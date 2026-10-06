const nav = [
  { href: "#products", label: "제품 라인업" },
  { href: "#compare", label: "사양 비교" },
  { href: "#interior", label: "인테리어" },
  { href: "#install", label: "설치" },
  { href: "#cases", label: "시공 사례" },
  { href: "#contact", label: "문의" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(23,24,26,.1)] bg-[rgba(244,243,239,.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-6 px-8">
        <a href="#top" className="group flex flex-none items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-[20px] font-extrabold tracking-[-0.02em] group-hover:text-accent">우주하우스</span>
          <span className="font-mono text-[11px] font-medium tracking-[.08em] text-muted">WOOJU HOUSE</span>
        </a>
        <nav className="flex min-w-0 gap-[clamp(14px,2vw,28px)] overflow-x-auto whitespace-nowrap text-[15px] font-medium">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-accent">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
