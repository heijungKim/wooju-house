// Next 정적 export(out/)를 Artifact용 프래그먼트 + 상대경로 파일로 변환
import fs from 'node:fs'; import path from 'node:path';
const [outDir, dest, fontFile] = process.argv.slice(2);
fs.rmSync(dest, { recursive: true, force: true }); fs.mkdirSync(dest, { recursive: true });
fs.cpSync(path.join(outDir, '_next'), path.join(dest, 'assets/_next'), { recursive: true });
fs.cpSync(path.join(outDir, 'img'), path.join(dest, 'img'), { recursive: true });
fs.mkdirSync(path.join(dest, 'fonts')); fs.copyFileSync(fontFile, path.join(dest, 'fonts/PretendardVariable.woff2'));
// JS 청크 안의 절대 이미지 경로를 상대 경로로
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(path.join(dest, 'assets/_next')).filter(f => f.endsWith('.js'))) {
  const s = fs.readFileSync(f, 'utf8'); const t = s.replaceAll('"/img/', '"./img/').replaceAll('`/img/', '`./img/').replaceAll('\uFFFD', '\\uFFFD');
  if (s !== t) fs.writeFileSync(f, t);
}
let html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8').replaceAll('"/img/', '"./img/').replaceAll('\\"/img/', '\\"./img/');
const htmlClass = /<html[^>]*class="([^"]*)"/.exec(html)[1];
const head = /<head>([\s\S]*?)<\/head>/.exec(html)[1]
  .replace(/<meta charSet[^>]*>/i, '').replace(/<meta name="viewport"[^>]*>/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '').replace(/<link[^>]*pretendard[^>]*>/g, '');
const body = /<body[^>]*>([\s\S]*)<\/body>/.exec(html)[1];
// Pretendard @font-face를 CSS 청크에 넣음 (React가 문서를 다시 그려도 유지됨)
const ff = '@font-face{font-family:"Pretendard Variable";src:url(../../../../fonts/PretendardVariable.woff2) format("woff2-variations"),url(../../../../fonts/PretendardVariable.woff2) format("woff2");font-weight:45 920;font-style:normal;font-display:swap}';
for (const f of walk(path.join(dest, 'assets/_next/static/chunks')).filter(f => f.endsWith('.css'))) fs.writeFileSync(f, ff + fs.readFileSync(f, 'utf8'));
const frag = `<title>우주하우스</title>
<script>document.documentElement.classList.add(${JSON.stringify(...htmlClass.split(' ').filter(Boolean)).replace(/^/, '').split(',').join('","')})</script>
${head}
${body}`;
fs.writeFileSync(path.join(dest, 'index.html'), frag);
console.log('ok', htmlClass, frag.length);
