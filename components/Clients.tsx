"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

const testimonials = [
  {
    quote: "This portfolio blew my mind!",
    name: "Abhilekh Bhardwaj",
    title: "Software Developer",
  },
  {
    quote: "I've never seen animations this smooth before.",
    name: "John Doe",
    title: "Product Designer",
  },
  {
    quote: "The attention to detail is next level.",
    name: "Jane Smith",
    title: "UI Engineer",
  },
];

const Clients = () => {
  return (
    <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
};

export default Clients;
