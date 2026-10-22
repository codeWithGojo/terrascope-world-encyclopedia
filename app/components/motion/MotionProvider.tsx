"use client";
import { MotionConfig, LayoutGroup } from "motion/react";
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="terrascope">{children}</LayoutGroup>
    </MotionConfig>
  );
}
