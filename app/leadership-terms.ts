// Verified term starts. Ongoing bars stop at the existing editorial snapshot,
// never at an inferred election date or a promised future term end.
export const leadershipTerms: Record<
  string,
  { name: string; start: number; end: number; label: string; source: string }[]
> = {
  NG: [
    {
      name: "Bola Ahmed Tinubu",
      start: 2023,
      end: 2026,
      label: "29 May 2023 – snapshot 30 Sep 2026",
      source: "https://statehouse.gov.ng/team/bola-ahmed-tinubu/",
    },
  ],
};
