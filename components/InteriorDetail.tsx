"use client";

import { useState } from "react";
import { interiorFeatures, optionalSystems, standardSystems } from "@/content/models";
import { Eyebrow, Photo, SectionTitle } from "./ui";

/** 인테리어 디테일: 사진 위 번호 포인트 + 설명, 좌측 시스템 목록 (카탈로그 구성) */
export default function InteriorDetail() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="interior" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-8 py-28">
      <div className="mb-12 flex flex-col gap-3.5">
        <Eyebrow>03 — INTERIOR</Eyebrow>
        <SectionTitle>인테리어 디테일</SectionTitle>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
        <div className="flex min-w-0 flex-col gap-10 lg:order-2">
          <div className="relative aspect-[2075/859] overflow-hidden rounded-md bg-well">
            <Photo src="/img/interior.jpg" alt="인테리어 전경" sizes="(min-width: 1320px) 900px, 100vw" />
            {interiorFeatures.map((f, i) => (
              <button
                key={f.n}
                type="button"
                aria-label={`${f.n} ${f.title}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={`absolute flex size-[clamp(22px,2.4vw,30px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full font-mono text-[clamp(10px,1vw,12px)] font-medium shadow-[0_0_0_3px_rgba(244,243,239,.7),0_2px_8px_rgba(0,0,0,.25)] transition-colors ${
                  active === i ? "bg-accent text-paper" : "bg-ink text-paper"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-7 p-0">
            {interiorFeatures.map((f, i) => (
              <li
                key={f.n}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`flex flex-col gap-2 border-t pt-4 transition-colors ${active === i ? "border-accent" : "border-[rgba(23,24,26,.15)]"}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] font-medium text-accent">{f.n}</span>
                  <h3 className="m-0 text-[17px] font-bold tracking-[-0.01em]">{f.title}</h3>
                </div>
                <p className="m-0 text-[15px] leading-[1.7] text-pretty text-body">{f.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="flex flex-col gap-10 self-start rounded-md bg-paper-2 p-[clamp(24px,3vw,36px)] lg:order-1">
          <SystemList title="표준배합시스템" items={standardSystems} />
          <SystemList title="선택배치시스템" items={optionalSystems} />
        </aside>
      </div>
    </section>
  );
}

function SystemList({ title, items }: { title: string; items: { n: string; t: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{title}</h3>
      <ul className="m-0 flex list-none flex-col border-t border-ink p-0">
        {items.map((s) => (
          <li key={s.n} className="flex gap-3.5 border-b border-[rgba(23,24,26,.12)] py-[11px] text-[15px] leading-[1.45]">
            <span className="min-w-[20px] pt-[2px] font-mono text-[12px] font-medium text-accent">{s.n}</span>
            <span>{s.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
