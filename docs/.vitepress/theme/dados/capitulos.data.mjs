import { lerCapitulos } from '../../lib/conteudo.mjs'

// Metadados de todos os capítulos (título, local, personagens, trecho, notas
// da reflexão). Recarrega sozinho quando um capítulo ou reflexão muda.
export default {
  watch: ['../../../public/capitulos/*.md', '../../../reflexoes/*.md'],
  load() {
    return lerCapitulos()
  }
}
