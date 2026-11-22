import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// AudioContext falso: conta fontes que começaram e ainda não pararam.
const vivas = new Set()
const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} })
const no = (extra = {}) => ({ connect: (d) => d, disconnect() {}, ...extra })
const fonte = () => {
  const f = no({ frequency: param(), start: () => vivas.add(f), stop: () => vivas.delete(f) })
  return f
}
class FakeAudioContext {
  sampleRate = 8
  currentTime = 0
  destination = no()
  resume() {}
  createGain() { return no({ gain: param() }) }
  createBuffer(_c, len) { return { getChannelData: () => new Float32Array(len) } }
  createBufferSource() { return fonte() }
  createOscillator() { return fonte() }
  createBiquadFilter() { return no({ frequency: param() }) }
}

test('desligar o som para o ruído e o zumbido, mesmo depois de vários ciclos', async (t) => {
  globalThis.window = { AudioContext: FakeAudioContext }
  t.mock.timers.enable({ apis: ['setTimeout'] })
  // package.json é commonjs e som.js é ESM (o Vite resolve); aqui carrega como módulo ESM.
  const src = readFileSync(new URL('../docs/.vitepress/theme/som.js', import.meta.url), 'utf8')
  const { ligarSom, desligarSom } = await import(`data:text/javascript,${encodeURIComponent(src)}`)
  for (let i = 0; i < 3; i++) {
    assert.equal(ligarSom(), true)
    assert.equal(vivas.size, 2)
    desligarSom()
    t.mock.timers.tick(1000)
    assert.equal(vivas.size, 0, `ciclo ${i + 1}: fontes ainda tocando`)
  }
  ligarSom()
  ligarSom()
  assert.equal(vivas.size, 2, 'ligar duas vezes não pode criar um segundo drone')
  desligarSom()
  t.mock.timers.tick(1000)
  assert.equal(vivas.size, 0)
})
