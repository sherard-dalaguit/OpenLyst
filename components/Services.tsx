"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { servicesContent } from "@/data";

export function Services() {
  return (
    <div id="services" className="py-4">
      <h1 className="mx-auto mt-8 text-center text-md sm:text-lg lg:text-xl">
				We empower enterprises with tailored AI solutions that streamline processes, unlock insights, and fuel sustainable growth.
        <br />
        Here are some of the services we offer.
			</h1>
      <StickyScroll content={servicesContent} />
    </div>
  );
}
