"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Rick and Morty",
    description: "Rick and morty styled landing page, page changes with a click",
    image: "/projects/creative-portfolio.png",
    tech: ["/gsap.svg", "/re.svg", "/tail.svg"],
    url: "https://page-change-36xe.vercel.app/",
  },
  {
    id: 2,
    title: "3D Model Showcase",
    description: "Three.js powered site to showcase 3D objects with interaction.",
    image: "/projects/3d-showcase.png",
    tech: ["/three.svg", "/re.svg", "/css.svg"],
    url: "https://3d-showcase.example.com",
  },
];

export default function CreativeProjects() {
  return (
    <section className="min-h-screen px-4 md:px-10 py-10 bg-[#0f0f0f] text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">Creative Projects</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={400}
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((icon, index) => (
                  <Image
                    key={index}
                    src={icon}
                    alt="tech icon"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
