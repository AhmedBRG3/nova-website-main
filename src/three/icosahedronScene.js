// ─────────────────────────────────────────
//  initIcosahedronScene
//  The NOVA 3D motif — icosahedron + wireframe
//  shell, 3 orbital rings, additive glow sprite,
//  dual particle fields, fog depth, mouse-driven
//  camera drift and spotlight. Originally built
//  for <Hero />, extracted here so any section
//  can mount the same scene on its own canvas.
// ─────────────────────────────────────────
export default function initIcosahedronScene(canvas) {
  const THREE = window.THREE;
  if (!THREE) return { setRunning: () => {}, cleanup: () => {} };

  const isMobile = window.matchMedia('(max-width:768px)').matches;
  const getSize = () => ({
    w: canvas.parentElement?.clientWidth || window.innerWidth,
    h: canvas.parentElement?.clientHeight || window.innerHeight,
  });

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  let { w, h } = getSize();
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0A0808, 0.055);
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 0, 5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.28));
  const spot = new THREE.PointLight(0xec2027, 3.4, 22); spot.position.set(2, 3, 4); scene.add(spot);
  const fill = new THREE.PointLight(0xff6b4a, 1.6, 16); fill.position.set(-3, -2, 2); scene.add(fill);
  const rim = new THREE.PointLight(0xffffff, 0.5, 14); rim.position.set(0, 4, -3); scene.add(rim);

  const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const ico = new THREE.Mesh(icoGeo, new THREE.MeshPhongMaterial({
    color: 0x180808, emissive: 0x2a0505, specular: 0xec2027, shininess: 130,
    transparent: true, opacity: 0.88, flatShading: true,
  }));
  const wire = new THREE.Mesh(icoGeo.clone(), new THREE.MeshBasicMaterial({
    color: 0xec2027, wireframe: true, transparent: true, opacity: 0.2,
  }));
  wire.scale.setScalar(1.006);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xec2027, transparent: true, opacity: 0.06 });
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), glowMat);
  scene.add(ico, wire, glow);

  // Additive-blended glow sprite behind the shape
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 256;
  const sctx = spriteCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(236,32,39,0.55)');
  grad.addColorStop(0.4, 'rgba(236,32,39,0.15)');
  grad.addColorStop(1, 'rgba(236,32,39,0)');
  sctx.fillStyle = grad; sctx.fillRect(0, 0, 256, 256);
  const spriteTex = new THREE.CanvasTexture(spriteCanvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: spriteTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85,
  }));
  sprite.scale.set(6.5, 6.5, 1);
  sprite.position.z = -1;
  scene.add(sprite);

  const mkRing = (r, tube, color, op, rx, rz) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(r, tube, 16, 140),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op }),
    );
    m.rotation.x = rx; if (rz) m.rotation.z = rz;
    scene.add(m); return m;
  };
  const ring1 = mkRing(2.15, 0.012, 0xec2027, 0.32, Math.PI / 2.4, 0);
  const ring2 = mkRing(1.72, 0.008, 0xff6b4a, 0.2, Math.PI / 3, Math.PI / 5);
  const ring3 = mkRing(2.6, 0.005, 0xffffff, 0.07, Math.PI / 1.9, Math.PI / 3);

  const COUNT = isMobile ? 140 : 420;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const vels = [];
  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 2.4 + Math.random() * 3.2;
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
    vels.push({ t: Math.random() * Math.PI * 2, s: 0.003 + Math.random() * 0.007 });
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const parts = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xffa090, size: 0.032, transparent: true, opacity: 0.75, sizeAttenuation: true,
  }));
  const parts2 = new THREE.Points(pGeo.clone(), new THREE.PointsMaterial({
    color: 0xec2027, size: 0.05, transparent: true, opacity: 0.25, sizeAttenuation: true,
  }));
  parts2.scale.setScalar(1.25);
  scene.add(parts, parts2);

  let mx = 0, my = 0;
  const onMouseMove = (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onResize = () => {
    ({ w, h } = getSize());
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  let t = 0, rafId, running = true;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    if (!running) return;
    t += 0.008;
    ico.rotation.x += 0.0038; ico.rotation.y += 0.0066;
    ico.rotation.x += (my * 0.32 - ico.rotation.x) * 0.035;
    ico.rotation.y += (mx * 0.32 - ico.rotation.y) * 0.035;
    wire.rotation.copy(ico.rotation);
    glow.rotation.y += 0.003;
    ring1.rotation.z += 0.0028; ring2.rotation.y += 0.005; ring3.rotation.z -= 0.0015;
    glowMat.opacity = 0.06 + 0.025 * Math.sin(t * 2);
    sprite.material.opacity = 0.75 + 0.2 * Math.sin(t * 1.6);
    const pa = pGeo.attributes.position;
    for (let i = 0; i < COUNT; i++) { vels[i].t += vels[i].s; pa.array[i * 3 + 1] += Math.sin(vels[i].t) * 0.0022; }
    pa.needsUpdate = true;
    parts.rotation.y += 0.0011; parts2.rotation.y -= 0.0007;
    spot.position.x += (mx * 3.2 - spot.position.x) * 0.05;
    spot.position.y += (my * 2.2 - spot.position.y) * 0.05;
    camera.position.x += (mx * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (my * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();

  return {
    setRunning: (v) => { running = v; },
    cleanup: () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    },
  };
}
