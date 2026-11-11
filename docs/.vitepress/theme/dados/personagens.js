// Fichas dos Dossiês. `ancora` aponta para a seção completa em personagens.md;
// `match` casa com o campo `personagens` do frontmatter dos capítulos.
// Estado: crit (crítico), warn (ameaça ativa), ok (resolvido), off (fora de cena).
export const PERSONAGENS = [
  {
    id: 'elara', nome: 'Elara', img: 'elara', ancora: 'elara', match: 'Elara',
    papel: 'Protagonista · Sucateira · 22 anos', estado: ['crit', 'Sem poderes'],
    medidores: [
      ['Bioeletricidade', 2, 'sangue', 'extinta · Cap. 45'],
      ['Integridade física', 38, 'enxofre', 'ferida'],
      ['Retorno previsto', 0, 'volt', 'Cap. 130']
    ],
    texto: 'Olhos violeta, mutação da radiação dos núcleos de dados. Queimou a Sobrecarga Sináptica contra o Deus-Máquina e, desde o Cap. 45, sobrevive só com agilidade, astúcia de sucateira e engenharia do ambiente. No Cap. 122 desmontou um drone de escavação com uma chave de manutenção e alavanca.'
  },
  {
    id: 'jaxon', nome: 'Jaxon', img: 'jaxon', ancora: 'jaxon', match: 'Jaxon',
    papel: 'Mercenário · 40 anos', estado: ['crit', 'Debilitado'],
    medidores: [
      ['Braço cibernético', 0, 'sangue', 'destruído'],
      ['Pulmão sintético', 6, 'sangue', 'inoperante'],
      ['Munição do revólver', 8, 'enxofre', 'quase zero'],
      ['Mobilidade', 25, 'enxofre', 'apoiado em Elara']
    ],
    texto: 'O braço foi estraçalhado no Abismo Termal; resta um soquete envolto em ataduras feitas da roupa de Elara. O pulmão está intoxicado de fuligem sulfúrica. Atira com a mão orgânica e um revólver de tambor pesado, e anda apoiado nela.'
  },
  {
    id: 'vex', nome: 'Dr. Vex', img: 'dr_vex', ancora: 'dr-vex', match: 'Dr. Vex',
    papel: 'Ripperdoc · Médico clandestino', estado: ['off', 'Bunker · Setor 5'], medidores: [],
    texto: 'Selado no bunker do Setor 5. Estabilizou o purificador de Jaxon e avisou a dupla sobre o colapso iminente antes da partida.'
  },
  {
    id: 'silas', nome: 'Silas', img: 'silas', ancora: 'silas-lider-do-cartel-da-agua', match: 'Silas',
    papel: 'Líder do Cartel da Água', estado: ['warn', 'Caçando'], medidores: [],
    texto: 'Monopoliza filtros e água limpa no Setor 4. Perdeu o nodo principal de purificação no Cap. 118, o que causou um apagão hidráulico, e continua caçando Elara e Jaxon.'
  },
  {
    id: 'malakar', nome: 'Malakar', img: 'malakar', ancora: 'alto-sacerdote-malakar', match: 'Malakar',
    papel: 'Alto Sacerdote · Ordem do Silício', estado: ['off', 'Ordem fragmentada'], medidores: [],
    texto: 'Líder da Ordem do Silício. Depois da queda do Deus-Máquina, os sacerdotes que sobraram dependem de defesas automáticas como o Protocolo de Purga Térmica.'
  },
  {
    id: 'kaelen', nome: 'Kaelen', img: 'kaelen', ancora: 'kaelen-o-exorcista', match: 'Kaelen',
    papel: 'O Exorcista · Fantasma da Rede', estado: ['off', 'Paradeiro desconhecido'], medidores: [],
    texto: 'Sacrificou a oficina com um EMP no Cap. 31 e criou um ponto cego permanente que serviu de refúgio no Cap. 64.'
  },
  {
    id: 'ferrao', nome: 'Ferrão', img: 'ferrao', ancora: 'ferrao-enforcer-do-cartel', match: 'Ferrão',
    papel: 'Executor do Cartel da Água', estado: ['warn', 'Ativo'], medidores: [],
    texto: 'Ciborgue violento com implantes subdermais, braçadeiras de choque e lâminas retráteis. Persegue alvos nas vielas e docas clandestinas do Setor 4.'
  },
  {
    id: 'acougueiro', nome: 'O Açougueiro de Neve', img: 'acougueiro_neve', ancora: 'o-acougueiro-de-neve', match: 'O Açougueiro',
    papel: 'Predador cibernético', estado: ['warn', 'Ameaça'], medidores: [],
    texto: 'Figura colossal em peles térmicas e placas de sucata congeladas, com máscara respiratória cadavérica e serra óssea pneumática. Ronda as ruínas congeladas do Setor 5.'
  },
  {
    id: 'sentinelas', nome: 'Sentinelas', img: 'sentinela', ancora: 'sentinels', match: 'Sentinelas',
    papel: 'Unidade de elite da Ordem', estado: ['off', 'Desativados'], medidores: [],
    texto: 'Com a morte do Deus-Máquina, os que sobreviveram ao Núcleo Central viraram cascas paralisadas. O status das unidades na superfície é incerto.'
  },
  {
    id: 'ratos', nome: 'Ratos-Drones', img: 'ratos_drones', ancora: 'ratos-drones-limpadores', match: 'Ratos-Drones',
    papel: 'Limpadores · segurança automática', estado: ['off', 'Congelados'], medidores: [],
    texto: 'A vanguarda foi congelada por um vazamento de nitrogênio líquido no Cap. 111; o resto ficou nas Galerias de Escoamento.'
  },
  {
    id: 'deus', nome: 'Deus-Máquina', img: 'deus_maquina', ancora: 'deus-maquina', match: 'Deus-Máquina',
    papel: 'Supercomputador wetware', estado: ['ok', 'Silenciado'], medidores: [],
    texto: 'Massa de carne biomecânica feita de mentes colhidas pela Ascensão. Colapsou no Cap. 41 quando Elara saturou suas conexões com toda a bioeletricidade que tinha.'
  },
  {
    id: 'tita', nome: 'Titã', img: 'tita', ancora: 'tita-classe-mech-de-guerra', match: 'Titã',
    papel: 'Mech de guerra · tecnologia proibida', estado: ['off', 'Arquivo'], medidores: [],
    texto: 'Classe de mech de guerra listada entre as tecnologias proibidas de Nova Aether.'
  }
]
