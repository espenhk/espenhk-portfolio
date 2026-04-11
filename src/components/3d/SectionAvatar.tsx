import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const avatarConfigs = {
  publications: { id: 'fox', label: 'Fox' },
  'character-sheet': { id: 'owl', label: 'Owl' },
  projects: { id: 'bear', label: 'Bear' },
  experience: { id: 'cat', label: 'Cat' },
  contact: { id: 'rabbit', label: 'Rabbit' },
};

export type AvatarSectionId = keyof typeof avatarConfigs;

// Shared handlebar mustache component
function HandlebarMustache({ y, z, scale = 1, color = '#3A2218' }: { y: number; z: number; scale?: number; color?: string }) {
  return (
    <group position={[0, y, z]} scale={scale}>
      {/* Left curl */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.018, 0.12, 4, 8]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Left tip curl up */}
      <mesh position={[-0.22, 0.03, 0]} rotation={[0, 0, 1.2]}>
        <capsuleGeometry args={[0.014, 0.06, 4, 8]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Right curl */}
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.018, 0.12, 4, 8]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Right tip curl up */}
      <mesh position={[0.22, 0.03, 0]} rotation={[0, 0, -1.2]}>
        <capsuleGeometry args={[0.014, 0.06, 4, 8]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Center bridge */}
      <mesh position={[0, -0.01, 0]}>
        <capsuleGeometry args={[0.02, 0.06, 4, 8]} />
        <meshToonMaterial color={color} />
      </mesh>
    </group>
  );
}

// Toon outline material helper
function OutlineMesh({ children, geometry, scale = 1.06 }: { children?: React.ReactNode; geometry: THREE.BufferGeometry; scale?: number }) {
  return (
    <mesh geometry={geometry} scale={scale}>
      <meshBasicMaterial color="#1A1A1A" side={THREE.BackSide} />
    </mesh>
  );
}

// === FOX (Publications) — warm russet, big bushy tail, pointed ears ===
function FoxAvatar() {
  const bodyColor = '#C4622D';
  const bellyColor = '#F5DCC0';
  const darkColor = '#5B2E15';

  return (
    <group position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.28, 0.5, 8, 16]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Belly patch */}
      <mesh position={[0, -0.05, 0.2]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0.05]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.48, 0.25]}>
        <coneGeometry args={[0.1, 0.18, 8]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.5, 0.35]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.1, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.095, 0.61, 0.22]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.105, 0.61, 0.22]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Ears — pointed */}
      <mesh position={[-0.15, 0.82, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.15, 0.82, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Inner ears */}
      <mesh position={[-0.15, 0.82, 0.02]} rotation={[0, 0, -0.2]} scale={0.6}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <meshToonMaterial color="#E8A07A" />
      </mesh>
      <mesh position={[0.15, 0.82, 0.02]} rotation={[0, 0, 0.2]} scale={0.6}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <meshToonMaterial color="#E8A07A" />
      </mesh>
      {/* Tail — big and bushy */}
      <mesh position={[0, -0.1, -0.35]} rotation={[0.6, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.4, 8, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 0.05, -0.55]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, -0.45, 0]}>
        <capsuleGeometry args={[0.06, 0.2, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.12, -0.45, 0]}>
        <capsuleGeometry args={[0.06, 0.2, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.3, 0.05, 0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.05, 0.2, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.3, 0.05, 0.05]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.05, 0.2, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* MUSTACHE */}
      <HandlebarMustache y={0.46} z={0.28} scale={0.8} color={darkColor} />
    </group>
  );
}

// === OWL (Character Sheet) — round, wise, big eyes ===
function OwlAvatar() {
  const bodyColor = '#6B5E4F';
  const chestColor = '#D4C8B0';
  const darkColor = '#3A3028';

  return (
    <group position={[0, -0.45, 0]}>
      {/* Body — rounder */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 14, 14]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Chest feathers */}
      <mesh position={[0, -0.02, 0.22]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshToonMaterial color={chestColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Eye discs — big round owl eyes */}
      <mesh position={[-0.12, 0.52, 0.2]}>
        <circleGeometry args={[0.09, 16]} />
        <meshToonMaterial color={chestColor} />
      </mesh>
      <mesh position={[0.12, 0.52, 0.2]}>
        <circleGeometry args={[0.09, 16]} />
        <meshToonMaterial color={chestColor} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.12, 0.52, 0.21]}>
        <circleGeometry args={[0.05, 12]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.12, 0.52, 0.21]}>
        <circleGeometry args={[0.05, 12]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      {/* Eye shine */}
      <mesh position={[-0.1, 0.54, 0.22]}>
        <circleGeometry args={[0.018, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.14, 0.54, 0.22]}>
        <circleGeometry args={[0.018, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.44, 0.24]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshToonMaterial color="#E8A040" />
      </mesh>
      {/* Ear tufts */}
      <mesh position={[-0.16, 0.76, -0.02]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.06, 0.18, 4]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.16, 0.76, -0.02]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.06, 0.18, 4]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.35, 0.1, -0.05]} rotation={[0, 0.3, 0.4]}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.35, 0.1, -0.05]} rotation={[0, -0.3, -0.4]}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.1, -0.38, 0.08]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color="#E8A040" />
      </mesh>
      <mesh position={[0.1, -0.38, 0.08]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color="#E8A040" />
      </mesh>
      {/* MUSTACHE */}
      <HandlebarMustache y={0.42} z={0.26} scale={0.7} color={darkColor} />
    </group>
  );
}

// === BEAR (Projects) — stocky, round ears ===
function BearAvatar() {
  const bodyColor = '#7B6248';
  const snoutColor = '#C4A882';
  const darkColor = '#4A3828';

  return (
    <group position={[0, -0.5, 0]}>
      {/* Body — stocky */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.32, 0.45, 8, 14]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.05, 0.2]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshToonMaterial color={snoutColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.46, 0.22]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshToonMaterial color={snoutColor} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.5, 0.33]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.11, 0.58, 0.2]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.11, 0.58, 0.2]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[-0.1, 0.59, 0.22]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.12, 0.59, 0.22]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Round ears */}
      <mesh position={[-0.2, 0.78, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.2, 0.78, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.2, 0.78, 0.03]} scale={0.6}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshToonMaterial color={snoutColor} />
      </mesh>
      <mesh position={[0.2, 0.78, 0.03]} scale={0.6}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshToonMaterial color={snoutColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.35, 0.08, 0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.07, 0.22, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.35, 0.08, 0.05]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.07, 0.22, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.13, -0.45, 0]}>
        <capsuleGeometry args={[0.08, 0.18, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.13, -0.45, 0]}>
        <capsuleGeometry args={[0.08, 0.18, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* MUSTACHE */}
      <HandlebarMustache y={0.44} z={0.28} scale={0.9} color={darkColor} />
    </group>
  );
}

// === CAT (Experience) — sleek, tall ears, long tail ===
function CatAvatar() {
  const bodyColor = '#4A5568';
  const chestColor = '#CBD5E0';
  const darkColor = '#2D3748';

  return (
    <group position={[0, -0.5, 0]}>
      {/* Body — sleeker */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.24, 0.5, 8, 14]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Chest */}
      <mesh position={[0, 0.05, 0.16]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshToonMaterial color={chestColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.23, 12, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.47, 0.22]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshToonMaterial color="#E8A0A0" />
      </mesh>
      {/* Eyes — cat-like, slightly angled */}
      <mesh position={[-0.1, 0.56, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#88C878" />
      </mesh>
      <mesh position={[0.1, 0.56, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#88C878" />
      </mesh>
      {/* Cat pupils — vertical slits */}
      <mesh position={[-0.1, 0.56, 0.21]}>
        <capsuleGeometry args={[0.008, 0.04, 4, 6]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.1, 0.56, 0.21]}>
        <capsuleGeometry args={[0.008, 0.04, 4, 6]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      {/* Tall pointed ears */}
      <mesh position={[-0.14, 0.78, 0]} rotation={[0, 0, -0.15]}>
        <coneGeometry args={[0.07, 0.22, 4]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.14, 0.78, 0]} rotation={[0, 0, 0.15]}>
        <coneGeometry args={[0.07, 0.22, 4]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.14, 0.78, 0.02]} rotation={[0, 0, -0.15]} scale={0.55}>
        <coneGeometry args={[0.07, 0.2, 4]} />
        <meshToonMaterial color="#E8A0A0" />
      </mesh>
      <mesh position={[0.14, 0.78, 0.02]} rotation={[0, 0, 0.15]} scale={0.55}>
        <coneGeometry args={[0.07, 0.2, 4]} />
        <meshToonMaterial color="#E8A0A0" />
      </mesh>
      {/* Tail — long curving */}
      <mesh position={[0.1, -0.05, -0.3]} rotation={[0.8, 0.3, 0]}>
        <capsuleGeometry args={[0.04, 0.35, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.2, 0.15, -0.52]} rotation={[0.2, 0.2, 0]}>
        <capsuleGeometry args={[0.035, 0.15, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.28, 0.05, 0.05]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.045, 0.22, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.28, 0.05, 0.05]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.045, 0.22, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, -0.45, 0]}>
        <capsuleGeometry args={[0.055, 0.2, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.1, -0.45, 0]}>
        <capsuleGeometry args={[0.055, 0.2, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Whiskers */}
      <mesh position={[-0.18, 0.47, 0.18]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.004, 0.12, 2, 4]} />
        <meshBasicMaterial color={chestColor} />
      </mesh>
      <mesh position={[-0.17, 0.45, 0.18]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.004, 0.1, 2, 4]} />
        <meshBasicMaterial color={chestColor} />
      </mesh>
      <mesh position={[0.18, 0.47, 0.18]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.004, 0.12, 2, 4]} />
        <meshBasicMaterial color={chestColor} />
      </mesh>
      <mesh position={[0.17, 0.45, 0.18]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.004, 0.1, 2, 4]} />
        <meshBasicMaterial color={chestColor} />
      </mesh>
      {/* MUSTACHE */}
      <HandlebarMustache y={0.44} z={0.22} scale={0.75} color={darkColor} />
    </group>
  );
}

// === RABBIT (Contact) — long ears, round body ===
function RabbitAvatar() {
  const bodyColor = '#D4C4A8';
  const bellyColor = '#F0E8D8';
  const darkColor = '#8B7D6B';

  return (
    <group position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.26, 0.42, 8, 14]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.04, 0.18]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Cheeks */}
      <mesh position={[-0.15, 0.42, 0.14]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      <mesh position={[0.15, 0.42, 0.14]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.46, 0.23]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshToonMaterial color="#E8A0A0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.54, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#2A1A1A" />
      </mesh>
      <mesh position={[0.1, 0.54, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#2A1A1A" />
      </mesh>
      <mesh position={[-0.09, 0.55, 0.2]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.11, 0.55, 0.2]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* LONG ears */}
      <mesh position={[-0.1, 0.85, -0.02]} rotation={[0.1, 0, -0.15]}>
        <capsuleGeometry args={[0.05, 0.35, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.1, 0.85, -0.02]} rotation={[-0.05, 0, 0.2]}>
        <capsuleGeometry args={[0.05, 0.35, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Inner ears */}
      <mesh position={[-0.1, 0.85, 0]} rotation={[0.1, 0, -0.15]} scale={[0.5, 0.9, 0.5]}>
        <capsuleGeometry args={[0.05, 0.3, 6, 8]} />
        <meshToonMaterial color="#E8B0B0" />
      </mesh>
      <mesh position={[0.1, 0.85, 0]} rotation={[-0.05, 0, 0.2]} scale={[0.5, 0.9, 0.5]}>
        <capsuleGeometry args={[0.05, 0.3, 6, 8]} />
        <meshToonMaterial color="#E8B0B0" />
      </mesh>
      {/* Tail puff */}
      <mesh position={[0, -0.15, -0.28]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshToonMaterial color={bellyColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.28, 0.05, 0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.28, 0.05, 0.05]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
        <meshToonMaterial color={bodyColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, -0.42, 0.05]}>
        <capsuleGeometry args={[0.07, 0.18, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.12, -0.42, 0.05]}>
        <capsuleGeometry args={[0.07, 0.18, 6, 8]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* MUSTACHE */}
      <HandlebarMustache y={0.43} z={0.23} scale={0.75} color={darkColor} />
    </group>
  );
}

const avatarComponents: Record<string, () => JSX.Element> = {
  fox: FoxAvatar,
  owl: OwlAvatar,
  bear: BearAvatar,
  cat: CatAvatar,
  rabbit: RabbitAvatar,
};

interface CharacterSceneProps {
  avatarId: string;
  rotation: number;
}

function CharacterScene({ avatarId, rotation }: CharacterSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(rotation);
  targetRotation.current = rotation;

  useFrame(() => {
    if (groupRef.current) {
      // Smooth lerp to target
      groupRef.current.rotation.y += (targetRotation.current - groupRef.current.rotation.y) * 0.08;
    }
  });

  const AvatarComponent = avatarComponents[avatarId];
  if (!AvatarComponent) return null;

  return (
    <group ref={groupRef}>
      <AvatarComponent />
    </group>
  );
}

interface SectionAvatarProps {
  sectionId: AvatarSectionId;
  scrollProgress: number;
}

export default function SectionAvatar({ sectionId, scrollProgress }: SectionAvatarProps) {
  const config = avatarConfigs[sectionId];
  // Much slower rotation: ~quarter turn per full section scroll
  const rotation = scrollProgress * Math.PI * 0.5;

  return (
    <div style={{
      width: 90,
      height: 110,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0.3, 3.0], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 5]} intensity={0.9} />
        <directionalLight position={[-2, 2, -3]} intensity={0.3} color="#B0C4DE" />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#FFE4C4" />
        <CharacterScene avatarId={config.id} rotation={rotation} />
      </Canvas>
    </div>
  );
}
