"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: activeCard === 0 || activeCard === cardLength - 1
        ? "#000000"
        : "#080212"
      }}
      className="relative flex justify-center min-h-screen space-x-10 rounded-md p-10 pb-[20vh]"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-3xl mt-[10vh]">
          {content.map((item, index) => (
            <div key={item.title + index} className="mb-[20vh]">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-4xl lg:text-6xl font-bold pb-1"
              >
                <span className="primary-text-gradient">{item.title}</span>
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-xl mt-10 max-w-xl text-neutral-200"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
      {(() => {
        const isFirst = activeCard === 0;
        const isLast  = activeCard === content.length;

        // for first card: sticky + margin-top so it scrolls until hit top:30vh
        // for last card: relative so it scrolls off like the left
        // middle cards: sticky at 30v.h. with no extra margin
        let panelClasses;

        if (isFirst) {
          panelClasses = "sticky top-[30vh] mt-[10vh] h-[40vh]";
        } else if (isLast) {
          panelClasses = "sticky top-[30vh] h-[40vh]";
        } else {
          panelClasses = "sticky top-[30vh] h-[40vh]";
        }

        return (
          <div
            style={{ background: backgroundGradient }}
            className={cn(
              panelClasses,
              "hidden w-[35vw] overflow-hidden rounded-xl bg-white lg:block",
              contentClassName,
            )}
          >
            {content[activeCard].content}
          </div>
        );
      })()}
    </motion.div>
  );
};
