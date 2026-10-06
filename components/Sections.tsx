import { cases, contact, installSteps, optionalSystems, sites, standardSystems, workPhotos } from "@/content/models";
import { Caption, Eyebrow, Photo, SectionTitle, SubTitle } from "./ui";

function SectionHead({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="mb-12 flex flex-col gap-3.5">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
    </div>
  );
}

function SubHead({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-5">
      <SubTitle>{title}</SubTitle>
      <Caption>{meta}</Caption>
    </div>
  );
}

function NumberedList({ title, items }: { title: string; items: { n: string; t: string }[] }) {
  return (
    <div className="flex flex-col gap-5">
      <SubTitle>{title}</SubTitle>
      <div className="flex flex-col border-t border-ink">
        {items.map((s) => (
          <div key={s.n} className="flex gap-4 border-b border-[rgba(23,24,26,.12)] py-[13px] text-[16px]">
            <span className="min-w-[22px] pt-[3px] font-mono text-[12px] font-medium text-accent">{s.n}</span>
            <span>{s.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Interior() {
  return (
    <section id="interior" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-8 py-28">
      <SectionHead eyebrow="03 — INTERIOR" title="인테리어 디테일" />
      <div className="mb-14 aspect-[21/9] overflow-hidden rounded-md bg-well">
        <Photo src="/img/interior.jpg" alt="실내 전경" sizes="(min-width: 1320px) 1256px, 100vw" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-14">
        <NumberedList title="표준배합시스템" items={standardSystems} />
        <NumberedList title="선택배치시스템" items={optionalSystems} />
      </div>
    </section>
  );
}

export function Install() {
  return (
    <section id="install" className="scroll-mt-[68px] bg-paper-2">
      <div className="mx-auto max-w-[1320px] px-8 py-28">
        <SectionHead eyebrow="04 — INSTALLATION" title="안전한 설치방법" />
        <div className="mb-12 aspect-[3/1] overflow-hidden rounded-md bg-white">
          <Photo src="/img/install.jpg" alt="설치 과정 일러스트" fit="contain" sizes="(min-width: 1320px) 1256px, 100vw" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-10">
          {installSteps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3.5 border-t border-ink pt-5">
              <span className="font-mono text-[12px] font-medium text-accent">STEP {s.n}</span>
              <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="m-0 text-[15px] leading-[1.75] text-pretty text-body">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-24 flex flex-col gap-6">
          <SubHead title="제작 · 시공 현장" meta="WORK IN PROGRESS" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            {workPhotos.map((w) => (
              <div key={w.label} className="flex flex-col gap-2.5">
                <div className="aspect-square overflow-hidden rounded bg-[#dcdad4]">
                  <Photo src={w.src} alt={w.label} placeholder={w.placeholder} sizes="(min-width: 1320px) 310px, (min-width: 600px) 50vw, 100vw" />
                </div>
                <Caption>{w.label}</Caption>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Cases() {
  return (
    <section id="cases" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-8 py-28">
      <SectionHead eyebrow="05 — PROJECTS" title="시공 사례" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,380px),1fr))] gap-4">
        {cases.map((src) => (
          <div key={src} className="aspect-[4/3] overflow-hidden rounded bg-well">
            <Photo src={src} alt="시공 사례 사진" sizes="(min-width: 1320px) 410px, (min-width: 800px) 50vw, 100vw" />
          </div>
        ))}
      </div>
      <div className="mt-24 flex flex-col gap-6">
        <SubHead title="단지 개발 계획" meta="CAMPSITE · RESORT" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-4">
          {sites.map((s) => (
            <div key={s.src} className="flex flex-col gap-2.5">
              <div className="aspect-[5/3] overflow-hidden rounded bg-well">
                <Photo src={s.src} alt={s.label} sizes="(min-width: 1320px) 410px, (min-width: 800px) 50vw, 100vw" />
              </div>
              <span className="text-[15px] font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-[68px] bg-ink text-paper">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-16 px-8 pt-28 pb-16">
        <div className="flex flex-col gap-7">
          <Eyebrow dark>06 — CONTACT</Eyebrow>
          <SectionTitle className="leading-[1.2]">
            기술로 만들고,
            <br />
            품질로 증명합니다.
          </SectionTitle>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.75] text-[rgba(244,243,239,.78)]">
            기획과 디자인, 설계, 생산에 이르기까지 모든 공정을 직접 관리하는 100% 국내 생산 시스템을 기반으로, 고객이 요구하는 공간의 가치와 완성도를 한 단계 높은 수준으로 구현하고 있습니다.
          </p>
        </div>
        <dl className="m-0 flex flex-col border-t border-[rgba(244,243,239,.4)]">
          {contact.map((c) => (
            <div key={c.label} className="grid grid-cols-[100px_1fr] gap-4 border-b border-[rgba(244,243,239,.14)] py-5">
              <dt className="pt-1 font-mono text-[12px] font-medium tracking-[.08em] text-[rgba(244,243,239,.6)]">{c.label}</dt>
              <dd className={`m-0 text-[20px] font-semibold ${c.label === "EMAIL" ? "break-all" : ""}`}>
                {c.href ? (
                  <a href={c.href} className="text-paper">
                    {c.value}
                  </a>
                ) : (
                  c.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-5 px-8 pt-6 pb-10 font-mono text-[12px] text-[rgba(244,243,239,.5)]">
        <span>© 2026 우주하우스</span>
        <span>MODULAR CAPSULE HOUSE</span>
      </div>
    </section>
  );
}
