import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 → 상대 경로 정적 내보내기 (미리보기 링크용)
const preview = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = preview
  ? { output: "export", assetPrefix: "./assets", images: { unoptimized: true } }
  : {};

export default nextConfig;
