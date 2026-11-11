<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { ARCOS, ROMANOS } from '../../lib/arcos.mjs'
import { leitura, iniciarLeitura, normalizar, tempoLeitura, tresDigitos } from '../leitura.js'

const FANTASMAS = 10 // capítulos "em escrita" desenhados após o último
const ultimo = capitulos[capitulos.length - 1]
const TOTAL = ultimo.n + FANTASMAS
const maxPalavras = Math.max(...capitulos.map((c) => c.palavras))
const arcos = ARCOS.filter((a) => a.de <= TOTAL).map((a) => ({ ...a, fim: Math.min(a.ate, TOTAL) }))
const arcoPorId = Object.fromEntries(ARCOS.map((a) => [a.id, a]))
const PERSONAGENS = ['Elara', 'Jaxon', 'Dr. Vex', 'Sentinelas', 'Kaelen', 'Ferrão', 'Silas', 'Deus-Máquina']

const filtro = ref({ arco: 0, pers: '', q: '' })
const selecionado = ref(ultimo.n)
const lidos = computed(() => new Set(leitura.lidos))

const casa = (c) => {
  const f = filtro.value
  if (f.arco && c.arco !== f.arco) return false
  if (f.pers && !c.pers.some((p) => p.startsWith(f.pers))) return false
  if (f.q) {
    const q = normalizar(f.q)
    if (!normalizar(`${c.n} ${c.titulo} ${c.local} ${c.trecho} ${c.pers.join(' ')}`).includes(q)) return false
  }
  return true
}
const visiveis = computed(() => capitulos.filter(casa))
const visSet = computed(() => new Set(visiveis.value.map((c) => c.n)))
const atual = computed(() => capitulos.find((c) => c.n === selecionado.value) || ultimo)
const arcoAtual = computed(() => arcoPorId[atual.value.arco])

// Curva narrativa da bioeletricidade de Elara (ilustrativa; marcos canônicos:
// sobrecarga nos caps. 41–44, extinção no 45, retorno instável a partir do 130).
function bio(n) {
  if (n <= 9) return 0.12 + 0.4 * (n / 9)
  if (n <= 40) return 0.52 + 0.1 * Math.sin(n * 0.7) + 0.18 * ((n - 9) / 31)
  if (n <= 44) return [0, 0.95, 1, 0.7, 0.35][n - 40]
  if (n < 130) return 0.025
  return 0.025 + 0.35 * ((n - 129) / 3)
}
const X = (n) => ((n - 0.5) / TOTAL) * 1000
const Y = (v) => 190 - 8 - v * 166
const ate = Math.min(129, TOTAL)
const curva = Array.from({ length: Math.min(ultimo.n, 129) }, (_, i) => `${i ? 'L' : 'M'}${X(i + 1).toFixed(1)},${Y(bio(i + 1)).toFixed(1)}`).join('')
const projecao = Array.from({ length: TOTAL - ultimo.n + 1 }, (_, i) => `${i ? 'L' : 'M'}${X(ultimo.n + i).toFixed(1)},${Y(bio(ultimo.n + i)).toFixed(1)}`).join('')
const area = `${curva}L${X(Math.min(ultimo.n, ate)).toFixed(1)},190L${X(1).toFixed(1)},190Z`
const pct = (n) => `${((n - 0.5) / TOTAL) * 100}%`

const altura = (c) => (18 + (82 * c.palavras) / maxPalavras).toFixed(1)

function selecionar(n, rolar) {
  selecionado.value = n
  if (rolar && typeof document !== 'undefined') {
    document.querySelector(`.mapa .lista a[data-n="${n}"]`)?.scrollIntoView({ block: 'nearest' })
  }
}
function aoPassar(c) {
  if (matchMedia('(hover: hover)').matches) selecionar(c.n)
}
function teclas(e) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  e.preventDefault()
  const n = Math.min(ultimo.n, Math.max(1, selecionado.value + (e.key === 'ArrowRight' ? 1 : -1)))
  selecionar(n, true)
  document.querySelector(`.mapa .barra[data-n="${n}"]`)?.focus()
}

onMounted(iniciarLeitura)
const fmt = (n) => n.toLocaleString('pt-BR')
</script>

<template>
  <section id="mapa" class="mapa vp-raw" aria-labelledby="mapa-titulo">
    <header class="cab">
      <p class="olho">Nível −1 · {{ capitulos.length }} capítulos</p>
      <h2 id="mapa-titulo">Mapa da Descida</h2>
      <p class="lede">
        Cada barra é um capítulo. A altura mostra a extensão, a cor mostra o arco e a linha violeta acompanha a
        bioeletricidade de Elara: sobe até o Deus-Máquina, some no Cap. 45 e volta, instável, a partir do 130.
        Passe o cursor, filtre por arco ou personagem e abra qualquer capítulo.
      </p>
    </header>

    <div class="filtros">
      <div class="linha">
        <span class="mono rot">Arco</span>
        <div class="chips">
          <button type="button" class="chip" :aria-pressed="filtro.arco === 0" @click="filtro.arco = 0">Todos</button>
          <button v-for="a in arcos" :key="a.id" type="button" class="chip" :aria-pressed="filtro.arco === a.id" @click="filtro.arco = a.id">
            <i :style="{ background: a.cor }" />{{ a.nome }}
          </button>
        </div>
      </div>
      <div class="linha">
        <span class="mono rot">Em cena</span>
        <div class="chips">
          <button type="button" class="chip" :aria-pressed="filtro.pers === ''" @click="filtro.pers = ''">Todos</button>
          <button v-for="p in PERSONAGENS" :key="p" type="button" class="chip" :aria-pressed="filtro.pers === p" @click="filtro.pers = p">{{ p }}</button>
        </div>
      </div>
      <div class="linha">
        <label class="mono rot" for="mapa-q">Filtrar</label>
        <span class="campo">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="m15 15 6 6" stroke="currentColor" stroke-width="2" /></svg>
          <input id="mapa-q" v-model="filtro.q" type="search" placeholder="título, lugar, trecho…" autocomplete="off">
        </span>
      </div>
    </div>

    <div class="sismo-caixa">
      <div class="sismo">
        <div class="barras" role="group" aria-label="Capítulos em ordem" @keydown="teclas">
          <button
            v-for="(c, i) in capitulos" :key="c.n" type="button" class="barra"
            :class="{ sel: c.n === selecionado, apagada: !visSet.has(c.n), lida: lidos.has(c.n) }"
            :data-n="c.n" :style="{ '--h': altura(c), '--c': arcoPorId[c.arco].cor, '--i': i }"
            :aria-label="`Capítulo ${c.n}: ${c.titulo}`" :tabindex="c.n === selecionado ? 0 : -1"
            @mouseenter="aoPassar(c)" @focus="selecionar(c.n)" @click="selecionar(c.n, true)"
          />
          <span v-for="k in FANTASMAS" :key="'f' + k" class="barra fantasma" :title="`Cap. ${ultimo.n + k} · em escrita`" />
        </div>
        <svg class="bio" viewBox="0 0 1000 190" preserveAspectRatio="none" aria-hidden="true">
          <path class="area" :d="area" />
          <path class="linha-bio" :d="curva" pathLength="1" />
          <path class="proj" :d="projecao" />
        </svg>
        <span class="marco" :style="{ left: pct(41), top: '4px' }">Cap 41–44 · sobrecarga</span>
        <span class="marco" :style="{ left: pct(46), bottom: '30px' }">Cap 45 · extinta</span>
        <span class="marco" :style="{ left: pct(Math.min(ultimo.n + 2, TOTAL - 4)), bottom: '70px' }">130 →</span>
      </div>
      <div class="eixo">
        <div v-for="a in arcos" :key="a.id" :style="{ '--c': a.cor, flex: a.fim - a.de + 1 }" :title="`${a.nome} · ${a.de}–${a.fim}`">
          {{ a.nome }} <span>{{ a.de }}–{{ a.ate === Infinity ? '…' : a.ate }}</span>
        </div>
      </div>
    </div>
    <div class="legenda mono">
      <span><i />Bioeletricidade de Elara</span>
      <span><i class="t" />Projeção do arco 130+</span>
      <span><i class="g" />Capítulo lido</span>
      <span><i class="f" />Em escrita</span>
    </div>

    <div class="grade">
      <article class="detalhe" aria-live="polite">
        <div :key="atual.n" class="troca">
          <span class="num" aria-hidden="true">{{ tresDigitos(atual.n) }}</span>
          <span class="mono" :style="{ color: arcoAtual.cor }">Arco {{ ROMANOS[arcoAtual.id] }} · {{ arcoAtual.nome }}</span>
          <h3>{{ atual.titulo }}</h3>
          <p class="local">
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M6 13S1 8 1 5a5 5 0 0 1 10 0c0 3-5 8-5 8z" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
            <span>{{ atual.local || 'Local não registrado' }}</span>
          </p>
          <div class="pchips">
            <span v-for="p in atual.pers" :key="p" class="pchip">{{ p }}</span>
            <span class="pchip fraco">{{ fmt(atual.palavras) }} palavras · {{ tempoLeitura(atual.palavras) }} min</span>
          </div>
          <blockquote>{{ atual.trecho }}</blockquote>
          <div class="acoes">
            <a class="btn prim" :href="withBase(atual.link + '.html')">{{ lidos.has(atual.n) ? 'Reler capítulo' : 'Ler capítulo' }}</a>
            <a v-if="atual.reflexao" class="btn" :href="withBase(atual.reflexao + '.html')">Reflexão</a>
          </div>
        </div>
      </article>
      <div>
        <div class="lista-cab mono"><span>{{ visiveis.length }} {{ visiveis.length === 1 ? 'capítulo' : 'capítulos' }}</span><span>← → percorre o mapa</span></div>
        <nav class="lista" aria-label="Lista de capítulos">
          <a
            v-for="c in visiveis" :key="c.n" :href="withBase(c.link + '.html')" :data-n="c.n"
            :class="{ sel: c.n === selecionado }" :title="`Capítulo ${c.n}: ${c.titulo}`" @mouseenter="aoPassar(c)"
          >
            <span class="n">{{ tresDigitos(c.n) }}</span>
            <span class="t">{{ c.titulo }}</span>
            <span class="r" :class="{ ok: lidos.has(c.n) }">{{ lidos.has(c.n) ? 'LIDO' : tempoLeitura(c.palavras) + ' MIN' }}</span>
          </a>
          <p v-if="!visiveis.length" class="vazio mono">Nada nesse trecho do poço. Limpe um filtro.</p>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mapa { padding: 56px 0 24px; scroll-margin-top: calc(var(--vp-nav-height) + 16px); }
.cab { display: grid; gap: .5rem; margin-bottom: 1.8rem; }
.olho { font-family: var(--cds-f-mono); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--cds-enxofre-texto); display: flex; align-items: center; gap: .6rem; margin: 0; }
.olho::before { content: ''; width: 22px; height: 2px; background: currentColor; }
h2 { font-family: var(--cds-f-display); font-weight: 900; text-transform: uppercase; font-size: clamp(2.4rem, 6vw, 3.8rem); line-height: .95; margin: 0; color: var(--cds-cinza); }
.lede { color: var(--cds-fumo); max-width: 64ch; margin: .4rem 0 0; line-height: 1.6; }
.mono { font-family: var(--cds-f-mono); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
.filtros { display: grid; gap: .7rem; margin-bottom: 1.2rem; }
.linha { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; }
.rot { color: var(--cds-fumo); min-width: 72px; }
.chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.chip { border: 1px solid var(--cds-veio); background: transparent; border-radius: 999px; padding: .3rem .7rem; font-family: var(--cds-f-mono); font-size: .7rem; color: var(--cds-fumo); display: inline-flex; align-items: center; gap: .4rem; transition: all .2s; }
.chip:hover { color: var(--cds-cinza); border-color: var(--cds-fumo); }
.chip[aria-pressed='true'] { color: var(--cds-oleo); background: var(--cds-cinza); border-color: var(--cds-cinza); }
.chip i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.campo { display: flex; align-items: center; gap: .5rem; border: 1px solid var(--cds-veio); background: var(--cds-escoria); border-radius: 4px; padding: .35rem .6rem; min-width: 0; flex: 1; max-width: 340px; color: var(--cds-fumo); }
.campo input { all: unset; flex: 1; min-width: 0; font-family: var(--cds-f-mono); font-size: .8rem; color: var(--cds-cinza); }
.sismo-caixa { overflow-x: auto; border: 1px solid var(--cds-veio); background: linear-gradient(180deg, var(--cds-escoria), var(--cds-oleo)); border-radius: 4px; scrollbar-width: thin; }
.sismo { position: relative; min-width: 640px; margin: 22px 14px 0; height: 190px; }
.barras { display: flex; align-items: flex-end; gap: 2px; height: 100%; }
.barra { flex: 1; min-width: 0; border: 0; padding: 0; background: var(--c); height: calc(var(--h) * 1%); border-radius: 1px 1px 0 0; transform-origin: bottom; opacity: .85; cursor: pointer; position: relative; transition: opacity .25s, filter .25s, transform .25s var(--cds-ease); animation: subir .8s var(--cds-ease) both; animation-delay: calc(var(--i) * 6ms); }
@keyframes subir { from { transform: scaleY(.08); } }
.barra:hover, .barra.sel { opacity: 1; filter: brightness(1.3); transform: scaleY(1.06); }
.barra.sel { background: var(--cds-enxofre); box-shadow: 0 0 14px var(--cds-enxofre); }
.barra.apagada { opacity: .13; }
.barra.lida::after { content: ''; position: absolute; left: 0; right: 0; bottom: -5px; height: 3px; background: var(--cds-musgo); }
.barra.fantasma { background: transparent; border: 1px dashed var(--cds-veio); border-bottom: 0; animation: none; cursor: default; height: 30%; }
.bio { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.bio .area { fill: var(--cds-volt-suave); }
.bio .linha-bio { fill: none; stroke: var(--cds-volt); stroke-width: 2; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 5px var(--cds-volt)); stroke-dasharray: 1; stroke-dashoffset: 1; animation: desenhar 2.6s .4s var(--cds-ease) forwards; }
.bio .proj { fill: none; stroke: var(--cds-volt); stroke-width: 2; vector-effect: non-scaling-stroke; stroke-dasharray: 4 5; opacity: .75; }
@keyframes desenhar { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .bio .linha-bio { stroke-dashoffset: 0; } }
.marco { position: absolute; font-family: var(--cds-f-mono); font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; color: var(--cds-volt); white-space: nowrap; pointer-events: none; padding-left: 4px; }
.eixo { display: flex; gap: 2px; padding: 12px 14px 12px; min-width: 668px; }
.eixo div { border-top: 2px solid var(--c); padding-top: 5px; font-family: var(--cds-f-mono); font-size: .58rem; color: var(--cds-fumo); letter-spacing: .06em; text-transform: uppercase; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; min-width: 0; }
.eixo span { opacity: .6; }
.legenda { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; margin-top: .7rem; color: var(--cds-fumo); }
.legenda span { display: inline-flex; align-items: center; gap: .4rem; }
.legenda i { display: inline-block; width: 16px; height: 2px; background: var(--cds-volt); }
.legenda i.t { background: repeating-linear-gradient(90deg, var(--cds-volt) 0 4px, transparent 4px 8px); }
.legenda i.g { background: var(--cds-musgo); height: 3px; }
.legenda i.f { width: 10px; height: 12px; background: transparent; border: 1px dashed var(--cds-fumo); border-bottom: 0; }
.grade { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 1.2rem; margin-top: 1.4rem; }
@media (max-width: 860px) { .grade { grid-template-columns: 1fr; } }
.detalhe { border: 1px solid var(--cds-veio); background: var(--cds-escoria); border-radius: 4px; padding: 1.3rem; position: relative; overflow: hidden; min-height: 320px; color: var(--cds-cinza); }
.troca { animation: troca .45s var(--cds-ease); display: grid; gap: .3rem; }
@keyframes troca { from { opacity: 0; transform: translateY(8px); } }
.num { font-family: var(--cds-f-estencil); font-weight: 900; font-size: 5.5rem; line-height: .8; color: transparent; -webkit-text-stroke: 1px var(--cds-fumo); position: absolute; right: .6rem; top: .6rem; opacity: .5; font-variant-numeric: tabular-nums; }
.detalhe h3 { font-family: var(--cds-f-display); font-weight: 900; font-size: 2rem; line-height: 1; text-transform: uppercase; margin: .3rem 0 .4rem; max-width: 78%; }
.local { color: var(--cds-fumo); font-family: var(--cds-f-mono); font-size: .74rem; display: flex; gap: .4rem; align-items: flex-start; margin: 0; }
.local svg { flex: none; margin-top: 2px; }
.pchips { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .6rem; }
.pchip { font-family: var(--cds-f-mono); font-size: .68rem; padding: .15rem .5rem; border-radius: 2px; background: var(--cds-escoria-2); border: 1px solid var(--cds-veio); }
.pchip.fraco { color: var(--cds-fumo); }
blockquote { margin: 1rem 0; padding-left: 1rem; border-left: 2px solid var(--cds-volt); font-style: italic; font-size: .98rem; line-height: 1.6; }
.acoes { display: flex; flex-wrap: wrap; gap: .5rem; }
.btn { display: inline-flex; align-items: center; padding: .7rem 1rem; border-radius: 3px; border: 1px solid var(--cds-veio); background: var(--cds-oleo); color: var(--cds-cinza); text-decoration: none; font-family: var(--cds-f-mono); font-size: .74rem; letter-spacing: .06em; text-transform: uppercase; transition: transform .2s var(--cds-ease), border-color .2s; }
.btn:hover { transform: translateY(-2px); border-color: var(--cds-volt); }
.btn.prim { background: var(--cds-enxofre); color: var(--cds-enxofre-tinta); border-color: var(--cds-enxofre); }
.lista-cab { display: flex; justify-content: space-between; color: var(--cds-fumo); margin-bottom: .4rem; }
.lista { border: 1px solid var(--cds-veio); border-radius: 4px; max-height: 360px; overflow: auto; scrollbar-width: thin; background: var(--cds-oleo); }
.lista a { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: .6rem; border-bottom: 1px solid var(--cds-veio); padding: .55rem .8rem; align-items: center; color: var(--cds-cinza); text-decoration: none; transition: background .15s; }
.lista a:hover, .lista a.sel { background: var(--cds-escoria-2); }
.lista a.sel .n { color: var(--cds-enxofre-texto); }
.n { font-family: var(--cds-f-mono); font-size: .72rem; color: var(--cds-fumo); font-variant-numeric: tabular-nums; }
.t { font-size: .92rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.r { font-family: var(--cds-f-mono); font-size: .62rem; color: var(--cds-fumo); }
.r.ok { color: var(--cds-musgo); }
.vazio { padding: 1rem; color: var(--cds-fumo); margin: 0; }
</style>
