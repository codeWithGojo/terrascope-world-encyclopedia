export type ThemePreference = "light" | "dark" | "system";
export const THEME_KEY = "terrascope-theme";
export function isThemePreference(value: unknown): value is ThemePreference { return value === "light" || value === "dark" || value === "system"; }
export function resolveTheme(preference: ThemePreference, systemDark: boolean): "light" | "dark" { return preference === "system" ? (systemDark ? "dark" : "light") : preference; }
// Runs in the document head before the body paints; storage can be disabled.
export const themeBootScript = `(function(){var p='system';try{var s=localStorage.getItem('${THEME_KEY}');if(s==='light'||s==='dark'||s==='system')p=s}catch(e){}var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.dataset.themePreference=p;r.style.colorScheme=d?'dark':'light';r.dataset.motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'})()`;
