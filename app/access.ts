export type ProFeature='compare'|'history'|'hdExport';
/** The only Pro decision. Input must come from Supabase Auth's verified getUser(), never browser state. */
export function isPro(user:{app_metadata?:Record<string,unknown>}|null|undefined) {
  return user?.app_metadata?.terrascope_pro===true;
}
export function entitlements(user:{app_metadata?:Record<string,unknown>}|null|undefined) {
  const pro=isPro(user);
  return {pro,compare:pro,history:pro,hdExport:pro};
}
