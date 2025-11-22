import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Scene Setup ---
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x050505); // Let CSS handle background
scene.fog = new THREE.FogExp2(0x050505, 0.05);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00f2ff, 2);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xbd00ff, 5);
pointLight.position.set(-5, -5, 5);
scene.add(pointLight);

// --- Objects (Procedural Parts) ---

// Group to hold everything
const computerGroup = new THREE.Group();
scene.add(computerGroup);

// 1. Motherboard Base
const boardGeometry = new THREE.BoxGeometry(4, 0.2, 4);
const boardMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, 
    roughness: 0.7,
    metalness: 0.5 
});
const motherboard = new THREE.Mesh(boardGeometry, boardMaterial);
motherboard.position.y = -0.5;
computerGroup.add(motherboard);

// Circuit lines (Texture simulation via simple geometry for now)
// Ideally use textures, but keeping it procedural for simplicity

// 2. CPU
const cpuGroup = new THREE.Group();
const cpuBaseGeo = new THREE.BoxGeometry(1, 0.1, 1);
const cpuBaseMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cpuBase = new THREE.Mesh(cpuBaseGeo, cpuBaseMat);

const cpuTopGeo = new THREE.BoxGeometry(0.8, 0.05, 0.8);
const cpuTopMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1, roughness: 0.2 });
const cpuTop = new THREE.Mesh(cpuTopGeo, cpuTopMat);
cpuTop.position.y = 0.075;

cpuGroup.add(cpuBase, cpuTop);
cpuGroup.position.set(0, 0.1, 0);
computerGroup.add(cpuGroup);

// 3. GPU
const gpuGroup = new THREE.Group();
const gpuBoardGeo = new THREE.BoxGeometry(3, 0.1, 1.5);
const gpuBoardMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const gpuBoard = new THREE.Mesh(gpuBoardGeo, gpuBoardMat);

const gpuFansGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
const gpuFanMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const fan1 = new THREE.Mesh(gpuFansGeo, gpuFanMat);
fan1.rotation.x = Math.PI / 2;
fan1.position.set(-0.8, 0.1, 0);
const fan2 = fan1.clone();
fan2.position.set(0.8, 0.1, 0);

gpuGroup.add(gpuBoard, fan1, fan2);
gpuGroup.position.set(0, 0.5, 1.5);
gpuGroup.rotation.x = -Math.PI / 2; // Plugged in vertically
gpuGroup.rotation.z = Math.PI / 2;
computerGroup.add(gpuGroup);

// 4. RAM
const ramGroup = new THREE.Group();
const ramStickGeo = new THREE.BoxGeometry(2, 0.5, 0.1);
const ramStickMat = new THREE.MeshStandardMaterial({ color: 0xbd00ff, emissive: 0x220044 });

const ram1 = new THREE.Mesh(ramStickGeo, ramStickMat);
ram1.position.set(0, 0.25, -1);
const ram2 = ram1.clone();
ram2.position.set(0, 0.25, -1.2);

ramGroup.add(ram1, ram2);
computerGroup.add(ramGroup);


// --- Animations ---

// Initial State
computerGroup.rotation.x = 0.5;
computerGroup.rotation.y = 0.5;

// ScrollTrigger Animations

// 1. CPU Focus
gsap.to(camera.position, {
    scrollTrigger: {
        trigger: "#cpu-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: 0,
    y: 2,
    z: 3,
});

gsap.to(computerGroup.rotation, {
    scrollTrigger: {
        trigger: "#cpu-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: 0.2,
    y: Math.PI * 0.25,
});

// Explode CPU slightly
gsap.to(cpuTop.position, {
    scrollTrigger: {
        trigger: "#cpu-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    y: 0.5, // Lift the IHS
});


// 2. GPU Focus
gsap.to(camera.position, {
    scrollTrigger: {
        trigger: "#gpu-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: -3,
    y: 1,
    z: 3,
});

gsap.to(computerGroup.rotation, {
    scrollTrigger: {
        trigger: "#gpu-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: 0,
    y: Math.PI * 0.8, // Rotate to see GPU
});

// Spin GPU Fans
gsap.to([fan1.rotation, fan2.rotation], {
    scrollTrigger: {
        trigger: "#gpu-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.1,
    },
    z: Math.PI * 10, // Spin
});


// 3. RAM Focus
gsap.to(camera.position, {
    scrollTrigger: {
        trigger: "#ram-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: 2,
    y: 1,
    z: 2,
});

gsap.to(computerGroup.rotation, {
    scrollTrigger: {
        trigger: "#ram-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    x: 0.5,
    y: -Math.PI * 0.2,
});

// Lift RAM sticks
gsap.to([ram1.position, ram2.position], {
    scrollTrigger: {
        trigger: "#ram-section",
        start: "top bottom",
        end: "center center",
        scrub: 1,
    },
    y: 1,
    stagger: 0.1
});


// Reveal Text Content
const sections = document.querySelectorAll('.content');
sections.forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.5
    });
});


// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Idle animation
    // computerGroup.rotation.y += 0.001;

    renderer.render(scene, camera);
}
animate();
