"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { servicesContent } from "@/data";

export function Services() {
  return (
    <div id="services" className="py-4">
      <h1 className="mx-auto mt-8 text-center text-md sm:text-lg lg:text-xl">
				Nomadlyst brings together thousands of remote job listings from the internet into one dashboard.
				<br />
				Everything you need to keep your job search organized and stress-free.
			</h1>
      <StickyScroll content={servicesContent} />
    </div>
  );
}
