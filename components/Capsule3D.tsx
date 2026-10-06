"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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
    renderer.domElement.style.display = "block";
    renderer.domElement.style.outline = "none";
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });

    // 스튜디오 조명 + 바닥 그림자
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
    fill.position.set(-5, 3, -4);
    scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const object = buildCapsule(
      { L: +model.l, W: +model.w, H: +model.h, skylight: model.skylight, deck: model.deck },
      "capsule_" + model.key,
    );
    objectRef.current = object;

    // 바닥에 올리고 카메라를 바운딩에 맞춤
    const box = new THREE.Box3().setFromObject(object);
    ground.position.y = box.min.y;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const dist = (sphere.radius / Math.tan((camera.fov * Math.PI) / 360)) * 1.35;
    camera.position.copy(sphere.center).add(new THREE.Vector3(1, 0.55, 1.25).normalize().multiplyScalar(dist));
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
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
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
            Drag to orbit · scroll to zoom · right-drag to pan
          </div>
          <div className="absolute right-4 bottom-4 flex gap-2" style={{ fontFamily: sysFont }}>
            <button type="button" className={btn} style={{ fontFamily: "inherit" }} disabled={!ready} onClick={exportObj}>
              Download OBJ + MTL
            </button>
            <button type="button" className={btn} style={{ fontFamily: "inherit" }} disabled={!ready} onClick={exportGlb}>
              Download GLB
            </button>
          </div>
        </>
      )}
    </div>
  );
}
