import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, Points } from "three";

const particles = new Float32Array(
  Array.from({ length: 360 }, (_, index) => ((index * 37) % 100) / 10 - 5),
);

function ServerCore() {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const stars = useRef<Points>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x += (pointer.y * 0.12 - group.current.rotation.x) * 0.035;
      group.current.position.x += (pointer.x * 0.3 - group.current.position.x) * 0.025;
    }
    if (inner.current) inner.current.rotation.z -= delta * 0.35;
    if (stars.current) stars.current.rotation.y += delta * 0.015;
    state.camera.position.x += (pointer.x * 0.45 - state.camera.position.x) * 0.018;
    state.camera.position.y += (pointer.y * 0.25 - state.camera.position.y) * 0.018;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#4a9c8d" size={0.014} transparent opacity={0.28} />
      </points>
      <group ref={group}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial
            color="#d9e6dc"
            roughness={0.32}
            transmission={0.58}
            thickness={0.45}
            transparent
            opacity={0.76}
          />
        </mesh>
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#27796d"
            emissive="#2f8d80"
            emissiveIntensity={0.9}
            wireframe
          />
        </mesh>
        {[1.65, 1.9, 2.2].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.8, index * 0.55, index * 0.35]}>
            <torusGeometry args={[radius, 0.012, 8, 100]} />
            <meshBasicMaterial
              color={index === 1 ? "#d69b4c" : "#4a9c8d"}
              transparent
              opacity={0.34 - index * 0.06}
            />
          </mesh>
        ))}
        {[
          [3.5, 0.7, -1],
          [-3.4, 0.8, -0.5],
          [3.7, -1.2, -1],
          [-3.6, -0.8, -1],
        ].map((point, index) => (
          <mesh key={index} position={point as [number, number, number]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={index % 2 ? "#d69b4c" : "#4a9c8d"} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 46 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.65} />
      <pointLight position={[3, 3, 4]} color="#69b7a8" intensity={10} />
      <pointLight position={[-3, -2, 2]} color="#d8a25c" intensity={5} />
      <ServerCore />
    </Canvas>
  );
}
