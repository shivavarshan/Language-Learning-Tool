import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';

const Character = () => {
    const ref = React.useRef();

    // Animation loop to make the character bob up and down
    useFrame(({ clock }) => {
        ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.5;
    });

    return (
        <mesh ref={ref} position={[0, 1, 0]} onClick={() => alert("Hello! Let's learn together!")}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'#007BFF'} />
        </mesh>
    );
};

const CharacterCanvas = () => (
    <Canvas style={{ height: '300px', margin: '20px auto' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Character />
    </Canvas>
);

export default CharacterCanvas;
