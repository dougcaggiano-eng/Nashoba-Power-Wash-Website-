import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { PartId } from '../data/services';
import { serviceByPart } from '../data/services';
import { choosePart, getState, setState, useSite } from '../lib/store';

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */
const BRAND = new THREE.Color('#2077fc');
const MOLD = new THREE.Color('#4d5a33'); // greenish grime tint

/** Where each part's label floats and where the camera looks when it's selected. */
export const PART_ANCHORS: Record<PartId, { label: [number, number, number]; cam: [number, number, number]; look: [number, number, number] }> = {
  siding: { label: [1.5, 5.6, 3.1], cam: [9, 7, 20], look: [0.5, 2.8, 0] },
  patio: { label: [-5.8, 0.9, 4.2], cam: [-3, 6.5, 13], look: [-5.8, 0, 4] },
  deck: { label: [-5.6, 2.4, -0.4], cam: [-12, 6, 7], look: [-5.6, 0.8, -0.4] },
  fence: { label: [-10, 2.2, 1.5], cam: [-3, 5, 12], look: [-10, 0.8, 0] },
  walkway: { label: [0, 1.6, 6.5], cam: [4.5, 4.5, 14], look: [0, 0.4, 6] },
  driveway: { label: [6.5, 1, 7], cam: [12, 6, 15], look: [6.5, 0, 6.5] },
};

/* ------------------------------------------------------------------ */
/*  Procedural textures (no downloads)                                 */
/* ------------------------------------------------------------------ */
function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat: [number, number]) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function useTextures() {
  return useMemo(() => {
    const siding = canvasTexture(
      64,
      64,
      (ctx) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 64, 64);
        const g = ctx.createLinearGradient(0, 0, 0, 16);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.8, '#e8ecf0');
        g.addColorStop(1, '#b9c1c9');
        for (let y = 0; y < 64; y += 16) {
          ctx.fillStyle = g;
          ctx.save();
          ctx.translate(0, y);
          ctx.fillRect(0, 0, 64, 16);
          ctx.restore();
        }
      },
      [3, 6],
    );
    const pavers = canvasTexture(
      128,
      128,
      (ctx) => {
        ctx.fillStyle = '#d8cfc2';
        ctx.fillRect(0, 0, 128, 128);
        const tones = ['#c9bba7', '#d6c9b6', '#bfae98', '#cfc3b0'];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const off = r % 2 ? 16 : 0;
            ctx.fillStyle = tones[(r * 3 + c) % tones.length];
            ctx.fillRect(c * 32 + off + 2, r * 32 + 2, 28, 28);
            if (off && c === 3) ctx.fillRect(2 - 16 + 16, r * 32 + 2, 14, 28);
          }
        }
      },
      [3, 3],
    );
    const boards = canvasTexture(
      64,
      64,
      (ctx) => {
        ctx.fillStyle = '#9c8a76';
        ctx.fillRect(0, 0, 64, 64);
        for (let x = 0; x < 64; x += 16) {
          ctx.fillStyle = x % 32 ? '#a89580' : '#958370';
          ctx.fillRect(x + 1, 0, 14, 64);
        }
      },
      [4, 1],
    );
    const shingles = canvasTexture(
      64,
      64,
      (ctx) => {
        ctx.fillStyle = '#3b3f45';
        ctx.fillRect(0, 0, 64, 64);
        for (let y = 0; y < 64; y += 8) {
          for (let x = (y / 8) % 2 ? -8 : 0; x < 64; x += 16) {
            ctx.fillStyle = Math.random() > 0.5 ? '#43484f' : '#33373c';
            ctx.fillRect(x + 1, y + 1, 14, 6);
          }
        }
      },
      [6, 4],
    );
    const lawn = canvasTexture(
      64,
      64,
      (ctx) => {
        ctx.fillStyle = '#5d8a3d';
        ctx.fillRect(0, 0, 64, 64);
        for (let i = 0; i < 400; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#6a9846' : '#527c35';
          ctx.fillRect(Math.random() * 64, Math.random() * 64, 2, 2);
        }
      },
      [20, 20],
    );
    return { siding, pavers, boards, shingles, lawn };
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Part material: lerps from grimy to clean, glows on hover           */
/* ------------------------------------------------------------------ */
function usePartMaterial(part: PartId, cleanHex: string, map?: THREE.Texture, roughness = 0.75) {
  const shown = useRef(0);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: cleanHex, map: map ?? null, roughness, metalness: 0 }),
    [cleanHex, map, roughness],
  );
  const clean = useMemo(() => new THREE.Color(cleanHex), [cleanHex]);
  const dirty = useMemo(() => clean.clone().lerp(MOLD, 0.62).multiplyScalar(0.72), [clean]);

  useFrame((state, dt) => {
    const s = getState();
    const target = s.clean[part];
    shown.current = THREE.MathUtils.damp(shown.current, target, 3.2, dt);
    mat.color.copy(dirty).lerp(clean, shown.current);
    const hovered = s.hovered === part;
    const selected = s.selected === part;
    const pulse = selected ? 0.04 + Math.sin(state.clock.elapsedTime * 3) * 0.03 : 0;
    mat.emissive.copy(BRAND);
    mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, hovered ? 0.35 : pulse, 10, dt);
  });
  return mat;
}

/* ------------------------------------------------------------------ */
/*  Interactive wrapper                                                */
/* ------------------------------------------------------------------ */
function Part({ id, children }: { id: PartId; children: ReactNode }) {
  const hovered = useSite((s) => s.hovered === id);
  const selected = useSite((s) => s.selected === id);
  const anchor = PART_ANCHORS[id];

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setState({ hovered: id });
    document.body.style.cursor = 'pointer';
  };
  const out = () => {
    if (getState().hovered === id) setState({ hovered: null });
    document.body.style.cursor = '';
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    choosePart(id);
  };

  return (
    <group onPointerOver={over} onPointerOut={out} onClick={click} name={id}>
      {children}
      {(hovered || selected) && (
        <Html position={anchor.label} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="part-label">{serviceByPart[id].name}</div>
        </Html>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Static (non-clickable) bits                                        */
/* ------------------------------------------------------------------ */
const trimMat = new THREE.MeshStandardMaterial({ color: '#f7f7f4', roughness: 0.6 });
const glassMat = new THREE.MeshStandardMaterial({ color: '#2a3d55', roughness: 0.15, metalness: 0.3 });
const doorMat = new THREE.MeshStandardMaterial({ color: '#1d2f4f', roughness: 0.5 });
const brickMat = new THREE.MeshStandardMaterial({ color: '#8a4b3a', roughness: 0.9 });
const leafMat = new THREE.MeshStandardMaterial({ color: '#3f6b2c', roughness: 0.9, flatShading: true });
const leafMat2 = new THREE.MeshStandardMaterial({ color: '#4f7f35', roughness: 0.9, flatShading: true });
const trunkMat = new THREE.MeshStandardMaterial({ color: '#5a4030', roughness: 1 });

function Window({ position, w = 1.1, h = 1.5 }: { position: [number, number, number]; w?: number; h?: number }) {
  return (
    <group position={position}>
      <mesh material={trimMat}>
        <boxGeometry args={[w + 0.24, h + 0.24, 0.08]} />
      </mesh>
      <mesh material={glassMat} position={[0, 0, 0.05]}>
        <boxGeometry args={[w, h, 0.04]} />
      </mesh>
      <mesh material={trimMat} position={[0, 0, 0.08]}>
        <boxGeometry args={[0.06, h, 0.03]} />
      </mesh>
      <mesh material={trimMat} position={[0, 0, 0.08]}>
        <boxGeometry args={[w, 0.06, 0.03]} />
      </mesh>
      {/* shutters */}
      <mesh material={doorMat} position={[-w / 2 - 0.3, 0, 0.02]}>
        <boxGeometry args={[0.34, h + 0.1, 0.05]} />
      </mesh>
      <mesh material={doorMat} position={[w / 2 + 0.3, 0, 0.02]}>
        <boxGeometry args={[0.34, h + 0.1, 0.05]} />
      </mesh>
    </group>
  );
}

function Tree({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh material={trunkMat} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 2, 6]} />
      </mesh>
      <mesh material={leafMat} position={[0, 2.8, 0]}>
        <icosahedronGeometry args={[1.5, 0]} />
      </mesh>
      <mesh material={leafMat2} position={[0.5, 3.6, 0.2]}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}

function Shrub({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <mesh material={leafMat2} position={position} scale={[s, s * 0.7, s]}>
      <icosahedronGeometry args={[0.55, 0]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  The procedural house                                               */
/* ------------------------------------------------------------------ */
function ProceduralHouse() {
  const tex = useTextures();
  const siding = usePartMaterial('siding', '#f4f6f8', tex.siding, 0.7);
  const patio = usePartMaterial('patio', '#ffffff', tex.pavers, 0.95);
  const deck = usePartMaterial('deck', '#ffffff', tex.boards, 0.85);
  const deckRail = usePartMaterial('deck', '#efeae2', undefined, 0.7);
  const fence = usePartMaterial('fence', '#d9b991', undefined, 0.9);
  const walk = usePartMaterial('walkway', '#c8c2b8', undefined, 0.95);
  const drive = usePartMaterial('driveway', '#8e9196', undefined, 0.95);

  const roofGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-4.5, 0);
    shape.lineTo(4.5, 0);
    shape.lineTo(0, 2.8);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 6.8, bevelEnabled: false });
    g.translate(0, 0, -3.4);
    g.rotateY(Math.PI / 2);
    return g;
  }, []);
  const gableGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-4, 0);
    shape.lineTo(4, 0);
    shape.lineTo(0, 2.5);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex.shingles, roughness: 0.95 }), [tex]);
  const lawnMat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex.lawn, roughness: 1 }), [tex]);

  return (
    <group>
      {/* Lawn */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} material={lawnMat} receiveShadow>
        <circleGeometry args={[30, 48]} />
      </mesh>

      {/* ---------------- Siding (house walls) ---------------- */}
      <Part id="siding">
        <mesh material={siding} position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 5, 6]} />
        </mesh>
        {/* gable ends */}
        <mesh geometry={gableGeo} material={siding} position={[0, 5, 3.001]} />
        <mesh geometry={gableGeo} material={siding} position={[0, 5, -3.001]} rotation-y={Math.PI} />
        {/* attached garage wing */}
        <mesh material={siding} position={[5.6, 1.75, 0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.5, 4.8]} />
        </mesh>
      </Part>

      {/* Roofs, trim, windows (not clickable) */}
      <mesh geometry={roofGeo} material={roofMat} position={[0, 5, 0]} rotation-y={Math.PI / 2} castShadow />
      <mesh material={roofMat} position={[5.6, 3.75, 0.6]} rotation-z={0} castShadow>
        <boxGeometry args={[3.6, 0.3, 5.2]} />
      </mesh>
      <mesh material={brickMat} position={[-2.6, 6.4, -1]} castShadow>
        <boxGeometry args={[0.8, 2.6, 0.8]} />
      </mesh>
      {/* corner boards */}
      {[-4, 4].map((x) =>
        [-3, 3].map((z) => (
          <mesh key={`${x}${z}`} material={trimMat} position={[x, 2.5, z]}>
            <boxGeometry args={[0.18, 5, 0.18]} />
          </mesh>
        )),
      )}
      <Window position={[-2.4, 3.7, 3.02]} />
      <Window position={[2.4, 3.7, 3.02]} />
      <Window position={[-2.4, 1.5, 3.02]} />
      <Window position={[2.4, 1.5, 3.02]} />
      <Window position={[0, 3.9, 3.02]} w={0.9} h={1.1} />
      <Window position={[0, 6.1, 3.02]} w={0.8} h={0.8} />
      <group position={[-4.02, 2.6, 0]} rotation-y={-Math.PI / 2}>
        <Window position={[1.4, 1.1, 0]} />
        <Window position={[-1.4, 1.1, 0]} />
      </group>
      {/* front door */}
      <mesh material={trimMat} position={[0, 1.6, 3.03]}>
        <boxGeometry args={[1.4, 2.4, 0.08]} />
      </mesh>
      <mesh material={doorMat} position={[0, 1.55, 3.08]}>
        <boxGeometry args={[1.05, 2.15, 0.06]} />
      </mesh>
      {/* garage door */}
      <mesh material={trimMat} position={[5.6, 1.25, 3.02]}>
        <boxGeometry args={[2.6, 2.5, 0.06]} />
      </mesh>
      {[0.4, 0.95, 1.5, 2.05].map((y) => (
        <mesh key={y} material={trimMat} position={[5.6, y, 3.06]}>
          <boxGeometry args={[2.5, 0.05, 0.04]} />
        </mesh>
      ))}

      {/* ---------------- Walkway + front stairs ---------------- */}
      <Part id="walkway">
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={walk} position={[0, (0.45 - 0.15 * i) / 2, 3.2 + 0.4 * i]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.45 - 0.15 * i, 0.4]} />
          </mesh>
        ))}
        <mesh material={walk} position={[0, 0.02, 7.2]} receiveShadow>
          <boxGeometry args={[1.5, 0.05, 5]} />
        </mesh>
      </Part>

      {/* ---------------- Driveway ("any other surface") ---------------- */}
      <Part id="driveway">
        <mesh material={drive} position={[5.6, 0.02, 7.3]} receiveShadow>
          <boxGeometry args={[3.4, 0.04, 8.4]} />
        </mesh>
      </Part>

      {/* ---------------- Composite deck ---------------- */}
      <Part id="deck">
        <mesh material={deck} position={[-5.6, 0.9, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.16, 4.2]} />
        </mesh>
        {/* posts */}
        {[-7.1, -4.1].map((x) =>
          [-2.4, 1.6].map((z) => (
            <mesh key={`${x}${z}`} material={deckRail} position={[x, 0.95, z]} castShadow>
              <boxGeometry args={[0.14, 1.9, 0.14]} />
            </mesh>
          )),
        )}
        {/* rails */}
        <mesh material={deckRail} position={[-7.1, 1.85, -0.4]}>
          <boxGeometry args={[0.1, 0.08, 4.2]} />
        </mesh>
        <mesh material={deckRail} position={[-5.6, 1.85, -2.45]}>
          <boxGeometry args={[3.1, 0.08, 0.1]} />
        </mesh>
        {Array.from({ length: 13 }).map((_, i) => (
          <mesh key={i} material={deckRail} position={[-7.1, 1.4, -2.3 + i * 0.32]}>
            <boxGeometry args={[0.05, 0.85, 0.05]} />
          </mesh>
        ))}
        {/* deck steps down to the patio */}
        <mesh material={deck} position={[-5.6, 0.6, 1.95]} castShadow>
          <boxGeometry args={[1.4, 0.1, 0.5]} />
        </mesh>
        <mesh material={deck} position={[-5.6, 0.3, 2.35]} castShadow>
          <boxGeometry args={[1.4, 0.1, 0.4]} />
        </mesh>
      </Part>

      {/* ---------------- Paver patio ---------------- */}
      <Part id="patio">
        <mesh material={patio} position={[-5.8, 0.04, 4.3]} receiveShadow>
          <boxGeometry args={[4.2, 0.08, 3.6]} />
        </mesh>
      </Part>
      {/* patio furniture */}
      <mesh material={trunkMat} position={[-6.4, 0.45, 4.4]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.06, 16]} />
      </mesh>
      <mesh material={trunkMat} position={[-6.4, 0.22, 4.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 6]} />
      </mesh>

      {/* ---------------- Fence ---------------- */}
      <Part id="fence">
        {/* side run */}
        {Array.from({ length: 34 }).map((_, i) => (
          <mesh key={`s${i}`} material={fence} position={[-10, 0.75, -4.6 + i * 0.36]} castShadow>
            <boxGeometry args={[0.08, 1.5, 0.3]} />
          </mesh>
        ))}
        {/* back run */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={`b${i}`} material={fence} position={[-9.7 + i * 0.36, 0.75, -4.7]} castShadow>
            <boxGeometry args={[0.3, 1.5, 0.08]} />
          </mesh>
        ))}
        <mesh material={fence} position={[-10.05, 1.1, 1.3]}>
          <boxGeometry args={[0.06, 0.12, 12]} />
        </mesh>
        <mesh material={fence} position={[-7.1, 1.1, -4.75]}>
          <boxGeometry args={[5.8, 0.12, 0.06]} />
        </mesh>
      </Part>

      {/* Landscaping */}
      <Tree position={[-13, 0, -6]} s={1.3} />
      <Tree position={[10.5, 0, -4]} s={1.5} />
      <Tree position={[-12.5, 0, 8]} s={1.1} />
      <Tree position={[11, 0, 9]} s={1} />
      <Shrub position={[-1.6, 0.3, 3.6]} />
      <Shrub position={[1.6, 0.3, 3.6]} />
      <Shrub position={[-3.2, 0.3, 3.5]} s={0.8} />
      <Shrub position={[3.1, 0.3, 3.5]} s={0.8} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Optional .glb model (public/models/house.glb)                      */
/*  Name each clickable mesh (or its parent) after a PartId:           */
/*  siding, patio, deck, fence, walkway, driveway                      */
/* ------------------------------------------------------------------ */
const PART_IDS: PartId[] = ['siding', 'patio', 'deck', 'fence', 'walkway', 'driveway'];

function partOf(obj: THREE.Object3D | null): PartId | null {
  while (obj) {
    const hit = PART_IDS.find((p) => obj!.name.toLowerCase().startsWith(p));
    if (hit) return hit;
    obj = obj.parent;
  }
  return null;
}

function GlbHouse({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const mats = useMemo(() => {
    const m = new Map<THREE.MeshStandardMaterial, { part: PartId; clean: THREE.Color; dirty: THREE.Color }>();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const part = partOf(o);
      if (mesh.isMesh && part) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mesh.material = mat;
        const clean = mat.color.clone();
        m.set(mat, { part, clean, dirty: clean.clone().lerp(MOLD, 0.62).multiplyScalar(0.72) });
      }
    });
    return m;
  }, [scene]);
  const shown = useRef<Record<string, number>>({});

  useFrame((_, dt) => {
    const s = getState();
    mats.forEach(({ part, clean, dirty }, mat) => {
      shown.current[part] = THREE.MathUtils.damp(shown.current[part] ?? 0, s.clean[part], 3.2, dt);
      mat.color.copy(dirty).lerp(clean, shown.current[part]);
      mat.emissive.copy(BRAND);
      mat.emissiveIntensity = s.hovered === part ? 0.45 : s.selected === part ? 0.05 : 0;
    });
  });

  return (
    <primitive
      object={scene}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        const p = partOf(e.object);
        if (p) {
          e.stopPropagation();
          setState({ hovered: p });
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setState({ hovered: null });
        document.body.style.cursor = '';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const p = partOf(e.object);
        if (p) {
          e.stopPropagation();
          choosePart(p);
        }
      }}
    />
  );
}

export default function HouseModel({ glbUrl }: { glbUrl?: string | null }) {
  return glbUrl ? <GlbHouse url={glbUrl} /> : <ProceduralHouse />;
}
