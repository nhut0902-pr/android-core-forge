import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, MeshTransmissionMaterial, Sparkles, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function ServerCore() {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x += (pointer.y * 0.12 - group.current.rotation.x) * 0.035;
      group.current.position.x += (pointer.x * 0.3 - group.current.position.x) * 0.025;
    }
    if (inner.current) inner.current.rotation.z -= delta * 0.35;
    state.camera.position.x += (pointer.x * 0.45 - state.camera.position.x) * 0.018;
    state.camera.position.y += (pointer.y * 0.25 - state.camera.position.y) * 0.018;
    state.camera.lookAt(0, 0, 0);
  });

  const paths: [number, number, number][][] = [
    [[0, 0, 0], [2.1, 1.1, -0.4], [3.5, 0.7, -1]],
    [[0, 0, 0], [-2, 1.4, 0.3], [-3.4, 0.8, -0.5]],
    [[0, 0, 0], [2.5, -1.5, 0.2], [3.7, -1.2, -1]],
    [[0, 0, 0], [-2.3, -1.4, -0.4], [-3.6, -0.8, -1]],
  ];

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.45}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.35, 0]} />
          <MeshTransmissionMaterial
            color="#092f3a"
            thickness={0.4}
            roughness={0.12}
            transmission={0.92}
            chromaticAberration={0.08}
            anisotropy={0.4}
          />
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
      </Float>
      {paths.map((points, index) => (
        <group key={index}>
          <Line points={points} color={index % 2 ? "#ffb86b" : "#38e8ff"} lineWidth={0.7} transparent opacity={0.32} />
          <mesh position={points[2]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={index % 2 ? "#ffb86b" : "#38e8ff"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 46 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 4]} color="#38e8ff" intensity={22} />
      <pointLight position={[-3, -2, 2]} color="#ff9b55" intensity={12} />
      <Stars radius={50} depth={25} count={900} factor={1.8} saturation={0} fade speed={0.5} />
      <Sparkles count={70} scale={[9, 6, 5]} size={1.5} speed={0.28} color="#7deeff" opacity={0.5} />
      <ServerCore />
    </Canvas>
  );
}