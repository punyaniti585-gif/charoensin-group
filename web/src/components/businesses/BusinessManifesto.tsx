"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BusinessPageData } from "@/data/businesses-data";
import { luxEase } from "./motion";

type Props = Pick<BusinessPageData, "manifesto">;

/**
 * Manifesto: lead line + three value words revealed one by one,
 * each underlined by a gold hairline that draws in after the word lands.
 */
export default function BusinessManifesto({ manifesto }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24 border-y border-[#CCA369]/20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: luxEase }}
          className="font-kanit text-lg sm:text-xl text-[#6B5A3A]"
        >
          {manifesto.lead}
        </motion.p>

        <p className="mt-4 flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-4 font-kanit font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#1F1F1F]">
          {manifesto.words.map((word, i) => (
            <span key={word} className="relative inline-block pb-3">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.22, ease: luxEase }}
              >
                {word}
              </motion.span>
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-[#CCA369] via-[#E6C786] to-[#9A7B3E] origin-left"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.22, ease: luxEase }}
              />
            </span>
          ))}
        </p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.9, ease: luxEase }}
          className="mt-8 font-sarabun text-sm sm:text-base text-[#1F1F1F]/70 max-w-2xl mx-auto leading-relaxed"
        >
          {manifesto.body}
        </motion.p>
      </div>
    </section>
  );
}
