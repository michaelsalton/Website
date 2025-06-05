'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

interface ModelViewerProps {
  modelPath: string;
}

export default function ModelViewer({ modelPath }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    setLoading(true);
    setError(null);

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 40);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000);
    containerRef.current.appendChild(renderer.domElement);

    // Load the model
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = isProd ? '/website-2' : '';
    console.log('Attempting to load model from:', modelPath);
    
    // Load the model
    const fbxLoader = new FBXLoader();
    // Use the correct path based on environment
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
        
        // Get model size
        const size = box.getSize(new THREE.Vector3());
        console.log('Model size:', size);
        
        // Scale the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.020; // Back to working scale
        fbx.scale.setScalar(scale);
        
        // Position the model
        fbx.position.set(-25, -0.15, 1);
        
        // Rotate the model counter-clockwise by 65 degrees
        fbx.rotation.y = THREE.MathUtils.degToRad(200);
        fbx.rotation.x = THREE.MathUtils.degToRad(-3);
        fbx.rotation.z = THREE.MathUtils.degToRad(2.2);
        
        // Enable shadows for all meshes
        fbx.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              // Create new material with different properties
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
        
        // Add solid light grey plane
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x000000,
          roughness: 0.8,
          metalness: 0.2
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.15;
        plane.receiveShadow = true;
        scene.add(plane);
        
        // Add flickering light inside the building
        const flickerLight = new THREE.PointLight(0xffa500, 5.0);
        flickerLight.position.set(-20, 3, 5);
        flickerLight.castShadow = true;
        flickerLight.shadow.mapSize.width = 1024;
        flickerLight.shadow.mapSize.height = 1024;
        flickerLight.shadow.camera.near = 0.5;
        flickerLight.shadow.camera.far = 50;
        scene.add(flickerLight);

        // Add subtle front-facing light
        const frontLight = new THREE.PointLight(0xffffff, 25);
        frontLight.position.set(0, 10, 45); // Position near camera
        frontLight.castShadow = true;
        frontLight.shadow.mapSize.width = 1024;
        frontLight.shadow.mapSize.height = 1024;
        frontLight.shadow.camera.near = 0.5;
        frontLight.shadow.camera.far = 50;
        scene.add(frontLight);

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
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          // Tighter spread of initial positions
          positions[i3] = (Math.random() - 0.5) * 2;
          positions[i3 + 1] = Math.random() * 1;
          positions[i3 + 2] = (Math.random() - 0.5) * 2;

          // Fire colors (orange to yellow)
          colors[i3] = 1.0;     // R
          colors[i3 + 1] = 0.3 + Math.random() * 0.4; // G
          colors[i3 + 2] = 0.0; // B

          sizes[i] = 0.05 + Math.random() * 0.1;
          lifetimes[i] = 0;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.set(-20, 3, 5);
        scene.add(particleSystem);
        
        let lastTime = Date.now();
        let particleTimer = 0;
        
        // Set up animation
        const animate = () => {
          requestAnimationFrame(animate);
          
          const currentTime = Date.now();
          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;
          
          // Update fire particles
          const positions = particles.attributes.position.array;
          const colors = particles.attributes.color.array;
          
          // Only spawn new particles every 0.2 seconds
          particleTimer += deltaTime;
          if (particleTimer > 0.2) {
            particleTimer = 0;
          }
          
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Update lifetime
            lifetimes[i] += deltaTime;
            
            // Only move particles that are "alive"
            if (lifetimes[i] < 1.0) { // Particles live for 1 second
              // More controlled upward movement
              positions[i3 + 1] += deltaTime * (0.3 + Math.random() * 0.4);
              
              // Reduced horizontal movement
              positions[i3] += (Math.random() - 0.5) * 0.05;
              positions[i3 + 2] += (Math.random() - 0.5) * 0.05;
              
              // Fade out based on lifetime
              const lifeRatio = 1 - (lifetimes[i] / 1.0);
              colors[i3 + 1] = Math.max(0.1, 0.3 * lifeRatio);
            } else {
              // Reset particle if it's too old or too high
              if (particleTimer < 0.1) { // Only reset on first half of spawn interval
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
          
          // Create flickering effect
          const time = currentTime * 0.001;
          const flickerIntensity = 3.0 + Math.sin(time * 15) * 0.5 + Math.sin(time * 7) * 0.2;
          const flickerPosition = Math.sin(time * 8) * 0.15;
          
          flickerLight.intensity = Math.max(1.0, flickerIntensity);
          flickerLight.position.y = 3 + flickerPosition;
          
          // Just render the scene without rotating
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Set loading to false after everything is set up
        setLoading(false);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load model: ' + (error instanceof Error ? error.message : String(error)));
        setLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  return (
    <div className="w-full h-full bg-white">
      <div ref={containerRef} className="w-full h-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 text-black text-lg">
            Loading model...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 z-20 text-white text-lg p-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 