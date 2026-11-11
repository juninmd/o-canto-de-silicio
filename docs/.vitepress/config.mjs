import { defineConfig } from 'vitepress'
import { lerCapitulos, ARCOS, arcoDe } from './lib/conteudo.mjs'
import { ROMANOS } from './lib/arcos.mjs'

// Sidebar, navegação e prev/next são gerados a partir do frontmatter dos
// capítulos: publicar o capítulo N+1 não exige mais editar este arquivo.
const capitulos = lerCapitulos()
const ultimo = capitulos[capitulos.length - 1]
const porLink = new Map()
capitulos.forEach((c) => {
  porLink.set(`public/capitulos/capitulo-${c.n}.md`, { tipo: 'cap', c })
  if (c.reflexao) porLink.set(`${c.reflexao.slice(1)}.md`, { tipo: 'ref', c })
})
const comReflexao = capitulos.filter((c) => c.reflexao)

const nomeArco = (a) => `Arco ${ROMANOS[a.id] || a.id} · ${a.nome}`
const arcosUsados = ARCOS.filter((a) => capitulos.some((c) => c.arco === a.id))

const sidebar = [
  {
    text: 'Leitura',
    items: [
      { text: 'Início', link: '/' },
      { text: 'Mapa da Descida', link: '/#mapa' },
      { text: `Último lançado · Cap. ${ultimo.n}`, link: ultimo.link }
    ]
  },
  ...arcosUsados.map((a) => ({
    text: nomeArco(a),
    collapsed: a.id !== arcoDe(ultimo.n).id,
    items: capitulos
      .filter((c) => c.arco === a.id)
      .map((c) => ({ text: `${c.n}. ${c.titulo}`, link: c.link }))
  })),
  {
    text: 'Reflexões',
    collapsed: true,
    items: arcosUsados.map((a) => ({
      text: nomeArco(a),
      collapsed: true,
      items: comReflexao
        .filter((c) => c.arco === a.id)
        .map((c) => ({ text: `Reflexão: Capítulo ${c.n}`, link: c.reflexao }))
    }))
  },
  {
    text: 'Universo',
    items: [
      { text: 'Dossiês · Personagens', link: '/personagens' },
      { text: 'Atlas · Sobre o Universo', link: '/sobre' }
    ]
  }
]

const vizinho = (c, txt) => (c ? { text: txt(c), link: c.link } : false)

export default defineConfig({
  base: '/o-canto-de-silicio/',
  lang: 'pt-BR',
  title: 'O Canto de Silício',
  description: 'Um thriller sci-fi/fantasia pós-apocalíptico onde Elara busca reacender o mundo à sombra de deuses-máquina.',
  publicDir: 'static',
  appearance: 'dark',
  head: [
    ['meta', { name: 'theme-color', content: '#0c0b10' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;900&family=Big+Shoulders+Stencil+Display:wght@800;900&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap'
    }]
  ],

  // prev/next explícitos: capítulo ↔ capítulo e reflexão ↔ reflexão.
  transformPageData(pageData) {
    const alvo = porLink.get(pageData.relativePath)
    if (!alvo) return
    const { tipo, c } = alvo
    if (tipo === 'cap') {
      const i = capitulos.indexOf(c)
      pageData.frontmatter.prev ??= vizinho(capitulos[i - 1], (x) => `Cap. ${x.n} · ${x.titulo}`)
      pageData.frontmatter.next ??= vizinho(capitulos[i + 1], (x) => `Cap. ${x.n} · ${x.titulo}`)
    } else {
      const i = comReflexao.indexOf(c)
      const ref = (x) => x && { text: `Reflexão: Capítulo ${x.n}`, link: x.reflexao }
      pageData.frontmatter.prev ??= ref(comReflexao[i - 1]) || false
      pageData.frontmatter.next ??= ref(comReflexao[i + 1]) || false
    }
  },

  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      {
        text: 'Capítulos',
        items: [
          { text: 'Mapa da Descida', link: '/#mapa' },
          { text: 'Capítulo 1 (O Início)', link: '/public/capitulos/capitulo-1' },
          { text: `Capítulo ${ultimo.n} (Último Lançado)`, link: ultimo.link }
        ]
      },
      { text: 'Dossiês', link: '/personagens' },
      { text: 'Atlas', link: '/sobre' }
    ],
    sidebar,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Texto integral', buttonAriaLabel: 'Buscar no texto integral' },
          modal: {
            noResultsText: 'Nada encontrado no poço para',
            resetButtonTitle: 'Limpar busca',
            displayDetails: 'Mostrar detalhes',
            footer: { selectText: 'abrir', navigateText: 'navegar', closeText: 'fechar' }
          }
        }
      }
    },
    outline: { label: 'Nesta página' },
    docFooter: { prev: 'Anterior', next: 'Próximo' },
    darkModeSwitchLabel: 'Aparência',
    lightModeSwitchTitle: 'Mudar para o tema claro',
    darkModeSwitchTitle: 'Mudar para o tema escuro',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Voltar ao topo',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/juninmd/o-canto-de-silicio' }
    ]
  }
})
