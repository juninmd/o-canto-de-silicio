<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { data as capitulos } from '../dados/capitulos.data.mjs'
import { PERSONAGENS } from '../dados/personagens.js'
import { CAMADAS } from '../dados/atlas.js'
import { AMBIENTES, iniciarLeitura, leitura, normalizar, tresDigitos, ui } from '../leitura.js'

const { isDark, page } = useData()
const router = useRouter()
const dialogo = ref(null)
const campo = ref(null)
const q = ref('')
const ativo = ref(0)

const naCapitulo = computed(() => /^public\/capitulos\/capitulo-\d+\.md$/.test(page.value.relativePath))
const ultimo = capitulos[capitulos.length - 1]
const ir = (url) => { fechar(); router.go(withBase(url)) }
const acao = (a) => { fechar(); dispatchEvent(new CustomEvent('cds:acao', { detail: a })) }

function textoIntegral(termo) {
  fechar()
  document.querySelector('.VPNavBarSearch button')?.click()
  if (!termo) return
  const preencher = (tentativas = 20) => {
    const input = document.querySelector('.VPLocalSearchBox input')
    if (!input) return tentativas && setTimeout(() => preencher(tentativas - 1), 50)
    input.value = termo
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
  preencher()
}

const acoes = computed(() => {
  const lista = []
  const p = leitura.progresso
  const c = p?.n && capitulos.find((x) => x.n === p.n)
  lista.push(c
    ? { t: `Continuar de onde parei · Cap. ${c.n} (${p.p}%)`, run: () => ir(c.link + '.html') }
    : { t: `Ler o mais recente · Cap. ${ultimo.n}`, run: () => ir(ultimo.link + '.html') })
  lista.push({ t: 'Abrir o Mapa da Descida', run: () => ir('/#mapa') })
  for (const a of AMBIENTES) lista.push({ t: `Ambiente de leitura: ${a.nome}`, run: () => { leitura.ambiente = a.id; fechar() } })
  if (naCapitulo.value) {
    lista.push({ t: leitura.foco ? 'Desligar o modo foco' : 'Ligar o modo foco', run: () => acao('foco') })
    lista.push({ t: 'Abrir a reflexão deste capítulo', run: () => acao('reflexao') })
    lista.push({ t: leitura.som ? 'Desligar o som do subnível' : 'Ligar o som do subnível', run: () => acao('som') })
  }
  lista.push({ t: isDark.value ? 'Mudar o site para o tema claro' : 'Mudar o site para o tema escuro', run: () => { isDark.value = !isDark.value; fechar() } })
  return lista
})

function realce(t, termo) {
  const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]))
  if (!termo) return esc(t)
  const i = normalizar(t).indexOf(termo)
  if (i < 0) return esc(t)
  return esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + termo.length)) + '</mark>' + esc(t.slice(i + termo.length))
}

const itens = computed(() => {
  const termo = normalizar(q.value.trim())
  const out = []
  const caps = termo
    ? capitulos.filter((c) => normalizar(c.titulo).includes(termo) || String(c.n) === termo).slice(0, 8)
    : capitulos.slice(-5).reverse()
  for (const c of caps) {
    out.push({ g: 'Capítulos', k: tresDigitos(c.n), t: realce(c.titulo, termo), s: c.local, run: () => ir(c.link + '.html') })
  }
  if (termo.length > 2) {
    capitulos
      .filter((c) => !normalizar(c.titulo).includes(termo) && normalizar(`${c.trecho} ${c.local} ${c.pers.join(' ')}`).includes(termo))
      .slice(0, 5)
      .forEach((c) => {
        const i = normalizar(c.trecho).indexOf(termo)
        const s = i >= 0 ? '…' + c.trecho.slice(Math.max(0, i - 30), i + 70) + '…' : c.local
        out.push({ g: 'Trechos e lugares', k: tresDigitos(c.n), t: realce(c.titulo, ''), s, run: () => ir(c.link + '.html') })
      })
  }
  PERSONAGENS.filter((p) => !termo || normalizar(`${p.nome} ${p.papel}`).includes(termo))
    .slice(0, termo ? 6 : 3)
    .forEach((p) => out.push({ g: 'Personagens', k: '◆', t: realce(p.nome, termo), s: p.papel, run: () => ir(`/personagens.html#${p.ancora}`) }))
  if (termo) {
    CAMADAS.filter((c) => normalizar(`${c.nome} ${c.texto}`).includes(termo))
      .forEach((c) => out.push({ g: 'Lugares', k: '⌖', t: realce(c.nome, termo), s: c.nivel, run: () => ir(`/sobre.html#camada-${c.id}`) }))
  }
  acoes.value.filter((a) => !termo || normalizar(a.t).includes(termo))
    .forEach((a) => out.push({ g: 'Ações', k: '↵', t: realce(a.t, termo), s: '', run: a.run }))
  out.push({ g: 'Texto integral', k: '¶', t: termo ? `Procurar “${realce(q.value.trim(), '')}” no texto de todos os capítulos` : 'Busca no texto integral dos capítulos', s: 'atalho: /', run: () => textoIntegral(q.value.trim()) })
  return out
})

watch(itens, () => (ativo.value = 0))
watch(() => ui.comandos, async (aberto) => {
  const d = dialogo.value
  if (!d) return
  if (aberto && !d.open) {
    q.value = ''
    d.showModal()
    await nextTick()
    campo.value?.focus()
  } else if (!aberto && d.open) d.close()
})

function fechar() { ui.comandos = false }
function mover(d) {
  const n = itens.value.length
  ativo.value = (ativo.value + d + n) % n
  nextTick(() => dialogo.value?.querySelector('.it.ativo')?.scrollIntoView({ block: 'nearest' }))
}
function teclasCampo(e) {
  if (e.key === 'ArrowDown') { e.preventDefault(); mover(1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1) }
  else if (e.key === 'Enter') { e.preventDefault(); itens.value[ativo.value]?.run() }
}

// Ctrl/⌘ K abre esta paleta (captura antes da busca nativa, que segue no "/").
function atalho(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K') && e.isTrusted !== false) {
    e.preventDefault()
    e.stopImmediatePropagation()
    ui.comandos = !ui.comandos
  }
}
onMounted(() => {
  iniciarLeitura()
  addEventListener('keydown', atalho, true)
})
onBeforeUnmount(() => removeEventListener('keydown', atalho, true))

const grupoNovo = (i) => i === 0 || itens.value[i - 1].g !== itens.value[i].g
</script>

<template>
  <dialog ref="dialogo" class="cmd vp-raw" aria-label="Comandos e busca" @close="ui.comandos = false" @click.self="fechar">
    <div class="entrada">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="m15 15 6 6" stroke="currentColor" stroke-width="2" /></svg>
      <input
        ref="campo" v-model="q" type="text" placeholder="Capítulo, trecho, personagem, lugar ou ação…"
        autocomplete="off" aria-label="Buscar" role="combobox" aria-expanded="true" aria-controls="cmd-lista" @keydown="teclasCampo"
      >
      <kbd class="cds-kbd">Esc</kbd>
    </div>
    <div id="cmd-lista" class="res" role="listbox">
      <template v-for="(it, i) in itens" :key="i">
        <div v-if="grupoNovo(i)" class="grp">{{ it.g }}</div>
        <button type="button" class="it" :class="{ ativo: i === ativo }" role="option" :aria-selected="i === ativo" @mousemove="ativo = i" @click="it.run()">
          <span class="k">{{ it.k }}</span>
          <span class="tx"><span v-html="it.t" /><span v-if="it.s" class="s">{{ it.s }}</span></span>
          <span class="k">{{ i === ativo ? '↵' : '' }}</span>
        </button>
      </template>
    </div>
    <div class="rodape"><span><kbd class="cds-kbd">↑</kbd> <kbd class="cds-kbd">↓</kbd> navegar</span><span><kbd class="cds-kbd">↵</kbd> abrir</span><span><kbd class="cds-kbd">/</kbd> texto integral</span></div>
  </dialog>
</template>

<style scoped>
.cmd { border: 1px solid var(--cds-veio); background: var(--cds-escoria); color: var(--cds-cinza); border-radius: 8px; padding: 0; width: min(640px, calc(100vw - 32px)); margin-top: 12vh; box-shadow: var(--cds-sombra); }
.cmd::backdrop { background: color-mix(in srgb, var(--cds-oleo) 70%, transparent); backdrop-filter: blur(4px); }
.cmd[open] { animation: pop .35s var(--cds-ease); }
@keyframes pop { from { opacity: 0; transform: translateY(14px) scale(.98); } }
.entrada { display: flex; align-items: center; gap: .6rem; padding: .9rem 1rem; border-bottom: 1px solid var(--cds-veio); color: var(--cds-fumo); }
.entrada input { all: unset; flex: 1; min-width: 0; font-family: var(--cds-f-leitura); font-size: 1.08rem; color: var(--cds-cinza); }
.res { max-height: min(56vh, 460px); overflow: auto; padding: .4rem; }
.grp { font-family: var(--cds-f-mono); font-size: .62rem; color: var(--cds-fumo); letter-spacing: .1em; text-transform: uppercase; padding: .7rem .6rem .3rem; }
.it { display: grid; grid-template-columns: 40px minmax(0, 1fr) 16px; gap: .6rem; align-items: center; width: 100%; text-align: left; padding: .55rem .6rem; border: 0; border-radius: 4px; background: transparent; color: var(--cds-cinza); font-size: .95rem; }
.it.ativo { background: var(--cds-escoria-2); box-shadow: inset 2px 0 0 var(--cds-enxofre); }
.k { font-family: var(--cds-f-mono); font-size: .7rem; color: var(--cds-fumo); }
.tx { min-width: 0; }
.s { display: block; font-family: var(--cds-f-mono); font-size: .66rem; color: var(--cds-fumo); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx :deep(mark) { background: transparent; color: var(--cds-enxofre-texto); }
.rodape { display: flex; gap: 1rem; flex-wrap: wrap; padding: .6rem 1rem; border-top: 1px solid var(--cds-veio); color: var(--cds-fumo); font-family: var(--cds-f-mono); font-size: .66rem; }
</style>
