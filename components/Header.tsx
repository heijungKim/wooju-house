"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const nav = [
  { href: "#products", label: "제품 라인업" },
  { href: "#compare", label: "사양 비교" },
  { href: "#interior", label: "인테리어" },
  { href: "#install", label: "설치" },
  { href: "#cases", label: "시공 사례" },
  { href: "#contact", label: "문의" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // 데스크톱 폭으로 바뀌거나 Esc를 누르면 메뉴 닫기
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => mq.matches && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    mq.addEventListener("change", close);
    document.addEventListener("keydown", onKey);
    return () => {
      mq.removeEventListener("change", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(23,24,26,.1)] bg-[rgba(244,243,239,.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[60px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8 md:h-[68px]">
        <a href="#top" onClick={() => setOpen(false)} className="flex flex-none items-center" aria-label="우주하우스 홈">
          <Image src="/logo.png" alt="우주하우스 WOOJU HOUSE" width={720} height={144} priority className="h-9 w-auto md:h-10" />
        </a>
        <nav className="hidden min-w-0 gap-[clamp(14px,2vw,28px)] whitespace-nowrap text-[15px] font-medium md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-accent">
              {n.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-200 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
            <span className={`absolute top-[5px] left-0 h-[1.5px] w-5 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-200 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
          </span>
        </button>
      </div>
      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-[rgba(23,24,26,.1)] bg-paper px-5 pt-2 pb-5 sm:px-8 md:hidden"
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-[rgba(23,24,26,.1)] py-4 text-[18px] font-semibold"
              >
                {n.label}
                <span className="font-mono text-[12px] font-medium text-muted">→</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
