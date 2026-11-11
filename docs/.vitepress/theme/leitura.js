// Estado de leitura compartilhado entre componentes, persistido no navegador.
// Tudo que toca window/localStorage roda só no cliente (SSR-safe).
import { reactive, watch } from 'vue'
import { inBrowser } from 'vitepress'

const PREFIXO = 'cds-'

function ler(chave, padrao) {
  if (!inBrowser) return padrao
  try {
    const v = localStorage.getItem(PREFIXO + chave)
    return v == null ? padrao : JSON.parse(v)
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  if (!inBrowser) return
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
  } catch {
    /* armazenamento bloqueado: segue sem persistir */
  }
}

export const AMBIENTES = [
  { id: 'auto', nome: 'Automático', amostra: 'linear-gradient(135deg,#0c0b10 50%,#f1ece2 50%)' },
  { id: 'noir', nome: 'Noir', amostra: '#0f0e13' },
  { id: 'sepia', nome: 'Sépia', amostra: '#3a2f20' },
  { id: 'papel', nome: 'Papel', amostra: '#ece6da' }
]

export const leitura = reactive({
  pronto: false,
  tamanho: 19,
  ambiente: 'auto',
  foco: false,
  som: false,
  gaveta: false,
  progresso: { n: 0, p: 0 },
  lidos: []
})

export const ui = reactive({ comandos: false, aviso: '', avisoId: 0 })

/** Carrega preferências salvas e passa a persistir mudanças. Idempotente. */
export function iniciarLeitura() {
  if (leitura.pronto || !inBrowser) return
  leitura.tamanho = ler('tamanho', 19)
  leitura.ambiente = ler('ambiente', 'auto')
  leitura.progresso = ler('progresso', { n: 0, p: 0 })
  leitura.lidos = ler('lidos', [])
  leitura.pronto = true
  watch(() => leitura.tamanho, (v) => gravar('tamanho', v))
  watch(() => leitura.ambiente, (v) => gravar('ambiente', v))
  watch(() => leitura.progresso, (v) => gravar('progresso', v), { deep: true })
  watch(() => leitura.lidos, (v) => gravar('lidos', v), { deep: true })
}

export function marcarLido(n) {
  if (!leitura.lidos.includes(n)) leitura.lidos.push(n)
}

export function avisar(msg) {
  ui.aviso = msg
  ui.avisoId++
}

export function abrirComandos() {
  ui.comandos = true
}

export const tempoLeitura = (palavras) => Math.max(1, Math.round(palavras / 200))
export const tresDigitos = (n) => String(n).padStart(3, '0')
export const normalizar = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
export const reduzMovimento = () => inBrowser && matchMedia('(prefers-reduced-motion: reduce)').matches
