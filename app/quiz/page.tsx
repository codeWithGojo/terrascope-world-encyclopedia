import { atlasCountries } from "../atlas-data";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { WorldQuiz } from "./WorldQuiz";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Flag, capital & anthem quizzes | TerraScope",
};
export default function QuizPage() {
  return (
    <main>
      <SiteHeader active="quiz" />
      <section className="index-hero">
        <p className="eyebrow">A world of small discoveries</p>
        <h1>
          Know the flag?
          <br />
          Name the place.
        </h1>
        <p>
          Flag, capital and anthem-title rounds alongside the daily outline
          game. New practice questions, at your pace.
        </p>
      </section>
      <WorldQuiz
        day={new Date().toISOString().slice(0, 10)}
        countries={atlasCountries.map(
          ({ code, name, slug, capital, flag }) => ({
            code,
            name,
            slug,
            capital,
            flag,
          }),
        )}
      />
      <SiteFooter />
    </main>
  );
}
