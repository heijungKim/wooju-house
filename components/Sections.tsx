import { cases, contact, installSteps, sites, workPhotos } from "@/content/models";
import { Caption, Eyebrow, Photo, SectionTitle, SubTitle } from "./ui";

function SectionHead({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="mb-8 flex flex-col md:mb-12 gap-3.5">
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

export function Install() {
  return (
    <section id="install" className="scroll-mt-[68px] bg-paper-2">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 py-[72px] md:py-28">
        <SectionHead eyebrow="04 — INSTALLATION" title="안전한 설치방법" />
        {/* 모바일에서는 일러스트가 너무 작아져 가로로 밀어서 보도록 */}
        <div className="-mx-5 mb-10 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 md:mb-12 [&::-webkit-scrollbar]:hidden">
          <div className="aspect-[3/1] min-w-[640px] overflow-hidden rounded-md bg-white sm:min-w-0">
            <Photo src="/img/install.jpg" alt="설치 과정 일러스트" fit="contain" sizes="(min-width: 1320px) 1256px, 640px" />
          </div>
        </div>
        <p className="-mt-7 mb-10 font-mono text-[11px] text-muted sm:hidden">← 옆으로 밀어서 보기</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {installSteps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3.5 border-t border-ink pt-5">
              <span className="font-mono text-[12px] font-medium text-accent">STEP {s.n}</span>
              <h3 className="m-0 text-[20px] font-bold tracking-[-0.02em] md:text-[22px]">{s.title}</h3>
              <p className="m-0 text-[15px] leading-[1.75] text-pretty text-body">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex md:mt-24 flex-col gap-6">
          <SubHead title="제작 · 시공 현장" meta="WORK IN PROGRESS" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {workPhotos.map((w) => (
              <div key={w.label} className="flex flex-col gap-2.5">
                <div className="aspect-square overflow-hidden rounded bg-[#dcdad4]">
                  <Photo src={w.src} alt={w.label} placeholder={w.placeholder} sizes="(min-width: 1024px) 310px, 50vw" />
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
    <section id="cases" className="mx-auto max-w-[1320px] scroll-mt-[68px] px-5 sm:px-8 py-[72px] md:py-28">
      <SectionHead eyebrow="05 — PROJECTS" title="시공 사례" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {cases.map((src) => (
          <div key={src} className="aspect-[4/3] overflow-hidden rounded bg-well">
            <Photo src={src} alt="시공 사례 사진" sizes="(min-width: 1320px) 410px, (min-width: 800px) 50vw, 100vw" />
          </div>
        ))}
      </div>
      <div className="mt-16 flex md:mt-24 flex-col gap-6">
        <SubHead title="단지 개발 계획" meta="CAMPSITE · RESORT" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 px-5 sm:px-8 pt-[72px] md:pt-28 pb-16">
        <div className="flex flex-col gap-6 md:gap-7">
          <Eyebrow dark>06 — CONTACT</Eyebrow>
          <SectionTitle className="leading-[1.2]">
            기술로 만들고,
            <br />
            품질로 증명합니다.
          </SectionTitle>
          <p className="m-0 max-w-[520px] text-[16px] leading-[1.75] md:text-[17px] text-[rgba(244,243,239,.78)]">
            기획과 디자인, 설계, 생산에 이르기까지 모든 공정을 직접 관리하는 100% 국내 생산 시스템을 기반으로, 고객이 요구하는 공간의 가치와 완성도를 한 단계 높은 수준으로 구현하고 있습니다.
          </p>
        </div>
        <dl className="m-0 flex flex-col border-t border-[rgba(244,243,239,.4)]">
          {contact.map((c) => (
            <div key={c.label} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 border-b border-[rgba(244,243,239,.14)] py-4 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-4 sm:py-5">
              <dt className="pt-1 font-mono text-[12px] font-medium tracking-[.08em] text-[rgba(244,243,239,.6)]">{c.label}</dt>
              <dd className="m-0 text-[17px] font-semibold [overflow-wrap:anywhere] sm:text-[20px]">
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
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-5 px-5 sm:px-8 pt-6 pb-10 font-mono text-[12px] text-[rgba(244,243,239,.5)]">
        <span>© 2026 우주하우스</span>
        <span>MODULAR CAPSULE HOUSE</span>
      </div>
    </section>
  );
}
