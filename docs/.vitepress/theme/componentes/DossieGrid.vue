<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { PERSONAGENS } from '../dados/personagens.js'
import { reduzMovimento } from '../leitura.js'

const dialogo = ref(null)
const aberto = ref(null)
const ultimo = capitulos[capitulos.length - 1]
const img = (nome) => withBase(`/midia/${nome}.jpg`)
const COR = { sangue: 'var(--cds-sangue)', enxofre: 'var(--cds-enxofre)', volt: 'var(--cds-volt)' }
const aparicoes = (p) => capitulos.filter((c) => c.pers.some((x) => x.startsWith(p.match))).map((c) => c.n)

function abrir(p) {
  const ns = aparicoes(p)
  aberto.value = { ...p, ns, set: new Set(ns) }
  dialogo.value?.showModal()
}
function fechar() { dialogo.value?.close() }

function inclinar(e) {
  if (reduzMovimento() || e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`
}
const soltar = (e) => (e.currentTarget.style.transform = '')
</script>

<template>
  <div class="dossies vp-raw">
    <div class="grade">
      <button
        v-for="p in PERSONAGENS" :key="p.id" type="button" class="ficha"
        :aria-label="`Abrir dossiê: ${p.nome}`" @click="abrir(p)" @pointermove="inclinar" @pointerleave="soltar"
      >
        <span class="foto"><img :src="img(p.img)" alt="" loading="lazy" decoding="async"></span>
        <span class="corpo">
          <span class="estado" :class="p.estado[0]">{{ p.estado[1] }}</span>
          <span class="nome">{{ p.nome }}</span>
          <span class="papel">{{ p.papel }}</span>
          <span v-for="m in p.medidores.slice(0, 2)" :key="m[0]" class="medidor">
            <span>{{ m[0] }}</span><span>{{ m[3] }}</span>
            <span class="trilho"><i :style="{ width: m[1] + '%', background: COR[m[2]] }" /></span>
          </span>
        </span>
      </button>
    </div>

    <dialog ref="dialogo" class="ficha-aberta" aria-label="Dossiê" @click.self="fechar" @close="aberto = null">
      <template v-if="aberto">
        <button class="x" type="button" aria-label="Fechar" @click="fechar">✕</button>
        <div class="dg">
          <img :src="img(aberto.img)" :alt="aberto.nome">
          <div class="db">
            <span class="estado" :class="aberto.estado[0]">{{ aberto.estado[1] }}</span>
            <h3>{{ aberto.nome }}</h3>
            <span class="papel">{{ aberto.papel }}</span>
            <p>{{ aberto.texto }}</p>
            <span v-for="m in aberto.medidores" :key="m[0]" class="medidor">
              <span>{{ m[0] }}</span><span>{{ m[3] }}</span>
              <span class="trilho"><i :style="{ width: m[1] + '%', background: COR[m[2]] }" /></span>
            </span>
            <div>
              <div class="papel">Presença nos capítulos · {{ aberto.ns.length ? aberto.ns.length + ' marcados' : 'citado no texto, sem marcação nos metadados' }}</div>
              <div class="presenca" aria-hidden="true"><i v-for="c in capitulos" :key="c.n" :class="{ on: aberto.set.has(c.n) }" :title="`Cap. ${c.n}`" /></div>
              <div class="papel eixo"><span>1</span><span>{{ ultimo.n }}</span></div>
            </div>
            <div class="acoes">
              <a class="btn" :href="'#' + aberto.ancora" @click="fechar">Ficha completa</a>
              <template v-if="aberto.ns.length">
                <a class="btn" :href="withBase(`/public/capitulos/capitulo-${aberto.ns[0]}.html`)">Primeira aparição · Cap. {{ aberto.ns[0] }}</a>
                <a class="btn" :href="withBase(`/public/capitulos/capitulo-${aberto.ns[aberto.ns.length - 1]}.html`)">Última · Cap. {{ aberto.ns[aberto.ns.length - 1] }}</a>
              </template>
            </div>
          </div>
        </div>
      </template>
    </dialog>
  </div>
</template>

<style scoped>
.dossies { margin: 1.5rem 0 3rem; }
.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.ficha { position: relative; text-align: left; background: var(--cds-escoria); border: 1px solid var(--cds-veio); border-radius: 4px; padding: 0; overflow: hidden; display: flex; flex-direction: column; color: var(--cds-cinza); transition: transform .35s var(--cds-ease), border-color .3s; }
.ficha:hover { border-color: var(--cds-volt); }
.foto { display: block; aspect-ratio: 16 / 10; overflow: hidden; position: relative; background: var(--cds-escoria-2); }
.foto img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1) contrast(1.1) brightness(.82); transition: filter .6s, transform .8s var(--cds-ease); }
.ficha:hover .foto img { filter: grayscale(.1) contrast(1.05); transform: scale(1.05); }
.foto::after { content: ''; position: absolute; left: 0; right: 0; height: 30%; top: -30%; background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--cds-volt) 30%, transparent), transparent); pointer-events: none; }
.ficha:hover .foto::after { animation: varrer 1.2s var(--cds-ease); }
@keyframes varrer { to { top: 100%; } }
.corpo { display: grid; gap: .45rem; padding: .9rem 1rem 1rem; }
.nome { font-family: var(--cds-f-display); font-weight: 900; text-transform: uppercase; font-size: 1.4rem; line-height: 1; }
.papel { font-family: var(--cds-f-mono); font-size: .66rem; letter-spacing: .04em; color: var(--cds-fumo); }
.estado { display: inline-flex; align-items: center; gap: .4rem; width: max-content; font-family: var(--cds-f-mono); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; padding: .15rem .45rem; border-radius: 2px; }
.estado::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.estado.crit { color: var(--cds-sangue); background: color-mix(in srgb, var(--cds-sangue) 12%, transparent); }
.estado.warn { color: var(--cds-enxofre-texto); background: color-mix(in srgb, var(--cds-enxofre) 12%, transparent); }
.estado.ok { color: var(--cds-musgo); background: color-mix(in srgb, var(--cds-musgo) 12%, transparent); }
.estado.off { color: var(--cds-fumo); background: color-mix(in srgb, var(--cds-fumo) 12%, transparent); }
.medidor { display: grid; grid-template-columns: 1fr auto; gap: .2rem .5rem; font-family: var(--cds-f-mono); font-size: .64rem; color: var(--cds-fumo); }
.trilho { grid-column: 1 / -1; height: 4px; background: var(--cds-veio); border-radius: 2px; overflow: hidden; }
.trilho i { display: block; height: 100%; }
.ficha-aberta { border: 1px solid var(--cds-veio); background: var(--cds-escoria); color: var(--cds-cinza); border-radius: 6px; padding: 0; width: min(880px, calc(100vw - 32px)); max-height: calc(100vh - 40px); }
.ficha-aberta::backdrop { background: color-mix(in srgb, var(--cds-oleo) 75%, transparent); backdrop-filter: blur(4px); }
.ficha-aberta[open] { animation: pop .45s var(--cds-ease); }
@keyframes pop { from { opacity: 0; transform: translateY(16px) scale(.98); } }
.x { position: absolute; top: .6rem; right: .6rem; z-index: 2; width: 34px; height: 34px; border: 1px solid var(--cds-veio); border-radius: 3px; background: var(--cds-oleo); color: var(--cds-cinza); }
.dg { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
@media (max-width: 720px) { .dg { grid-template-columns: 1fr; } }
.dg img { width: 100%; height: 100%; max-height: 460px; object-fit: cover; display: block; }
.db { padding: 1.4rem; display: grid; gap: .8rem; align-content: start; min-width: 0; }
.db h3 { font-family: var(--cds-f-display); font-weight: 900; font-size: 2.4rem; text-transform: uppercase; line-height: .9; margin: 0; }
.db p { margin: 0; font-size: .95rem; line-height: 1.6; }
.presenca { display: flex; gap: 1px; height: 24px; margin-top: .4rem; }
.presenca i { flex: 1; background: var(--cds-veio); }
.presenca i.on { background: var(--cds-volt); }
.eixo { display: flex; justify-content: space-between; margin-top: .2rem; }
.acoes { display: flex; flex-wrap: wrap; gap: .5rem; }
.btn { display: inline-flex; padding: .6rem .9rem; border: 1px solid var(--cds-veio); border-radius: 3px; color: var(--cds-cinza); text-decoration: none; font-family: var(--cds-f-mono); font-size: .7rem; letter-spacing: .05em; text-transform: uppercase; transition: border-color .2s; }
.btn:hover { border-color: var(--cds-volt); }
</style>
