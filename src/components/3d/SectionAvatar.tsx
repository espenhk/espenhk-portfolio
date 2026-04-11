import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Muted Tunic-inspired palettes per section
export const avatarConfigs = {
  publications: {
    body: '#8B7D6B',   // warm stone
    head: '#F5E6D3',   // pale skin
    accent: '#C4956A', // warm accent
    hat: '#5B4E3A',    // dark hat
    cape: '#9B4D4D',   // muted red cape
  },
  'character-sheet': {
    body: '#6B7D8B',   // cool blue-gray
    head: '#F5E6D3',
    accent: '#7BA3C4',
    hat: '#3A4E5B',
    cape: '#4D6E9B',   // muted blue cape
  },
  projects: {
    body: '#7D8B6B',   // sage green
    head: '#F5E6D3',
    accent: '#A3C47B',
    hat: '#4E5B3A',
    cape: '#5B9B4D',   // muted green cape
  },
  experience: {
    body: '#8B6B7D',   // muted plum
    head: '#F5E6D3',
    accent: '#C47BA3',
    hat: '#5B3A4E',
    cape: '#9B4D8B',   // muted purple cape
  },
  contact: {
    body: '#8B836B',   // warm ochre
    head: '#F5E6D3',
    accent: '#C4B07B',
    hat: '#5B533A',
    cape: '#C49B4D',   // muted gold cape
  },
};

export type AvatarSectionId = keyof typeof avatarConfigs;

interface CharacterProps {
  colors: typeof avatarConfigs[AvatarSectionId];
  rotation: number;
}

function LowPolyCharacter({ colors, rotation }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  // Create low-poly body shape
  const bodyGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.35, 0.25, 1.0, 6);
    return geo;
  }, []);

  const headGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.28, 1);
  }, []);

  const hatGeo = useMemo(() => {
    return new THREE.ConeGeometry(0.22, 0.35, 5);
  }, []);

  const capeGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.3, 0.4);
    shape.quadraticCurveTo(-0.45, -0.1, -0.35, -0.5);
    shape.lineTo(0.35, -0.5);
    shape.quadraticCurveTo(0.45, -0.1, 0.3, 0.4);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape, 4);
    return geo;
  }, []);

  // Arms
  const armGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.08, 0.06, 0.5, 5);
  }, []);

  // Legs
  const legGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.1, 0.08, 0.4, 5);
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh geometry={bodyGeo} position={[0, 0.2, 0]}>
        <meshToonMaterial color={colors.body} />
      </mesh>

      {/* Head */}
      <mesh geometry={headGeo} position={[0, 0.95, 0]}>
        <meshToonMaterial color={colors.head} />
      </mesh>

      {/* Eyes - two small dark spheres */}
      <mesh position={[-0.1, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#2A2A2A" />
      </mesh>
      <mesh position={[0.1, 0.98, 0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#2A2A2A" />
      </mesh>

      {/* Hat */}
      <mesh geometry={hatGeo} position={[0, 1.3, 0]}>
        <meshToonMaterial color={colors.hat} />
      </mesh>

      {/* Cape (behind) */}
      <mesh geometry={capeGeo} position={[0, 0.3, -0.28]} rotation={[0.15, 0, 0]}>
        <meshToonMaterial color={colors.cape} side={THREE.DoubleSide} />
      </mesh>

      {/* Left arm */}
      <mesh geometry={armGeo} position={[-0.45, 0.15, 0]} rotation={[0, 0, 0.3]}>
        <meshToonMaterial color={colors.accent} />
      </mesh>

      {/* Right arm */}
      <mesh geometry={armGeo} position={[0.45, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <meshToonMaterial color={colors.accent} />
      </mesh>

      {/* Left leg */}
      <mesh geometry={legGeo} position={[-0.15, -0.45, 0]}>
        <meshToonMaterial color={colors.hat} />
      </mesh>

      {/* Right leg */}
      <mesh geometry={legGeo} position={[0.15, -0.45, 0]}>
        <meshToonMaterial color={colors.hat} />
      </mesh>
    </group>
  );
}

interface SectionAvatarProps {
  sectionId: AvatarSectionId;
  scrollProgress: number; // 0-1 within the section
}

export default function SectionAvatar({ sectionId, scrollProgress }: SectionAvatarProps) {
  const colors = avatarConfigs[sectionId];
  const rotation = scrollProgress * Math.PI * 2;

  return (
    <div style={{
      width: 80,
      height: 100,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0.5, 3.2], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <directionalLight position={[-2, 1, -3]} intensity={0.3} color="#9BB8D0" />
        <LowPolyCharacter colors={colors} rotation={rotation} />
      </Canvas>
    </div>
  );
}
