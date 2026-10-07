import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

const description =
  "우주선 캡슐하우스 주문 제작 전문기업. 주택형 · 영업형 · 확장형 6개 모델을 설계부터 생산, 설치까지 직접 책임집니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wj-house.kr"),
  title: "우주하우스 | 모듈형 캡슐하우스",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "우주하우스",
    title: "우주하우스 | 모듈형 캡슐하우스",
    description,
    locale: "ko_KR",
    images: [{ url: "/img/hero.jpg", width: 2951, height: 1297, alt: "우주하우스 캡슐하우스 외관" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={plexMono.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
