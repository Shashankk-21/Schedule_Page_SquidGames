import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(68, W / H, 0.1, 300);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    let mx = 0, my = 0;

    // ── PINK TUNNEL / CORRIDOR ──────────────────────
    const tunnelGrp = new THREE.Group();
    tunnelGrp.position.z = -40;

    // Rectangular neon doorframes receding into distance
    const FRAMES = 14;
    for (let i = 0; i < FRAMES; i++) {
      const z   = -i * 9;
      const scl = 1 + i * 0.22;
      const w   = 6 * scl, h = 9 * scl;
      const opacityPink = Math.max(0.04, 0.32 - i * 0.024);
      const opacityTeal = Math.max(0.02, 0.15 - i * 0.012);

      // Pink frame lines
      const pinkMat = new THREE.LineBasicMaterial({ color: 0xff0050, transparent: true, opacity: opacityPink });
      const pts = [
        new THREE.Vector3(-w/2,  h/2, z),
        new THREE.Vector3( w/2,  h/2, z),
        new THREE.Vector3( w/2, -h/2, z),
        new THREE.Vector3(-w/2, -h/2, z),
        new THREE.Vector3(-w/2,  h/2, z),
      ];
      const fGeo = new THREE.BufferGeometry().setFromPoints(pts);
      tunnelGrp.add(new THREE.Line(fGeo, pinkMat));

      // Teal inner frame
      if (i % 3 === 0) {
        const tMat = new THREE.LineBasicMaterial({ color: 0x00fff0, transparent: true, opacity: opacityTeal });
        const tw = w * 0.78, th = h * 0.78;
        const tpts = [
          new THREE.Vector3(-tw/2, th/2, z), new THREE.Vector3( tw/2, th/2, z),
          new THREE.Vector3( tw/2,-th/2, z), new THREE.Vector3(-tw/2,-th/2, z),
          new THREE.Vector3(-tw/2, th/2, z),
        ];
        tunnelGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tpts), tMat));
      }

      // Connecting lines (corridor edges)
      if (i < FRAMES - 1) {
        const nscl = 1 + (i+1) * 0.22;
        const nw = 6 * nscl, nh = 9 * nscl;
        const nz = -(i+1) * 9;
        const edgeMat = new THREE.LineBasicMaterial({ color: 0xff0050, transparent: true, opacity: opacityPink * 0.45 });
        const edgePairs = [
          [[-w/2,h/2,z],[-nw/2,nh/2,nz]],
          [[w/2,h/2,z],[nw/2,nh/2,nz]],
          [[w/2,-h/2,z],[nw/2,-nh/2,nz]],
          [[-w/2,-h/2,z],[-nw/2,-nh/2,nz]],
        ];
        edgePairs.forEach(([a,b]) => {
          const ePts = [new THREE.Vector3(...a), new THREE.Vector3(...b)];
          tunnelGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ePts), edgeMat));
        });
      }
    }
    scene.add(tunnelGrp);

    // ── VERTICAL NEON BARS (stage lighting) ─────────
    const barGrp = new THREE.Group();
    const barDefs = [
      { x: -14, color: 0xff0050, op: 0.22, h: 30 },
      { x: -11, color: 0xe91e8c, op: 0.14, h: 24 },
      { x:  11, color: 0x00fff0, op: 0.18, h: 26 },
      { x:  14, color: 0xff0050, op: 0.22, h: 30 },
      { x:  -7, color: 0xff0050, op: 0.08, h: 18 },
      { x:   7, color: 0x00fff0, op: 0.08, h: 18 },
    ];
    barDefs.forEach(({ x, color, op, h }) => {
      const geo = new THREE.PlaneGeometry(0.08, h);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0, -8);
      barGrp.add(mesh);

      // Glow layer
      const gGeo = new THREE.PlaneGeometry(0.35, h);
      const gMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op * 0.25 });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      gMesh.position.set(x, 0, -8.1);
      barGrp.add(gMesh);
    });
    scene.add(barGrp);

    // ── CONFETTI / PETAL PARTICLES ───────────────────
    const PETALS = 600;
    const pPositions = new Float32Array(PETALS * 3);
    const pVelocities = [];
    const pColors = new Float32Array(PETALS * 3);

    const PALETTE = [
      [1,0,0.31],    // pink
      [0,1,0.94],    // teal
      [1,0.65,0.13], // amber
      [0.91,0.12,0.55], // magenta
      [1,1,1],       // white
    ];

    for (let i = 0; i < PETALS; i++) {
      pPositions[i*3]   = (Math.random()-.5) * 48;
      pPositions[i*3+1] = (Math.random()-.5) * 36 + 24; // start above
      pPositions[i*3+2] = (Math.random()-.5) * 16 - 4;

      pVelocities.push({
        x: (Math.random()-.5) * 0.022,
        y: -(0.018 + Math.random() * 0.035),
        z: 0,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.025,
      });

      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      pColors[i*3] = col[0]; pColors[i*3+1] = col[1]; pColors[i*3+2] = col[2];
    }

    const petalGeo = new THREE.BufferGeometry();
    petalGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    petalGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    const petalMat = new THREE.PointsMaterial({
      size: 0.072, vertexColors: true, transparent: true, opacity: 0.75,
    });
    const petals = new THREE.Points(petalGeo, petalMat);
    scene.add(petals);

    // ── FLOATING WIREFRAME SHAPES ────────────────────
    const floaters = [];
    const makeWire = (geo, color, op, pos) => {
      const edges = new THREE.EdgesGeometry(geo);
      const mat   = new THREE.LineBasicMaterial({ color, transparent: true, opacity: op });
      const mesh  = new THREE.LineSegments(edges, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      floaters.push({
        mesh,
        rv: [(Math.random()-.5)*0.008, (Math.random()-.5)*0.008, (Math.random()-.5)*0.004],
        phase: Math.random()*Math.PI*2, speed: 0.008+Math.random()*0.01, amp: 0.002+Math.random()*0.006,
      });
    };

    // Big guard-area shapes
    makeWire(new THREE.TorusGeometry(7,0.06,8,100),   0xff0050, 0.22, [-18, 5,-25]);
    makeWire(new THREE.TetrahedronGeometry(6,0),       0x00fff0, 0.22, [ 18,-6,-22]);
    makeWire(new THREE.BoxGeometry(9,9,0.12),          0xff0050, 0.13, [  2,-16,-30]);
    makeWire(new THREE.TorusGeometry(4.5,0.05,8,80),  0xe91e8c, 0.18, [ 16,12,-18]);
    makeWire(new THREE.TetrahedronGeometry(3.5,0),     0xf5a623, 0.2,  [-16,-9,-16]);

    // Small scattered shapes
    [[0xff0050],[0x00fff0],[0xf5a623],[0xe91e8c]].forEach(([col], ci) => {
      for(let i=0;i<5;i++){
        const pos = [(Math.random()-.5)*44,(Math.random()-.5)*30,-4-Math.random()*18];
        const type = (ci+i)%3;
        const geo = type===0
          ? new THREE.TorusGeometry(0.6+Math.random()*1.2,0.05,6,60)
          : type===1
          ? new THREE.TetrahedronGeometry(0.7+Math.random()*1.1,0)
          : new THREE.BoxGeometry(1.2+Math.random()*1.4,1.2+Math.random()*1.4,0.1);
        makeWire(geo, col, 0.1+Math.random()*0.18, pos);
      }
    });

    // ── GROUND FLOOR GRID ────────────────────────────
    const gridGrp = new THREE.Group();
    const gridMat = new THREE.LineBasicMaterial({ color: 0xff0050, transparent: true, opacity: 0.05 });
    for (let x = -20; x <= 20; x += 2.5) {
      const pts = [new THREE.Vector3(x,-12,-10), new THREE.Vector3(x,-12,-80)];
      gridGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat.clone()));
    }
    for (let z = -10; z >= -80; z -= 3.5) {
      const pts = [new THREE.Vector3(-20,-12,z), new THREE.Vector3(20,-12,z)];
      gridGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat.clone()));
    }
    scene.add(gridGrp);

    // ── MOUSE ────────────────────────────────────────
    const onMouse = (e) => {
      mx = (e.clientX/window.innerWidth  - 0.5) * 2;
      my = -(e.clientY/window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ── ANIMATION LOOP ───────────────────────────────
    let raf;
    const pos = petalGeo.attributes.position;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Tunnel slow push
      tunnelGrp.position.z = -40 + ((t * 0.5) % 9);

      // Bar flicker
      barGrp.children.forEach((b, bi) => {
        const f = 0.7 + 0.3 * Math.sin(t * 1.8 + bi * 0.7);
        b.material.opacity *= 0.92; b.material.opacity += (b.material.opacity + f * 0.02) * 0.08;
      });

      // Petals fall & wobble
      for (let i = 0; i < PETALS; i++) {
        const v = pVelocities[i];
        v.wobble += v.wobbleSpeed;
        pos.array[i*3]   += v.x + Math.sin(v.wobble) * 0.012;
        pos.array[i*3+1] += v.y;
        pos.array[i*3+2] += v.z;
        // Reset when below floor
        if (pos.array[i*3+1] < -20) {
          pos.array[i*3]   = (Math.random()-.5)*48;
          pos.array[i*3+1] = 24 + Math.random()*8;
          pos.array[i*3+2] = (Math.random()-.5)*16-4;
        }
      }
      pos.needsUpdate = true;

      // Floaters
      floaters.forEach(f => {
        f.mesh.rotation.x += f.rv[0];
        f.mesh.rotation.y += f.rv[1];
        f.mesh.rotation.z += f.rv[2];
        f.phase += f.speed;
        f.mesh.position.y += Math.sin(f.phase) * f.amp;
      });

      // Parallax
      camera.position.x += (mx * 2.4 - camera.position.x) * 0.022;
      camera.position.y += (my * 1.4 - camera.position.y) * 0.022;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    // ── RESIZE ───────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
    }} />
  );
}
