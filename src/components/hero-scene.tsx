import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, Points } from "three";

const particles = new Float32Array(Array.from({ length: 360 }, (_, index) => ((index * 37) % 100) / 10 - 5));

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
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
        <pointsMaterial color="#7deeff" size={0.018} transparent opacity={0.55} />
      </points>
      <group ref={group}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial color="#092f3a" roughness={0.14} transmission={0.75} thickness={0.5} transparent opacity={0.88} />
        </mesh>
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial color="#38e8ff" emissive="#0ec5df" emissiveIntensity={3} wireframe />
        </mesh>
        {[1.65, 1.9, 2.2].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.8, index * 0.55, index * 0.35]}>
            <torusGeometry args={[radius, 0.012, 8, 100]} />
            <meshBasicMaterial color={index === 1 ? "#ffb86b" : "#58eaff"} transparent opacity={0.58 - index * 0.1} />
          </mesh>
        ))}
        {[[3.5,.7,-1],[-3.4,.8,-.5],[3.7,-1.2,-1],[-3.6,-.8,-1]].map((point, index) => (
          <mesh key={index} position={point as [number, number, number]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={index % 2 ? "#ffb86b" : "#38e8ff"} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 46 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 4]} color="#38e8ff" intensity={22} />
      <pointLight position={[-3, -2, 2]} color="#ff9b55" intensity={12} />
      <ServerCore />
    </Canvas>
  );
}