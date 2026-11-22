import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import HouseModel, { PART_ANCHORS } from './HouseModel';
import { getState, setState, subscribe, useSite } from '../lib/store';
import type { StepEffect } from '../data/services';

const HOME_CAM = new THREE.Vector3(13, 11, 25);
const HOME_LOOK = new THREE.Vector3(-1.5, 1.2, 2);

/** Eases the camera toward the selected part, or back home. */
function CameraRig({ controls }: { controls: React.RefObject<OrbitControlsImpl> }) {
  const { camera } = useThree();
  const goal = useRef({ pos: HOME_CAM.clone(), look: HOME_LOOK.clone(), active: true });

  useEffect(() => {
    let last = { sel: getState().selected, reset: getState().resetTick };
    const update = () => {
      const s = getState();
      if (s.selected === last.sel && s.resetTick === last.reset) return;
      last = { sel: s.selected, reset: s.resetTick };
      if (s.selected) {
        const a = PART_ANCHORS[s.selected];
        goal.current = { pos: new THREE.Vector3(...a.cam), look: new THREE.Vector3(...a.look), active: true };
      } else {
        goal.current = { pos: HOME_CAM.clone(), look: HOME_LOOK.clone(), active: true };
      }
    };
    return subscribe(update);
  }, []);

  // Stop steering as soon as the visitor orbits by hand.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => (goal.current.active = false);
    c.addEventListener('start', stop);
    return () => c.removeEventListener('start', stop);
  }, [controls]);

  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g.active || !c) return;
    const k = 1 - Math.exp(-2.4 * dt);
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.look, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.02 && c.target.distanceTo(g.look) < 0.02) g.active = false;
  });
  return null;
}

/** Simple particle spray: water, foam or sand, aimed at the selected part. */
const COUNT = 260;
const EFFECT_STYLE: Partial<Record<StepEffect, { color: string; size: number; speed: number }>> = {
  rinse: { color: '#cfe6ff', size: 0.09, speed: 9 },
  clean: { color: '#e8f3ff', size: 0.08, speed: 12 },
  foam: { color: '#ffffff', size: 0.22, speed: 4 },
  sand: { color: '#d8c39c', size: 0.07, speed: 3 },
  done: { color: '#9fd0ff', size: 0.12, speed: 1.2 },
};

function Spray() {
  const effect = useSite((s) => s.effect);
  const selected = useSite((s) => s.selected);
  const style = effect ? EFFECT_STYLE[effect] : undefined;
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const s = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      s[i * 3] = Math.random();
      s[i * 3 + 1] = Math.random() - 0.5;
      s[i * 3 + 2] = Math.random() - 0.5;
    }
    return { positions: p, seeds: s };
  }, []);

  useFrame(({ clock }) => {
    const pts = ref.current;
    if (!pts || !style || !selected) return;
    const a = PART_ANCHORS[selected];
    const target = new THREE.Vector3(...a.look);
    const nozzle = new THREE.Vector3(...a.cam).lerp(target, 0.62);
    nozzle.y = Math.max(nozzle.y - 1.2, 0.8);
    const dir = target.clone().sub(nozzle);
    const t = clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const life = (seeds[i * 3] + t * (style.speed / 10)) % 1;
      const spread = effect === 'done' ? 2.4 : 0.9 * life;
      const p = nozzle.clone().addScaledVector(dir, effect === 'done' ? 1 : life);
      p.x += seeds[i * 3 + 1] * spread;
      p.z += seeds[i * 3 + 2] * spread;
      p.y += effect === 'done' ? life * 2.5 : seeds[i * 3 + 1] * spread * 0.5;
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  if (!style || !selected || effect === 'inspect' || effect === 'dwell') return null;
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={style.color} size={style.size} transparent opacity={0.85} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/** Uses public/models/house.glb if it exists, otherwise the built-in house. */
function useGlbUrl() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = '/models/house.glb';
    fetch(u, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        if (r.ok && !type.includes('text/html')) setUrl(u);
      })
      .catch(() => {});
  }, []);
  return url;
}

export default function HouseScene() {
  const controls = useRef<OrbitControlsImpl>(null);
  const glbUrl = useGlbUrl();
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: HOME_CAM.toArray(), fov: 38, near: 0.5, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => setState({ hovered: null })}
      aria-hidden="true"
    >
      <color attach="background" args={['#cfe2f3']} />
      <fog attach="fog" args={['#cfe2f3', 38, 70]} />
      <hemisphereLight args={['#eaf4ff', '#5d7a45', 0.9]} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <Suspense fallback={null}>
        <HouseModel glbUrl={glbUrl} />
      </Suspense>
      <ContactShadows position={[0, 0.005, 0]} opacity={0.35} scale={30} blur={2.5} far={8} />
      {!reduce && <Spray />}
      <OrbitControls
        ref={controls}
        makeDefault
        target={HOME_LOOK.toArray()}
        enablePan={false}
        enableZoom
        minDistance={11}
        maxDistance={34}
        minPolarAngle={0.35}
        maxPolarAngle={1.28}
        minAzimuthAngle={-1.1}
        maxAzimuthAngle={1.1}
        enableDamping
      />
      <CameraRig controls={controls} />
    </Canvas>
  );
}
