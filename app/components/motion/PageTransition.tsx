"use client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { route } from "../../../shared/motion/config";
export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={path}
        className="page-transition"
        initial={reduced ? false : "hidden"}
        animate="visible"
        exit={reduced ? undefined : "exit"}
        variants={route}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
