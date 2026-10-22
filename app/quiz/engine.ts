export type QuizCountry = {
  code: string;
  name: string;
  slug: string;
  capital: string;
  flag: string;
};
export const anthems: Record<string, string> = {
  NG: "Nigeria, We Hail Thee",
  GH: "God Bless Our Homeland Ghana",
  KE: "Ee Mungu Nguvu Yetu",
  TZ: "Mungu ibariki Afrika",
  UG: "Oh Uganda, Land of Beauty",
  ZM: "Stand and Sing of Zambia, Proud and Free",
  ZW: "Simudzai Mureza wedu WeZimbabwe",
  SN: "Pincez tous vos koras, frappez les balafons",
  EG: "Bilady, Bilady, Bilady",
  MA: "Hymne Chérifien",
  FR: "La Marseillaise",
  GB: "God Save the King",
  US: "The Star-Spangled Banner",
  CA: "O Canada",
  AU: "Advance Australia Fair",
  NZ: "God Defend New Zealand",
  JP: "Kimigayo",
  IN: "Jana Gana Mana",
  BR: "Hino Nacional Brasileiro",
  MX: "Himno Nacional Mexicano",
  DE: "Das Lied der Deutschen",
  IT: "Il Canto degli Italiani",
  ES: "Marcha Real",
  PT: "A Portuguesa",
  TR: "İstiklâl Marşı",
  KR: "Aegukga",
  CN: "March of the Volunteers",
  ID: "Indonesia Raya",
};
export type QuizMode = "flag" | "capital" | "anthem";
export function seedHash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
export function quizRound(
  countries: QuizCountry[],
  mode: QuizMode,
  seed: string,
  round: number,
) {
  const pool = countries.filter((c) => mode !== "anthem" || anthems[c.code]),
    sorted = [...pool].sort(
      (a, b) =>
        seedHash(seed + a.code) - seedHash(seed + b.code) ||
        a.code.localeCompare(b.code),
    ),
    answer = sorted[round % sorted.length],
    other = countries
      .filter((c) => c.code !== answer.code)
      .sort(
        (a, b) =>
          seedHash(seed + round + a.code) - seedHash(seed + round + b.code),
      )
      .slice(0, 3),
    choices = [answer, ...other].sort(
      (a, b) =>
        seedHash(seed + "choice" + round + a.code) -
        seedHash(seed + "choice" + round + b.code),
    );
  return {
    answer,
    choices,
    clue:
      mode === "flag"
        ? answer.flag
        : mode === "capital"
          ? answer.capital
          : anthems[answer.code],
  };
}
