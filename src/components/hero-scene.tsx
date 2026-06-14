import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

const particlesCount = 400;
const particlePositions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  particlePositions[i] = (Math.random() - 0.5) * 15;
}

function DataLines() {
  const lines = useMemo(() => {
    const tempLines = [];
    for (let i = 0; i < 8; i++) {
      const points = [];
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      );
      const end = new THREE.Vector3(0, 0, 0);
      points.push(start, end);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      tempLines.push(geometry);
    }
    return tempLines;
  }, []);

  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={group}>
      {lines.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#4a9c8d" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
}

function ServerCore() {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const stars = useRef<Points>(null);
  const glowRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x += (pointer.y * 0.12 - group.current.rotation.x) * 0.035;
      group.current.position.x += (pointer.x * 0.3 - group.current.position.x) * 0.025;
      group.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
    if (inner.current) {
      inner.current.rotation.z -= delta * 0.35;
      inner.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (stars.current) {
      stars.current.rotation.y += delta * 0.015;
      stars.current.position.y = Math.sin(t * 0.2) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(t * 1.5) * 0.1);
    }
    state.camera.position.x += (pointer.x * 0.8 - state.camera.position.x) * 0.02;
    state.camera.position.y += (pointer.y * 0.4 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#4a9c8d" size={0.02} transparent opacity={0.3} sizeAttenuation />
      </points>

      <group ref={group}>
        {/* Soft Volumetric Glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#2f8d80" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial
            color="#d9e6dc"
            roughness={0.1}
            transmission={0.8}
            thickness={1}
            transparent
            opacity={0.8}
            envMapIntensity={2}
          />
        </mesh>

        <mesh ref={inner}>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#27796d"
            emissive="#2f8d80"
            emissiveIntensity={2}
            wireframe
          />
        </mesh>

        {[1.65, 1.9, 2.2, 2.5].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.8, index * 0.55, index * 0.35]}>
            <torusGeometry args={[radius, 0.008, 16, 100]} />
            <meshBasicMaterial
              color={index % 2 === 1 ? "#d69b4c" : "#4a9c8d"}
              transparent
              opacity={0.4 - index * 0.08}
            />
          </mesh>
        ))}

        {[
          [3.5, 0.7, -1],
          [-3.4, 0.8, -0.5],
          [3.7, -1.2, -1],
          [-3.6, -0.8, -1],
          [0, 4, -2],
          [0, -4, -2],
        ].map((point, index) => (
          <mesh key={index} position={point as [number, number, number]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 ? "#d69b4c" : "#4a9c8d"}
              emissive={index % 2 ? "#d69b4c" : "#4a9c8d"}
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
      <DataLines />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#69b7a8" />
      <pointLight position={[3, 3, 4]} color="#69b7a8" intensity={15} />
      <pointLight position={[-3, -2, 2]} color="#d8a25c" intensity={10} />
      <pointLight position={[0, 0, -5]} color="#4a9c8d" intensity={5} />
      <ServerCore />
    </Canvas>
  );
}
