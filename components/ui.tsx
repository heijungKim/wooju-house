import Image from "next/image";

/** 섹션 라벨 (예: 01 — LINEUP) */
export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`font-mono text-[12px] font-medium tracking-[.12em] ${dark ? "text-accent-dark" : "text-accent"}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`m-0 text-[length:clamp(32px,4vw,52px)] font-bold tracking-[-0.03em] ${className}`}>{children}</h2>
  );
}

/** 작은 모노 캡션 (예: 실내, 평면도) */
export function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[12px] font-medium text-muted">{children}</span>;
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="m-0 text-[24px] font-bold tracking-[-0.02em]">{children}</h3>;
}

/**
 * 이미지 슬롯. 부모 박스(크기·radius·overflow·배경)를 채운다.
 * src가 없으면 업로드 예정 자리표시를 보여준다.
 */
export function Photo({
  src,
  alt,
  placeholder,
  fit = "cover",
  sizes = "100vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  placeholder?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[rgba(127,127,127,.08)] p-3 text-center text-[13px] leading-[1.3] text-ink">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-45" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5-9 9" />
        </svg>
        <span className="max-w-[90%] font-medium tracking-[.01em] opacity-75">{placeholder ?? alt}</span>
        <span className="pointer-events-none absolute inset-0 border-[1.5px] border-dashed border-current opacity-35" />
      </div>
    );
  }
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
