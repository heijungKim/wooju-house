import { Photo } from "./ui";

const headline = (
  <>
    공장에서 완성해
    <br />
    그대로 옮겨 놓는 집
  </>
);
const intro =
  "우주선 캡슐하우스 주문 제작 전문기업. 주택형 · 영업형 · 확장형 6개 모델을 설계부터 생산, 설치까지 직접 책임집니다.";
const label = "MODULAR CAPSULE HOUSE";

export default function Hero({ layout }: { layout: "full" | "split" }) {
  return (
    <section id="top">
      {layout === "full" ? (
        <div className="relative h-[min(86vh,820px)] min-h-[560px] md:min-h-[520px] overflow-hidden bg-[#cfd3d6]">
          <div className="absolute inset-0">
            <Photo src="/img/hero.jpg" alt="우주하우스 대표 외관" priority />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[90%] bg-[linear-gradient(to_top,rgba(14,15,17,.8)_0%,rgba(14,15,17,.55)_45%,rgba(14,15,17,0))] md:h-[60%] md:bg-[linear-gradient(to_top,rgba(14,15,17,.72),rgba(14,15,17,0))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-7 px-5 pb-10 text-paper sm:px-8 md:gap-10 md:pb-16">
              <div className="max-w-[720px]">
                <div className="mb-4 font-mono text-[12px] md:mb-5 md:text-[13px] font-medium tracking-[.12em] text-accent-dark">{label}</div>
                <h1 className="m-0 text-[length:clamp(34px,6vw,80px)] leading-[1.08] font-bold tracking-[-0.035em]">{headline}</h1>
              </div>
              <div className="pointer-events-auto flex max-w-[360px] flex-col gap-5">
                <p className="m-0 text-[15px] leading-[1.65] text-[rgba(244,243,239,.9)] md:text-[17px]">{intro}</p>
                <a href="#products" className="self-start whitespace-nowrap rounded-full bg-paper px-[22px] py-3.5 text-[15px] font-semibold text-ink">
                  제품 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1320px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-8 px-5 pt-10 pb-14 sm:px-8 md:gap-12 md:pt-14 md:pb-[72px]">
          <div className="flex flex-col gap-7">
            <div className="font-mono text-[13px] font-medium tracking-[.12em] text-accent">{label}</div>
            <h1 className="m-0 text-[length:clamp(34px,5.4vw,76px)] leading-[1.08] font-bold tracking-[-0.035em]">{headline}</h1>
            <p className="m-0 max-w-[460px] text-[18px] leading-[1.65] text-sub">{intro}</p>
            <a href="#products" className="self-start whitespace-nowrap rounded-full bg-ink px-[22px] py-3.5 text-[15px] font-semibold text-paper">
              제품 보기
            </a>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-md">
            <Photo src="/img/hero.jpg" alt="우주하우스 대표 외관" sizes="(min-width: 1000px) 640px, 100vw" priority />
          </div>
        </div>
      )}
    </section>
  );
}
