"use client";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  reveal,
  countryList,
  item,
  spring,
} from "../../../shared/motion/config";
import { CountUp, Typewriter } from "../../../shared/motion/primitives";
export function HeroImage() {
  const ref = useRef<HTMLImageElement>(null),
    reduced = useReducedMotion(),
    { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"],
    }),
    y = useTransform(scrollYProgress, [0, 1], [0, 65]),
    scale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);
  return (
    <motion.img
      ref={ref}
      data-motion-owned
      className="travel-cover-image"
      src="/continents/americas.jpg"
      alt="Mountain peaks and open landscapes in Patagonia, Chile"
      width={1600}
      height={1000}
      fetchPriority="high"
      decoding="async"
      style={reduced ? undefined : { y, scale }}
    />
  );
}
export function ScrollSection({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion(),
    { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    }),
    opacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.85, 1],
      [0.65, 1, 1, 0.65],
    ),
    scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.98, 1, 0.98]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { opacity, scale }}
    >
      {children}
    </motion.div>
  );
}
export function CountryFacts({ facts }: { facts: string[] }) {
  const reduced = useReducedMotion();
  return (
    <motion.ol
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={countryList}
    >
      {facts.slice(0, 10).map((fact, i) => (
        <motion.li key={fact} variants={reduced ? {} : item}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <p>
            <Typewriter text={fact} />
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
export function CompactStat({
  value,
  kind = "number",
  suffix = "",
}: {
  value: number;
  kind?: "number" | "population" | "currency" | "area";
  suffix?: string;
}) {
  const divisor =
    kind === "population"
      ? value >= 1e9
        ? 1e9
        : value >= 1e6
          ? 1e6
          : 1
      : kind === "currency"
        ? value >= 1e12
          ? 1e12
          : value >= 1e9
            ? 1e9
            : value >= 1e6
              ? 1e6
              : 1
        : kind === "area" && value >= 1e6
          ? 1e6
          : 1;
  const unit =
    kind === "population"
      ? divisor === 1e9
        ? " billion"
        : divisor === 1e6
          ? " million"
          : ""
      : kind === "currency"
        ? divisor === 1e12
          ? "T"
          : divisor === 1e9
            ? "B"
            : divisor === 1e6
              ? "M"
              : ""
        : kind === "area" && divisor === 1e6
          ? "M km²"
          : kind === "area"
            ? " km²"
            : suffix;
  return (
    <>
      {kind === "currency" ? "$" : ""}
      <CountUp
        value={value / divisor}
        digits={divisor > 1 ? 2 : 0}
        suffix={unit}
      />
    </>
  );
}
export function TenureTimeline({
  terms,
}: {
  terms: {
    name: string;
    start: number;
    end: number;
    source: string;
    label?: string;
  }[];
}) {
  const reduced = useReducedMotion();
  if (!terms.length) return null;
  const first = Math.min(...terms.map((t) => t.start)),
    last = Math.max(...terms.map((t) => t.end));
  return (
    <div className="leader-tenures">
      {terms.map((t, i) => (
        <div key={`${t.name}-${t.start}`}>
          <span>
            {t.name} · {t.label ?? `${t.start}–${t.end}`}
          </span>
          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ ...reveal, delay: reduced ? 0 : i * 0.05 }}
            style={{
              transformOrigin: "left",
              marginLeft: `${((t.start - first) / (last - first || 1)) * 100}%`,
              width: `${((t.end - t.start) / (last - first || 1)) * 100}%`,
            }}
          />
          <a href={t.source}>Source ↗</a>
        </div>
      ))}
    </div>
  );
}
export function MotionFlag({ flag, code }: { flag: string; code: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      layoutId={reduced ? undefined : `country-flag-${code}`}
      transition={spring}
    >
      {flag}
    </motion.span>
  );
}
