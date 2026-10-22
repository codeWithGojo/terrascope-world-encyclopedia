import { test } from "node:test";
import assert from "node:assert/strict";
import {
  callingSlots,
  localTime,
  visaRequirement,
  vibeMatch,
} from "../app/travel/tools.ts";
import { quizRound, anthems } from "../app/quiz/engine.ts";
import { atlasCountries } from "../app/atlas-data.ts";
test("visa categories and unknowns stay separate", () => {
  assert.equal(visaRequirement("NG", "NG").category, "home");
  assert.equal(visaRequirement("XX", "US").category, "unknown");
  assert.equal(visaRequirement("US", "FR").category, "visa-free");
  assert.notEqual(visaRequirement("NG", "US").category, "visa-free");
});
test("whole half-hour calls overlap with local dates", () => {
  const slots = callingSlots("2026-10-22", [
    { zone: "Africa/Lagos", start: 9, end: 18 },
    { zone: "America/New_York", start: 9, end: 18 },
  ]);
  assert.equal(slots[0], "2026-10-22T13:00:00.000Z");
  assert.match(localTime(slots[0], "America/New_York"), /09:00/);
  assert.equal(slots.at(-1), "2026-10-22T16:30:00.000Z");
});
test("DST changes overlap; invalid dates and zones fail closed", () => {
  for (const [date, hour] of [
    ["2026-07-01", "08:00"],
    ["2026-12-01", "09:00"],
  ])
    assert.equal(
      callingSlots(date, [
        { zone: "Europe/London", start: 9, end: 10 },
        { zone: "UTC", start: 0, end: 24 },
      ])[0].slice(11, 16),
      hour,
    );
  assert.deepEqual(
    callingSlots("2026-02-30", [
      { zone: "UTC", start: 9, end: 18 },
      { zone: "UTC", start: 9, end: 18 },
    ]),
    [],
  );
  assert.deepEqual(
    callingSlots("2026-10-22", [
      { zone: "bad", start: 9, end: 18 },
      { zone: "UTC", start: 9, end: 18 },
    ]),
    [],
  );
});
test("quizzes have four unique options and ten different answers without mutating country order", () => {
  const before = atlasCountries.map((c) => c.code);
  for (const mode of ["flag", "capital", "anthem"]) {
    let seen = new Set();
    for (let round = 0; round < 10; round++) {
      const q = quizRound(atlasCountries, mode, "day" + mode, round);
      assert.equal(new Set(q.choices.map((c) => c.code)).size, 4);
      assert.equal(q.choices.filter((c) => c.code === q.answer.code).length, 1);
      assert.ok(q.clue);
      seen.add(q.answer.code);
      if (mode === "anthem") assert.ok(anthems[q.answer.code]);
    }
    assert.equal(seen.size, 10);
  }
  assert.deepEqual(
    atlasCountries.map((c) => c.code),
    before,
  );
});
test("vibes use guide words", () => {
  assert.equal(vibeMatch("National Museum and palace", "Culture"), true);
  assert.equal(vibeMatch("National Museum", "Nature"), false);
});
