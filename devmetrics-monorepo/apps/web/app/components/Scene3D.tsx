"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  ContactShadows, 
  Icosahedron, 
  Sphere,
  Box,
  Torus,
  Lightformer
} from "@react-three/drei";
import * as THREE from "three";

// ─── Engineering Theme Materials ──────────────────────────────────────

const materials = {
  metallic: new THREE.MeshStandardMaterial({
    color: "#888888",
    roughness: 0.1,
    metalness: 0.9,
  }),
  obsidian: new THREE.MeshStandardMaterial({
    color: "#050505",
    roughness: 0.8,
    metalness: 0.2,
  }),
  wireframe: new THREE.MeshBasicMaterial({
    color: "#444444",
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  }),
  crystal: new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9, // glass-like
    ior: 1.5,
    thickness: 0.5,
  })
};

// ─── Scene Objects ──────────────────────────────────────────────────

function SceneObjects() {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax
  useFrame((state) => {
    // Subtle mouse tracking
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // slow continuous rotation
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 2, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 2, 0.05);
    }
    
    // Camera drift
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 0.5, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 0.5, 0.02);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Metallic Sphere */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 32, 32]} position={[-2.5, 1, -2]}>
          <primitive object={materials.metallic} attach="material" />
        </Sphere>
      </Float>

      {/* Glass Sphere */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[1.2, 32, 32]} position={[2, -1, 1]}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#ffffff"
          />
        </Sphere>
      </Float>

      {/* Matte Obsidian Sphere */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.8}>
        <Sphere args={[1.5, 32, 32]} position={[0, -2.5, -4]}>
          <primitive object={materials.obsidian} attach="material" />
        </Sphere>
      </Float>

      {/* Crystal Object (Icosahedron) */}
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.2}>
        <Icosahedron args={[0.8, 0]} position={[-2, -1.5, 2]}>
          <primitive object={materials.crystal} attach="material" />
        </Icosahedron>
      </Float>

      {/* Engineering-inspired form (Wireframe Box) */}
      <Float speed={0.5} rotationIntensity={2} floatIntensity={0.5}>
        <Box args={[1.5, 1.5, 1.5]} position={[2.5, 1.5, -3]}>
          <primitive object={materials.wireframe} attach="material" />
        </Box>
      </Float>

      {/* Engineering-inspired form (Torus/Ring) */}
      <Float speed={0.7} rotationIntensity={1} floatIntensity={0.5}>
        <Torus args={[2, 0.05, 16, 64]} position={[0, 0, -2]} rotation={[Math.PI / 3, 0, 0]}>
          <primitive object={materials.metallic} attach="material" />
        </Torus>
      </Float>
    </group>
  );
}

// ─── Environment & Lighting ─────────────────────────────────────────

function SceneLighting() {
  return (
    <>
      {/* Ambient and base directional lights */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <spotLight position={[-10, 10, -10]} intensity={2} angle={0.3} penumbra={1} color="#4488ff" />
      <spotLight position={[10, -10, 10]} intensity={1} angle={0.3} penumbra={1} color="#ff4488" />

      {/* Soft Reflections / Environment mapping */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
          <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
          <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
        </group>
      </Environment>

      {/* Ambient Shadows (Contact Shadows below the objects) */}
      <ContactShadows 
        position={[0, -4, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />
    </>
  );
}


// ─── Main Component ─────────────────────────────────────────────────

export default function Scene3D({ 
  className = "", 
  style = {} 
}: { 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return (
    <div className={`absolute inset-0 pointer-events-auto ${className}`} style={{ ...style, zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        dpr={[1, 1.5]} // Limit DPR to 1.5 for performance (60fps target)
        gl={{ antialias: true }} 
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 5, 20]} /> {/* Depth fog */}
        
        <SceneLighting />
        <SceneObjects />
      </Canvas>
    </div>
  );
}
