"use client";

import { useEffect, useRef, useState } from "react";
import { interiorFeatures, optionalSystems, standardSystems } from "@/content/models";
import { Eyebrow, Photo, SectionTitle } from "./ui";

/** 인테리어 디테일: 사진 위 번호 포인트 + 설명, 좌측 시스템 목록 (카탈로그 구성) */
export default function InteriorDetail() {
  // hover: 마우스를 올린 번호(일시), pinned: 클릭으로 고정한 번호
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hover ?? pinned;
  const areaRef = useRef<HTMLDivElement>(null);

  // 바깥을 누르면 고정 해제
  useEffect(() => {
    if (pinned === null) return;
    const onDown = (e: PointerEvent) => {
      if (!areaRef.current?.contains(e.target as Node)) setPinned(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const toggle = (i: number) => setPinned((p) => (p === i ? null : i));
  const hoverProps = (i: number) => ({
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
  });

  return (
    <section id="interior" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-5 sm:px-8 py-[72px] md:py-28">
      <div className="mb-8 flex flex-col md:mb-12 gap-3.5">
        <Eyebrow>03 — INTERIOR</Eyebrow>
        <SectionTitle>인테리어 디테일</SectionTitle>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
        <div ref={areaRef} className="flex min-w-0 flex-col gap-8 md:gap-10 lg:order-2">
          <div className="relative isolate aspect-[2075/859]">
            <div className="absolute inset-0 overflow-hidden rounded-md bg-well">
              <Photo src="/img/interior.jpg" alt="인테리어 전경" sizes="(min-width: 1320px) 900px, 100vw" />
              <div
                className={`pointer-events-none absolute inset-0 bg-[rgba(14,15,17,.28)] transition-opacity duration-200 ${active === null ? "opacity-0" : "opacity-100"}`}
              />
            </div>
            {interiorFeatures.map((f, i) => {
              const on = active === i;
              return (
                <button
                  key={f.n}
                  type="button"
                  aria-label={`${f.n} ${f.title}`}
                  aria-expanded={on}
                  {...hoverProps(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => toggle(i)}
                  style={{ left: `${f.x}%`, top: `${f.y}%` }}
                  className={`absolute flex size-[clamp(22px,2.4vw,30px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full font-mono text-[clamp(10px,1vw,12px)] font-medium text-paper transition-[background-color,transform,box-shadow] duration-200 ${
                    on
                      ? "z-20 scale-125 bg-accent shadow-[0_0_0_4px_rgba(230,201,143,.55),0_2px_10px_rgba(0,0,0,.35)]"
                      : `z-10 bg-ink shadow-[0_0_0_3px_rgba(244,243,239,.7),0_2px_8px_rgba(0,0,0,.25)] ${active !== null ? "opacity-60" : ""}`
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
            {active !== null && <Bubble f={interiorFeatures[active]} />}
          </div>

          {/* 모바일: 사진이 작아 말풍선 대신 사진 바로 아래에 설명 표시 */}
          <div aria-live="polite" className="-mt-6 min-h-[92px] rounded-md bg-white px-4 py-3.5 sm:hidden">
            {active === null ? (
              <p className="m-0 flex h-full min-h-[64px] items-center text-[14px] text-muted">사진의 번호를 누르면 설명을 볼 수 있어요.</p>
            ) : (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-medium text-paper">{active + 1}</span>
                  <span className="text-[15px] font-bold">{interiorFeatures[active].title}</span>
                </div>
                <p className="m-0 text-[14px] leading-[1.6] text-body">{interiorFeatures[active].body}</p>
              </>
            )}
          </div>

          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-5 gap-y-4 p-0">
            {interiorFeatures.map((f, i) => {
              const on = active === i;
              return (
                <li key={f.n} {...hoverProps(i)}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={pinned === i}
                    className={`flex h-full w-full cursor-pointer flex-col gap-2 rounded-md border-t-2 px-4 pt-4 pb-5 text-left transition-[background-color,border-color,opacity,box-shadow] duration-200 ${
                      on
                        ? "border-accent bg-white shadow-[0_6px_24px_rgba(23,24,26,.08)]"
                        : `border-[rgba(23,24,26,.15)] bg-transparent ${active !== null ? "opacity-40" : ""}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-6 flex-none items-center justify-center rounded-full font-mono text-[11px] font-medium transition-colors ${
                          on ? "bg-accent text-paper" : "bg-ink text-paper"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <h3 className="m-0 text-[17px] font-bold tracking-[-0.01em]">{f.title}</h3>
                    </div>
                    <p className="m-0 text-[15px] leading-[1.7] text-pretty text-body">{f.body}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <SystemTabs />
      </div>
    </section>
  );
}

/** 번호 옆에 뜨는 설명 말풍선. 사진 가장자리에서는 안쪽으로 붙는다. */
function Bubble({ f }: { f: (typeof interiorFeatures)[number] }) {
  const below = f.y < 45;
  const align = f.x < 28 ? "left" : f.x > 72 ? "right" : "center";
  const x = align === "left" ? "-translate-x-[18px]" : align === "right" ? "-translate-x-[calc(100%-18px)]" : "-translate-x-1/2";
  return (
    <div
      role="tooltip"
      style={{ left: `${f.x}%`, top: `${f.y}%` }}
      className={`pointer-events-none absolute z-30 hidden w-[min(280px,78vw)] sm:block ${x} ${below ? "pt-[clamp(20px,2.2vw,26px)]" : "-translate-y-full pb-[clamp(20px,2.2vw,26px)]"}`}
    >
      <div className="animate-[bubble_.18s_ease-out] rounded-md bg-ink px-4 pt-3 pb-3.5 text-paper shadow-[0_10px_30px_rgba(0,0,0,.3)]">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-mono text-[11px] font-medium text-accent-dark">{f.n}</span>
          <span className="text-[15px] font-bold">{f.title}</span>
        </div>
        <p className="m-0 text-[13px] leading-[1.6] text-[rgba(244,243,239,.82)]">{f.body}</p>
      </div>
    </div>
  );
}

const systemTabs = [
  { id: "standard", label: "표준배합시스템", items: standardSystems },
  { id: "optional", label: "선택배치시스템", items: optionalSystems },
];

/** 표준배합 / 선택배치 시스템 탭 */
function SystemTabs() {
  const [tab, setTab] = useState(0);
  const cur = systemTabs[tab];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (tab + (e.key === "ArrowRight" ? 1 : -1) + systemTabs.length) % systemTabs.length;
    setTab(next);
    document.getElementById(`systab-${systemTabs[next].id}`)?.focus();
  };
  return (
    <aside className="flex flex-col gap-5 self-start rounded-md bg-paper-2 p-[clamp(20px,2.6vw,32px)] lg:order-1">
      <div role="tablist" aria-label="인테리어 시스템" onKeyDown={onKey} className="grid grid-cols-2 gap-1 rounded-full bg-[rgba(23,24,26,.07)] p-1">
        {systemTabs.map((t, i) => {
          const on = i === tab;
          return (
            <button
              key={t.id}
              id={`systab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`syspanel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(i)}
              className={`inline-flex cursor-pointer items-baseline justify-center gap-1 whitespace-nowrap rounded-full px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                on ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-[rgba(23,24,26,.06)]"
              }`}
            >
              {t.label.replace("시스템", "")}
              <span className="font-mono text-[11px] font-normal opacity-60">{t.items.length}</span>
            </button>
          );
        })}
      </div>
      <div id={`syspanel-${cur.id}`} role="tabpanel" aria-labelledby={`systab-${cur.id}`} className="flex flex-col gap-3">
        <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{cur.label}</h3>
        <ul className="m-0 flex list-none flex-col border-t border-ink p-0">
          {cur.items.map((s) => (
            <li key={s.n} className="flex gap-3.5 border-b border-[rgba(23,24,26,.12)] py-[11px] text-[15px] leading-[1.45]">
              <span className="min-w-[20px] pt-[2px] font-mono text-[12px] font-medium text-accent">{s.n}</span>
              <span>{s.t}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
