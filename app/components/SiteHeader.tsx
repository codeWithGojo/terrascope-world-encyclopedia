"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CommandPalette } from "./discovery/CommandPalette";
import { ThemeToggle } from "./ThemeProvider";
import { ArrowUpRight } from "./ArrowUpRight";

type Panel = "more" | "theme" | "search" | null;
export function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false),
    [panel, setPanel] = useState<Panel>(null);
  const header = useRef<HTMLElement>(null),
    menu = useRef<HTMLButtonElement>(null),
    more = useRef<HTMLElement>(null);
  const closeNavigation = useCallback(() => {
    setOpen(false);
    setPanel(null);
  }, []);
  const setThemeOpen = useCallback((next: boolean) => {
    if (next) {
      setOpen(false);
      setPanel("theme");
    } else setPanel((current) => (current === "theme" ? null : current));
  }, []);
  const setSearchOpen = useCallback((next: boolean) => {
    if (next) {
      setOpen(false);
      setPanel("search");
    } else setPanel((current) => (current === "search" ? null : current));
  }, []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== "Escape") return;
      if (panel === "more") {
        setPanel(null);
        more.current?.focus();
      } else if (open) {
        setOpen(false);
        menu.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        closeNavigation();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open, panel, closeNavigation]);
  const nav = [
    { id: "escape", label: "Escape", href: "/escape" },
    { id: "countries", label: "Countries", href: "/countries" },
    { id: "trips", label: "Trip planner", href: "/trips" },
    { id: "football", label: "Football", href: "/football-archive" },
    { id: "rankings", label: "Rankings", href: "/rankings" },
    { id: "elections", label: "Elections", href: "/elections" },
  ];
  return (
    <header ref={header} className="site-header inner-header">
      <Link className="brand" href="/" aria-label="TerraScope home">
        <img
          className="brand-logo"
          src="/brand/terrascope-mark.webp"
          alt=""
          width={40}
          height={40}
          decoding="async"
          fetchPriority="high"
        />
        <span>TerraScope</span>
      </Link>
      <nav
        className={`main-nav ${open ? "is-open" : ""}`}
        id="site-navigation"
        aria-label="Main navigation"
      >
        {nav.map((item) => (
          <Link
            className={active === item.id ? "active" : ""}
            aria-current={active === item.id ? "page" : undefined}
            href={item.href}
            key={item.href}
            onClick={closeNavigation}
          >
            {item.label}
          </Link>
        ))}
        <details className="nav-more" open={panel === "more"}>
          <summary
            ref={more}
            aria-expanded={panel === "more"}
            aria-controls="more-navigation"
            onClick={(event) => {
              event.preventDefault();
              setPanel((current) => (current === "more" ? null : "more"));
            }}
          >
            More <span aria-hidden="true">⌄</span>
          </summary>
          <div id="more-navigation">
            <Link
              href="/my-travels"
              aria-current={active === "my-travels" ? "page" : undefined}
              onClick={closeNavigation}
            >
              My travels
            </Link>
            <Link href="/travel" onClick={closeNavigation}>Travel tools</Link>
            <Link href="/flights" aria-current={active === "flights" ? "page" : undefined} onClick={closeNavigation}>Flights · booking preview</Link>
            <Link href="/quiz" onClick={closeNavigation}>Flag, capital & anthem quizzes</Link>
            <Link href="/daily" onClick={closeNavigation}>
              Guess the Country
            </Link>
            <Link href="/account" onClick={closeNavigation}>
              Your account
            </Link>
            <Link href="/pro" onClick={closeNavigation}>
              TerraScope Pro
            </Link>
            <Link href="/compare" onClick={closeNavigation}>
              Compare countries
            </Link>
            <Link href="/rankings/iq" onClick={closeNavigation}>
              IQ ranking & context
            </Link>
            <Link href="/football-archive/greats" onClick={closeNavigation}>
              All-time football lists
            </Link>
            <Link href="/method" onClick={closeNavigation}>
              Sources & method
            </Link>
          </div>
        </details>
      </nav>
      <div className="header-tools">
        <CommandPalette
          open={panel === "search"}
          onOpenChange={setSearchOpen}
        />
        <ThemeToggle open={panel === "theme"} onOpenChange={setThemeOpen} />
      </div>
      <Link className="nav-action" href="/escape">
        Find an escape <ArrowUpRight />
      </Link>
      <button
        ref={menu}
        className="mobile-menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => {
          setPanel(null);
          setOpen((value) => !value);
        }}
      >
        <span className="mobile-menu-label">{open ? "Close" : "Menu"}</span>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d={open ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
    </header>
  );
}
