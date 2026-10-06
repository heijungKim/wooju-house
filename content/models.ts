// 우주하우스 사이트 콘텐츠. 문구는 디자인(project/우주하우스.dc.html) 원문 그대로.

export type ModelType = "주택형" | "영업형" | "확장형";

export type Model = {
  key: string;
  code: string;
  type: ModelType;
  title: string;
  /** 치수(m) — 표시용 문자열 */
  l: string;
  w: string;
  h: string;
  /** 건축면적(㎡) */
  area: number;
  desc: string;
  /** 3D 뷰어 옵션: 천창(K9) / 발코니(B5, B7) */
  skylight?: boolean;
  deck?: boolean;
};

export const models: Model[] = [
  {
    key: "bk7", code: "BK7", type: "주택형", title: "신형 주택형 우주선", l: "11.5", w: "3.3", h: "3.2", area: 38,
    desc: "bk7은 현재 회사에서 최신 개발한 제품으로 주방 배치를 추가하고 내부 배치를 자유롭게 선택하여 배치할 수 있어 더욱 좋은 경험을 할 수 있다.",
  },
  {
    key: "k9", code: "K9", type: "주택형", title: "주택형 우주선", l: "11.5", w: "3.4", h: "3.4", area: 39, skylight: true,
    desc: "K9 제품 라인에서 가장 큰 사이즈로 초대형 크기를 보유하고 있다. 천창 및 면적은 사용자의 모든 방면의 사용 요구를 만족시킨다. 아연도금 구조 전체 알루미늄 케이스는 긴 시간 사용 자연환경을 느낄 수 있게 해줍니다.",
  },
  {
    key: "k7", code: "K7", type: "영업형", title: "영업형 우주선", l: "11.5", w: "3.3", h: "3.2", area: 38,
    desc: "전체 강철 프레임과 플루오르 카본 페인팅 에어 알루미늄. 고전적인 흑백 두색을 이용하여 시각효과를 강화한다. 유려한 곡선의 외관 디자인으로 국내외 고급 조립식 건물에 첫발을 내딛는 데다 뛰어난 외모로 시장에서 선호받는다.",
  },
  {
    key: "b5", code: "B5", type: "영업형", title: "영업형 우주선", l: "8.5", w: "3.3", h: "3.2", area: 28, deck: true,
    desc: "b5 모델은 흑백의 플루오카본페인트 항공알루미늄 외장면을 채용하였다. 원가를 낮추면서도 기술적인 느낌을 주는 전망용 발코니가 있어 자연을 직접 즐길 수 있으며, 베스트셀러이다.",
  },
  {
    key: "b7", code: "B7", type: "확장형", title: "확장형 우주선", l: "11.5", w: "3.3", h: "3.2", area: 38, deck: true,
    desc: "B7은 성능 대비 성능이 우수한 제품으로 본체는 열도금아연강, 플루오카본페인트 항공알루미늄을 사용하였으며 주방설계와 합리적인 평면배치로 넓은 공간의 편안함, 넓은 시야의 파노라마 선창, 슈퍼 공간의 확장성을 특징으로 하였다.",
  },
  {
    key: "k5", code: "K5", type: "확장형", title: "확장형 우주선", l: "8.5", w: "3.3", h: "3.2", area: 28,
    desc: "본체는 열도금아연강 + 플루오카본도료를 사용한 항공알루미늄으로 B7 레이아웃설계를 참고하여 크기를 줄였으며 보다 경제적이고 실속있다. 내부 배치: 주방 + 거실 + 침실 + 화장실 조합으로 민박, 주거, 사무 등에 적합합니다.",
  },
];

export const modelTypes: ModelType[] = ["주택형", "영업형", "확장형"];

/** 모델별 이미지 경로. 설계도면(dwg)은 아직 없음 — 파일을 넣고 경로를 채우면 표시됨. */
export const modelImages = (key: string) => ({
  side: `/img/${key}-side.jpg`,
  ext: `/img/${key}-ext.jpg`,
  int: `/img/${key}-int.jpg`,
  plan: `/img/${key}-plan.jpg`,
  dwg: undefined as string | undefined,
});

export const dims = (m: Model) => `${m.l}×${m.w}×${m.h}m`;

const numbered = (items: string[]) => items.map((t, i) => ({ n: String(i + 1).padStart(2, "0"), t }));

export const standardSystems = numbered([
  "표준내진구조체계",
  "초저에너지 보온 구조 체계",
  "표준 색상 쉘 모듈 · 사용자 정의 색상 가능",
  "표준 컬러 인테리어 모듈 · 사용자 정의 인테리어 완성 가능",
  "표준 컬러 캐비닛 모듈 · 맞춤형 캐비닛 소재",
  "전경 중공 low-e 유리",
  "친환경 바닥",
  "전 주택 조명",
  "브랜드 고급 욕실 일체형",
  "고급 안전 문",
]);

export const optionalSystems = numbered([
  "에어컨, 온수기, 신선한 공기 시스템 설치",
  "온돌 시스템 설치",
  "지능형 제어 시스템 선택 설치",
  "선루프 시스템 설치",
]);

/** 인테리어 사진 위 포인트. x, y = 사진 기준 위치(%). 카탈로그 '인테리어 디테일' 지시선 문구. */
export const interiorFeatures = [
  { x: 29.2, y: 10.5, title: "LED 조명 · 선루프", body: "LED 조명, 선루프 옵션이 추가됩니다. 스마트 모드와 결합되어 조명 환경을 쉽게 조절할 수 있습니다." },
  { x: 31.3, y: 53, title: "인텔리전트 컨트롤", body: "풀 하우스 인텔리전트 컨트롤 시스템 패널을 통합할 수 있으며, 모바일 단말기에서 원격 조종할 수 있습니다." },
  { x: 78.3, y: 30, title: "270° 파노라마 창", body: "270° 파노라마 창문으로 구성된 럭셔리한 풍경 속에서 자는 꿈을 실현합니다." },
  { x: 13.5, y: 84, title: "자유로운 평면 레이아웃", body: "완전히 자유로운 평면 레이아웃으로 다양한 상황에서 최대한의 만족과 무한한 가능성을 열어줍니다." },
  { x: 52.5, y: 60, title: "고급 욕실", body: "푸젠 고품질 전체 욕실 라인을 사용한 고급 욕실 브랜드 제품입니다." },
  { x: 66.7, y: 84, title: "로비 쿠션 공간", body: "순수한 자연의 즐거움의 극치를 보여주는 로비 쿠션 공간. 우리의 삶을 바꿀 수 있습니다." },
].map((f, i) => ({ ...f, n: String(i + 1).padStart(2, "0") }));

export const installSteps = [
  {
    n: "01", title: "운송 단계", img: "/img/install-1.jpg",
    body: "제품의 표준조달계약에는 운송료가 포함됩니다. 회사에서 통일적으로 화물차를 안배하여 프로젝트 현장까지 운송합니다. 표준화물차는 길이 17.5m의 하프트레일러이고 운송너비는 3.3m이며, 운송에 사용된 높이가 4.2m보다 크지 않아 전국 고속도로를 자유롭게 통행할 수 있습니다.",
  },
  {
    n: "02", title: "기중기 조립 단계", img: "/img/install-2.jpg",
    body: "화물이 현장에 도착한 후 고객은 현지의 기중기와 연락하여 봉사해야 합니다. 회사 기술진이 미리 도착해서 현장 지도를 합니다. 6~12톤의 무게를 들어 올리는 전체 시리즈 제품은 25톤급 이상의 기중기를 권장합니다.",
  },
  {
    n: "03", title: "설치 단계", img: "/img/install-3.jpg",
    body: "제품을 설치하기 전에 고객은 반드시 회사의 제품 표준에 근거해야 합니다. 수도, 전기, 오수 배수관과 하중 견딜 기초를 완성하는 전기 설계도 현장 공사를 진행하며, 회사 기술자의 지도하에 설치점까지 정확하게 위치를 잡습니다. 수도와 전기를 연결한 후 고객의 검수를 받습니다.",
  },
];

/** 제작·시공 현장 작업사진. src를 채우면 사진이 표시됨. */
export const workPhotos: { label: string; placeholder: string; src?: string }[] = [
  { label: "프레임 제작", placeholder: "작업사진 · 프레임" },
  { label: "외장 · 도장", placeholder: "작업사진 · 외장" },
  { label: "내부 마감", placeholder: "작업사진 · 내부" },
  { label: "운송 · 설치", placeholder: "작업사진 · 설치" },
];

export const cases = [1, 2, 3, 4, 5, 6].map((i) => `/img/case${i}.jpg`);

export const sites = [
  { src: "/img/camp.jpg", label: "캠프장 계획" },
  { src: "/img/resort.jpg", label: "프리미엄 리조트 개발 시안" },
  { src: "/img/island.jpg", label: "프리미엄 리조트 개발 시안 · 수변" },
];

export const contact = [
  { label: "TEL", value: "031-408-8856", href: "tel:031-408-8856" },
  { label: "HP", value: "010-8434-5277", href: "tel:010-8434-5277" },
  { label: "EMAIL", value: "cwkencha1976@naver.com", href: "mailto:cwkencha1976@naver.com" },
  { label: "ADDRESS", value: "경기도 화성시 팔탄면 무하로 149-52" },
];
