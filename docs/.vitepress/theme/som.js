// "Som do subnível": ruído marrom filtrado, um zumbido grave e gotas
// aleatórias, gerados com Web Audio (sem arquivos de áudio).
let ctx = null
let mestre = null
let timerGota = null

export function ligarSom() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = ctx || new AC()
  ctx.resume()
  mestre = ctx.createGain()
  mestre.gain.value = 0
  mestre.connect(ctx.destination)

  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let ultimo = 0
  for (let i = 0; i < len; i++) {
    ultimo = (ultimo + 0.02 * (Math.random() * 2 - 1)) / 1.02
    d[i] = ultimo * 3.2
  }
  const ruido = ctx.createBufferSource()
  ruido.buffer = buf
  ruido.loop = true
  const filtro = ctx.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = 380
  ruido.connect(filtro).connect(mestre)
  ruido.start()

  const zumbido = ctx.createOscillator()
  zumbido.frequency.value = 46
  const gz = ctx.createGain()
  gz.gain.value = 0.05
  zumbido.connect(gz).connect(mestre)
  zumbido.start()

  mestre.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2)

  const gota = () => {
    if (!mestre) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(1300 + Math.random() * 900, t)
    o.frequency.exponentialRampToValueAtTime(380, t + 0.12)
    g.gain.setValueAtTime(0.12, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
    o.connect(g).connect(mestre)
    o.start(t)
    o.stop(t + 0.3)
    timerGota = setTimeout(gota, 1800 + Math.random() * 4200)
  }
  timerGota = setTimeout(gota, 1500)
  return true
}

export function desligarSom() {
  clearTimeout(timerGota)
  if (!mestre || !ctx) return
  const m = mestre
  mestre = null
  m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
  setTimeout(() => m.disconnect(), 700)
}
