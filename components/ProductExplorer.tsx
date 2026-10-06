"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { dims, modelImages, models, modelTypes, type Model, type ModelType } from "@/content/models";
import { Caption, Eyebrow, Photo, SectionTitle } from "./ui";

const Capsule3D = dynamic(() => import("./Capsule3D"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-well" />,
});

type Filter = "전체" | ModelType;
const filters: Filter[] = ["전체", ...modelTypes];

const HEADER_OFFSET = 76;

/** 제품 라인업 + 모델 상세 + 사양 비교 (선택 상태 공유) */
export default function ProductExplorer({ view }: { view: "grid" | "list" }) {
  const [filter, setFilter] = useState<Filter>("전체");
  const [sel, setSel] = useState("bk7");
  const [view3d, setView3d] = useState(false);
  const detailRef = useRef<HTMLElement>(null);

  const select = (key: string) => {
    setSel(key);
    // 상세 패널이 다시 그려진 뒤 스크롤
    requestAnimationFrame(() => {
      const el = detailRef.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: "smooth" });
    });
  };

  const visible = filter === "전체" ? models : models.filter((m) => m.type === filter);
  const selected = models.find((m) => m.key === sel) ?? models[0];

  return (
    <>
      <section id="products" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-8 pt-28 pb-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>01 — LINEUP</Eyebrow>
            <SectionTitle className="leading-[1.15]">제품 라인업</SectionTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = f === filter;
              const count = f === "전체" ? models.length : models.filter((m) => m.type === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f)}
                  className={`inline-flex cursor-pointer items-baseline gap-1 whitespace-nowrap rounded-full border px-[18px] py-2.5 text-[15px] font-medium ${
                    on ? "border-ink bg-ink text-paper" : "border-[rgba(23,24,26,.25)] bg-transparent text-ink"
                  }`}
                >
                  {f} <span className="font-mono text-[12px] font-normal opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-5">
            {visible.map((m) => (
              <ProductCard key={m.key} m={m} active={m.key === sel} onSelect={() => select(m.key)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col border-t border-[rgba(23,24,26,.15)]">
            {visible.map((m) => (
              <ProductRow key={m.key} m={m} active={m.key === sel} onSelect={() => select(m.key)} />
            ))}
          </div>
        )}
      </section>

      <section ref={detailRef} aria-label={`${selected.code} 상세`} className="mx-auto max-w-[1320px] scroll-mt-[68px] px-8 pt-10 pb-[120px]">
        <ModelDetail m={selected} view3d={view3d} setView3d={setView3d} />
      </section>

      <section id="compare" className="scroll-mt-[68px] bg-ink text-paper">
        <div className="mx-auto max-w-[1320px] px-8 py-28">
          <div className="mb-12 flex flex-col gap-3.5">
            <Eyebrow dark>02 — SPECIFICATIONS</Eyebrow>
            <SectionTitle>사양 비교</SectionTitle>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-[720px] flex-col">
              <div className="grid grid-cols-[1fr_1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[rgba(244,243,239,.4)] pb-3.5 font-mono text-[12px] font-medium tracking-[.08em] text-[rgba(244,243,239,.65)]">
                <span>모델</span>
                <span>구분</span>
                <span>길이</span>
                <span>폭</span>
                <span>높이</span>
                <span>건축면적</span>
              </div>
              {models.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => select(m.key)}
                  className="grid cursor-pointer grid-cols-[1fr_1.4fr_1fr_1fr_1fr_1fr] items-baseline gap-4 border-b border-[rgba(244,243,239,.14)] bg-transparent py-[22px] text-left text-[17px] text-paper hover:bg-[rgba(244,243,239,.05)]"
                >
                  <span className="text-[24px] font-bold tracking-[-0.02em]">{m.code}</span>
                  <span className="font-medium text-accent-dark">{m.title}</span>
                  <span>{m.l} m</span>
                  <span>{m.w} m</span>
                  <span>{m.h} m</span>
                  <span className="font-bold">{m.area}㎡</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MonoKey({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[11px] font-medium tracking-[.08em] text-muted">{children}</span>;
}

function ProductCard({ m, active, onSelect }: { m: Model; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-md border bg-white p-0 text-left text-ink ${
        active ? "border-ink shadow-[0_0_0_1px_#17181a]" : "border-[rgba(23,24,26,.1)]"
      }`}
    >
      <div className="box-border aspect-[16/10] w-full border-b border-[rgba(23,24,26,.08)] bg-white p-5">
        <div className="relative h-full w-full">
          <Image src={modelImages(m.key).side} alt={m.code} fill sizes="(min-width: 1320px) 420px, (min-width: 800px) 50vw, 100vw" className="object-contain" />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 pt-[22px] pb-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[34px] font-bold tracking-[-0.03em]">{m.code}</span>
          <span className="text-[14px] font-semibold text-accent">{m.type}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-[rgba(23,24,26,.1)] pt-3.5">
          <div className="flex flex-col gap-1">
            <MonoKey>AREA</MonoKey>
            <span className="text-[16px] font-semibold">{m.area}㎡</span>
          </div>
          <div className="flex flex-col gap-1">
            <MonoKey>L × W × H</MonoKey>
            <span className="text-[16px] font-semibold">{dims(m)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProductRow({ m, active, onSelect }: { m: Model; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`grid cursor-pointer grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto] items-center gap-8 border-b border-[rgba(23,24,26,.15)] px-2 py-5 text-left text-ink ${
        active ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="relative h-24 w-full overflow-hidden rounded bg-white">
        <Image src={modelImages(m.key).side} alt={m.code} fill sizes="240px" className="object-contain" />
      </div>
      <div className="flex flex-wrap items-baseline gap-5">
        <span className="min-w-[90px] text-[36px] font-bold tracking-[-0.03em]">{m.code}</span>
        <span className="text-[16px] font-semibold text-accent">{m.title}</span>
      </div>
      <div className="flex gap-7 font-mono text-[14px] font-medium text-sub">
        <span>{m.area}㎡</span>
        <span>{dims(m)}</span>
      </div>
    </button>
  );
}

function ModelDetail({ m, view3d, setView3d }: { m: Model; view3d: boolean; setView3d: (v: boolean) => void }) {
  const img = modelImages(m.key);
  const specs = [
    { k: "길이", v: m.l, u: "m" },
    { k: "폭", v: m.w, u: "m" },
    { k: "높이", v: m.h, u: "m" },
    { k: "건축면적", v: m.area, u: "㎡" },
  ];
  const toggle = (on: boolean) =>
    `cursor-pointer whitespace-nowrap rounded-full border-0 px-3.5 py-[7px] text-[13px] font-semibold ${
      on ? "bg-paper text-ink" : "bg-transparent text-paper"
    }`;

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white p-[clamp(20px,3vw,40px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[clamp(24px,4vw,56px)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded bg-well">
          {view3d ? (
            <Capsule3D key={m.key} model={m} />
          ) : (
            <Photo src={img.ext} alt={`${m.code} 외관`} placeholder="외관 사진" sizes="(min-width: 1000px) 620px, 100vw" />
          )}
          <div className="absolute top-3.5 left-3.5 flex gap-0.5 rounded-full bg-[rgba(23,24,26,.82)] p-[3px] backdrop-blur-[6px]">
            <button type="button" aria-pressed={!view3d} onClick={() => setView3d(false)} className={toggle(!view3d)}>
              사진
            </button>
            <button type="button" aria-pressed={view3d} onClick={() => setView3d(true)} className={toggle(view3d)}>
              3D 회전
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-7 pt-2">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[12px] font-medium tracking-[.12em] text-accent">MODEL {m.code}</span>
            <h3 className="m-0 text-[length:clamp(30px,3.4vw,44px)] leading-[1.15] font-bold tracking-[-0.03em]">{m.title}</h3>
          </div>
          <p className="m-0 text-[17px] leading-[1.75] text-pretty text-body">{m.desc}</p>
          <div className="grid grid-cols-4 border-t border-ink">
            {specs.map((s, i) => (
              <div key={s.k} className={`flex flex-col gap-1.5 pt-4 ${i < 3 ? "pr-3" : ""}`}>
                <MonoKey>{s.k}</MonoKey>
                <span className="text-[22px] font-bold tracking-[-0.02em]">
                  {s.v}
                  <span className="ml-0.5 text-[14px] font-medium">{s.u}</span>
                </span>
              </div>
            ))}
          </div>
          <a href="#contact" className="self-start whitespace-nowrap rounded-full bg-ink px-[22px] py-3.5 text-[15px] font-semibold text-paper">
            {m.code} 견적 문의
          </a>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        <Figure caption="실내">
          <div className="aspect-[4/3] overflow-hidden rounded bg-well">
            <Photo src={img.int} alt={`${m.code} 실내`} placeholder="실내 사진" sizes="(min-width: 1000px) 400px, 100vw" />
          </div>
        </Figure>
        <Figure caption="평면도">
          <div className="aspect-[4/3] overflow-hidden rounded border border-[rgba(23,24,26,.1)] bg-white">
            <Photo src={img.plan} alt={`${m.code} 평면도`} placeholder="평면도" fit="contain" sizes="(min-width: 1000px) 400px, 100vw" />
          </div>
        </Figure>
        <Figure caption="설계도면">
          <div className="aspect-[4/3] overflow-hidden rounded border border-[rgba(23,24,26,.1)] bg-white">
            <Photo src={img.dwg} alt={`${m.code} 설계도면`} placeholder="설계도면 (입면·단면도)" fit="contain" sizes="(min-width: 1000px) 400px, 100vw" />
          </div>
        </Figure>
      </div>
    </div>
  );
}

function Figure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {children}
      <Caption>{caption}</Caption>
    </div>
  );
}
