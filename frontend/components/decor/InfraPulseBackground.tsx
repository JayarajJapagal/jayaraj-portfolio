'use client'

import { useEffect, useRef } from 'react'

type Node = {
  orbitCenter: number
  orbitRadius: number
  orbitAngle: number
  x: number
  y: number
  baseY: number
  color: string
  label?: string
  isService: boolean
  isAnchor?: boolean
  twinklePhase: number
  driftPhase: number
  driftSpeed: number
  driftRange: number
  depthFactor?: number
}

type Edge = { a: Node; b: Node; len: number }

const SERVICES = ['EKS', 'RDS', 'S3', 'Lambda', 'VPC', 'Redis', 'SQS', 'Terraform', 'ECR', 'ALB', 'IAM']
const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#22d3ee', '#34d399']
const MAX_EDGE_LEN = 170
const SIDE_BAND_WIDTH = 260
const ROT_SPEED = 0.3
const BOOT_DURATION = 2600
const PULSE_INTERVAL = 5500
const PULSE_SPEED = 0.22
const PULSE_BAND = 140
const ANCHOR_COLOR = '#34d399'
const ANCHOR_LABEL = 'CloudFront'

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

export default function InfraPulseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let nodes: Node[] = []
    let edges: Edge[] = []
    let anchorNode: Node
    let animationFrame: number
    let t = 0
    let lastPulseStart = 0
    const startTime = performance.now()

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
      buildNodes()
    }

    function randomInBand() {
      const useLeft = Math.random() < 0.5
      const orbitCenter = useLeft ? SIDE_BAND_WIDTH / 2 : w - SIDE_BAND_WIDTH / 2
      const orbitRadius = 20 + Math.random() * (SIDE_BAND_WIDTH / 2 - 30)
      const orbitAngle = Math.random() * Math.PI * 2
      const y = 60 + Math.random() * (h - 120)
      return { orbitCenter, orbitRadius, orbitAngle, y }
    }

    function buildNodes() {
      nodes = []
      SERVICES.forEach((label, i) => {
        const p = randomInBand()
        nodes.push({
          orbitCenter: p.orbitCenter, orbitRadius: p.orbitRadius, orbitAngle: p.orbitAngle,
          x: p.orbitCenter, y: p.y, baseY: p.y,
          label, color: COLORS[i % COLORS.length], isService: true,
          twinklePhase: Math.random() * Math.PI * 2,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.15 + Math.random() * 0.15,
          driftRange: 5 + Math.random() * 4,
        })
      })
      const bandArea = SIDE_BAND_WIDTH * h * 2
      const fillerCount = Math.round(bandArea / 26000)
      for (let i = 0; i < fillerCount; i++) {
        const p = randomInBand()
        nodes.push({
          orbitCenter: p.orbitCenter, orbitRadius: p.orbitRadius, orbitAngle: p.orbitAngle,
          x: p.orbitCenter, y: p.y, baseY: p.y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)], isService: false,
          twinklePhase: Math.random() * Math.PI * 2,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.1 + Math.random() * 0.15,
          driftRange: 4 + Math.random() * 3,
        })
      }
      anchorNode = {
        orbitCenter: 0, orbitRadius: 0, orbitAngle: 0,
        x: 60, y: 60, baseY: 60,
        label: ANCHOR_LABEL, color: ANCHOR_COLOR, isService: true, isAnchor: true,
        twinklePhase: 0, driftPhase: 0, driftSpeed: 0, driftRange: 0,
      }
      nodes.push(anchorNode)

      edges = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = dist(nodes[i], nodes[j])
          if (d < MAX_EDGE_LEN) edges.push({ a: nodes[i], b: nodes[j], len: d })
        }
      }
    }

    function pulseInfluence(node: Node, pulseRadius: number) {
      const d = dist(node, anchorNode)
      const delta = Math.abs(d - pulseRadius)
      return Math.max(0, 1 - delta / PULSE_BAND)
    }

    function draw(now: number) {
      t += 0.016
      const elapsed = now - startTime
      const bootReveal = elapsed < BOOT_DURATION ? 1 - easeOutCubic(elapsed / BOOT_DURATION) : 0

      if (elapsed - lastPulseStart > PULSE_INTERVAL) lastPulseStart = elapsed
      const pulseAge = elapsed - lastPulseStart
      const pulseRadius = pulseAge * PULSE_SPEED

      ctx!.clearRect(0, 0, w, h)

      nodes.forEach(n => {
        if (n.orbitRadius) {
          const angle = n.orbitAngle + t * ROT_SPEED
          n.x = n.orbitCenter + Math.cos(angle) * n.orbitRadius
          n.depthFactor = (Math.sin(angle) + 1) / 2
          n.y = n.baseY + Math.sin(t * n.driftSpeed + n.driftPhase) * n.driftRange
        }
      })

      edges.forEach(e => {
        const midX = (e.a.x + e.b.x) / 2
        const midY = (e.a.y + e.b.y) / 2
        const midDist = dist({ x: midX, y: midY }, anchorNode)
        const delta = Math.abs(midDist - pulseRadius)
        const pulseInf = Math.max(0, 1 - delta / PULSE_BAND)

        const baseAlpha = 0.05 + (1 - e.len / MAX_EDGE_LEN) * 0.08
        const alpha = Math.min(0.9, baseAlpha + pulseInf * 0.6) + bootReveal * 0.35

        ctx!.beginPath()
        ctx!.moveTo(e.a.x, e.a.y)
        ctx!.lineTo(e.b.x, e.b.y)
        ctx!.strokeStyle = pulseInf > 0.3 ? ANCHOR_COLOR : '#3b82f6'
        ctx!.globalAlpha = Math.min(1, alpha)
        ctx!.lineWidth = pulseInf > 0.3 ? 1.4 : 1
        ctx!.setLineDash([])
        ctx!.stroke()

        const dashAlpha = Math.min(1, 0.35 + pulseInf * 0.65)
        ctx!.beginPath()
        ctx!.moveTo(e.a.x, e.a.y)
        ctx!.lineTo(e.b.x, e.b.y)
        ctx!.strokeStyle = pulseInf > 0.3 ? ANCHOR_COLOR : '#60a5fa'
        ctx!.globalAlpha = dashAlpha
        ctx!.lineWidth = 1.2
        ctx!.setLineDash([3, 9])
        ctx!.lineDashOffset = -t * 22
        ctx!.stroke()
        ctx!.setLineDash([])
      })

      nodes.forEach(n => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.6 + n.twinklePhase)
        const depth = n.isAnchor ? 1 : (n.depthFactor !== undefined ? n.depthFactor : 0.7)
        const baseAlpha = n.isService
          ? (0.25 + depth * 0.35) + twinkle * 0.1
          : (0.05 + depth * 0.14) + twinkle * 0.06
        const baseSize = n.isService ? 2.5 + depth * 3 : 0.8 + depth * 1.4
        const pulseInf = n.isAnchor ? 0 : pulseInfluence(n, pulseRadius)

        let alpha = Math.min(1, baseAlpha + pulseInf * 0.55)
        let size = baseSize + pulseInf * 3
        let glow = 3 + depth * 10 + pulseInf * 16
        let showLabel = n.isService && (pulseInf > 0.25 || !!n.isAnchor || depth > 0.75)

        if (n.isAnchor) {
          alpha = 0.9 + twinkle * 0.1
          size = 5.5
          glow = 16 + twinkle * 6
          showLabel = true
        }

        alpha = Math.min(1, alpha + bootReveal * 0.6)
        size = size + bootReveal * 1.5
        glow = Math.max(glow, bootReveal * 14)
        if (bootReveal > 0.05) showLabel = showLabel || n.isService

        ctx!.shadowBlur = glow
        ctx!.shadowColor = n.color
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, size, 0, Math.PI * 2)
        ctx!.fillStyle = n.color
        ctx!.globalAlpha = alpha
        ctx!.fill()
        ctx!.shadowBlur = 0

        if (showLabel && n.label) {
          const labelAlpha = n.isAnchor ? 1 : Math.min(1, Math.max(pulseInf * 1.3, bootReveal * 1.1))
          ctx!.globalAlpha = labelAlpha
          ctx!.font = '10px JetBrains Mono, monospace'
          ctx!.fillStyle = n.color
          ctx!.fillText(n.label, n.x + size + 6, n.y + 3)
        }
      })

      ctx!.globalAlpha = 1
      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animationFrame = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}