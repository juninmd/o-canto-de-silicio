<script setup>
import { ref, watch } from 'vue'
import { ui } from '../leitura.js'

const visivel = ref(false)
let t = 0
watch(() => ui.avisoId, () => {
  visivel.value = true
  clearTimeout(t)
  t = setTimeout(() => (visivel.value = false), 2200)
})
</script>

<template>
  <div class="aviso vp-raw" :class="{ on: visivel }" role="status" aria-live="polite">{{ ui.aviso }}</div>
</template>

<style scoped>
.aviso {
  position: fixed; z-index: 120; left: 50%; bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  transform: translate(-50%, 16px); opacity: 0; visibility: hidden; pointer-events: none;
  background: var(--cds-cinza); color: var(--cds-oleo); font-family: var(--cds-f-mono); font-size: .74rem;
  padding: .55rem .9rem; border-radius: 3px; max-width: calc(100vw - 32px);
  transition: transform .35s var(--cds-ease), opacity .35s, visibility 0s .35s;
}
.aviso.on { transform: translate(-50%, 0); opacity: 1; visibility: visible; transition: transform .35s var(--cds-ease), opacity .35s; }
</style>
