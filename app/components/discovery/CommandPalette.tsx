"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { modal, reveal } from "../../../shared/motion/config";
import { Skeleton } from "../Skeleton";
import { notify } from "../../../shared/motion/overlays";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";
import { searchEntries, type SearchEntry } from "./search";
const RECENTS = "terrascope-search-recents";
export function CommandPalette({
  open,
  onOpenChange: setOpen,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState(""),
    [index, setIndex] = useState<SearchEntry[]>([]),
    [recent, setRecent] = useState<string[]>([]),
    [active, setActive] = useState(0),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(false),
    [retry, setRetry] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { setPreference, preference } = useTheme();
  const actions: SearchEntry[] = [
    {
      id: "theme",
      label: `Switch to ${preference === "dark" ? "light" : "dark"} theme`,
      group: "Quick actions",
      detail: "Appearance",
      href: "",
    },
    {
      id: "game",
      label: "Play Guess the Country",
      group: "Quick actions",
      detail: "Daily challenge",
      href: "/game",
    },
    {
      id: "pricing",
      label: "Explore TerraScope Pro",
      group: "Quick actions",
      detail: "Plans & pricing",
      href: "/pricing",
    },
    {
      id: "fly-NG",
      label: "Fly to Nigeria",
      group: "Quick actions",
      detail: "Move the globe",
      href: "/#globe",
      countryCode: "NG",
    },
  ];
  const results = query
    ? searchEntries([...actions, ...index], query)
    : [
        ...actions,
        ...recent.flatMap((id) => index.find((e) => e.id === id) ?? []),
      ];
  const fly = query
    ? searchEntries(
        index.filter((e) => e.group === "Countries"),
        query,
      )
        .slice(0, 3)
        .map((e) => ({
          ...e,
          id: `fly-${e.countryCode}`,
          label: `Fly to ${e.label}`,
          group: "Quick actions",
          href: "/#globe",
        }))
    : [];
  const entries = [...fly, ...results];
  const grouped = new Map<string, SearchEntry[]>();
  for (const e of entries)
    grouped.set(e.group, [...(grouped.get(e.group) ?? []), e]);
  const ordered = Array.from(grouped.values()).flat();
  const openSearch = useCallback(() => {
    setLoading(!index.length);
    setError(false);
    setActive(0);
    try {
      const saved = JSON.parse(localStorage.getItem(RECENTS) || "[]");
      if (Array.isArray(saved))
        setRecent(saved.filter((v) => typeof v === "string").slice(0, 6));
    } catch {}
    setOpen(true);
  }, [index.length, setOpen]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openSearch();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, openSearch, setOpen]);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      input.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!open || index.length) return;
    const abort = new AbortController();
    fetch("/data/discovery-index.json", { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw Error("Search unavailable");
        return r.json();
      })
      .then((rows) => {
        if (!Array.isArray(rows)) throw Error("Invalid index");
        setIndex(rows);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [open, index.length, retry]);
  useEffect(() => {
    dialog.current
      ?.querySelector(`#command-result-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);
  function choose(entry: SearchEntry) {
    setOpen(false);
    setQuery("");
    if (entry.id === "theme") {
      setPreference(preference === "dark" ? "light" : "dark");
      return;
    }
    if (entry.id.startsWith("fly-") && entry.countryCode) {
      notify(`Flying to ${entry.label.replace("Fly to ", "")}.`, "success");
      try {
        sessionStorage.setItem("terrascope-fly", entry.countryCode);
      } catch {}
      window.dispatchEvent(
        new CustomEvent("terrascope-fly", { detail: entry.countryCode }),
      );
      router.push("/#globe");
      return;
    }
    const next = [entry.id, ...recent.filter((id) => id !== entry.id)].slice(
      0,
      6,
    );
    setRecent(next);
    try {
      localStorage.setItem(RECENTS, JSON.stringify(next));
    } catch {}
    router.push(entry.href);
  }
  return (
    <>
      <button
        ref={trigger}
        className="icon-button command-trigger"
        type="button"
        onClick={openSearch}
        aria-label="Search TerraScope"
        aria-haspopup="dialog"
      >
        <svg
          viewBox="0 0 24 24"
          width="19"
          height="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4 4" />
        </svg>
        <kbd>⌘ K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="command-dialog"
        data-motion-state={open ? "open" : "closing"}
        aria-labelledby="command-title"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false);
        }}
      >
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            dialog.current?.close();
            trigger.current?.focus();
          }}
        >
          {open && (
            <motion.div
              key="search-shell"
              data-motion-owned
              className="command-shell"
              variants={modal}
              initial={reduced ? false : "hidden"}
              animate="visible"
              exit="exit"
            >
              <div className="command-input">
                <span aria-hidden="true">⌕</span>
                <label
                  htmlFor="command-query"
                  id="command-title"
                  className="sr-only"
                >
                  Search TerraScope
                </label>
                <input
                  id="command-query"
                  ref={input}
                  value={query}
                  placeholder="A country, city, player, a new rabbit hole…"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded="true"
                  aria-controls="command-results"
                  aria-activedescendant={
                    ordered[active] ? `command-result-${active}` : undefined
                  }
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((v) => Math.min(v + 1, ordered.length - 1));
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((v) => Math.max(0, v - 1));
                    }
                    if (e.key === "Home") {
                      e.preventDefault();
                      setActive(0);
                    }
                    if (e.key === "End") {
                      e.preventDefault();
                      setActive(ordered.length - 1);
                    }
                    if (e.key === "Enter" && ordered[active]) {
                      e.preventDefault();
                      choose(ordered[active]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                >
                  Esc
                </button>
              </div>
              <div
                className="command-results"
                id="command-results"
                role="listbox"
                aria-label="Search results"
              >
                {loading && (
                  <Skeleton
                    className="command-notice"
                    label="Opening the atlas index"
                  />
                )}
                {error && (
                  <p className="command-notice" role="alert">
                    Search could not load.{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setLoading(true);
                        setError(false);
                        setRetry((v) => v + 1);
                      }}
                    >
                      Try again
                    </button>
                  </p>
                )}
                {Array.from(grouped).map(([group, items]) => (
                  <div role="group" aria-label={group} key={group}>
                    <p className="command-group">
                      {group}
                      {!query && group !== "Quick actions" ? " · Recent" : ""}
                    </p>
                    {items.map((e) => {
                      const i = ordered.indexOf(e);
                      return (
                        <motion.button
                          data-motion-owned
                          initial={reduced ? false : { opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...reveal, delay: i * 0.03 }}
                          type="button"
                          role="option"
                          aria-selected={i === active}
                          id={`command-result-${i}`}
                          key={e.id}
                          className={i === active ? "active" : ""}
                          onPointerMove={() => setActive(i)}
                          onClick={() => choose(e)}
                        >
                          <span className="result-icon" aria-hidden="true">
                            {group === "Countries"
                              ? "◎"
                              : group === "Players"
                                ? "⚽"
                                : group === "Quick actions"
                                  ? "↗"
                                  : "⌁"}
                          </span>
                          <span>
                            <b>{e.label}</b>
                            <small>{e.detail}</small>
                          </span>
                          <span aria-hidden="true">↵</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
                {query && !ordered.length && !loading && (
                  <p className="command-notice">
                    No matches yet. Try a shorter name or different spelling.
                  </p>
                )}
              </div>
              <div className="command-footer">
                <span>
                  <kbd>↑</kbd> <kbd>↓</kbd> to explore <kbd>↵</kbd> to open
                </span>
                <span>TerraScope / Discovery</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
