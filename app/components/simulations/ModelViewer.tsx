'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useTheme } from '../../context/ThemeContext';

interface ModelViewerProps {
  modelPath: string;
}

export default function ModelViewer({ modelPath }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [fbx, setFbx] = useState<THREE.Group | null>(null);
  const [particles, setParticles] = useState<THREE.BufferGeometry | null>(null);
  const [particleLifetimes, setParticleLifetimes] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState(0);
  const [particleTimer, setParticleTimer] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    setError(null);

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'dark' ? 0x000000 : 0x87CEEB); // Black for dark mode, Sky blue for light mode

    // Add solid light grey plane
    const planeGeometry = new THREE.PlaneGeometry(250, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.2
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    plane.receiveShadow = true;
    scene.add(plane);

    // Add lights
    const flickerLight = new THREE.PointLight(0xffa500, 30.0);
    flickerLight.position.set(7, 1, 6);
    flickerLight.castShadow = true;
    flickerLight.shadow.mapSize.width = 2048;
    flickerLight.shadow.mapSize.height = 2048;
    flickerLight.shadow.camera.near = 0.5;
    flickerLight.shadow.camera.far = 50;
    flickerLight.shadow.bias = -0.0001;
    scene.add(flickerLight);

    // Add ambient light for day mode
    if (theme === 'light') {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced ambient light intensity
      scene.add(ambientLight);

      // Add directional light for day mode
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(0, 10, 20); // Position in front and above the model
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.bias = -0.0001;
      scene.add(directionalLight);
    }

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 40);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(0x000000);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);

    // Load the model
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = '';
    console.log('Attempting to load model from:', modelPath);
    
    // Load the model
    const fbxLoader = new FBXLoader();
    const modelUrl = `${basePath}${modelPath}`;
    console.log('Loading model from URL:', modelUrl);
    
    fbxLoader.load(
      modelUrl,
      (fbx) => {
        console.log('Model loaded successfully');
        
        // Center the model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);
        
        // Scale the model if needed
        const size = box.getSize(new THREE.Vector3());
        //const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.025;
        fbx.scale.multiplyScalar(scale);
        
        // Position the model
        fbx.position.set(0, -0.5, 0); // Center position
        
        // Rotate the model
        fbx.rotation.y = THREE.MathUtils.degToRad(178);
        fbx.rotation.x = THREE.MathUtils.degToRad(0);
        fbx.rotation.z = THREE.MathUtils.degToRad(1);
        
        // Enable shadows for all meshes
        fbx.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const newMaterial = new THREE.MeshPhongMaterial({
                map: child.material.map,
                shininess: 0,
                specular: 0x000000,
                flatShading: false
              });
              child.material = newMaterial;
              child.material.needsUpdate = true;
            }
          }
        });
        
        // Add the model to the scene
        scene.add(fbx);
        
        // Add flickering light
        const flickerLight = new THREE.PointLight(0xff7700, 50.0, 12); // Increased intensity and range
        flickerLight.position.set(7, 3, 6);
        flickerLight.castShadow = true;
        flickerLight.shadow.mapSize.width = 2048;
        flickerLight.shadow.mapSize.height = 2048;
        flickerLight.shadow.camera.near = 0.5;
        flickerLight.shadow.camera.far = 20;
        flickerLight.shadow.bias = -0.0001;
        flickerLight.shadow.radius = 3;
        scene.add(flickerLight);

        // Create fire particles
        const particleCount = 15;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const lifetimes = new Float32Array(particleCount);

        // Create particle material
        const particleMaterial = new THREE.PointsMaterial({
          size: 0.15,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] = (Math.random() - 0.5) * 1.5;
          positions[i3 + 1] = Math.random() * 0.8;
          positions[i3 + 2] = (Math.random() - 0.5) * 1.5;

          colors[i3] = 1.0;
          colors[i3 + 1] = 0.3 + Math.random() * 0.4;
          colors[i3 + 2] = 0.0;

          sizes[i] = 0.05 + Math.random() * 0.1;
          lifetimes[i] = Math.random() * 3.0;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.set(7, 1, 6);
        scene.add(particleSystem);
        
        let lastTime = Date.now();
        let particleTimer = 0;
        
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          const currentTime = Date.now();
          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;
          
          const positions = particles.attributes.position.array;
          const colors = particles.attributes.color.array;
          
          particleTimer += deltaTime;
          
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            lifetimes[i] += deltaTime;

            if (lifetimes[i] < 3.0) {
              positions[i3 + 1] += deltaTime * (1.2 + Math.random() * 0.8);
              positions[i3] += (Math.random() - 0.5) * 0.05;
              positions[i3 + 2] += (Math.random() - 0.5) * 0.05;
              
              const lifeRatio = 1 - (lifetimes[i] / 3.0);
              colors[i3 + 1] = Math.max(0.1, 0.3 * lifeRatio);
            } else {
              if (Math.random() < 0.1) {
                positions[i3] = (Math.random() - 0.5) * 2;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = (Math.random() - 0.5) * 2;
                lifetimes[i] = 0;
                colors[i3 + 1] = 0.3 + Math.random() * 0.4;
              }
            }
          }

          particles.attributes.position.needsUpdate = true;
          particles.attributes.color.needsUpdate = true;
          
          const time = currentTime * 0.001;
          
          // More complex flickering pattern with noise
          const baseIntensity = 50.0; // Increased base intensity
          
          // Multiple noise layers for more natural variation
          const noise1 = Math.sin(time * 15 + Math.sin(time * 5) * 2) * 8.0;
          const noise2 = Math.sin(time * 7 + Math.cos(time * 3) * 2) * 4.0;
          const noise3 = Math.sin(time * 23 + Math.sin(time * 11) * 2) * 2.0;
          const randomNoise = (Math.random() - 0.5) * 4.0;
          
          // Add some random movement to the light position
          const posX = Math.sin(time * 2 + Math.random() * 0.5) * 0.15;
          const posY = Math.sin(time * 8 + Math.random() * 0.5) * 0.2;
          const posZ = Math.cos(time * 3 + Math.random() * 0.5) * 0.15;
          
          // Combine all noise components
          const flickerIntensity = baseIntensity + noise1 + noise2 + noise3 + randomNoise;
          
          // Add some random spikes in intensity
          const spikeChance = Math.random();
          const intensitySpike = spikeChance > 0.95 ? 20.0 : 0.0;
          
          flickerLight.intensity = Math.max(20.0, flickerIntensity + intensitySpike);
          flickerLight.position.set(7 + posX, 3 + posY, 6 + posZ);

          renderer.render(scene, camera);
        };
        
        animate();
        setSceneReady(true);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load model');
      }
    );

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, theme]);



  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      )}
    </div>
  );
} 