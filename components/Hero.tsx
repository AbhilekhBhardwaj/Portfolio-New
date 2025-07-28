
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { BackgroundBeams } from "./ui/background-beams"; // ✅ USED

const Hero = () => {
  return (
    <div className="pb-20 pt-36 relative overflow-hidden"> {/* ✅ MODIFIED */}
      <BackgroundBeams /> {/* ✅ ADDED */}

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <TextGenerateEffect
            words="Making the Web Look Better, One Component at a Time"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi! I&apos;m Abhilekh, a Developer based in India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
