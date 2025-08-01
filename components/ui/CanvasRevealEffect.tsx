"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "../../lib/utils";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => (
  <div className={cn("h-full relative bg-white w-full", containerClassName)}>
    <div className="h-full w-full">
      <DotMatrix
        colors={colors}
        dotSize={dotSize ?? 3}
        opacities={opacities}
        shader={`
          float animation_speed_factor = ${animationSpeed.toFixed(1)};
          float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
          opacity *= step(intro_offset, u_time * animation_speed_factor);
          opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
        `}
        center={["x", "y"]}
      />
    </div>
    {showGradient && (
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
    )}
  </div>
);

interface DotMatrixProps {
  colors: number[][];
  opacities: number[];
  totalSize?: number;
  dotSize: number;
  shader: string;
  center: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors,
  opacities,
  totalSize = 4,
  dotSize = 2,
  shader,
  center,
}) => {
  const uniforms = useMemo(() => {
    let colorsArray: number[][] = Array(6).fill(colors[0]);

    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    } else if (colors.length === 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    }

    return {
      u_colors: {
        value: colorsArray.map((c) => c.map((x) => x / 255)),
        type: "uniform3fv" as const,
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv" as const,
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f" as const,
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f" as const,
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return <Shader source={createShader(shader, center)} uniforms={uniforms} />;
};

function createShader(shaderBody: string, center: string[]) {
  return `
    precision mediump float;
    in vec2 fragCoord;
    uniform float u_time;
    uniform float u_opacities[10];
    uniform vec3 u_colors[6];
    uniform float u_total_size;
    uniform float u_dot_size;
    uniform vec2 u_resolution;
    out vec4 fragColor;

    float PHI = 1.61803398874989484820459;
    float random(vec2 xy) {
      return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
    }

    void main() {
      vec2 st = fragCoord.xy;
      ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
      ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}

      float opacity = step(0.0, st.x) * step(0.0, st.y);
      vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
      float frequency = 5.0;
      float show_offset = random(st2);
      float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
      opacity *= u_opacities[int(rand * 10.0)];
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
      vec3 color = u_colors[int(show_offset * 6.0)];
      ${shaderBody}
      fragColor = vec4(color, opacity);
      fragColor.rgb *= fragColor.a;
    }
  `;
}

type Uniforms = Record<
  string,
  { value: number | number[] | number[][]; type: string }
>;

const ShaderMaterial: React.FC<{
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}> = ({ source, uniforms, maxFps = 60 }) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const lastFrame = useRef(0);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (now - lastFrame.current < 1 / maxFps) return;
    lastFrame.current = now;

    const mat = (ref.current?.material as unknown as { uniforms: Record<string, { value: number }> });
    if (mat?.uniforms?.u_time) mat.uniforms.u_time.value = now;
  });

  const builtUniforms = useMemo(() => {
    const u: Record<string, { value: number | THREE.Vector2 | THREE.Vector3 | THREE.Vector3[] }> = {};
    Object.entries(uniforms).forEach(([k, v]) => {
      if (v.type === "uniform3fv") {
        u[k] = { value: (v.value as number[][]).map((a) => new THREE.Vector3(...a)) };
      } else if (v.type === "uniform2f") {
        u[k] = { value: new THREE.Vector2(...(v.value as number[])) };
      } else {
        u[k] = { value: v.value as number };
      }
    });
    u.u_time = { value: 0 };
    u.u_resolution = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
    return u;
  }, [uniforms, size]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          in vec2 coordinates;
          uniform vec2 u_resolution;
          out vec2 fragCoord;
          void main(){
            gl_Position = vec4(position.xy, 0.0, 1.0);
            fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
            fragCoord.y = u_resolution.y - fragCoord.y;
          }
        `,
        fragmentShader: source,
        uniforms: builtUniforms,
        glslVersion: THREE.GLSL3,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor,
      }),
    [source, builtUniforms]
  );

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<{
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}> = (props) => (
  <Canvas className="absolute inset-0 h-full w-full">
    <ShaderMaterial {...props} />
  </Canvas>
);
