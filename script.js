/* =====================================================================
   script.js — Comportamiento de TODO el sitio
   ---------------------------------------------------------------------
   1. Menú lateral en celular (botón hamburguesa)
   2. Fondo animado con fundido entre GIF
   3. Luciérnagas (canvas)
   4. Luz que sigue al cursor
   5. Barra de progreso de lectura
   6. Aparición de elementos al hacer scroll
   7. Inclinación 3D de tarjetas
   8. Contador estilo VHS
   9. Transición suave entre páginas
   ===================================================================== */

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. MENÚ LATERAL EN CELULAR ---------- */
const menu = document.querySelector(".menu-lateral");
const botonMenu = document.querySelector(".btn-menu");
botonMenu.addEventListener("click", () => menu.classList.toggle("abierto"));
menu.addEventListener("click", e => { if (e.target.closest("a")) menu.classList.remove("abierto"); });

/* ---------- 2. FONDO ANIMADO (fundido entre GIF) ---------- */
// Para agregar o quitar fondos, edita esta lista (los archivos van en /img)
const fondos = ["img/fondo.gif", "img/bg1.gif", "img/bg2.gif"];
const contFondo = document.querySelector(".fondo");
fondos.forEach((ruta, i) => {
  const capa = document.createElement("div");
  capa.style.backgroundImage = `url('${ruta}')`;
  if (i === 0) capa.classList.add("activo");
  contFondo.appendChild(capa);
});
let fondoActual = 0;
setInterval(() => {                       // cambia cada 30 segundos (igual que la plantilla)
  const capas = contFondo.children;
  capas[fondoActual].classList.remove("activo");
  fondoActual = (fondoActual + 1) % capas.length;
  capas[fondoActual].classList.add("activo");
}, 30000);

/* ---------- 3. LUCIÉRNAGAS (cocuyos) ---------- */
const lienzo = document.getElementById("luciernagas");
const ctx = lienzo.getContext("2d");
const CANTIDAD = 45;                      // ← más o menos luciérnagas
let luciernagas = [];
function ajustarLienzo() { lienzo.width = innerWidth; lienzo.height = innerHeight; }
ajustarLienzo();
addEventListener("resize", ajustarLienzo);
for (let i = 0; i < CANTIDAD; i++) {
  luciernagas.push({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: 1 + Math.random() * 2.2,                       // tamaño
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,   // velocidad
    fase: Math.random() * Math.PI * 2                 // para que cada una brille en momento distinto
  });
}
function dibujarLuciernagas() {
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  for (const f of luciernagas) {
    f.x += f.vx; f.y += f.vy; f.fase += .02;
    if (f.x < 0) f.x = lienzo.width;  if (f.x > lienzo.width) f.x = 0;
    if (f.y < 0) f.y = lienzo.height; if (f.y > lienzo.height) f.y = 0;
    const brillo = (Math.sin(f.fase) + 1) / 2;        // 0 a 1
    const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 9);
    g.addColorStop(0, `rgba(160,255,255,${.85 * brillo})`);
    g.addColorStop(1, "rgba(0,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 9, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(dibujarLuciernagas);
}
if (!reducirMovimiento) dibujarLuciernagas();

/* ---------- 4. LUZ QUE SIGUE AL CURSOR ---------- */
addEventListener("pointermove", e => {
  document.documentElement.style.setProperty("--mx", e.clientX + "px");
  document.documentElement.style.setProperty("--my", e.clientY + "px");
});

/* ---------- 5. BARRA DE PROGRESO DE LECTURA ---------- */
const barra = document.querySelector(".progreso");
addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - innerHeight;
  barra.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + "%";
});

/* ---------- 6. APARICIÓN AL HACER SCROLL ---------- */
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); observador.unobserve(en.target); } });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => observador.observe(el));

/* ---------- 7. INCLINACIÓN 3D DE TARJETAS (solo índice) ---------- */
document.querySelectorAll(".tarjeta").forEach(t => {
  t.addEventListener("pointermove", e => {
    const r = t.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    t.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  t.addEventListener("pointerleave", () => t.style.transform = "");
});

/* ---------- 8. CONTADOR ESTILO VHS ---------- */
const tv = document.getElementById("transmission");
const inicio = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - inicio) / 1000);
  const p = n => String(n).padStart(2, "0");
  tv.innerHTML = `<b>●</b> PLAY ▶ ${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}, 1000);

/* ---------- 9. TRANSICIÓN SUAVE ENTRE PÁGINAS ---------- */
document.querySelectorAll("a[href$='.html']").forEach(a => {
  a.addEventListener("click", e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    document.body.classList.add("saliendo");
    setTimeout(() => location.href = a.href, 280);
  });
});
addEventListener("pageshow", () => document.body.classList.remove("saliendo"));  // por si se vuelve atrás
