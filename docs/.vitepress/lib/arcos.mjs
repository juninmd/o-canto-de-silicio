// Arcos narrativos de O Canto de Silício. O último arco fica aberto
// (até: Infinity) para absorver os capítulos novos sem editar este arquivo.
export const ARCOS = [
  { id: 1, nome: 'O Canto', de: 1, ate: 12, cor: '#a982ff' },
  { id: 2, nome: 'Sinapses', de: 13, ate: 44, cor: '#7b6cf0' },
  { id: 3, nome: 'Cinzas', de: 45, ate: 72, cor: '#c9a2ff' },
  { id: 4, nome: 'Neve Ácida', de: 73, ate: 90, cor: '#8fb7d9' },
  { id: 5, nome: 'Docas Mortas', de: 91, ate: 102, cor: '#5f8fa8' },
  { id: 6, nome: 'Abismo Termal', de: 103, ate: 120, cor: '#f08a3c' },
  { id: 7, nome: 'Fundo do Poço', de: 121, ate: Infinity, cor: '#f0b429' }
]

export const ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export const arcoDe = (n) => ARCOS.find((a) => n >= a.de && n <= a.ate) || ARCOS[ARCOS.length - 1]
