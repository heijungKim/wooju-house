import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/**
 * 우주하우스 캡슐 3D 모델 (단위 m, x = 길이, y = 위, z = 폭, 원점은 바닥 중앙).
 * 카탈로그 측면도를 기준으로 모델마다 유리 구간·데크·문 위치를 맞춘 근사 모델.
 * 실제 CAD/GLB가 생기면 GLTFLoader로 교체.
 */

/** 끝단 유리 구간. top/bottom = 끝에서 흰 몸체가 시작되는 거리(m). 위가 넓은 사다리꼴. */
type Bay = { top: number; bottom: number; deck?: number };

type Layout = {
  left?: Bay; // 없으면 막힌 끝단
  right?: Bay;
  door: number; // 문 중심 x (끝에서부터 m, 왼쪽 기준)
  louvres?: number[]; // 루버 중심 x (왼쪽 끝 기준 m)
  /** K9: 옆면 큰 창 (왼쪽 끝 기준 시작/끝 m) */
  sideWindow?: { from: number; to: number };
  /** B5: 왼쪽 끝 면의 둥근 검은 창 */
  roundEndWindow?: boolean;
  /** K9: 끝단 회색 패널 */
  endPanel?: boolean;
  skylight?: boolean;
};

export const LAYOUTS: Record<string, Layout> = {
  bk7: { left: { top: 2.7, bottom: 1.7 }, right: { top: 4.6, bottom: 3.6, deck: 1.4 }, door: 4.4, louvres: [3.5, 5.3] },
  k9: { door: 1.6, sideWindow: { from: 2.9, to: 10.9 }, endPanel: true, skylight: true },
  k7: { left: { top: 2.3, bottom: 1.4 }, right: { top: 5.75, bottom: 4.85, deck: 1.5 }, door: 3.3, louvres: [4.2] },
  b5: { right: { top: 5.4, bottom: 4.6, deck: 1.3 }, door: 1.5, louvres: [2.5], roundEndWindow: true },
  b7: { left: { top: 3.8, bottom: 2.3 }, right: { top: 3.8, bottom: 2.3 }, door: 5.9, louvres: [4.9, 6.9] },
  k5: { left: { top: 2.2, bottom: 0.8 }, right: { top: 2.2, bottom: 0.8 }, door: 3.2, louvres: [4.3] },
};

export type CapsuleSpec = { key: string; code: string; L: number; W: number; H: number };

export function buildCapsule(S: CapsuleSpec) {
  const lay = LAYOUTS[S.key] ?? LAYOUTS.bk7;
  const { L, W, H } = S;

  const M = {
    shell: new THREE.MeshPhysicalMaterial({ name: "aluminium_shell", color: 0xe6e7e6, roughness: 0.32, metalness: 0.08, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    panel: new THREE.MeshPhysicalMaterial({ name: "door_panel", color: 0xeeeeec, roughness: 0.3, metalness: 0.05, clearcoat: 0.5 }),
    seam: new THREE.MeshStandardMaterial({ name: "panel_seam", color: 0xa9adb0, roughness: 0.6 }),
    trim: new THREE.MeshStandardMaterial({ name: "dark_trim", color: 0x3b3e42, roughness: 0.4, metalness: 0.35 }),
    glass: new THREE.MeshPhysicalMaterial({
      name: "lowe_glass", color: 0x3d5660, roughness: 0.03, metalness: 0.15, transparent: true, opacity: 0.5,
      side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6,
    }),
    darkGlass: new THREE.MeshPhysicalMaterial({ name: "tinted_glass", color: 0x5f7884, roughness: 0.04, metalness: 0.45, envMapIntensity: 1.8, side: THREE.DoubleSide }),
    rail: new THREE.MeshPhysicalMaterial({
      name: "rail_glass", color: 0x9fc4c9, roughness: 0.05, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false,
    }),
    louvre: new THREE.MeshStandardMaterial({ name: "louvre", color: 0x8e9396, roughness: 0.5 }),
    greyPanel: new THREE.MeshStandardMaterial({ name: "grey_panel", color: 0x9a9da0, roughness: 0.5, metalness: 0.2 }),
    floor: new THREE.MeshStandardMaterial({ name: "floor", color: 0xd8cfc0, roughness: 0.7 }),
    wood: new THREE.MeshStandardMaterial({ name: "deck_wood", color: 0x9a7552, roughness: 0.75 }),
    soft: new THREE.MeshStandardMaterial({ name: "fabric", color: 0xe9e6e1, roughness: 0.95 }),
    softDark: new THREE.MeshStandardMaterial({ name: "fabric_dark", color: 0x7d8288, roughness: 0.95 }),
  };

  const g = new THREE.Group();
  g.name = "capsule_" + S.key;
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, name: string, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.position.set(x, y, z);
    m.castShadow = !(mat as THREE.Material).transparent;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

  // 세로 치수
  const legH = 0.32, floorT = 0.26, roofT = 0.3;
  const y0 = legH, y1 = y0 + floorT, y3 = H, y2 = y3 - roofT, wallH = y2 - y1;
  const xL = -L / 2, xR = L / 2;
  const inset = 0.12; // 끝단 유리벽이 지붕 아래로 들어간 깊이
  const zf = W / 2; // 앞면(문 쪽)

  // ── 지붕·바닥 슬래브 + 어두운 테두리 띠
  const rPlan = 0.7; // 위에서 본 끝 모서리 반지름
  add(planSlab(L, roofT, W, rPlan, 0.1), M.shell, "roof", 0, y2, 0);
  add(planSlab(L, floorT, W, rPlan, 0.11), M.shell, "floor_slab", 0, y0, 0);
  add(planSlab(L - 0.03, 0.05, W + 0.014, rPlan, 0.02), M.trim, "roof_trim", 0, y2 - 0.015, 0);
  add(planSlab(L - 0.03, 0.05, W + 0.014, rPlan, 0.02), M.trim, "floor_trim", 0, y1 - 0.035, 0);
  /** 위에서 본 모양(x, z)을 세로로 세운 기둥형 메시 */
  const vprism = (x0: number, x1: number, zHalf: number, rOuter: number, outerAtX0: boolean, yb: number, h: number, mat: THREE.Material, name: string, ring = 0) => {
    const ax = Math.min(x0, x1), bx = Math.max(x0, x1);
    const atLeft = outerAtX0 === x0 < x1;
    const rad = (d: number) => (atLeft ? [rOuter - d, 0, 0, rOuter - d] : [0, rOuter - d, rOuter - d, 0]).map((r) => Math.max(r, 0));
    const pts = (d: number): [number, number][] => [[ax + d, -zHalf + d], [bx - d, -zHalf + d], [bx - d, zHalf - d], [ax + d, zHalf - d]];
    const shape = roundedShape(pts(0), rad(0));
    if (ring > 0) shape.holes.push(new THREE.Path(roundedShape(pts(ring), rad(ring)).getPoints(12)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 14 });
    geo.rotateX(-Math.PI / 2);
    return add(geo, mat, name, 0, yb, 0);
  };

  // ── 흰 몸체: 측면에서 본 사다리꼴(아래가 넓음)을 폭 방향으로 압출
  const bl = lay.left, br = lay.right;
  const sx = (fromLeft: number) => xL + fromLeft;
  const capD = 0.62, rCap = rPlan - inset; // 막힌 끝 캡 깊이·반지름
  const solidLB = bl ? sx(bl.bottom) : xL + inset + capD - 0.02;
  const solidLT = bl ? sx(bl.top) : xL + inset + capD - 0.02;
  const solidRB = br ? xR - br.bottom : xR - inset - capD + 0.02;
  const solidRT = br ? xR - br.top : xR - inset - capD + 0.02;
  const rL = bl ? 0.6 : 0.02, rR = br ? 0.6 : 0.02;
  const solidPts = (d: number): [number, number][] => [
    [solidLB - (bl ? d : 0), y1], [solidRB + (br ? d : 0), y1], [solidRT + (br ? d : 0), y2], [solidLT - (bl ? d : 0), y2],
  ];
  const wallD = W - 0.02;
  const solidGeo = new THREE.ExtrudeGeometry(roundedShape(solidPts(0), [rL, rR, rR, rL]), { depth: wallD, bevelEnabled: false, curveSegments: 10 });
  solidGeo.translate(0, 0, -wallD / 2);
  add(solidGeo, M.shell, "body");
  if (!bl) vprism(xL + inset, xL + inset + capD, (W - 0.02) / 2, rCap, true, y1, wallH, M.shell, "end_cap_l");
  if (!br) vprism(xR - inset, xR - inset - capD, (W - 0.02) / 2, rCap, true, y1, wallH, M.shell, "end_cap_r");
  // 흰 패널의 굴곡선(유리 경계를 따라 안쪽으로 들어간 선)
  if (bl || br) {
    const ccw = solidPts(0);
    const inner = (d: number) => offsetConvex(ccw, -d);
    const gr = [bl ? 0.35 : 0.02, br ? 0.35 : 0.02, br ? 0.3 : 0.02, bl ? 0.3 : 0.02];
    const groove = roundedShape(inner(0.3), gr);
    groove.holes.push(new THREE.Path(roundedShape(inner(0.325), gr.map((r) => Math.max(r - 0.025, 0.005))).getPoints(10)));
    for (const z of [1, -1]) {
      const gg = new THREE.ExtrudeGeometry(groove, { depth: 0.004, bevelEnabled: false, curveSegments: 10 });
      add(gg, M.seam, "panel_groove", 0, 0, z > 0 ? (W - 0.02) / 2 : -(W - 0.02) / 2 - 0.004);
    }
  }
  // 유리와 맞닿는 둥근 검은 테두리(가스켓)
  if (bl || br) {
    const rimD = wallD - 0.012;
    const rimGeo = new THREE.ExtrudeGeometry(roundedShape(solidPts(0.1), [rL + 0.1, rR + 0.1, rR + 0.1, rL + 0.1]), { depth: rimD, bevelEnabled: false, curveSegments: 10 });
    rimGeo.translate(0, 0, -rimD / 2);
    add(rimGeo, M.trim, "window_rim");
  }

  // 몸체 옆면 이음선 (양쪽 면)
  for (let x = Math.ceil((Math.max(solidLB, solidLT) + 0.4) / 1.45) * 1.45; x < Math.min(solidRB, solidRT) - 0.3; x += 1.45) {
    for (const s of [1, -1]) add(box(0.02, wallH, 0.006), M.seam, "seam", x, y1 + wallH / 2, s * (wallD / 2 + 0.002));
  }

  // ── 끝단 유리 구간
  const bay = (side: "left" | "right", b: Bay) => {
    const dir = side === "left" ? 1 : -1;
    const end = side === "left" ? xL : xR;
    const deck = b.deck ?? 0;
    const glassEnd = end + dir * (deck > 0 ? deck : inset); // 끝 유리벽 x
    const xb = end + dir * b.bottom, xt = end + dir * b.top; // 몸체 경계

    // 유리 볼륨: 위에서 본 끝 모서리가 둥글게 휜 유리 (몸체가 경사 바깥쪽을 가림)
    const gd = W - 0.06;
    const rg = deck > 0 ? 0 : rPlan - inset - 0.03;
    vprism(glassEnd, xt, gd / 2, rg, true, y1, wallH, M.glass, `glass_${side}`).renderOrder = 2;
    vprism(glassEnd, xt, gd / 2 - 0.01, Math.max(rg - 0.01, 0), true, y1, 0.02, M.floor, `int_floor_${side}`);

    // 프레임: 휜 유리 양끝 기둥, 중간 멀리언
    add(box(0.06, wallH, 0.06), M.trim, `end_post_${side}`, glassEnd, y1 + wallH / 2, gd / 2 - rg);
    add(box(0.06, wallH, 0.06), M.trim, `end_post_${side}`, glassEnd, y1 + wallH / 2, -(gd / 2 - rg));
    for (const z of [1, -1]) {
      add(box(0.06, wallH, 0.06), M.trim, `post_${side}`, glassEnd + dir * rg, y1 + wallH / 2, z * (gd / 2));
      const span = Math.abs(xb - glassEnd - dir * rg);
      const n = Math.floor(span / 1.3);
      for (let i = 1; i <= n; i++) {
        const mx = glassEnd + dir * rg + (dir * span * i) / (n + 1);
        add(box(0.04, wallH, 0.04), M.trim, `mullion_${side}`, mx, y1 + wallH / 2, z * (gd / 2));
      }
    }
    // 끝면 가운데 멀리언
    add(box(0.04, wallH, 0.04), M.trim, `end_mullion_${side}`, glassEnd, y1 + wallH / 2, 0);

    // 가구 (유리 너머로 보이는 실내감)
    const depth = Math.abs(xt - glassEnd);
    if (depth > 1.6) {
      const cx = glassEnd + dir * Math.min(1.1, depth / 2);
      if (side === "right") {
        add(box(2.0, 0.42, 1.6), M.soft, "bed", cx, y1 + 0.21, -0.35);
        add(box(1.2, 0.08, 1.62), M.softDark, "bed_throw", cx - dir * 0.3, y1 + 0.46, -0.35);
      } else {
        add(box(0.85, 0.42, 2.0), M.softDark, "sofa", cx, y1 + 0.21, -0.55);
        add(box(0.25, 0.5, 2.0), M.softDark, "sofa_back", cx - dir * 0.35, y1 + 0.55, -0.55);
      }
    }

    // 데크(테라스): 나무 바닥 + 유리 난간 + 모서리 기둥
    if (deck > 0) {
      const dx0 = end + dir * 0.06, rd = rPlan - 0.08;
      vprism(dx0, glassEnd, W / 2 - 0.06, rd, true, y1, 0.03, M.wood, `deck_${side}`);
      const railH = 1.05, rz = W / 2 - 0.1;
      vprism(dx0 + dir * 0.04, glassEnd, rz, rd - 0.05, true, y1, railH, M.rail, `rail_${side}`, 0.02).renderOrder = 3;
      vprism(dx0 + dir * 0.03, glassEnd, rz + 0.01, rd - 0.04, true, y1 + railH, 0.04, M.trim, `rail_cap_${side}`, 0.045);
      for (const z of [1, -1]) {
        add(box(0.07, wallH, 0.07), M.trim, `deck_post_${side}`, dx0 + dir * (rd - 0.05), y1 + wallH / 2, z * rz);
      }
    }
  };
  if (bl) bay("left", bl);
  if (br) bay("right", br);

  // ── 막힌 끝단 디테일: 둥근 캡을 감싸는 검은 유리(B5) / 회색 패널(K9)
  if (!bl && lay.roundEndWindow) {
    vprism(xL + inset - 0.012, xL + inset + capD - 0.08, (W - 0.02) / 2 + 0.012, rCap + 0.012, true, y1 + 0.18, wallH - 0.36, M.darkGlass, "end_window", 0.03);
  }
  if (!bl && lay.endPanel) {
    vprism(xL + inset - 0.012, xL + inset + capD - 0.05, (W - 0.02) / 2 + 0.012, rCap + 0.012, true, y1 + 0.25, wallH - 0.5, M.greyPanel, "end_panel", 0.03);
  }

  // ── K9 옆면 큰 창 (왼쪽 위·아래 모서리를 깎은 모양)
  if (lay.sideWindow) {
    const a = xL + lay.sideWindow.from, b = xL + lay.sideWindow.to;
    const yb = y1 + 0.35, yt = y2 - 0.28, c = 0.55;
    const pts: [number, number][] = [[a + c, yb], [b, yb], [b, yt], [a + c, yt], [a, yt - c], [a, yb + c]];
    const shapeOf = (p: [number, number][]) => {
      const s = new THREE.Shape();
      s.moveTo(p[0][0], p[0][1]);
      p.slice(1).forEach(([x, y]) => s.lineTo(x, y));
      s.closePath();
      return s;
    };
    const outer = offsetConvex(pts, 0.07);
    const frame = shapeOf(outer);
    frame.holes.push(new THREE.Path(pts.map(([x, y]) => new THREE.Vector2(x, y))));
    for (const z of [1, -1]) {
      const fg = new THREE.ExtrudeGeometry(frame, { depth: 0.03, bevelEnabled: false });
      const gg = new THREE.ShapeGeometry(shapeOf(pts));
      const zz = z * (wallD / 2);
      add(fg, M.trim, "side_window_frame", 0, 0, z > 0 ? zz : zz - 0.03);
      add(gg, M.darkGlass, "side_window", 0, 0, zz + z * 0.008);
      for (const f of [0.38, 0.68]) add(box(0.05, yt - yb, 0.03), M.trim, "side_window_mullion", a + (b - a) * f, (yb + yt) / 2, zz + z * 0.012);
    }
  }

  // ── 문 + 로고 + 루버 (앞면)
  const doorX = xL + lay.door, doorW = 0.95, doorH = Math.min(2.05, wallH - 0.15);
  add(box(doorW + 0.05, doorH + 0.05, 0.012), M.seam, "door_gap", doorX, y1 + doorH / 2 + 0.05, zf - 0.004);
  add(box(doorW, doorH, 0.03), M.panel, "door", doorX, y1 + doorH / 2 + 0.05, zf);
  add(box(0.03, 0.2, 0.04), M.trim, "door_handle", doorX - doorW / 2 + 0.14, y1 + 1.05, zf + 0.03);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.42), logoMaterial(S.code));
  logo.name = "logo";
  logo.position.set(doorX + 0.04, y1 + doorH - 0.38, zf + 0.017);
  g.add(logo);
  const wedge = new THREE.Shape();
  wedge.moveTo(-0.3, 0);
  wedge.lineTo(0.3, 0.02);
  wedge.lineTo(0.3, 0.05);
  wedge.lineTo(-0.3, 0.13);
  wedge.closePath();
  const louvreGeo = new THREE.ExtrudeGeometry(wedge, { depth: 0.03, bevelEnabled: false });
  for (const lx of lay.louvres ?? []) {
    const x = xL + lx;
    for (const z of [1, -1]) {
      for (let i = 0; i < 6; i++) {
        // 한쪽이 두껍고 끝으로 갈수록 얇아지는 쐐기형 루버
        const lv = add(louvreGeo, M.louvre, "louvre", x, y1 + 0.4 + i * 0.3, z > 0 ? wallD / 2 : -wallD / 2 - 0.03);
        if (x > doorX) lv.scale.x = -1;
      }
    }
  }

  // ── 출입 계단
  const steps = 3, stepRise = (y1 - 0.02) / (steps + 1);
  for (let i = 0; i < steps; i++) {
    const yTop = y1 - stepRise * (i + 1);
    add(box(1.0, 0.05, 0.3), M.panel, "step", doorX, yTop, zf + 0.2 + i * 0.3);
  }
  for (const sxo of [-0.5, 0.5]) {
    const len = Math.hypot(steps * 0.3, y1);
    const st = add(box(0.04, len, 0.06), M.panel, "stair_stringer", doorX + sxo, y1 / 2, zf + 0.2 + (steps * 0.3) / 2);
    st.rotation.x = -Math.atan2(steps * 0.3, y1);
  }

  // ── 받침 다리
  const legXs = [xL + 0.9, (xL + xR) / 2, xR - 0.9];
  for (const x of legXs) {
    for (const z of [1, -1]) {
      add(new THREE.CylinderGeometry(0.07, 0.07, legH, 16), M.trim, "leg", x, legH / 2, z * (W / 2 - 0.7));
      add(box(0.3, 0.03, 0.3), M.seam, "leg_pad", x, 0.015, z * (W / 2 - 0.7));
    }
  }

  // ── 천창 (K9)
  if (lay.skylight) add(new RoundedBoxGeometry(2.2, 0.04, 1.3, 2, 0.015), M.darkGlass, "skylight", 0.6, y3 + 0.005, 0);

  return g;
}

/** 측면에서 본 모서리 둥근 슬래브를 폭 방향으로 압출. 모서리도 폭 방향으로 둥글게(bevel). y 기준 = 아래면 */
function slab(L: number, T: number, W: number, rTop: number, rBot: number) {
  const b = 0.06;
  const w = L - 2 * b, h = T - 2 * b;
  const geo = new THREE.ExtrudeGeometry(
    roundedShape([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], [rBot, rBot, rTop, rTop]),
    { depth: W - 2 * b, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 4, curveSegments: 12 },
  );
  geo.translate(0, b, -(W - 2 * b) / 2);
  return geo;
}

/** 위에서 본 모양이 끝 둥근 사각형인 판. 모서리는 bevel로 둥글게. y 기준 = 아래면 */
function planSlab(L: number, T: number, W: number, r: number, b: number) {
  const w = L - 2 * b, d = W - 2 * b, rr = Math.max(r - b, 0.01);
  const shape = roundedShape([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]], [rr, rr, rr, rr]);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(T - 2 * b, 0.001), bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 5, curveSegments: 16 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, b, 0);
  return geo;
}

/** 꼭짓점마다 반지름을 준 둥근 다각형 */
function roundedShape(pts: [number, number][], radii: number[]) {
  const n = pts.length;
  const s = new THREE.Shape();
  const at = (i: number) => pts[(i + n) % n];
  for (let i = 0; i < n; i++) {
    const [px, py] = at(i - 1), [cx, cy] = at(i), [nx, ny] = at(i + 1);
    const l1 = Math.hypot(px - cx, py - cy), l2 = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radii[i] ?? 0, l1 / 2, l2 / 2);
    const ax = cx + ((px - cx) / l1) * r, ay = cy + ((py - cy) / l1) * r;
    const bx = cx + ((nx - cx) / l2) * r, by = cy + ((ny - cy) / l2) * r;
    if (i === 0) s.moveTo(ax, ay);
    else s.lineTo(ax, ay);
    s.quadraticCurveTo(cx, cy, bx, by);
  }
  s.closePath();
  return s;
}

/** 볼록 다각형을 바깥으로 d만큼 넓힘 (반시계 순서 가정) */
function offsetConvex(pts: [number, number][], d: number): [number, number][] {
  const n = pts.length;
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
    const nx = dy / len, ny = -dx / len; // 오른쪽 법선 = 반시계 다각형의 바깥
    return { p: [p[0] + nx * d, p[1] + ny * d], dir: [dx, dy] };
  });
  return lines.map((l, i) => {
    const m = lines[(i + n - 1) % n];
    // m.p + t*m.dir = l.p + s*l.dir
    const det = m.dir[0] * -l.dir[1] - m.dir[1] * -l.dir[0];
    const t = ((l.p[0] - m.p[0]) * -l.dir[1] - (l.p[1] - m.p[1]) * -l.dir[0]) / det;
    return [m.p[0] + m.dir[0] * t, m.p[1] + m.dir[1] * t] as [number, number];
  });
}

/** 문 위 모델 로고: 영문은 검정, 숫자는 빨강 */
function logoMaterial(code: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.font = "800 190px 'Pretendard Variable', Pretendard, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  const letters = code.replace(/\d+$/, ""), digits = code.slice(letters.length);
  const wl = ctx.measureText(letters).width, wd = ctx.measureText(digits).width;
  let x = (512 - wl - wd) / 2;
  ctx.fillStyle = "#26282b";
  ctx.fillText(letters, x, 135);
  x += wl;
  ctx.fillStyle = "#e0452b";
  ctx.fillText(digits, x, 135);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ name: "logo", map: tex, transparent: true, toneMapped: false });
}
