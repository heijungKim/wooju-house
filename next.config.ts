import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 → 상대 경로 정적 내보내기 (claude.ai 미리보기용)
// GITHUB_PAGES=1   → GitHub Pages 정적 배포 (https://<user>.github.io/<repo>/)
const preview = process.env.PREVIEW_EXPORT === "1";
const pagesBase = process.env.GITHUB_PAGES === "1" ? process.env.PAGES_BASE_PATH ?? "" : null;

const nextConfig: NextConfig =
  pagesBase !== null
    ? {
        output: "export",
        basePath: pagesBase,
        env: { NEXT_PUBLIC_BASE_PATH: pagesBase },
        images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
      }
    : preview
      ? { output: "export", assetPrefix: "./assets", images: { unoptimized: true } }
      : {};

export default nextConfig;
