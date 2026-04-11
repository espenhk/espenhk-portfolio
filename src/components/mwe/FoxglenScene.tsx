import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

function GoldenOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          color="#D4B87B"
          emissive="#D4B87B"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.7}
          distort={0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingRune({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.3, 0.08, 8, 6]} />
        <MeshWobbleMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          factor={0.3}
          speed={1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function LeafShape({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + position[0];
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={[0.6, 0.8, 0.1]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.5}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function FoxglenScene({ height = 300 }: { height?: number }) {
  const { isDark } = useTheme();

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.3 : 0.5} />
        <pointLight position={[3, 3, 3]} intensity={isDark ? 0.8 : 0.5} color="#D4B87B" />
        <pointLight position={[-3, -2, 2]} intensity={0.3} color="#8CAA7E" />

        <GoldenOrb />

        <FloatingRune position={[-2.2, 0.8, -1]} color="#D4B87B" />
        <FloatingRune position={[2.5, -0.5, -0.5]} color="#8CAA7E" />
        <FloatingRune position={[-1.5, -1.2, 0.5]} color="#7B95A5" />
        <FloatingRune position={[1.8, 1.2, -1.5]} color="#C4907C" />

        <LeafShape position={[-2.8, -0.2, 0]} color="#8CAA7E" />
        <LeafShape position={[2.8, 0.8, -1]} color="#8CAA7E" />

        <Sparkles
          count={40}
          scale={6}
          size={2}
          speed={0.3}
          color="#D4B87B"
          opacity={isDark ? 0.6 : 0.3}
        />
      </Canvas>
    </div>
  );
}
