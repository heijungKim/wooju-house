import * as THREE from "three";

export type CapsuleSpec = { L: number; W: number; H: number; skylight?: boolean; deck?: boolean };

/**
 * 치수 기반 단순화 캡슐 모델 (단위 m, y-up, 원점 중심).
 * 실제 CAD/GLB가 생기면 GLTFLoader로 교체.
 */
export function buildCapsule(S: CapsuleSpec, name: string) {
  const M = {
    shell: new THREE.MeshStandardMaterial({ name: "aluminium_shell", color: 0xeceeed, roughness: 0.32, metalness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ name: "lowe_glass", color: 0x22303a, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.62, side: THREE.DoubleSide }),
    frame: new THREE.MeshStandardMaterial({ name: "steel_frame", color: 0x2a2c2f, roughness: 0.55, metalness: 0.3 }),
    floor: new THREE.MeshStandardMaterial({ name: "floor", color: 0xcfc6b6, roughness: 0.8 }),
    wood: new THREE.MeshStandardMaterial({ name: "deck_wood", color: 0x8f6f4c, roughness: 0.75 }),
  };
  const g = new THREE.Group();
  g.name = name;
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, meshName: string, x = 0, y = 0, z = 0, shadow = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = meshName;
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  const legH = 0.45, hb = S.H - legH, W = S.W, t = 0.09, rt = 0.95, rb = 0.4;
  const deckL = S.deck ? 1.6 : 0;
  const bodyL = S.L - deckL;
  const x0 = -S.L / 2, xb = x0 + bodyL; // 본체 x0..xb

  function rr(w: number, h: number, rtop: number, rbot: number, ox = 0, oy = 0) {
    const s = new THREE.Shape(), l = ox - w / 2, r = ox + w / 2, b = oy, tp = oy + h;
    s.moveTo(l + rbot, b); s.lineTo(r - rbot, b); s.quadraticCurveTo(r, b, r, b + rbot);
    s.lineTo(r, tp - rtop); s.quadraticCurveTo(r, tp, r - rtop, tp);
    s.lineTo(l + rtop, tp); s.quadraticCurveTo(l, tp, l, tp - rtop);
    s.lineTo(l, b + rbot); s.quadraticCurveTo(l, b, l + rbot, b);
    return s;
  }
  const outer = rr(W, hb, rt, rb), inner = rr(W - 2 * t, hb - 2 * t, rt - t, rb - t * 0.6, 0, t);
  const ring = outer.clone();
  ring.holes.push(new THREE.Path(inner.getPoints(48)));

  // 외피 (X축 방향 압출)
  const shell = add(new THREE.ExtrudeGeometry(ring, { depth: bodyL, bevelEnabled: false, curveSegments: 32 }), M.shell, "shell");
  shell.rotation.y = Math.PI / 2;
  shell.position.set(x0, legH, 0);
  // 양 끝 테두리 + 유리
  const rimGeo = new THREE.ExtrudeGeometry(ring, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 32 });
  [x0, xb - 0.12].forEach((x, i) => {
    const r = add(rimGeo, M.shell, "end_rim_" + i);
    r.rotation.y = Math.PI / 2;
    r.position.set(x, legH, 0);
  });
  const glassGeo = new THREE.ShapeGeometry(inner, 32);
  [x0 + 0.35, xb - 0.35].forEach((x, i) => {
    const gl = add(glassGeo, M.glass, "end_glass_" + i, 0, 0, 0, false);
    gl.rotation.y = Math.PI / 2;
    gl.position.set(x, legH, 0);
  });
  // 바닥
  add(new THREE.BoxGeometry(bodyL - 0.2, 0.06, W - 2 * t - 0.1), M.floor, "floor", (x0 + xb) / 2, legH + t + 0.03, 0);
  // 측면 파노라마 창
  const flatB = legH + rb + 0.05, flatT = legH + hb - rt - 0.02, wh = flatT - flatB;
  const winL = Math.min(3.2, bodyL * 0.32);
  add(new THREE.BoxGeometry(winL, wh, 0.02), M.glass, "side_window_front", xb - 0.5 - winL / 2, flatB + wh / 2, W / 2 + 0.006, false);
  add(new THREE.BoxGeometry(winL * 0.8, wh, 0.02), M.glass, "side_window_back", x0 + 0.5 + winL * 0.4, flatB + wh / 2, -W / 2 - 0.006, false);
  // 출입문
  const doorX = x0 + bodyL * 0.42;
  const doorH = Math.min(2.1, wh + 0.3);
  add(new THREE.BoxGeometry(0.95, doorH, 0.025), M.frame, "door", doorX, flatB - 0.05 + doorH / 2, W / 2 + 0.008);
  // 이음선
  for (let i = 1; i < 6; i++) {
    const x = x0 + (bodyL * i) / 6;
    if (Math.abs(x - doorX) < 0.7) continue;
    add(new THREE.BoxGeometry(0.012, wh * 0.9, 0.006), M.frame, "seam_" + i, x, flatB + wh / 2, W / 2 + 0.004);
  }
  // 천창 (K9)
  if (S.skylight) add(new THREE.BoxGeometry(bodyL * 0.4, 0.02, W - 2 * rt + 0.4), M.glass, "skylight", (x0 + xb) / 2, legH + hb + 0.006, 0, false);
  // 하부 철골 + 기둥
  add(new THREE.BoxGeometry(bodyL - 0.6, 0.18, W - 0.9), M.frame, "base_frame", (x0 + xb) / 2, legH - 0.09, 0);
  [x0 + 0.6, (x0 + xb) / 2, xb - 0.6].forEach((x, i) =>
    [-1, 1].forEach((s) =>
      add(new THREE.BoxGeometry(0.2, legH - 0.18, 0.2), M.frame, `leg_${i}_${s > 0 ? "f" : "b"}`, x, (legH - 0.18) / 2, s * (W / 2 - 0.6)),
    ),
  );
  // 출입 계단
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(1.0, 0.04, 0.28), M.shell, "step_" + i, doorX, legH - 0.12 - i * 0.13, W / 2 + 0.18 + i * 0.28);
  // 발코니 (B5/B7)
  if (S.deck) {
    const dx = xb + deckL / 2;
    add(new THREE.BoxGeometry(deckL, 0.1, W - 0.1), M.wood, "deck", dx, legH + 0.05, 0);
    add(new THREE.BoxGeometry(deckL, 0.18, W - 0.9), M.frame, "deck_frame", dx, legH - 0.09, 0);
    [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.2, legH - 0.18, 0.2), M.frame, "deck_leg_" + s, S.L / 2 - 0.3, (legH - 0.18) / 2, s * (W / 2 - 0.6)));
    const railH = 1.05;
    add(new THREE.BoxGeometry(0.02, railH, W - 0.2), M.glass, "rail_end", S.L / 2 - 0.06, legH + 0.1 + railH / 2, 0, false);
    [-1, 1].forEach((s) => add(new THREE.BoxGeometry(deckL - 0.1, railH, 0.02), M.glass, "rail_side_" + s, dx, legH + 0.1 + railH / 2, s * (W / 2 - 0.08), false));
    add(new THREE.BoxGeometry(deckL * 0.7, 0.08, W - 0.6), M.shell, "canopy", xb + deckL * 0.35, legH + hb - 0.06, 0);
  }
  return g;
}
