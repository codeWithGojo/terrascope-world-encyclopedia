"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { quizRound, type QuizCountry, type QuizMode } from "./engine";
export function WorldQuiz({
  countries,
  day,
}: {
  countries: QuizCountry[];
  day: string;
}) {
  const [mode, setMode] = useState<QuizMode>("flag"),
    [round, setRound] = useState(0),
    [selected, setSelected] = useState(""),
    [score, setScore] = useState(0),
    [attempt, setAttempt] = useState(0),
    [saved, setSaved] = useState("");
  const reduced = useReducedMotion(),
    item = quizRound(countries, mode, day + mode + attempt, round),
    done = round === 10;
  function reset(next: QuizMode = mode) {
    setMode(next);
    setRound(0);
    setSelected("");
    setScore(0);
    setSaved("");
  }
  function choose(code: string) {
    if (selected || done) return;
    setSelected(code);
    if (code === item.answer.code) setScore((s) => s + 1);
  }
  function next() {
    if (round === 9) {
      try {
        const key = "terrascope-quiz-best:" + mode,
          old = Number(localStorage.getItem(key) || 0),
          best = Math.max(Number.isFinite(old) ? old : 0, score);
        localStorage.setItem(key, String(best));
        setSaved(`Best on this browser: ${best}/10`);
      } catch {
        setSaved("Browser storage unavailable. Your score is shown here.");
      }
    }
    setRound((r) => r + 1);
    setSelected("");
  }
  return (
    <section className="travel-tool">
      <nav className="quiz-nav" aria-label="Quiz modes">
        {(["flag", "capital", "anthem"] as const).map((m) => (
          <button key={m} aria-pressed={mode === m} onClick={() => reset(m)}>
            {m === "flag"
              ? "Flag"
              : m === "capital"
                ? "Capital"
                : "Anthem title"}
          </button>
        ))}
        <Link href="/daily">Guess the Country →</Link>
      </nav>
      <p>
        {mode === "anthem"
          ? "Match an anthem title to its country. Text mode covers 28 titles; no audio is required."
          : mode === "flag"
            ? "Which country uses this flag?"
            : "Which country has this capital?"}{" "}
        · Ten questions · local practice score
      </p>
      <p aria-live="polite">
        {done ? "Round complete" : `Question ${round + 1} of 10`} · Score{" "}
        {score}/10
      </p>
      {done ? (
        <div className="tool-result">
          <h2>{score}/10. Keep exploring.</h2>
          <p>{saved}</p>
          <button
            onClick={() => {
              setAttempt((a) => a + 1);
              reset();
            }}
          >
            New round
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + round + attempt}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
          >
            <div
              className="quiz-clue"
              aria-label={mode === "flag" ? "Country flag" : undefined}
            >
              <span>{item.clue}</span>
            </div>
            <div className="quiz-choices">
              {item.choices.map((c) => (
                <motion.button
                  key={c.code}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  disabled={!!selected}
                  data-answer={
                    selected
                      ? c.code === item.answer.code
                        ? "correct"
                        : c.code === selected
                          ? "wrong"
                          : undefined
                      : undefined
                  }
                  onClick={() => choose(c.code)}
                >
                  {c.name}
                </motion.button>
              ))}
            </div>
            {selected && (
              <div className="tool-result" role="status">
                <h3>
                  {selected === item.answer.code ? "Correct." : "Good try."}{" "}
                  {item.answer.name}.
                </h3>
                <p>
                  <Link href={`/countries/${item.answer.slug}`}>
                    Explore the country →
                  </Link>
                  {mode === "anthem" && (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={`https://en.wikipedia.org/wiki/National_anthem_of_${encodeURIComponent(item.answer.name.replaceAll(" ", "_"))}`}
                      >
                        Anthem reference
                      </a>
                    </>
                  )}
                </p>
                <button onClick={next}>
                  {round === 9 ? "See score" : "Next question"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
