import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

export default function Minimal3DTest() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
}
