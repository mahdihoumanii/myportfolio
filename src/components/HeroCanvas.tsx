import { useEffect, useRef } from 'react'

/**
 * Hero background telling the site's story in one animation:
 * a particle scattering event (incoming beams, vertex, detector rings,
 * outgoing tracks) whose tracks morph into stochastic Monte Carlo paths,
 * with one highlighted minimum-action path pinned to a rare target level.
 * Static composite frame under prefers-reduced-motion; paused offscreen.
 */

// Must visually match the @theme tokens in index.css.
const BG = '#0a0e14'
const ACCENT = '#6fd3e8'
const RING = '#3a4a5e'
const TARGET = '#8b98a9'
// event-display palette: mostly warm particle tracks with cool accents
const TRACK_COLORS = ['#ffc857', '#ffc857', '#ffb347', '#6fd3e8', '#a78bfa', '#f47ea9']

const N_TRACKS = 26
const N_STEPS = 200
const CYCLE_MS = 13000

// cycle phases (fractions of CYCLE_MS)
const P_BEAMS = 0.08 // incoming beams drawn
const P_TRACKS = 0.32 // outgoing tracks fully grown
const P_MORPH_0 = 0.38
const P_MORPH_1 = 0.62 // morph into stochastic paths complete
const P_FADE = 0.93

interface Scene {
  /** per track: scattering-cone geometry [angle, curvature, length] + colour */
  tracks: { angle: number; curve: number; len: number; color: string }[]
  /** per track per step: stochastic y offsets (unit gaussians, cumsum) */
  walks: Float32Array[]
  star: Float32Array
  targetY: number
}

function gaussian(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function makeScene(): Scene {
  const tracks = []
  const walks: Float32Array[] = []
  for (let i = 0; i < N_TRACKS; i++) {
    const angle = (-72 + (144 * i) / (N_TRACKS - 1) + (Math.random() - 0.5) * 8) * (Math.PI / 180)
    tracks.push({
      angle,
      curve: (Math.random() - 0.5) * 0.9,
      len: 0.55 + Math.random() * 0.45,
      color: TRACK_COLORS[Math.floor(Math.random() * TRACK_COLORS.length)],
    })
    const w = new Float32Array(N_STEPS + 1)
    for (let k = 1; k <= N_STEPS; k++) w[k] = w[k - 1] + gaussian()
    walks.push(w)
  }
  // minimum-action path: steep early rise easing into the pinned rare level
  const star = new Float32Array(N_STEPS + 1)
  const targetY = 0.24
  for (let k = 0; k <= N_STEPS; k++) {
    const t = k / N_STEPS
    star[k] = 1.6 * t - 0.6 * t * t // 0 → 1, steep then flat
  }
  return { tracks, walks, star, targetY }
}

const ease = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scene = makeScene()
    let raf = 0
    let running = true
    let visible = true
    let start = performance.now()
    let W = 0
    let H = 0

    const vertex = () => ({ x: W * 0.24, y: H * 0.55 })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce) drawFrame(1, 1, 0.55, 1)
    }

    /** point k of track i, blended between scattering track and random walk */
    const point = (i: number, k: number, m: number) => {
      const v = vertex()
      const t = k / N_STEPS
      const { angle, curve, len } = scene.tracks[i]
      const r = t * len * H * 0.75
      const a = angle + curve * t
      const sx = v.x + r * Math.cos(a)
      const sy = v.y + r * Math.sin(a)
      const wx = v.x + t * (W * 1.04 - v.x)
      const wy = v.y + scene.walks[i][k] * H * 0.012
      return { x: sx + (wx - sx) * m, y: sy + (wy - sy) * m }
    }

    const drawFrame = (trackP: number, beamP: number, m: number, alpha: number) => {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)
      const v = vertex()

      // detector rings, fading out as the event becomes stochastic
      const ringAlpha = 0.28 * (1 - m) * alpha
      if (ringAlpha > 0.004) {
        ctx.strokeStyle = RING
        ctx.lineWidth = 1
        for (const r of [0.16, 0.3, 0.44]) {
          ctx.globalAlpha = ringAlpha
          ctx.beginPath()
          ctx.arc(v.x, v.y, r * H, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // incoming beams (from left and lower-left toward vertex)
      if (beamP > 0) {
        ctx.strokeStyle = ACCENT
        ctx.lineWidth = 1.2
        ctx.globalAlpha = 0.5 * (1 - m * 0.7) * alpha
        for (const from of [
          { x: -20, y: v.y - H * 0.28 },
          { x: -20, y: v.y + H * 0.32 },
        ]) {
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(from.x + (v.x - from.x) * beamP, from.y + (v.y - from.y) * beamP)
          ctx.stroke()
        }
        // vertex glow — warm, like an interaction point
        ctx.globalAlpha = (0.95 - m * 0.5) * alpha
        ctx.fillStyle = '#ffc857'
        ctx.shadowColor = '#ffc857'
        ctx.shadowBlur = 16 * (1 - m * 0.6)
        ctx.beginPath()
        ctx.arc(v.x, v.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // rare-target level appears with the morph
      if (m > 0.15) {
        ctx.save()
        ctx.globalAlpha = 0.22 * clamp01((m - 0.15) / 0.4) * alpha
        ctx.strokeStyle = TARGET
        ctx.lineWidth = 1
        ctx.setLineDash([2, 6])
        ctx.beginPath()
        ctx.moveTo(v.x, scene.targetY * H)
        ctx.lineTo(W, scene.targetY * H)
        ctx.stroke()
        ctx.restore()
      }

      // outgoing tracks → stochastic paths
      ctx.lineWidth = 1.1
      for (let i = 0; i < N_TRACKS; i++) {
        const steps = Math.max(1, Math.floor(trackP * N_STEPS))
        ctx.strokeStyle = scene.tracks[i].color
        ctx.globalAlpha = (0.34 - 0.14 * m) * alpha
        ctx.beginPath()
        for (let k = 0; k <= steps; k++) {
          const p = point(i, k, m)
          if (k === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        // glowing phase-space endpoint while still an event display
        if (trackP >= 1 && m < 0.5) {
          const p = point(i, N_STEPS, m)
          ctx.globalAlpha = 0.8 * (1 - m * 2) * alpha
          ctx.fillStyle = scene.tracks[i].color
          ctx.shadowColor = scene.tracks[i].color
          ctx.shadowBlur = 6
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // minimum-action path draws in once the world is stochastic
      const starP = clamp01((m - 0.45) / 0.55)
      if (starP > 0) {
        ctx.save()
        ctx.globalAlpha = 0.9 * alpha
        ctx.strokeStyle = ACCENT
        ctx.lineWidth = 1.8
        ctx.shadowColor = ACCENT
        ctx.shadowBlur = 12
        ctx.beginPath()
        const steps = Math.max(1, Math.floor(starP * N_STEPS))
        for (let k = 0; k <= steps; k++) {
          const t = k / N_STEPS
          const x = v.x + t * (W * 1.02 - v.x)
          const y = v.y + scene.star[k] * (scene.targetY * H - v.y)
          if (k === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.restore()
      }

      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      if (!running) return
      if (!visible) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = ((now - start) % CYCLE_MS) / CYCLE_MS
      if (now - start >= CYCLE_MS && t < 0.02) {
        scene = makeScene()
        start = now
      }
      const beamP = clamp01(t / P_BEAMS)
      const trackP = clamp01((t - P_BEAMS) / (P_TRACKS - P_BEAMS))
      const m = ease(clamp01((t - P_MORPH_0) / (P_MORPH_1 - P_MORPH_0)))
      const alpha = t < P_FADE ? 1 : 1 - (t - P_FADE) / (1 - P_FADE)
      drawFrame(trackP, beamP, m, Math.max(0, alpha))
      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    if (!reduce) raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}
