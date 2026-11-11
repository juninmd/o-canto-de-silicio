<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { CAMADAS, capitulosPorCamada } from '../dados/atlas.js'

const porCamada = capitulosPorCamada(capitulos)
const sel = ref('fundo')
const camada = computed(() => CAMADAS.find((c) => c.id === sel.value))
const ns = computed(() => porCamada[sel.value])
const nsSet = computed(() => new Set(ns.value))

function lerHash() {
  const m = location.hash.match(/^#camada-([\w-]+)$/)
  if (m && porCamada[m[1]]) {
    sel.value = m[1]
    document.getElementById('atlas')?.scrollIntoView({ block: 'start' })
  }
}
function escolher(id) {
  sel.value = id
  history.replaceState(history.state, '', `#camada-${id}`)
}
onMounted(() => {
  lerHash()
  addEventListener('hashchange', lerHash)
})
onBeforeUnmount(() => removeEventListener('hashchange', lerHash))
</script>

<template>
  <section id="atlas" class="atlas vp-raw" aria-label="Atlas estratigráfico de Nova Aether">
    <div class="estratos" role="listbox" aria-label="Camadas, da órbita ao fundo">
      <button
        v-for="c in CAMADAS" :id="`camada-${c.id}`" :key="c.id" type="button" role="option"
        class="estrato" :class="{ sel: c.id === sel }" :aria-selected="c.id === sel" :style="{ '--fundo': c.fundo }"
        @click="escolher(c.id)"
      >
        <span class="nv">{{ c.nivel }}</span>
        <span class="nm">{{ c.nome }}<span v-if="c.aqui" class="aqui" title="Elara e Jaxon estão aqui" /></span>
        <span class="ct">{{ porCamada[c.id].length }} cap.</span>
      </button>
    </div>

    <article :key="camada.id" class="lugar" aria-live="polite">
      <div class="foto">
        <img v-if="camada.img" :src="withBase(`/midia/${camada.img}.jpg`)" :alt="camada.nome" loading="lazy">
        <svg v-else viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="320" height="180" :fill="camada.fundo" />
          <ellipse v-for="i in 9" :key="i" cx="160" cy="92" :rx="150 - i * 16" :ry="80 - i * 8.5" fill="none" stroke="#3a4a46" stroke-width="1" />
          <rect y="120" width="320" height="60" fill="#05080a" opacity=".85" />
          <template v-if="camada.aqui">
            <circle cx="142" cy="92" r="4" fill="#f0b429" />
            <circle cx="178" cy="92" r="4" fill="#f0b429" />
          </template>
        </svg>
      </div>
      <div class="corpo">
        <span class="mono">{{ camada.nivel }} · {{ ns.length }} capítulos<template v-if="ns.length"> · do {{ ns[0] }} ao {{ ns[ns.length - 1] }}</template></span>
        <h3>{{ camada.nome }}</h3>
        <p>{{ camada.texto }}</p>
        <p class="cheiro">Cheiro: {{ camada.cheiro }}</p>
        <template v-if="ns.length">
          <div class="presenca" aria-hidden="true"><i v-for="c in capitulos" :key="c.n" :class="{ on: nsSet.has(c.n) }" /></div>
          <a class="btn" :href="withBase(`/public/capitulos/capitulo-${ns[ns.length - 1]}.html`)">Ler o mais recente aqui · Cap. {{ ns[ns.length - 1] }}</a>
        </template>
        <p v-else class="mono">Nenhum capítulo nesta camada ainda.</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.atlas { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 1.2rem; margin: 1.5rem 0 3rem; scroll-margin-top: calc(var(--vp-nav-height) + 16px); }
@media (max-width: 860px) { .atlas { grid-template-columns: 1fr; } }
.estratos { display: flex; flex-direction: column; border: 1px solid var(--cds-veio); border-radius: 4px; overflow: hidden; align-self: start; }
.estrato { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: .6rem; align-items: center; text-align: left; border: 0; border-bottom: 1px solid #00000040; padding: .75rem .9rem; background: var(--fundo); color: #ebe6dc; transition: padding .35s var(--cds-ease), filter .3s; scroll-margin-top: calc(var(--vp-nav-height) + 16px); }
.estrato:hover { filter: brightness(1.25); }
.estrato.sel { padding-block: 1.15rem; box-shadow: inset 3px 0 0 var(--cds-enxofre); }
.nv { font-family: var(--cds-f-mono); font-size: .66rem; color: #9a94a3; }
.nm { font-family: var(--cds-f-display); font-weight: 700; font-size: 1.12rem; text-transform: uppercase; letter-spacing: .02em; }
.ct { font-family: var(--cds-f-mono); font-size: .64rem; color: #9a94a3; font-variant-numeric: tabular-nums; }
.aqui { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f0b429; margin-left: .5rem; vertical-align: middle; animation: ping 1.8s infinite; }
@keyframes ping { 0% { box-shadow: 0 0 0 0 #f0b429aa; } 70%, 100% { box-shadow: 0 0 0 10px #f0b42900; } }
.lugar { border: 1px solid var(--cds-veio); border-radius: 4px; background: var(--cds-escoria); overflow: hidden; color: var(--cds-cinza); animation: troca .45s var(--cds-ease); align-self: start; }
@keyframes troca { from { opacity: 0; transform: translateY(8px); } }
.foto { aspect-ratio: 16 / 9; overflow: hidden; background: #0c0b10; }
.foto img, .foto svg { width: 100%; height: 100%; object-fit: cover; display: block; }
.foto img { animation: kb 14s ease-in-out infinite alternate; }
@keyframes kb { to { transform: scale(1.08) translate(-1%, -1%); } }
.corpo { padding: 1.1rem 1.2rem 1.3rem; display: grid; gap: .6rem; }
.mono { font-family: var(--cds-f-mono); font-size: .68rem; letter-spacing: .07em; text-transform: uppercase; color: var(--cds-fumo); margin: 0; }
h3 { font-family: var(--cds-f-display); font-weight: 900; font-size: 2rem; text-transform: uppercase; line-height: .95; margin: 0; }
p { margin: 0; font-size: .95rem; line-height: 1.6; }
.cheiro { color: var(--cds-fumo); font-style: italic; }
.presenca { display: flex; gap: 1px; height: 22px; }
.presenca i { flex: 1; background: var(--cds-veio); }
.presenca i.on { background: var(--cds-volt); }
.btn { justify-self: start; display: inline-flex; padding: .6rem .9rem; border: 1px solid var(--cds-veio); border-radius: 3px; color: var(--cds-cinza); text-decoration: none; font-family: var(--cds-f-mono); font-size: .7rem; letter-spacing: .05em; text-transform: uppercase; transition: border-color .2s; }
.btn:hover { border-color: var(--cds-volt); }
</style>
