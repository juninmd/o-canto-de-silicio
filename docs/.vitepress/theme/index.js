import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import MapaDescida from './componentes/MapaDescida.vue'
import DossieGrid from './componentes/DossieGrid.vue'
import AtlasEstratos from './componentes/AtlasEstratos.vue'
import './estilo.css'

/** Tema "Descida": estende o tema padrão do VitePress sem trocar o conteúdo Markdown. */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('MapaDescida', MapaDescida)
    app.component('DossieGrid', DossieGrid)
    app.component('AtlasEstratos', AtlasEstratos)
  }
}
