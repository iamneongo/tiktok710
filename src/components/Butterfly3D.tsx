import React, { useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Clone } from '@react-three/drei';
import * as THREE from 'three';

function ButterflyModel({ 
  timeOffset = 0, 
  speed = 1, 
  scale = 8, 
  flyRadius = 1, 
  yOffset = 0,
  rotationOffset = [0, Math.PI, 0] // Default to 180 deg to fix backward flight
}: { 
  timeOffset?: number; 
  speed?: number; 
  scale?: number; 
  flyRadius?: number; 
  yOffset?: number;
  rotationOffset?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/butterfly.glb');
  
  const { actions, names } = useAnimations(animations, group);
  
  // Prefer 'Flying' animation, otherwise fallback
  useEffect(() => {
    if (names.length > 0) {
      const flyAnim = names.find((name) => name.toLowerCase().includes('fly')) || names[0];
      const action = actions[flyAnim];
      if (action) {
        // Randomize start time so they don't flap in sync
        action.time = Math.random() * action.getClip().duration;
        action.timeScale = 1.2 * speed;
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names, speed]);

  const { viewport, pointer } = useThree();
  const timeRef = useRef(Math.random() * 1000 + timeOffset);
  const stateRef = useRef<'flying' | 'hovering'>('flying');
  const hoverTimerRef = useRef(0);
  const positionRef = useRef(new THREE.Vector3(0, 0, 0));
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getPathPos = (t: number) => {
    const w = (viewport.width / 2) * flyRadius;
    const h = (viewport.height / 2) * flyRadius;
    
    // Organic flight path
    const x = Math.sin(t * 0.4) * w * 0.85 + Math.cos(t * 0.7) * w * 0.15;
    const y = Math.cos(t * 0.5) * h * 0.7 + Math.sin(t * 0.9) * h * 0.2 + yOffset;
    const z = Math.sin(t * 0.6) * 3;
    
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (group.current) {
      const startPos = getPathPos(timeRef.current);
      group.current.position.copy(startPos);
      positionRef.current.copy(startPos);
    }
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (prefersReducedMotion) {
      group.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005;
      return;
    }

    const dt = Math.min(delta, 0.1);

    if (stateRef.current === 'flying') {
      timeRef.current += dt * 0.35 * speed; 
      
      if (Math.random() < 0.003) {
        stateRef.current = 'hovering';
        hoverTimerRef.current = 1.0 + Math.random() * 2; 
      }
    } else {
      hoverTimerRef.current -= dt;
      timeRef.current += dt * 0.05 * speed; 
      
      if (hoverTimerRef.current <= 0) {
        stateRef.current = 'flying';
      }
    }

    const targetPos = getPathPos(timeRef.current);
    
    const mousePos = new THREE.Vector3(
      pointer.x * viewport.width / 2,
      pointer.y * viewport.height / 2,
      0
    );
    
    const distToMouse = targetPos.distanceTo(mousePos);
    if (distToMouse < 4) {
      const pushDir = targetPos.clone().sub(mousePos).normalize();
      targetPos.add(pushDir.multiplyScalar((4 - distToMouse) * 0.5));
    }

    const lerpSpeed = stateRef.current === 'hovering' ? 1.0 : 2.5;
    positionRef.current.lerp(targetPos, dt * lerpSpeed);
    
    const velocity = positionRef.current.clone().sub(group.current.position);
    group.current.position.copy(positionRef.current);

    if (velocity.lengthSq() > 0.0001) {
      const targetRotation = new THREE.Matrix4();
      const up = new THREE.Vector3(0, 1, 0);
      
      up.x = -velocity.x * 2.5;
      up.z = velocity.y * 1.5;
      up.normalize();

      const lookAtPos = group.current.position.clone().add(velocity.normalize());
      targetRotation.lookAt(group.current.position, lookAtPos, up);
      
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotation);
      group.current.quaternion.slerp(targetQuat, dt * 4);
    }
  });

  return (
    <group ref={group} scale={scale}>
      {/* 
        Use Clone instead of primitive so we can render multiple instances 
        safely sharing the same geometry/materials but with unique skeletons.
        Also apply rotationOffset to fix backward flying.
      */}
      <Clone object={scene} rotation={rotationOffset} deep={true} />
    </group>
  );
}

try {
  useGLTF.preload('/models/butterfly.glb');
} catch (e) {
  console.warn('Butterfly model not found at /models/butterfly.glb yet.');
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const Butterfly3D = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none" 
      aria-hidden="true"
    >
      <Canvas
        style={{ pointerEvents: 'none' }}
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} 
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <ErrorBoundary>
          <Suspense fallback={null}>
            {/* 3 Butterflies restricted to fly tightly around the bouquet (center-bottom) */}
            <ButterflyModel 
              timeOffset={0} 
              scale={8} 
              speed={1.0} 
              flyRadius={0.35} 
              yOffset={-1.5} 
            />
            <ButterflyModel 
              timeOffset={200} 
              scale={6} 
              speed={1.2} 
              flyRadius={0.25} 
              yOffset={-0.5} 
            />
            <ButterflyModel 
              timeOffset={500} 
              scale={5} 
              speed={0.85} 
              flyRadius={0.4} 
              yOffset={-2.0} 
            />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  );
};

export default React.memo(Butterfly3D);
