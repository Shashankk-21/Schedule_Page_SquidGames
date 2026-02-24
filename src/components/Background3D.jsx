import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Torus, Tetrahedron, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const FloatingShape = ({ type, position, color, scale = 1, rotationSpeed = 0.5 }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.5;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      {type === 'circle' && (
        <Torus ref={meshRef} args={[1, 0.2, 16, 32]} scale={scale}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </Torus>
      )}
      {type === 'triangle' && (
        <Tetrahedron ref={meshRef} args={[1.2]} scale={scale}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </Tetrahedron>
      )}
      {type === 'square' && (
        <Box ref={meshRef} args={[1.5, 1.5, 1.5]} scale={scale}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </Box>
      )}
    </Float>
  );
};

const GridFloor = () => {
  return (
    <gridHelper
      args={[60, 60, 0x249f9c, 0x333333]}
      position={[0, -5, 0]}
    />
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      <ambientLight intensity={1} />

      {/* Visible Floor Grid */}
      <GridFloor />

      {/* Floating Iconic Shapes - BRIGHT & VISIBLE */}
      <FloatingShape type="circle" position={[-5, 2, 8]} color="#ed1b76" scale={0.8} />
      <FloatingShape type="triangle" position={[6, -3, 5]} color="#249f9c" scale={1.0} />
      <FloatingShape type="square" position={[0, 5, 2]} color="#ffffff" scale={0.6} />

      <FloatingShape type="triangle" position={[-7, -4, -2]} color="#ed1b76" scale={1.5} />
      <FloatingShape type="circle" position={[8, 6, -5]} color="#249f9c" scale={0.8} />

      {/* Massive Starfield */}
      <Stars radius={50} depth={50} count={6000} factor={6} saturation={0} fade speed={1} />

      {/* Post Processing - Bloom for the neon glow */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} radius={0.8} />
      </EffectComposer>
    </>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-squid-black">
      <Canvas gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 20, 60]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Background3D;
