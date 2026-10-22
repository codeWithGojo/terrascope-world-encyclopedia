"use client";
import { useState } from "react";
import { callingSlots, localTime } from "./tools";
type Zone = { zone: string; label: string };
export function CallingPlanner({ zones }: { zones: Zone[] }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)),
    [a, setA] = useState("Africa/Lagos"),
    [b, setB] = useState("America/New_York"),
    [c, setC] = useState(""),
    [start, setStart] = useState(9),
    [end, setEnd] = useState(18),
    [selected, setSelected] = useState(""),
    [message, setMessage] = useState("");
  const people = [a, b, c].filter(Boolean),
    slots = callingSlots(
      date,
      people.map((zone) => ({ zone, start, end })),
    );
  function calendar(instant: string) {
    const endTime = new Date(Date.parse(instant) + 1800000).toISOString(),
      stamp = (s: string) => s.replace(/[-:]/g, "").replace(".000", "");
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TerraScope//Calling planner//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@terrascope`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(instant)}`,
      `DTEND:${stamp(endTime)}`,
      "SUMMARY:International call",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
        new Blob([body], { type: "text/calendar" }),
      ),
      link = document.createElement("a");
    link.href = url;
    link.download = "terrascope-call.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Calendar file downloaded.");
  }
  return (
    <section className="travel-tool" id="calling">
      <p className="eyebrow">Find a time that works</p>
      <h2>Across time zones.</h2>
      <p>
        Compare a 30-minute call on a UTC date. Local dates and daylight-saving
        changes are calculated for every zone.
      </p>
      <div className="tool-fields">
        <label>
          UTC date
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelected("");
            }}
          />
        </label>
        {[
          [a, setA, "Person 1"],
          [b, setB, "Person 2"],
          [c, setC, "Person 3 (optional)"],
        ].map(([value, setter, label]) => (
          <label key={label as string}>
            {label as string}
            <select
              value={value as string}
              onChange={(e) => {
                (setter as (s: string) => void)(e.target.value);
                setSelected("");
              }}
            >
              {label === "Person 3 (optional)" && (
                <option value="">Not included</option>
              )}
              {zones.map((z) => (
                <option key={z.zone} value={z.zone}>
                  {z.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label>
          Earliest local hour
          <select
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </label>
        <label>
          Latest local hour
          <select value={end} onChange={(e) => setEnd(Number(e.target.value))}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </label>
      </div>
      <p>
        {slots.length
          ? `${slots.length} overlapping half-hour slots`
          : "No overlap. Widen the local hours or choose another date."}
      </p>
      <div className="call-slots">
        {slots.map((instant) => (
          <button
            type="button"
            key={instant}
            aria-pressed={selected === instant}
            onClick={() => setSelected(instant)}
          >
            {instant.slice(11, 16)} UTC
          </button>
        ))}
      </div>
      {selected && slots.includes(selected) && (
        <div className="tool-result">
          <h3>Your call</h3>
          {people.map((zone) => (
            <p key={zone}>
              <b>{zone.replaceAll("_", " ")}</b>
              <br />
              {localTime(selected, zone)}
            </p>
          ))}
          <button onClick={() => calendar(selected)}>
            Download calendar invite
          </button>
        </div>
      )}
      <p role="status">{message}</p>
    </section>
  );
}
