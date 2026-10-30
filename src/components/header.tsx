"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
export function Header({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  const links = [
    ["/#expertise", "Expertise"],
    ["/#jurisdictions", "Jurisdictions"],
    ["/insights", "Insights"],
    ["/firm", "The firm"],
    ["/contact", "Contact"],
  ];
  const nav = (
    <nav
      id={home ? "navigation" : "site-navigation"}
      className={open ? "open" : ""}
      aria-label="Main navigation"
    >
      {links.map(([href, label]) => (
        <Link key={href} href={href} onClick={() => setOpen(false)}>
          {label}
        </Link>
      ))}
    </nav>
  );
  const content = (
    <>
      <Link className="wordmark" href="/" aria-label="Circulox home">
        circulox
      </Link>
      {!home && (
        <nav className="desktop-navigation" aria-label="Main navigation">
          <Link href="/#expertise">All expertise</Link>
          <Link href="/firm">The firm</Link>
          <Link href="/insights">Insights</Link>
        </nav>
      )}
      {nav}
      <button
        ref={button}
        className={home ? "menu" : "site-menu"}
        type="button"
        aria-controls={home ? "navigation" : "site-navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close menu" : "Menu"}
      </button>
    </>
  );
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header ref={header} className={home ? "masthead" : "shell top"}>
        {home ? <div className="shell">{content}</div> : content}
      </header>
    </>
  );
}
