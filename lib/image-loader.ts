// GitHub Pages용: 최적화 서버가 없으므로 basePath만 붙여 원본 이미지를 그대로 사용
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
}
