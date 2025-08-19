"use client";
import React from "react";
import { motion } from "motion/react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const SpotlightReverse = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(247,0,255,0.15) 0%, rgba(247,0,255,0.065) 50%, transparent 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, rgba(250,138,46,0.08) 0%, rgba(250,138,46,0.025) 50%, transparent 80%)",
  translateY = 350,  // now positive for upward direction
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Left side beam group (bottom-left corner) */}
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden md:block absolute bottom-0 left-0 w-screen h-screen z-40 pointer-events-none"
      >
        {/* Large beam */}
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(135deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute bottom-0 right-0"
        />

        {/* Narrow beam #1 */}
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, 50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute bottom-0 right-0 origin-bottom-right"
        />
      </motion.div>

      {/* Right side beam group (bottom-right corner) */}
      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-screen h-screen z-40 pointer-events-none"
      >
        {/* Large beam */}
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-135deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute bottom-0 left-0"
        />

        {/* Narrow beam #1 */}
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, 50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute bottom-0 left-0 origin-bottom-left"
        />
      </motion.div>
    </motion.div>
  );
};
