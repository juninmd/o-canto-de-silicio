<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRouter, withBase, inBrowser } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { AMBIENTES, avisar, iniciarLeitura, leitura, marcarLido, ui } from '../leitura.js'
import { ligarSom, desligarSom } from '../som.js'

const { page } = useData()
const router = useRouter()

const n = computed(() => {
  const m = page.value.relativePath.match(/^public\/capitulos\/capitulo-(\d+)\.md$/)
  return m ? Number(m[1]) : 0
})
const cap = computed(() => capitulos.find((c) => c.n === n.value) || null)
const idx = computed(() => capitulos.findIndex((c) => c.n === n.value))
const anterior = computed(() => (idx.value > 0 ? capitulos[idx.value - 1] : null))
const proximo = computed(() => (idx.value >= 0 && idx.value < capitulos.length - 1 ? capitulos[idx.value + 1] : null))

const pct = ref(0)
const retomarEm = ref(0)
const reflexaoHtml = ref('')
const reflexaoCarregando = ref(false)
const cacheReflexao = new Map()

/* ---------- aplica estado no <html> ---------- */
function aplicarHtml() {
  const h = document.documentElement
  h.classList.toggle('is-capitulo', !!cap.value)
  h.classList.toggle('cds-foco', !!cap.value && leitura.foco)
  h.style.setProperty('--cds-leitura', leitura.tamanho + 'px')
  if (cap.value && leitura.ambiente !== 'auto') h.dataset.leitura = leitura.ambiente
  else delete h.dataset.leitura
}

/* Marca diálogos, capitular e metadados antigos (**Data:** etc.) no texto. */
function prepararTexto() {
  const doc = document.querySelector('.vp-doc > div')
  if (!doc) return
  let capitularFeita = false
  for (const p of doc.querySelectorAll(':scope > p')) {
    const t = p.textContent.trim()
    if (/^(Data|Localiza[çc][ãa]o|Personagens):/i.test(t) && p.firstElementChild?.tagName === 'STRONG') {
      p.classList.add('cds-meta-antiga')
      continue
    }
    if (/^[—–]\s?/.test(t)) p.classList.add('cds-dialogo')
    if (!capitularFeita && t.length > 80 && !/^[—–"“*]/.test(t) && !p.querySelector('img')) {
      p.classList.add('cds-capitular')
      capitularFeita = true
    }
  }
}

/* ---------- progresso de leitura ---------- */
let raf = 0
function medir() {
  raf = 0
  const el = document.querySelector('.vp-doc')
  if (!el || !cap.value) return
  const topo = el.getBoundingClientRect().top + scrollY
  const total = el.offsetHeight - innerHeight * 0.6
  const p = Math.round(Math.min(1, Math.max(0, (scrollY - topo + innerHeight * 0.4) / Math.max(1, total))) * 100)
  pct.value = p
  if (p > 2) retomarEm.value = 0
  if (leitura.progresso.n === n.value && p !== leitura.progresso.p) leitura.progresso.p = p
  if (p >= 95 && !leitura.lidos.includes(n.value)) {
    marcarLido(n.value)
    avisar(`Cap. ${n.value} marcado como lido`)
  }
  if (leitura.foco) marcarParagrafoAtual()
}
const aoRolar = () => { if (!raf) raf = requestAnimationFrame(medir) }

function marcarParagrafoAtual() {
  const meio = innerHeight * 0.42
  let melhor = null
  let dist = Infinity
  for (const p of document.querySelectorAll('.vp-doc > div > p')) {
    const r = p.getBoundingClientRect()
    const d = Math.abs(r.top + r.height / 2 - meio)
    if (d < dist) { dist = d; melhor = p }
  }
  document.querySelectorAll('.vp-doc p.cds-atual').forEach((p) => p !== melhor && p.classList.remove('cds-atual'))
  melhor?.classList.add('cds-atual')
}

function entrarNoCapitulo() {
  aplicarHtml()
  if (!cap.value) {
    leitura.gaveta = false
    if (leitura.som) { desligarSom(); leitura.som = false }
    return
  }
  retomarEm.value = 0
  if (leitura.progresso.n === n.value) {
    const p = leitura.progresso.p
    if (p > 3 && p < 95) retomarEm.value = p
  } else {
    leitura.progresso = { n: n.value, p: 0 }
  }
  reflexaoHtml.value = ''
  if (leitura.gaveta) carregarReflexao()
  nextTick(() => setTimeout(() => { prepararTexto(); medir() }, 30))
}

function retomar() {
  const el = document.querySelector('.vp-doc')
  if (!el) return
  const topo = el.getBoundingClientRect().top + scrollY
  const total = el.offsetHeight - innerHeight * 0.6
  scrollTo({ top: topo - innerHeight * 0.4 + (retomarEm.value / 100) * total, behavior: 'smooth' })
  retomarEm.value = 0
}

/* ---------- ações ---------- */
const ir = (c) => c && router.go(withBase(c.link + '.html'))
function alternarFoco() {
  leitura.foco = !leitura.foco
  aplicarHtml()
  if (leitura.foco) marcarParagrafoAtual()
  avisar(leitura.foco ? 'Modo foco ligado' : 'Modo foco desligado')
}
function tamanho(d) {
  leitura.tamanho = Math.min(26, Math.max(15, leitura.tamanho + d))
}
function ambiente(id) {
  leitura.ambiente = id
}
function alternarSom() {
  if (leitura.som) {
    desligarSom()
    leitura.som = false
  } else {
    leitura.som = ligarSom()
    avisar(leitura.som ? 'Som do subnível ligado' : 'Este navegador não liberou áudio')
  }
}
function alternarGaveta(estado) {
  leitura.gaveta = estado ?? !leitura.gaveta
  if (leitura.gaveta) carregarReflexao()
}

async function carregarReflexao() {
  const c = cap.value
  if (!c?.reflexao || reflexaoHtml.value) return
  if (cacheReflexao.has(c.n)) { reflexaoHtml.value = cacheReflexao.get(c.n); return }
  reflexaoCarregando.value = true
  try {
    const r = await fetch(withBase(c.reflexao + '.html'))
    const doc = new DOMParser().parseFromString(await r.text(), 'text/html')
    const corpo = doc.querySelector('.vp-doc > div')
    if (corpo) {
      corpo.querySelector('h1')?.remove()
      corpo.querySelectorAll('a.header-anchor').forEach((a) => a.remove())
      cacheReflexao.set(c.n, corpo.innerHTML)
      if (cap.value?.n === c.n) reflexaoHtml.value = corpo.innerHTML
    }
  } catch {
    /* sem rede: a gaveta mostra só as notas e o link */
  } finally {
    reflexaoCarregando.value = false
  }
}

function teclas(e) {
  if (!cap.value || e.ctrlKey || e.metaKey || e.altKey || ui.comandos) return
  const alvo = e.target
  if (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName)) return
  if (document.querySelector('.VPLocalSearchBox, dialog[open]')) return
  if (e.key === 'ArrowRight' && proximo.value) ir(proximo.value)
  else if (e.key === 'ArrowLeft' && anterior.value) ir(anterior.value)
  else if (e.key === 'f' || e.key === 'F') alternarFoco()
  else if (e.key === 'r' || e.key === 'R') alternarGaveta()
  else if (e.key === 'Escape' && leitura.gaveta) alternarGaveta(false)
  else return
  e.preventDefault()
}

watch(() => page.value.relativePath, entrarNoCapitulo)
watch(() => [leitura.tamanho, leitura.ambiente], aplicarHtml)

onMounted(() => {
  iniciarLeitura()
  entrarNoCapitulo()
  addEventListener('scroll', aoRolar, { passive: true })
  addEventListener('resize', aoRolar, { passive: true })
  addEventListener('keydown', teclas)
  addEventListener('cds:acao', (e) => {
    const a = e.detail
    if (a === 'foco') alternarFoco()
    else if (a === 'reflexao') alternarGaveta(true)
    else if (a === 'som') alternarSom()
  })
})
onBeforeUnmount(() => {
  removeEventListener('scroll', aoRolar)
  removeEventListener('resize', aoRolar)
  removeEventListener('keydown', teclas)
})
</script>

<template>
  <div v-if="cap" class="leitor vp-raw">
    <div class="barra-prog" :style="{ transform: `scaleX(${pct / 100})` }" aria-hidden="true" />
    <div class="regua" aria-hidden="true">
      <div class="marca" :style="{ top: pct + '%' }"><span>{{ pct }}%</span></div>
    </div>

    <div class="doca" role="toolbar" aria-label="Controles de leitura">
      <button v-if="retomarEm" class="b retomar" type="button" @click="retomar">Retomar em {{ retomarEm }}%</button>
      <button class="b nav" type="button" :disabled="!anterior" aria-label="Capítulo anterior" title="Capítulo anterior (←)" @click="ir(anterior)">←</button>
      <span class="sep nav" />
      <button class="b" type="button" aria-label="Diminuir texto" @click="tamanho(-1)">A−</button>
      <button class="b" type="button" aria-label="Aumentar texto" @click="tamanho(1)">A+</button>
      <span class="sep" />
      <button
        v-for="a in AMBIENTES" :key="a.id" class="b amostra" type="button"
        :style="{ background: a.amostra }" :aria-pressed="leitura.ambiente === a.id"
        :aria-label="`Ambiente ${a.nome}`" :title="`Ambiente ${a.nome}`" @click="ambiente(a.id)"
      />
      <span class="sep" />
      <button class="b" type="button" :aria-pressed="leitura.foco" title="Modo foco (F)" @click="alternarFoco">Foco</button>
      <button class="b" type="button" :aria-pressed="leitura.som" title="Som ambiente do subnível" @click="alternarSom">Som</button>
      <button v-if="cap.reflexao" class="b" type="button" :aria-pressed="leitura.gaveta" title="Reflexão (R)" @click="alternarGaveta()">Reflexão</button>
      <span class="sep nav" />
      <button class="b nav" type="button" :disabled="!proximo" aria-label="Próximo capítulo" title="Próximo capítulo (→)" @click="ir(proximo)">→</button>
    </div>

    <aside class="gaveta" :class="{ aberta: leitura.gaveta }" aria-label="Reflexão do capítulo" :aria-hidden="!leitura.gaveta">
      <div class="g-cab">
        <span class="mono">Reflexão · Cap. {{ cap.n }}</span>
        <button class="b" type="button" aria-label="Fechar reflexão" @click="alternarGaveta(false)">✕</button>
      </div>
      <h2>Análise crítica</h2>
      <div v-for="[k, v] in cap.notas" :key="k" class="nota">
        <span>{{ k }}</span><span>{{ v }}/10</span>
        <span class="trilho"><i :style="{ width: leitura.gaveta ? v * 10 + '%' : 0 }" /></span>
      </div>
      <p v-if="reflexaoCarregando" class="mono fraco">Carregando reflexão…</p>
      <div v-if="reflexaoHtml" class="g-corpo" v-html="reflexaoHtml" />
      <a v-if="cap.reflexao" class="link mono" :href="withBase(cap.reflexao + '.html')">Abrir a reflexão completa →</a>
    </aside>
  </div>
</template>

<style scoped>
.barra-prog { position: fixed; left: 0; right: 0; top: var(--vp-nav-height); height: 2px; z-index: 30; transform-origin: 0 50%; background: linear-gradient(90deg, var(--cds-volt), var(--cds-enxofre)); pointer-events: none; }
.regua { position: fixed; right: 0; top: calc(var(--vp-nav-height) + 24px); bottom: 96px; width: 30px; z-index: 20; pointer-events: none; border-left: 1px solid var(--cds-veio); background: repeating-linear-gradient(180deg, var(--cds-veio) 0 1px, transparent 1px 14px); background-size: 8px 100%; background-repeat: no-repeat; }
.regua .marca { position: absolute; left: -1px; right: 0; height: 2px; background: var(--cds-enxofre); box-shadow: 0 0 10px var(--cds-enxofre); transition: top .15s linear; }
.regua .marca span { position: absolute; right: 3px; top: -14px; font-family: var(--cds-f-mono); font-size: .55rem; color: var(--cds-fumo); font-variant-numeric: tabular-nums; }
@media (max-width: 767px) { .regua { display: none; } }
@media (max-width: 959px) { .barra-prog { top: 0; z-index: 60; } }

.doca {
  position: fixed; z-index: 40; left: 50%; transform: translateX(-50%);
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  display: flex; align-items: center; gap: 4px; padding: 6px;
  max-width: calc(100vw - 24px); overflow-x: auto; scrollbar-width: none;
  background: color-mix(in srgb, var(--cds-escoria) 88%, transparent);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--cds-veio); border-radius: 8px; box-shadow: var(--cds-sombra);
  animation: sobe .6s .2s var(--cds-ease) both;
}
@keyframes sobe { from { opacity: 0; transform: translate(-50%, 20px); } }
.b { flex: none; min-width: 32px; height: 32px; padding: 0 .55rem; border: 1px solid var(--cds-veio); border-radius: 4px; background: transparent; color: var(--cds-cinza); font-family: var(--cds-f-mono); font-size: .7rem; display: inline-flex; align-items: center; justify-content: center; transition: border-color .2s, background .2s, color .2s; }
.b:hover:not(:disabled) { border-color: var(--cds-volt); }
.b:disabled { opacity: .35; cursor: default; }
.b[aria-pressed='true'] { background: var(--cds-volt); border-color: var(--cds-volt); color: var(--cds-oleo); }
.b.amostra { min-width: 24px; width: 24px; height: 24px; border-radius: 50%; padding: 0; border-width: 2px; }
.b.amostra[aria-pressed='true'] { outline: 2px solid var(--cds-enxofre); outline-offset: 2px; }
.b.retomar { background: var(--cds-enxofre); color: var(--cds-enxofre-tinta); border-color: var(--cds-enxofre); }
.sep { flex: none; width: 1px; height: 20px; background: var(--cds-veio); margin: 0 2px; }

.gaveta {
  position: fixed; z-index: 45; top: var(--vp-nav-height); right: 0; bottom: 0;
  width: min(420px, 92vw); overflow: auto; padding: 1.2rem 1.3rem 6rem;
  background: color-mix(in srgb, var(--cds-escoria) 94%, var(--cds-volt));
  border-left: 1px solid var(--cds-veio); box-shadow: var(--cds-sombra);
  transform: translateX(102%); visibility: hidden;
  transition: transform .5s var(--cds-ease), visibility 0s .5s;
  color: var(--cds-cinza);
}
.gaveta.aberta { transform: none; visibility: visible; transition: transform .5s var(--cds-ease); }
.g-cab { display: flex; justify-content: space-between; align-items: center; }
.mono { font-family: var(--cds-f-mono); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-fumo); }
h2 { font-family: var(--cds-f-display); font-weight: 900; text-transform: uppercase; font-size: 1.8rem; margin: .4rem 0 1rem; line-height: 1; }
.nota { display: grid; grid-template-columns: 1fr auto; gap: .3rem .6rem; margin-bottom: .9rem; font-family: var(--cds-f-mono); font-size: .72rem; }
.trilho { grid-column: 1 / -1; height: 6px; background: var(--cds-veio); border-radius: 3px; overflow: hidden; }
.trilho i { display: block; height: 100%; background: linear-gradient(90deg, var(--cds-volt), var(--cds-enxofre)); transition: width 1s .15s var(--cds-ease); }
.g-corpo { font-size: .9rem; line-height: 1.6; }
.g-corpo :deep(h2) { font-size: 1.2rem; margin: 1.4rem 0 .5rem; }
.g-corpo :deep(h3) { font-family: var(--cds-f-display); text-transform: uppercase; font-size: 1.05rem; margin: 1rem 0 .4rem; }
.g-corpo :deep(ul) { padding-left: 1.1rem; }
.g-corpo :deep(li) { margin: .3rem 0; }
.link { display: inline-block; margin-top: 1rem; color: var(--cds-enxofre-texto); text-decoration: none; }
.fraco { margin-top: 1rem; }
@media (max-width: 520px) { .doca .nav { display: none; } .doca { gap: 3px; } .b { padding: 0 .4rem; } .sep { margin: 0; } }
</style>
