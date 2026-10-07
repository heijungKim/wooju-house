"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Model } from "@/content/models";
import { buildCapsule } from "./capsule-geometry";

const BG = "#e7e6e1";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** 캡슐 3D 뷰어: 자동 회전, 드래그 회전, 휠 줌, 우클릭 이동, OBJ/GLB 다운로드 */
export default function Capsule3D({ model }: { model: Model }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<THREE.Object3D | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const basename = `wooju-${model.key}`;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      setError("3D를 표시할 수 없습니다 (WebGL 미지원).\n" + String((e as Error)?.message ?? e));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.outline = "none";
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    // 반사용 환경맵 (흰 외장의 광택·유리 반사)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.7;
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 500);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });
    controls.maxPolarAngle = Math.PI * 0.49; // 바닥 아래로는 못 내려가게

    // 스튜디오 조명 + 바닥 그림자
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 0.6));
    const key = new THREE.DirectionalLight(0xfffaf2, 2.4);
    key.position.set(5, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
    fill.position.set(-5, 3, -4);
    scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.22 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const object = buildCapsule({ key: model.key, code: model.code, L: +model.l, W: +model.w, H: +model.h });
    objectRef.current = object;

    // 바닥에 올리고 카메라를 바운딩에 맞춤
    const box = new THREE.Box3().setFromObject(object);
    ground.position.y = box.min.y;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    // 제품 사진처럼 문 쪽 측면을 약간 비스듬히 내려다보는 각도
    const dist = (sphere.radius / Math.tan((camera.fov * Math.PI) / 360)) * 0.8;
    camera.position.copy(sphere.center).add(new THREE.Vector3(0.5, 0.24, 1).normalize().multiplyScalar(dist));
    controls.minDistance = dist * 0.45;
    controls.maxDistance = dist * 1.8;
    camera.near = Math.max(dist / 100, 0.01);
    camera.far = dist * 100;
    camera.updateProjectionMatrix();
    controls.target.copy(sphere.center);
    controls.update();
    const span = sphere.radius * 3;
    Object.assign(key.shadow.camera, { left: -span, right: span, top: span, bottom: -span });
    key.shadow.camera.updateProjectionMatrix();
    scene.add(object);

    const fit = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });
    setReady(true);

    return () => {
      setReady(false);
      objectRef.current = null;
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      envTex.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            (m as THREE.MeshBasicMaterial).map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [model]);

  const exportObj = async () => {
    const object = objectRef.current;
    if (!object) return;
    const { OBJExporter } = await import("three/addons/exporters/OBJExporter.js");
    const mats = new Set<THREE.MeshStandardMaterial>();
    object.traverse((o) => {
      if (o instanceof THREE.Mesh) mats.add(o.material as THREE.MeshStandardMaterial);
    });
    const obj = `mtllib ${basename}.mtl\n` + new OBJExporter().parse(object);
    let mtl = "# Exported by 우주하우스 3D viewer\n";
    for (const m of mats) {
      const c = m.color;
      mtl += `newmtl ${m.name}\n`;
      mtl += `Kd ${c.r.toFixed(4)} ${c.g.toFixed(4)} ${c.b.toFixed(4)}\n`;
      mtl += "Ks 0.2000 0.2000 0.2000\n";
      mtl += `Ns ${Math.round((1 - m.roughness) * 200)}\n`;
      mtl += `d ${m.opacity.toFixed(4)}\n\n`;
    }
    download(new Blob([obj], { type: "text/plain" }), basename + ".obj");
    download(new Blob([mtl], { type: "text/plain" }), basename + ".mtl");
  };

  const exportGlb = async () => {
    const object = objectRef.current;
    if (!object) return;
    const { GLTFExporter } = await import("three/addons/exporters/GLTFExporter.js");
    const buf = (await new GLTFExporter().parseAsync(object, { binary: true })) as ArrayBuffer;
    download(new Blob([buf], { type: "model/gltf-binary" }), basename + ".glb");
  };

  const sysFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const btn =
    "cursor-default rounded-lg border border-[rgba(20,20,19,.18)] bg-[rgba(255,255,255,.92)] px-3 py-[9px] text-[12.5px] leading-none font-medium text-[#1a1915] hover:bg-white active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden" style={{ background: BG }} aria-label={`${model.code} 3D`}>
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[14px] leading-[1.6] font-medium whitespace-pre-line text-[#8a2f20]" style={{ fontFamily: sysFont }}>
          {error}
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute bottom-4 left-4 max-w-[60%] text-[12px] leading-normal text-[rgba(26,25,21,.55)] select-none" style={{ fontFamily: sysFont }}>
            드래그: 회전 · 휠: 확대/축소 · 우클릭 드래그: 이동
          </div>
          <div className="absolute right-4 bottom-4 flex gap-2" style={{ fontFamily: sysFont }}>
            <button type="button" className={btn} style={{ fontFamily: "inherit" }} disabled={!ready} onClick={exportObj}>
              OBJ 다운로드
            </button>
            <button type="button" className={btn} style={{ fontFamily: "inherit" }} disabled={!ready} onClick={exportGlb}>
              GLB 다운로드
            </button>
          </div>
        </>
      )}
    </div>
  );
}
