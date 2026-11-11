<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { arcoDe, ROMANOS } from '../../lib/arcos.mjs'
import { tempoLeitura, tresDigitos } from '../leitura.js'

const { page } = useData()

const contexto = computed(() => {
  const rel = page.value.relativePath
  let m = rel.match(/^public\/capitulos\/capitulo-(\d+)\.md$/)
  if (m) return { tipo: 'cap', c: capitulos.find((x) => x.n === Number(m[1])) }
  m = rel.match(/^reflexoes\/reflexao-(?:capitulo-)?(\d+)\.md$/)
  if (m) return { tipo: 'ref', c: capitulos.find((x) => x.n === Number(m[1])) }
  return null
})
const c = computed(() => contexto.value?.c)
const arco = computed(() => c.value && arcoDe(c.value.n))
</script>

<template>
  <header v-if="contexto?.tipo === 'cap' && c" class="cab-cap vp-raw">
    <span class="num">{{ tresDigitos(c.n) }}</span>
    <span class="mono" :style="{ color: arco.cor }">Capítulo {{ c.n }} · Arco {{ ROMANOS[arco.id] }} · {{ arco.nome }}</span>
    <h1 class="titulo">{{ c.titulo }}</h1>
    <div class="meta mono">
      <span v-if="c.local">⌖ {{ c.local }}</span>
      <span v-if="c.pers.length">Em cena: {{ c.pers.join(', ') }}</span>
      <span>{{ tempoLeitura(c.palavras) }} min · {{ c.palavras.toLocaleString('pt-BR') }} palavras</span>
      <span v-if="c.data">{{ c.data }}</span>
    </div>
  </header>

  <aside v-else-if="contexto?.tipo === 'ref' && c" class="cab-ref vp-raw">
    <a class="volta mono" :href="withBase(c.link + '.html')">← Voltar ao Cap. {{ c.n }} · {{ c.titulo }}</a>
    <div v-if="c.notas.length" class="notas">
      <div v-for="[k, v] in c.notas" :key="k" class="nota">
        <span class="mono">{{ k }}</span><span class="mono v">{{ v }}/10</span>
        <span class="trilho"><i :style="{ width: v * 10 + '%' }" /></span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cab-cap { display: grid; gap: .5rem; margin: 0 0 2.4rem; animation: entra .8s var(--cds-ease) both; }
@keyframes entra { from { opacity: 0; transform: translateY(12px); } }
.num { font-family: var(--cds-f-estencil); font-weight: 900; font-size: clamp(3.6rem, 10vw, 6.2rem); line-height: .8; color: var(--cds-volt); font-variant-numeric: tabular-nums; }
.titulo { font-family: var(--cds-f-display); font-weight: 900; text-transform: uppercase; font-size: clamp(2rem, 5vw, 3rem); line-height: .95; margin: .2rem 0; color: var(--cds-cinza); text-wrap: balance; }
.mono { font-family: var(--cds-f-mono); font-size: .68rem; letter-spacing: .07em; text-transform: uppercase; }
.meta { color: var(--cds-fumo); display: flex; flex-wrap: wrap; gap: .3rem 1.1rem; text-transform: none; letter-spacing: .02em; }
.cab-ref { display: grid; gap: 1rem; margin-bottom: 1.6rem; padding: 1rem 1.1rem; border: 1px solid var(--cds-veio); border-left: 2px solid var(--cds-volt); background: var(--cds-escoria); border-radius: 4px; }
.volta { color: var(--cds-enxofre-texto); text-decoration: none; }
.volta:hover { text-decoration: underline; }
.notas { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .8rem 1.2rem; }
.nota { display: grid; grid-template-columns: 1fr auto; gap: .3rem; color: var(--cds-cinza); }
.nota .v { color: var(--cds-fumo); }
.trilho { grid-column: 1 / -1; height: 5px; background: var(--cds-veio); border-radius: 3px; overflow: hidden; }
.trilho i { display: block; height: 100%; background: linear-gradient(90deg, var(--cds-volt), var(--cds-enxofre)); animation: encher 1.1s var(--cds-ease) both; transform-origin: left; }
@keyframes encher { from { transform: scaleX(0); } }
</style>
