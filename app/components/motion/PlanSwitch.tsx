"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ActivePill } from "../../../shared/motion/primitives";
import { reveal } from "../../../shared/motion/config";
export function PlanSwitch() {
  const [plan, setPlan] = useState<"free" | "pro">("pro"),
    reduced = useReducedMotion();
  return (
    <div>
      <div className="card-size-controls" aria-label="Explore plan features">
        {(["free", "pro"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={plan === value}
            onClick={() => setPlan(value)}
          >
            {value === "free" ? "Free" : "Pro"}
            <ActivePill active={plan === value} id="plan-features" />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={plan}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={reveal}
        >
          {plan === "free"
            ? "Country profiles, virtual escapes, globe layers, the daily game and standard country cards stay free."
            : "Pro adds country comparisons, sourced history sliders and HD card exports. Payments are not open yet."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
