<script setup>
import DefaultTheme from 'vitepress/theme'
import HeroDescida from './componentes/HeroDescida.vue'
import LeitorCabecalho from './componentes/LeitorCabecalho.vue'
import LeitorControles from './componentes/LeitorControles.vue'
import BuscaCmd from './componentes/BuscaCmd.vue'
import Aviso from './componentes/Aviso.vue'
import { abrirComandos } from './leitura.js'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-before><HeroDescida /></template>
    <template #doc-before><LeitorCabecalho /></template>
    <template #nav-bar-content-after>
      <button class="cds-cmd-btn" type="button" aria-label="Abrir comandos (Ctrl K)" @click="abrirComandos()">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="m15 15 6 6" stroke="currentColor" stroke-width="2" /></svg>
        <span class="rot">Comandos</span><kbd>Ctrl K</kbd>
      </button>
    </template>
    <template #layout-bottom>
      <LeitorControles />
      <BuscaCmd />
      <Aviso />
    </template>
  </Layout>
</template>
