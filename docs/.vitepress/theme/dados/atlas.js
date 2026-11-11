// Camadas do Atlas Estratigráfico, da órbita ao fundo do poço.
// `re` casa com a localização do frontmatter; a contagem usa ORDEM_MATCH
// (da camada mais específica para a mais genérica).
export const CAMADAS = [
  { id: 'orbita', nivel: 'N+∞', nome: 'Estação Orbital Éden', img: 'estacao_eden', fundo: '#17151f', re: /[ÉE]den|Orbital/i,
    texto: 'Refúgio orbital dividido em setores por hierarquia e governado pela IA “Mãe”, do Cume às favelas do Setor 9.', cheiro: 'Ar filtrado e ozônio de reciclador.' },
  { id: 'superficie', nivel: 'N 0', nome: 'Superfície · Ruínas', img: 'nova_aether', fundo: '#18161f', re: /Superf[íi]cie|Ru[íi]nas|Telhado|Sombrio/i,
    texto: 'Natureza retomando esqueletos de megacidades. Tempestades de poeira e o brilho fraco de redes antigas.', cheiro: 'Poeira, ferrugem e chuva ácida.' },
  { id: 'pilha', nivel: 'N −1', nome: 'Setor 4 · A Pilha', img: 'setor_4', fundo: '#1a1722', re: /Setor 4|Pilha|Mercado|Purificador|Oficina/i,
    texto: 'Aglomerado vertical de habitações precárias, mercados negros e clínicas ilegais, sob o domínio do Cartel da Água.', cheiro: 'Neon, suor, peixe podre e ozônio velho.' },
  { id: 'setor5', nivel: 'N −2', nome: 'Setor 5 · Scrapyard', img: 'setor_5', fundo: '#1b1925', re: /Setor 5|Scrapyard|Bunker|Epsilon|Intermedi/i,
    texto: 'Sem energia desde a queda da rede central e coberto de neve ácida. A Scrapyard resiste com fogueiras químicas.', cheiro: 'Amônia da neve, óleo lubrificante, sangue.' },
  { id: 'setor7', nivel: 'N −3', nome: 'Setor 7 · Nódulo Primário', img: 'nodulo_primario', fundo: '#1c1927', re: /Setor 7|N[óo]dulo|N[úu]cleo|Subn[íi]vel 8|Manuten/i,
    texto: 'Centro de dados pré-colapso onde a Ordem escondia o wetware, a prisão de cérebros que formava o Deus-Máquina.', cheiro: 'Frio absoluto, formol e silício queimado.' },
  { id: 'docas', nivel: 'N −4', nome: 'Docas Mortas', img: null, fundo: '#141b22', re: /Docas|Submarin|Plataforma/i,
    texto: 'Docas secas inundadas, cascos podres e contrabando submarino sob chuva ácida constante.', cheiro: 'Sal químico, querosene, peixe morto.' },
  { id: 'dutos', nivel: 'N −5', nome: 'Dutos Térmicos', img: 'dutos_termicos', fundo: '#1f1912', re: /Dutos?|Tubos|Galerias|Ventila|Esgoto|T[úu]ne/i,
    texto: 'Rede de escoamento e túneis industriais, gotejando efluentes e vapor superaquecido. Território dos Ratos-Drones.', cheiro: 'Vapor, efluente químico, mofo.' },
  { id: 'abismo', nivel: 'N −6', nome: 'Abismo Termal', img: 'abismo_termal', fundo: '#2a160c', re: /Abismo|Forja|Elevador|Fornalha/i,
    texto: 'Fornalha subterrânea de purificação. Rios de metal derretido e o Protocolo de Purga Térmica varrendo os dutos.', cheiro: 'Enxofre ardente e metal superaquecido.' },
  { id: 'fundo', nivel: 'N −7', nome: 'Subníveis Esquecidos', img: null, fundo: '#0d1513', re: /Subn[íi]veis|Malha/i, aqui: true,
    texto: 'Malha de trânsito abandonada há meio século, inundada de água ácida e óleo negro. Maquinário ancestral caça por vibração.', cheiro: 'Lodo químico, ozônio queimado, água morta.' }
]

export const ORDEM_MATCH = ['fundo', 'abismo', 'docas', 'dutos', 'setor7', 'setor5', 'pilha', 'superficie', 'orbita']

/** Mapa id da camada → números dos capítulos que se passam nela. */
export function capitulosPorCamada(capitulos) {
  const mapa = Object.fromEntries(CAMADAS.map((c) => [c.id, []]))
  for (const cap of capitulos) {
    const id = ORDEM_MATCH.find((i) => CAMADAS.find((c) => c.id === i).re.test(cap.local))
    if (id) mapa[id].push(cap.n)
  }
  return mapa
}
