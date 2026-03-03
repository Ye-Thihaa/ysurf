import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";

// ── 1. FLOATING KEYBOARD ─────────────────────
function Key({ position, label }: { position: [number, number, number]; label: string }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + (pressed ? -0.05 : hovered ? 0.12 : 0);
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => { setHovered(false); setPressed(false); }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
      >
        <boxGeometry args={[0.28, 0.08, 0.28]} />
        <meshStandardMaterial
          color={hovered ? "#6366f1" : "#1e293b"}
          roughness={0.3} metalness={0.6}
          emissive={hovered ? "#4338ca" : "#000"}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 0.06, position[2] + 0.01]}
        fontSize={0.09}
        color={hovered ? "#fff" : "#94a3b8"}
        anchorX="center" anchorY="middle"
      >{label}</Text>
    </group>
  );
}

export function FloatingKeyboard() {
  const groupRef = useRef<THREE.Group>(null);
  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ];
  const zOffsets = [0, -0.25, 0.25];

  useFrame((s) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.3;
      groupRef.current.position.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[3.4, 0.12, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>
      {rows.map((row, ri) =>
        row.map((label, ci) => {
          const xStart = [-1.4, -1.2, -1.0][ri];
          const pos: [number, number, number] = [xStart + ci * 0.33, 0, zOffsets[ri]];
          return <Key key={`${ri}-${ci}`} label={label} position={pos} />;
        })
      )}
      <mesh position={[0, 0, 0.55]}>
        <boxGeometry args={[1.4, 0.08, 0.28]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ── 2. GLOWING TERMINAL ──────────────────────
const CODE_LINES = [
  "const build = async () => {",
  "  await think(deeply);",
  "  return craft(solution);",
  "};",
  "// Architecting the future",
  "export default genius;",
  "✓ Build successful",
  "const dev = 'Ysurf';",
];

export function GlowingTerminal() {
  const groupRef = useRef<THREE.Group>(null);
  const [t, setT] = useState(0);

  useFrame((s) => {
    setT(s.clock.elapsedTime);
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  const dur = 10, lDur = dur / CODE_LINES.length;
  const dotColors = ["#ff5f57", "#febc2e", "#28c840"] as const;
  const dotPositions: [number, number, number][] = [
    [-0.96, 0.85, 0.09],
    [-0.82, 0.85, 0.09],
    [-0.68, 0.85, 0.09],
  ];

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 1]} color="#50fa7b" intensity={1.5} distance={3} />
      <mesh>
        <boxGeometry args={[2.8, 2.0, 0.12]} />
        <meshStandardMaterial color="#0d1117" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[2.6, 1.8, 0.01]} />
        <meshStandardMaterial color="#011627" emissive="#011627" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.85, 0.07]}>
        <boxGeometry args={[2.6, 0.12, 0.02]} />
        <meshStandardMaterial color="#161b22" />
      </mesh>
      {dotPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color={dotColors[i]} emissive={dotColors[i]} emissiveIntensity={0.8} />
        </mesh>
      ))}
      {CODE_LINES.map((line, i) => {
        const p = Math.max(0, Math.min(1, ((t % dur) - i * lDur) / lDur));
        return p > 0 ? (
          <Text key={i}
            position={[-1.1, 0.65 - i * 0.18, 0.11]}
            fontSize={0.09} anchorX="left" anchorY="middle" maxWidth={2.2}
            color={line.startsWith("//") ? "#6272a4" : line.startsWith("✓") ? "#50fa7b" : "#f8f8f2"}
          >{line.slice(0, Math.floor(line.length * p))}</Text>
        ) : null;
      })}
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[0.18, 0.3, 0.12]} />
        <meshStandardMaterial color="#21262d" metalness={0.8} />
      </mesh>
      <mesh position={[0, -1.32, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.4]} />
        <meshStandardMaterial color="#21262d" metalness={0.8} />
      </mesh>
    </group>
  );
}

// ── 3. GEOMETRIC BRAIN ───────────────────────
function BrainNode({ position, size, delay }: { position: [number, number, number]; size: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hov, setHov] = useState(false);

  useFrame((s) => {
    if (ref.current) {
      const p = Math.sin(s.clock.elapsedTime * 2 + delay) * 0.5 + 0.5;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = hov ? 1 : 0.2 + p * 0.6;
      ref.current.scale.setScalar(hov ? 1.5 : 1 + p * 0.2);
    }
  });

  return (
    <mesh ref={ref} position={position}
      onPointerOver={() => setHov(true)} onPointerOut={() => setHov(false)}>
      <octahedronGeometry args={[size]} />
      <meshStandardMaterial color={hov ? "#a78bfa" : "#6366f1"} emissive="#818cf8"
        emissiveIntensity={0.3} roughness={0.1} metalness={0.8} />
    </mesh>
  );
}

export function GeometricBrain() {
  const ref = useRef<THREE.Group>(null);

  const nodes = useMemo<[number, number, number][]>(() =>
    Array.from({ length: 40 }, () => {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 0.5;
      return [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.75, r * Math.sin(ph) * Math.sin(th)];
    }), []);

  const lines = useMemo(() => {
    const geo: THREE.BufferGeometry[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i][0]-nodes[j][0], nodes[i][1]-nodes[j][1], nodes[i][2]-nodes[j][2]);
        if (d < 0.45) {
          geo.push(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...nodes[i]),
            new THREE.Vector3(...nodes[j]),
          ]));
        }
      }
    }
    return geo;
  }, [nodes]);

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={ref}>
      <pointLight position={[0, 0, 2]} color="#818cf8" intensity={2} distance={4} />
      {nodes.map((pos, i) => (
        <BrainNode key={i} position={pos} delay={i * 0.3} size={0.05 + (i % 5) * 0.01} />
      ))}
      {lines.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial color="#6366f1" transparent opacity={0.2} />
        </lineSegments>
      ))}
    </group>
  );
}

// ── 4. DNA HELIX ─────────────────────────────
const CHARS = ["</>", "{}", "=>", "fn", "[]", "//", "&&", "!=", "++", "=="];

export function DNAHelix() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5; });

  const strands = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 4, y = (i / 24) * 3 - 1.5, r = 0.7;
      return {
        pos1: [Math.cos(t) * r, y, Math.sin(t) * r] as [number, number, number],
        pos2: [Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r] as [number, number, number],
        label: CHARS[i % CHARS.length], t,
      };
    }), []);

  return (
    <group ref={ref}>
      <pointLight position={[0, 0, 2]} color="#06b6d4" intensity={1.5} distance={5} />
      {strands.map((s, i) => (
        <group key={i}>
          <mesh position={s.pos1}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={s.pos2}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[(s.pos1[0]+s.pos2[0])/2, s.pos1[1], (s.pos1[2]+s.pos2[2])/2]} rotation={[0, s.t+Math.PI/2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.4, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} transparent opacity={0.6} />
          </mesh>
          {i % 3 === 0 && (
            <Text position={[s.pos1[0]*1.4, s.pos1[1], s.pos1[2]*1.4]} fontSize={0.1} color="#38bdf8" anchorX="center" anchorY="middle">
              {s.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

// ── 5. DEVELOPER DESK ────────────────────────
export function DeveloperDesk() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.4;
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const legPositions: [number, number, number][] = [
    [-1.4, -0.6, -0.6], [1.4, -0.6, -0.6], [-1.4, -0.6, 0.6], [1.4, -0.6, 0.6],
  ];
  const leafColors = ["#15803d", "#16a34a", "#22c55e", "#4ade80"] as const;

  return (
    <group ref={ref} scale={0.9}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[3.2, 0.1, 1.6]} /><meshStandardMaterial color="#92400e" roughness={0.8} /></mesh>
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos}><boxGeometry args={[0.1, 1.1, 0.1]} /><meshStandardMaterial color="#78350f" /></mesh>
      ))}
      <mesh position={[0, 0.85, -0.4]}><boxGeometry args={[1.5, 0.9, 0.07]} /><meshStandardMaterial color="#0f172a" metalness={0.9} /></mesh>
      <mesh position={[0, 0.85, -0.36]}><boxGeometry args={[1.38, 0.78, 0.01]} /><meshStandardMaterial color="#011627" emissive="#1e3a5f" emissiveIntensity={0.8} /></mesh>
      <mesh position={[0, 0.22, -0.4]}><boxGeometry args={[0.12, 0.3, 0.1]} /><meshStandardMaterial color="#1e293b" metalness={0.8} /></mesh>
      <mesh position={[0, 0.07, -0.4]}><boxGeometry args={[0.5, 0.06, 0.3]} /><meshStandardMaterial color="#1e293b" metalness={0.8} /></mesh>
      <mesh position={[0, 0.09, 0.2]}><boxGeometry args={[1.0, 0.05, 0.38]} /><meshStandardMaterial color="#1e293b" metalness={0.7} /></mesh>
      <mesh position={[0.72, 0.09, 0.2]}><boxGeometry args={[0.18, 0.05, 0.28]} /><meshStandardMaterial color="#1e293b" metalness={0.7} /></mesh>
      <mesh position={[-1.1, 0.2, 0.1]}><cylinderGeometry args={[0.1, 0.09, 0.22, 10]} /><meshStandardMaterial color="#b45309" /></mesh>
      <mesh position={[-1.1, 0.28, 0.1]}><cylinderGeometry args={[0.085, 0.085, 0.02, 10]} /><meshStandardMaterial color="#451a03" /></mesh>
      <mesh position={[1.2, 0.18, -0.2]}><cylinderGeometry args={[0.12, 0.09, 0.2, 8]} /><meshStandardMaterial color="#b45309" roughness={0.8} /></mesh>
      <mesh position={[1.2, 0.42, -0.2]}><cylinderGeometry args={[0.02, 0.02, 0.28, 6]} /><meshStandardMaterial color="#166534" /></mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i}
          position={[1.2+Math.cos(i*1.57)*0.15, 0.5+i*0.05, -0.2+Math.sin(i*1.57)*0.15]}
          rotation={[0, i*1.57, 0.4]}>
          <sphereGeometry args={[0.1, 5, 4]} />
          <meshStandardMaterial color={leafColors[i]} roughness={0.9} />
        </mesh>
      ))}
      <pointLight position={[0, 0.9, -0.2]} color="#3b82f6" intensity={0.8} distance={2} />
    </group>
  );
}

// ── MODELS REGISTRY ──────────────────────────
const MODELS = [
  { id: 0, name: "⌨️ Keyboard",  C: FloatingKeyboard },
  { id: 1, name: "🖥️ Terminal",  C: GlowingTerminal  },
  { id: 2, name: "🧠 Brain",     C: GeometricBrain   },
  { id: 3, name: "🧬 DNA Helix", C: DNAHelix         },
  { id: 4, name: "🪴 Dev Desk",  C: DeveloperDesk    },
];

// ── SINGLE MODEL CARD ────────────────────────
function ModelCard({ model, isHovered, onEnter, onLeave }: {
  model: typeof MODELS[number];
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${isHovered ? "#6366f1" : "#1e293b"}`,
        background: "#0f172a",
        cursor: "grab",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: isHovered ? "0 0 24px #6366f144" : "none",
      }}
    >
      <div style={{
        padding: "10px 14px",
        color: isHovered ? "#a5b4fc" : "#475569",
        fontSize: 12, fontWeight: 600,
        borderBottom: "1px solid #1e293b",
        transition: "color 0.2s",
        fontFamily: "monospace",
        letterSpacing: "0.06em",
      }}>
        {model.name}
      </div>
      <div style={{ height: 260 }}>
        <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-3, 3, -3]} color="#818cf8" intensity={0.6} />
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
            <model.C />
          </Float>
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} />
        </Canvas>
      </div>
    </div>
  );
}

// ── SHOWCASE ─────────────────────────────────
export default function Hero3DShowcase() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{
      width: "100%", minHeight: "100vh", background: "#030712",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "monospace",
      padding: "48px 20px", boxSizing: "border-box",
    }}>
      <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 6px" }}>
        YSURF · 3D Hero Models
      </h1>
      <p style={{ color: "#475569", fontSize: 12, margin: "0 0 36px" }}>
        HOVER · DRAG TO ROTATE · SCROLL TO ZOOM
      </p>

      {/* Top row — 3 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, width: "min(1080px, 95vw)", marginBottom: 16 }}>
        {MODELS.slice(0, 3).map((m) => (
          <ModelCard key={m.id} model={m} isHovered={hovered === m.id}
            onEnter={() => setHovered(m.id)} onLeave={() => setHovered(null)} />
        ))}
      </div>

      {/* Bottom row — 2 cards centered */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, width: "min(720px, 95vw)" }}>
        {MODELS.slice(3).map((m) => (
          <ModelCard key={m.id} model={m} isHovered={hovered === m.id}
            onEnter={() => setHovered(m.id)} onLeave={() => setHovered(null)} />
        ))}
      </div>
    </div>
  );
}