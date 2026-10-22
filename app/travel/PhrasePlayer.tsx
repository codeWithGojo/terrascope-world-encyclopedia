"use client";
import { useEffect, useState } from "react";
import { phrasePacks } from "./phrases";
export function PhrasePlayer({ languages }: { languages: string[] }) {
  const initial =
    phrasePacks.find((p) =>
      languages.some((l) => l.toLowerCase().includes(p.language.toLowerCase())),
    )?.lang || "en-GB";
  const [chosen, setChosen] = useState(initial),
    [available, setAvailable] = useState<string[]>([]),
    [message, setMessage] = useState(""),
    [active, setActive] = useState("");
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () =>
      setAvailable(speechSynthesis.getVoices().map((v) => v.lang));
    update();
    speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", update);
      speechSynthesis.cancel();
    };
  }, []);
  const pack = phrasePacks.find((p) => p.lang === chosen)!;
  const supported = available.some(
    (v) => v.split("-")[0] === pack.lang.split("-")[0],
  );
  function speak(text: string) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = pack.lang;
    utterance.rate = 0.8;
    utterance.voice =
      speechSynthesis.getVoices().find((v) => v.lang === pack.lang) ||
      speechSynthesis
        .getVoices()
        .find((v) => v.lang.split("-")[0] === pack.lang.split("-")[0]) ||
      null;
    utterance.onend = () => setActive("");
    utterance.onerror = () => {
      setMessage("Playback failed. Try another installed voice.");
      setActive("");
    };
    setActive(text);
    setMessage("");
    speechSynthesis.speak(utterance);
  }
  return (
    <section className="travel-tool" id="phrases">
      <p className="eyebrow">Say a little</p>
      <h2>Words for the journey.</h2>
      <p>
        Country language register: {languages.join(" · ")}. Choose a phrase
        pack; playback uses a matching voice installed in your browser.
      </p>
      <label>
        Phrase language
        <select
          value={chosen}
          onChange={(e) => {
            setChosen(e.target.value);
            if ("speechSynthesis" in window) speechSynthesis.cancel();
            setActive("");
          }}
        >
          {phrasePacks.map((p) => (
            <option key={p.lang} value={p.lang}>
              {p.language}
            </option>
          ))}
        </select>
      </label>
      <div className="phrase-list">
        {pack.phrases.map(([meaning, text]) => (
          <div key={meaning}>
            <div>
              <small>{meaning}</small>
              <p lang={pack.lang} dir={pack.lang === "ar" ? "rtl" : undefined}>
                {text}
              </p>
            </div>
            <button
              disabled={!supported}
              aria-label={`Hear ${meaning} in ${pack.language}`}
              onClick={() => speak(text)}
            >
              {active === text ? "Speaking…" : "Listen"}
            </button>
          </div>
        ))}
      </div>
      <p className="source-note">
        {!supported
          ? "No matching voice is available on this device. The phrases remain readable. "
          : ""}
        <a href={pack.source}>Phrase reference</a> · Synthesised speech, not a
        native-speaker recording.{" "}
        {pack.lang === "ar"
          ? "Arabic wording is standard Arabic; local dialects vary."
          : ""}
      </p>
      <p role="status">{message}</p>
    </section>
  );
}
