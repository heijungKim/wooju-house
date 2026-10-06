# Handoff: 우주하우스 제품 중심 회사 소개 사이트

## Overview
모듈형 캡슐하우스 제조사 "우주하우스"의 원페이지 소개 사이트. 6개 모델(BK7, K9, K7, B5, B7, K5) 중심 구성 — 라인업 필터, 모델 상세(사진/3D 회전 토글, 실내, 평면도, 설계도면), 사양 비교, 인테리어, 설치, 시공 사례, 문의.

## About the Design Files
`design/` 폴더의 파일은 **HTML로 만든 디자인 레퍼런스**입니다. 그대로 배포하는 프로덕션 코드가 아니라, 의도한 모양과 동작을 보여주는 프로토타입입니다. 대상 코드베이스의 기존 환경(React, Next.js 등)에서 재구현하세요. 기존 환경이 없다면 **Next.js(App Router) + Tailwind** 또는 **Astro** 정적 사이트를 권장합니다(콘텐츠 중심, SEO 중요).

- `우주하우스.dc.html`: 메인 페이지. 내부 전용 "Design Component" 포맷(`<x-dc>` 템플릿 + `class Component extends DCLogic` 로직)이며 `support.js` 런타임 없이는 열리지 않을 수 있음. 마크업·인라인 스타일·로직 클래스를 읽어 구조를 참고.
- `capsule-3d.html` + `three-d-stage.js`: 독립 실행 가능한 three.js 3D 뷰어. `?m=bk7` 등 쿼리로 모델 선택.
- `image-slot.js`: 디자인 툴 전용 이미지 드롭 컴포넌트 → 실제 구현에서는 일반 `<img>`/`next/image`로 교체.

## Fidelity
**High-fidelity.** 색상, 타이포, 간격, 인터랙션 확정. 픽셀 단위로 재현하세요.

## Layout 공통
- 컨테이너: `max-width:1320px; margin:0 auto; padding:0 32px`
- 섹션 세로 패딩: 112px (상세 패널 40px/120px)
- 섹션 헤더: 모노 라벨(`01 — LINEUP`, 12px, letter-spacing .12em, #9a6f25) + H2(clamp(32px,4vw,52px), 700, -0.03em)
- 그리드: `repeat(auto-fit|auto-fill, minmax(min(100%,Npx),1fr))` 로 반응형
- 한글 줄바꿈: `word-break:keep-all`, 버튼/네비 `white-space:nowrap`

## Screens / Sections
1. **Header (sticky)** 높이 68px, 배경 rgba(244,243,239,.92) + blur(10px), 하단 1px rgba(23,24,26,.1). 좌: "우주하우스"(20px/800) + "WOOJU HOUSE"(모노 11px #6b6a66). 우: 앵커 네비 6개(15px/500, gap clamp(14px,2vw,28px), 가로 스크롤 허용).
2. **Hero** — 두 레이아웃(prop `heroLayout`):
   - `full`(기본): 높이 min(86vh,820px), min 520px, 풀블리드 사진 + 하단 60% 그라디언트(rgba(14,15,17,.72)→0). 좌하단 라벨(#e6c98f) + H1 "공장에서 완성해 / 그대로 옮겨 놓는 집"(clamp(40px,6vw,80px)/700/1.08/-0.035em), 우측 설명(17px/1.65) + CTA "제품 보기"(밝은 pill).
   - `split`: 2단 그리드, 우측 4:3 사진.
3. **제품 라인업** — 필터 pill(전체/주택형/영업형/확장형 + 개수). 활성: bg #17181a, 글자 #f4f3ef. 비활성: 투명, 테두리 rgba(23,24,26,.25). 카드(prop `productView`=grid): 흰 배경, radius 6, 상단 16:10 측면도(contain, padding 20), 모델코드 34px/700, 구분 14px/600 #9a6f25, AREA / L×W×H 2단. 선택 카드: 테두리+1px 링 #17181a. list 뷰: 행 그리드 `240px | 1fr | auto`.
4. **모델 상세 패널** — 선택 모델 1개만 표시. 흰 배경 radius 8, padding clamp(20px,3vw,40px). 좌 4:3 외관 + 좌상단 토글(사진 / 3D 회전, 어두운 pill rgba(23,24,26,.82)). 우: MODEL 라벨, 제목(clamp(30px,3.4vw,44px)), 설명(17px/1.75), 4칸 스펙(길이/폭/높이/건축면적, 상단 1px #17181a, 값 22px/700), CTA "{code} 견적 문의". 하단 3칸: 실내 / 평면도 / 설계도면(빈 슬롯 — 사용자 업로드 예정).
5. **사양 비교** — 배경 #17181a. 6열 표(모델, 구분, 길이, 폭, 높이, 건축면적), 행 클릭 시 해당 모델 선택 후 상세로 스크롤. 모바일은 min-width 720px 가로 스크롤.
6. **인테리어** — 21:9 실내 사진 + 2단 리스트(표준배합시스템 10개 / 선택배치시스템 4개), 번호 모노 #9a6f25.
7. **설치** — 배경 #e9e8e3. 3:1 설치 일러스트, 3단계 카드(STEP 01~03), 하단 "제작 · 시공 현장" 1:1 작업사진 4칸(프레임 제작 / 외장·도장 / 내부 마감 / 운송·설치, 사용자 업로드 예정).
8. **시공 사례** — 4:3 사진 6장 그리드 + "단지 개발 계획" 5:3 조감도 3장(캠프장 계획 / 리조트 시안 / 리조트 수변).
9. **문의 / Footer** — 배경 #17181a. 좌: 헤드라인 "기술로 만들고, 품질로 증명합니다." + 소개문. 우: TEL/HP/EMAIL/ADDRESS 표(라벨 100px 모노).

## Interactions & Behavior
- 앵커 네비 smooth scroll, 섹션 `scroll-margin-top:68px`.
- 카드/행 클릭 → `sel` 변경 → 상세 패널 상단으로 스크롤(헤더 높이 76px 오프셋).
- 필터 클릭 → 목록 필터링(상세 선택은 유지).
- 사진/3D 토글 → 3D일 때 `capsule-3d.html?m={key}` iframe 로드(선택 모델만, 성능상 lazy). 3D 뷰어: 자동 회전, 드래그 회전, 휠 줌, OBJ/GLB 다운로드.
- 사양 비교 행 hover: bg rgba(244,243,239,.05).

## State
- `filter`: '전체' | '주택형' | '영업형' | '확장형'
- `sel`: 모델 key (기본 'bk7')
- `view3d`: boolean
- 설정값: `productView` ('grid'|'list'), `heroLayout` ('full'|'split')

## Data (models)
| key | code | 구분 | 제목 | L | W | H | 면적㎡ | 비고 |
|---|---|---|---|---|---|---|---|---|
| bk7 | BK7 | 주택형 | 신형 주택형 우주선 | 11.5 | 3.3 | 3.2 | 38 | |
| k9 | K9 | 주택형 | 주택형 우주선 | 11.5 | 3.4 | 3.4 | 39 | 천창 |
| k7 | K7 | 영업형 | 영업형 우주선 | 11.5 | 3.3 | 3.2 | 38 | |
| b5 | B5 | 영업형 | 영업형 우주선 | 8.5 | 3.3 | 3.2 | 28 | 발코니 |
| b7 | B7 | 확장형 | 확장형 우주선 | 11.5 | 3.3 | 3.2 | 38 | 발코니 |
| k5 | K5 | 확장형 | 확장형 우주선 | 8.5 | 3.3 | 3.2 | 28 | |

모델 설명문, 표준/선택 시스템 목록, 설치 3단계 문구, 연락처는 `우주하우스.dc.html` 로직 클래스(`models`, `standard`, `optional`, `steps`)와 템플릿에 원문 그대로 있음 — 그대로 옮길 것. 데이터는 `content/models.ts` 같은 단일 파일로 분리 권장.

## Design Tokens
- 배경 #f4f3ef / 보조 배경 #e9e8e3 / 이미지 바탕 #e7e6e1 / 카드 #ffffff
- 잉크 #17181a / 본문 #3a3a38 / 보조 #4a4a47 / 뮤트 #6b6a66
- 액센트(라이트) #9a6f25 / 액센트(다크 배경) #e6c98f
- 다크 섹션 텍스트 #f4f3ef, 보조 rgba(244,243,239,.78 / .6 / .5), 구분선 rgba(244,243,239,.14 / .4)
- 구분선(라이트) rgba(23,24,26,.1 / .12 / .15), 강조선 1px #17181a
- 폰트: Pretendard Variable(본문/헤드라인), IBM Plex Mono 400/500(라벨·수치)
- Radius: 4(이미지) / 6(카드·히어로) / 8(상세 패널) / 999(pill)
- 간격: 8 · 12 · 16 · 20 · 28 · 40 · 48 · 56 · 64 · 96 · 112

## Assets
`design/img/` — 모두 TNB 카다로그 PDF에서 저해상도로 크롭한 임시 이미지. **고해상도 원본으로 교체 필요.**
- `{key}-ext.png` 외관, `{key}-int.png` 실내, `{key}-side.png` 측면도, `{key}-plan.png` 평면도 (6개 모델)
- `hero.png`, `interior.png`, `install.png`, `case1~6.png`, `camp.png`, `resort.png`, `island.png`
- 설계도면(`{key}-dwg`), 작업사진(`work-1~4`)은 비어 있음 — 업로드 예정.
- 3D 모델은 치수 기반 단순화 모델(`capsule-3d.html`). 실제 CAD/GLB가 있으면 GLTFLoader로 교체 권장.

## Files
- `design/우주하우스.dc.html` — 메인 페이지 디자인
- `design/capsule-3d.html`, `design/three-d-stage.js` — 3D 뷰어
- `design/image-slot.js` — (참고용) 이미지 슬롯
- `design/img/*` — 이미지

## Claude Code 시작 프롬프트 예시
> design_handoff_wooju_house/README.md 와 design/ 폴더를 읽고, Next.js + Tailwind로 이 사이트를 구현해줘. 모델 데이터는 content/models.ts로 분리하고, 3D 뷰어는 클라이언트 컴포넌트로 lazy-load 해줘.
