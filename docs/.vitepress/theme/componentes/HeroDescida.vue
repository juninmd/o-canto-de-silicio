<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { leitura, iniciarLeitura, reduzMovimento } from '../leitura.js'

const ultimo = capitulos[capitulos.length - 1]
const totalPalavras = capitulos.reduce((s, c) => s + c.palavras, 0)
const horas = Math.round(totalPalavras / 200 / 60)
const reflexoes = capitulos.filter((c) => c.reflexao).length
const fmt = (n) => n.toLocaleString('pt-BR')

const profundidade = ref(ultimo.n)
const descendo = ref(false)
const canvas = ref(null)
let rodando = true
let raf = 0

const retomar = computed(() => {
  const n = leitura.progresso?.n
  const c = n && capitulos.find((x) => x.n === n)
  return c ? { c, p: leitura.progresso.p || 0 } : null
})
const continuarCap = computed(() => retomar.value?.c || ultimo)

const LINHAS = [
  `Cap. ${ultimo.n} · <em>${ultimo.titulo}</em>`,
  'Elara · bioeletricidade <em>extinta</em> desde o Cap. 45',
  'Jaxon · pulmão sintético <em>inoperante</em> · munição <em>quase zero</em>',
  'Protocolo de Purga Térmica · <em>em andamento</em>',
  'Cartel da Água · Silas <em>ainda caça</em> a dupla',
  'Próximo marco · <em>Cap. 130</em>, o retorno instável'
]
const ticker = LINHAS.map((l) => `<span>■ ${l}</span>`).join('')

function neve() {
  const cv = canvas.value
  if (!cv) return
  const cx = cv.getContext('2d')
  const dpr = Math.min(2, devicePixelRatio || 1)
  let W = 0, H = 0, P = []
  const nova = (qualquer) => ({
    x: Math.random() * W, y: qualquer ? Math.random() * H : -10,
    r: Math.random() * 1.6 + 0.3, vy: Math.random() * 0.6 + 0.25, vx: Math.random() * 0.3 + 0.1,
    a: Math.random() * 0.5 + 0.15, faisca: Math.random() < 0.025
  })
  const medir = () => {
    W = cv.clientWidth; H = cv.clientHeight
    cv.width = W * dpr; cv.height = H * dpr
    cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    P = Array.from({ length: Math.round((W * H) / 5200) }, () => nova(true))
  }
  const claro = () => !document.documentElement.classList.contains('dark')
  const quadro = () => {
    cx.clearRect(0, 0, W, H)
    const base = claro() ? '60,52,70' : '225,222,205'
    for (const p of P) {
      p.y += p.vy; p.x += p.vx + Math.sin(p.y / 40) * 0.15
      if (p.y > H + 5 || p.x > W + 5) Object.assign(p, nova(false), { x: Math.random() * W * 1.1 - W * 0.1 })
      if (p.faisca) {
        const f = Math.random() < 0.08 ? 1 : 0.25
        cx.fillStyle = `rgba(169,130,255,${p.a * f + 0.1})`; cx.shadowColor = '#a982ff'; cx.shadowBlur = 8 * f
      } else {
        cx.fillStyle = `rgba(${base},${p.a})`; cx.shadowBlur = 0
      }
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill()
    }
    if (rodando && !reduzMovimento()) raf = requestAnimationFrame(quadro)
  }
  medir()
  addEventListener('resize', medir)
  quadro()
  onBeforeUnmount(() => removeEventListener('resize', medir))
}

onMounted(() => {
  iniciarLeitura()
  descendo.value = true
  if (!reduzMovimento()) {
    const t0 = performance.now()
    const passo = (t) => {
      const v = Math.min(1, (t - t0) / 1600)
      profundidade.value = Math.round(ultimo.n * (1 - Math.pow(1 - v, 3)))
      if (v < 1) requestAnimationFrame(passo)
    }
    requestAnimationFrame(passo)
  }
  neve()
})
onBeforeUnmount(() => { rodando = false; cancelAnimationFrame(raf) })

const letras = (t) => [...t].map((ch) => (ch === ' ' ? ' ' : ch))
</script>

<template>
  <section class="hero vp-raw" aria-labelledby="hero-titulo">
    <canvas ref="canvas" class="neve" aria-hidden="true" />
    <div class="grade">
      <div class="regua" aria-hidden="true">
        <div class="ticks" />
        <div class="marca" :class="{ desce: descendo }"><i /></div>
        <div class="rot">PROFUNDIDADE · CAP {{ String(profundidade).padStart(3, '0') }} / {{ ultimo.n }}</div>
      </div>
      <div class="corpo">
        <p class="olho">Thriller pós-apocalíptico · cyberpunk noir · {{ capitulos.length }} capítulos</p>
        <h1 id="hero-titulo" class="titulo" aria-label="O Canto de Silício">
          <span class="l1" aria-hidden="true"><span v-for="(ch, i) in letras('O Canto')" :key="'a' + i" class="ch" :style="{ animationDelay: i * 0.045 + 's' }">{{ ch }}</span></span>
          <span class="l2" aria-hidden="true"><span v-for="(ch, i) in letras('de Silício')" :key="'b' + i" class="ch" :style="{ animationDelay: 0.25 + i * 0.045 + 's' }">{{ ch }}</span></span>
        </h1>
        <p class="tag">Onde os deuses-máquina dormem, a esperança desperta.</p>
        <p class="sub">Uma jornada pós-apocalíptica de ficção científica e fantasia em um mundo retomado pela natureza.</p>
        <div class="cta">
          <a class="btn prim" :href="withBase(continuarCap.link + '.html')">
            {{ retomar ? 'Continuar' : 'Ler o mais recente' }}
            <span class="s">· Cap. {{ continuarCap.n }} {{ continuarCap.titulo }}</span>
          </a>
          <a class="btn" :href="withBase('/public/capitulos/capitulo-1.html')">Começar a Ler</a>
          <a class="btn" :href="withBase('/personagens.html#elara')">Conhecer Elara</a>
        </div>
        <a v-if="retomar" class="retomar" :href="withBase(retomar.c.link + '.html')">
          <span class="anel" :style="{ '--p': retomar.p }"><span>{{ retomar.p }}%</span></span>
          <span class="rt">
            <span class="mono">Você parou em</span>
            <span>Cap. {{ retomar.c.n }} · {{ retomar.c.titulo }}</span>
          </span>
        </a>
        <div class="stats">
          <span><b>{{ capitulos.length }}</b>capítulos</span>
          <span><b>{{ fmt(totalPalavras) }}</b>palavras</span>
          <span><b>{{ horas }}h</b>de leitura</span>
          <span><b>{{ reflexoes }}</b>reflexões</span>
        </div>
      </div>
    </div>
    <div class="ticker" aria-hidden="true"><div v-html="ticker + ticker" /></div>
  </section>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; isolation: isolate; padding: clamp(32px, 7vw, 88px) 0 0; margin-top: calc(var(--vp-nav-height) * -1); padding-top: calc(var(--vp-nav-height) + clamp(32px, 6vw, 80px)); }
.neve { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; }
.hero::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(60% 70% at 78% 30%, color-mix(in srgb, var(--cds-volt) 14%, transparent), transparent 70%),
    radial-gradient(50% 60% at 10% 100%, color-mix(in srgb, var(--cds-enxofre) 9%, transparent), transparent 70%),
    repeating-linear-gradient(0deg, color-mix(in srgb, var(--cds-cinza) 3%, transparent) 0 1px, transparent 1px 3px);
}
.grade { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: clamp(16px, 4vw, 48px); }
@media (min-width: 640px) { .grade { padding: 0 48px; } }
@media (min-width: 960px) { .grade { padding: 0 64px; } }
@media (max-width: 639px) { .regua { display: none; } .grade { grid-template-columns: minmax(0, 1fr); } }
.regua { width: 52px; position: relative; border-left: 1px solid var(--cds-veio); min-height: 340px; }
.regua .ticks { position: absolute; inset: 0; background: repeating-linear-gradient(180deg, var(--cds-veio) 0 1px, transparent 1px 12px), repeating-linear-gradient(180deg, var(--cds-fumo) 0 1px, transparent 1px 60px); background-size: 10px 100%, 20px 100%; background-repeat: no-repeat; }
.regua .marca { position: absolute; left: -1px; top: 0; transition: top 1.6s var(--cds-ease); }
.regua .marca.desce { top: calc(100% - 4px); }
.regua .marca i { display: block; width: 26px; height: 2px; background: var(--cds-enxofre); box-shadow: 0 0 12px var(--cds-enxofre); }
.regua .rot { position: absolute; left: 8px; bottom: 0; font-family: var(--cds-f-mono); font-size: .6rem; color: var(--cds-fumo); writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: .14em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.olho { font-family: var(--cds-f-mono); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-enxofre-texto); display: flex; align-items: center; gap: .6rem; margin: 0; }
.olho::before { content: ''; width: 22px; height: 2px; background: currentColor; flex: none; }
.titulo { font-family: var(--cds-f-estencil); font-weight: 900; text-transform: uppercase; font-size: clamp(3.2rem, 14.5vw, 9.4rem); line-height: .82; margin: .6rem 0 0; color: var(--cds-cinza); letter-spacing: -.005em; }
.titulo .l1, .titulo .l2 { display: block; }
.titulo .l2 { color: transparent; -webkit-text-stroke: 1.5px var(--cds-cinza); }
.titulo .ch { display: inline-block; animation: cair .9s var(--cds-ease) both; }
@keyframes cair { from { transform: translateY(-.35em); opacity: .15; filter: blur(6px); } }
.titulo:hover .l2 { animation: glitch .5s steps(2) 1; }
@keyframes glitch {
  0% { text-shadow: 3px 0 var(--cds-volt), -3px 0 var(--cds-enxofre); transform: translateX(2px); }
  50% { text-shadow: -2px 0 var(--cds-volt), 2px 0 var(--cds-enxofre); transform: translateX(-2px); }
}
.tag { font-family: var(--cds-f-leitura); font-style: italic; font-size: clamp(1.1rem, 2vw, 1.35rem); max-width: 38ch; margin: 1.2rem 0 0; color: var(--cds-cinza); line-height: 1.45; }
.sub { color: var(--cds-fumo); max-width: 56ch; margin: .6rem 0 0; font-size: .98rem; }
.cta { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.8rem; }
.btn { display: inline-flex; align-items: center; gap: .5rem; padding: .8rem 1.1rem; border-radius: 3px; border: 1px solid var(--cds-veio); background: var(--cds-escoria); color: var(--cds-cinza); text-decoration: none; font-family: var(--cds-f-mono); font-size: .76rem; letter-spacing: .06em; text-transform: uppercase; transition: transform .2s var(--cds-ease), border-color .2s, background .2s; }
.btn:hover { transform: translateY(-2px); border-color: var(--cds-volt); }
.btn.prim { background: var(--cds-enxofre); color: var(--cds-enxofre-tinta); border-color: var(--cds-enxofre); font-weight: 500; }
.btn.prim:hover { background: #ffc94a; }
.btn .s { opacity: .72; text-transform: none; letter-spacing: 0; }
@media (max-width: 520px) { .btn.prim { flex-wrap: wrap; row-gap: .2rem; } .btn.prim .s { flex-basis: 100%; } }
.retomar { margin-top: 1.4rem; display: flex; align-items: center; gap: 1rem; max-width: 520px; padding: .8rem 1rem; border: 1px solid var(--cds-veio); background: color-mix(in srgb, var(--cds-escoria) 85%, transparent); border-radius: 4px; color: var(--cds-cinza); text-decoration: none; transition: border-color .2s; }
.retomar:hover { border-color: var(--cds-volt); }
.anel { --p: 0; width: 46px; height: 46px; border-radius: 50%; flex: none; background: conic-gradient(var(--cds-volt) calc(var(--p) * 1%), var(--cds-veio) 0); display: grid; place-items: center; font-family: var(--cds-f-mono); font-size: .62rem; }
.anel::before { content: ''; grid-area: 1/1; width: 36px; height: 36px; border-radius: 50%; background: var(--cds-escoria); }
.anel span { grid-area: 1/1; position: relative; }
.rt { display: grid; min-width: 0; }
.mono { font-family: var(--cds-f-mono); font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-fumo); }
.stats { display: flex; flex-wrap: wrap; gap: .4rem 1.6rem; margin-top: 2rem; font-family: var(--cds-f-mono); font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-fumo); align-items: baseline; }
.stats b { color: var(--cds-cinza); font-family: var(--cds-f-display); font-size: 1.5rem; font-weight: 700; margin-right: .35rem; font-variant-numeric: tabular-nums; }
.ticker { margin-top: 2.6rem; border-block: 1px solid var(--cds-veio); overflow: hidden; white-space: nowrap; font-family: var(--cds-f-mono); font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-fumo); }
.ticker > div { display: inline-block; padding: .55rem 0; animation: tick 52s linear infinite; }
.ticker :deep(span) { margin-right: 3rem; }
.ticker :deep(em) { color: var(--cds-cinza); font-style: normal; }
@keyframes tick { to { transform: translateX(-50%); } }
</style>
