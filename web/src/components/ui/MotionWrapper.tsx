"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  animate,
  HTMLMotionProps,
} from "framer-motion";

/**
 * Standard slow, stately easing curve for Charoensin Group brand motion.
 * Reflects stability, elegance, and over 90 years of enterprise prestige.
 */
export const csgEase = [0.16, 1, 0.3, 1] as const;

export interface FadeUpProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

/**
 * FadeUp component: Smooth, slow, and elegant entrance animation.
 * Respects `prefers-reduced-motion` for accessibility.
 */
export function FadeUp({
  children,
  delay = 0,
  duration = 0.9,
  distance = 32,
  className = "",
  once = true,
  ...props
}: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: distance };

  const animateTarget = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animateTarget}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: csgEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface CountUpProps {
  to?: number;
  value?: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

/**
 * CountUp component: Smooth numeric count-up animation for company metrics & statistics.
 * Respects `prefers-reduced-motion`.
 */
export function CountUp({
  to,
  value,
  from = 0,
  duration = 2.2,
  delay = 0.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "",
}: CountUpProps) {
  const target = to ?? value ?? 0;
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatNumber(shouldReduceMotion ? target : from, decimals, separator)
  );

  function formatNumber(num: number, dec: number, sep: string): string {
    const fixed = num.toFixed(dec);
    const [intPart, decPart] = fixed.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      setDisplayValue(formatNumber(target, decimals, separator));
      return;
    }

    const controls = animate(from, target, {
      duration,
      delay,
      ease: csgEase,
      onUpdate: (latest) => {
        setDisplayValue(formatNumber(latest, decimals, separator));
      },
      onComplete: () => {
        setDisplayValue(formatNumber(target, decimals, separator));
      },
    });

    return () => controls.stop();
  }, [isInView, from, target, duration, delay, decimals, separator, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

/**
 * Default MotionWrapper component (aliases FadeUp for general entrance effects)
 */
export const MotionWrapper = FadeUp;

export default MotionWrapper;
