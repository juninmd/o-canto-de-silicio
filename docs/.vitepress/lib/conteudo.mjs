// Leitura do conteúdo em Markdown (capítulos e reflexões) direto do disco.
// Usado pelo config.mjs (sidebar, prev/next) e pelo data loader do tema.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARCOS, arcoDe } from './arcos.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
export const DOCS = path.resolve(AQUI, '../..')
const DIR_CAP = path.join(DOCS, 'public/capitulos')
const DIR_REF = path.join(DOCS, 'reflexoes')

const limpar = (s = '') => s.trim().replace(/^["']|["']$/g, '').trim()
const semPrefixo = (t = '') => t.replace(/^Cap[íi]tulo\s*\d+\s*[:\-–—]\s*/i, '').trim()

/** Separa o frontmatter (YAML simples chave: valor) do corpo. */
export function lerFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { fm: {}, corpo: src }
  const fm = {}
  for (const linha of m[1].split(/\r?\n/)) {
    const kv = linha.match(/^([^:#\s][^:]*):\s*(.*)$/)
    if (kv) fm[kv[1].trim()] = kv[2].trim()
  }
  return { fm, corpo: m[2] }
}

function lista(valor = '') {
  return limpar(valor).replace(/^\[|\]$/g, '').split(',')
    .map((p) => limpar(p).replace(/\s*\(.*?\)\s*/g, '').trim())
    .filter(Boolean)
    .filter((p, i, arr) => arr.indexOf(p) === i)
}

function metaNegrito(corpo, rotulo) {
  const m = corpo.match(new RegExp(`^\\*\\*${rotulo}:?\\*\\*:?\\s*(.+)$`, 'im'))
  return m ? m[1].trim() : ''
}

function primeiroParagrafo(corpo) {
  const blocos = corpo.split(/\r?\n\s*\r?\n/).map((b) => b.trim())
  const p = blocos.find((b) => b && !/^(#|!\[|<|---|\*\*[^*]+:\*\*|\*\*[^*]+\*\*:|>|\|)/.test(b)) || ''
  let txt = p.replace(/\r?\n/g, ' ').replace(/\*\*?|__?/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  if (txt.length > 240) txt = txt.slice(0, txt.lastIndexOf(' ', 240)) + '…'
  return txt
}

const contarPalavras = (corpo) =>
  corpo.replace(/^#.*$/gm, '').replace(/[*_#>\-]/g, ' ').split(/\s+/).filter(Boolean).length

/** Mapa nº do capítulo → caminho da reflexão (aceita os dois padrões de nome). */
export function reflexoesPorCapitulo() {
  const mapa = new Map()
  if (!fs.existsSync(DIR_REF)) return mapa
  for (const f of fs.readdirSync(DIR_REF)) {
    const m = f.match(/^reflexao-(?:capitulo-)?(\d+)\.md$/)
    if (m) mapa.set(Number(m[1]), path.join(DIR_REF, f))
  }
  return mapa
}

function notasDaReflexao(arquivo) {
  const src = fs.readFileSync(arquivo, 'utf8')
  const notas = []
  for (const [rotulo, re] of [
    ['Ritmo', /Ritmo[^\n]*?(\d+(?:[.,]\d+)?)\s*\/\s*10/i],
    ['Diálogos', /Di[aá]logos[^\n]*?(\d+(?:[.,]\d+)?)\s*\/\s*10/i],
    ['Atmosfera', /Atmosfera[^\n]*?(\d+(?:[.,]\d+)?)\s*\/\s*10/i]
  ]) {
    const m = src.match(re)
    if (m) notas.push([rotulo, Number(m[1].replace(',', '.'))])
  }
  return notas
}

/** Lista completa e ordenada de capítulos com metadados para a UI. */
export function lerCapitulos() {
  const refl = reflexoesPorCapitulo()
  const arquivos = fs.readdirSync(DIR_CAP)
    .map((f) => ({ f, n: Number((f.match(/^capitulo-(\d+)\.md$/) || [])[1]) }))
    .filter((x) => x.n)
    .sort((a, b) => a.n - b.n)

  return arquivos.map(({ f, n }) => {
    const src = fs.readFileSync(path.join(DIR_CAP, f), 'utf8')
    const { fm, corpo } = lerFrontmatter(src)
    const h1 = (corpo.match(/^#\s+(.+)$/m) || [])[1] || ''
    let titulo = semPrefixo(limpar(fm.title || '')) || semPrefixo(h1)
    if (!titulo || /^Cap[íi]tulo\s*\d+$/i.test(titulo)) titulo = semPrefixo(h1) || `Capítulo ${n}`
    const local = limpar(fm['localização'] || fm.localizacao || '') || metaNegrito(corpo, 'Localiza[çc][ãa]o')
    const pers = lista(fm.personagens || metaNegrito(corpo, 'Personagens'))
    const data = limpar(fm.data || '') || metaNegrito(corpo, 'Data')
    const reflArq = refl.get(n)
    return {
      n,
      titulo,
      link: `/public/capitulos/capitulo-${n}`,
      local,
      data,
      pers,
      palavras: contarPalavras(corpo),
      trecho: primeiroParagrafo(corpo),
      arco: arcoDe(n).id,
      reflexao: reflArq ? `/reflexoes/${path.basename(reflArq, '.md')}` : null,
      notas: reflArq ? notasDaReflexao(reflArq) : []
    }
  })
}

export { ARCOS, arcoDe }
