'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  DoughnutController,
  LineController,
} from 'chart.js'

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, DoughnutController, LineController)

export type DonutSlice = { label: string; value: number; color: string }

export function DonutChart({ data, compact = false }: { data: DonutSlice[]; compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const total = data.reduce((acc, s) => acc + s.value, 0)
  const hovered = hoveredIdx !== null ? data[hoveredIdx] : null
  const size = compact ? 62 : 104

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: data.map((s) => s.label),
        datasets: [{
          data: data.map((s) => Math.max(s.value, 0.0001)),
          backgroundColor: data.map((s) => s.color),
          borderWidth: 0,
          hoverOffset: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        onHover: (_evt, elements) => {
          setHoveredIdx(elements.length > 0 ? elements[0].index : null)
        },
      },
    })
    return () => { chartRef.current?.destroy() }
  }, [data])

  return (
    <div
      className={`flex items-center ${compact ? 'gap-2.5' : 'gap-4'}`}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        {total > 0 ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="w-full h-full rounded-full border-[12px] border-[#f1f0ed]" />
        )}
        <div className="absolute rounded-full flex flex-col items-center justify-center pointer-events-none transition-all duration-150" style={{ inset: compact ? '10px' : '16px' }}>
          {hovered ? (
            <>
              <div className={`font-newsreader font-semibold leading-none ${compact ? 'text-lg' : 'text-2xl'}`} style={{ color: hovered.color }}>{hovered.value}</div>
              {!compact && <div className="text-[9px] text-muted text-center leading-tight mt-0.5 max-w-[48px] truncate">{hovered.label}</div>}
            </>
          ) : (
            <>
              <div className={`font-newsreader font-semibold text-text leading-none ${compact ? 'text-lg' : 'text-2xl'}`}>{total}</div>
              <div className={`text-muted ${compact ? 'text-[8.5px]' : 'text-[10px]'}`}>Total</div>
            </>
          )}
        </div>
      </div>
      <div className={`flex flex-col ${compact ? 'gap-[4px]' : 'gap-[9px]'} flex-1 min-w-0`}>
        {data.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center gap-1.5 transition-opacity ${compact ? 'text-[10.5px]' : 'text-[12.5px]'} ${hoveredIdx !== null && hoveredIdx !== i ? 'opacity-40' : 'opacity-100'}`}
          >
            <span className={`rounded-full flex-shrink-0 ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} style={{ background: s.color }} />
            <span className="text-muted flex-1 truncate">{s.label}</span>
            <span className="font-bold text-text">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export type WeekPoint = { label: string; value: number }

// Chart de área responsivo que preenche 100% do container.
// O SVG usa preserveAspectRatio="none" (escala livre) com vector-effect nas
// linhas pra não distorcer a espessura; os dots e textos são HTML por cima,
// garantindo círculos perfeitos e tipografia nítida em qualquer largura.
export function WeekChart({ points }: { points: WeekPoint[] }) {
  const max = Math.max(30, ...points.map((p) => p.value))
  const n = points.length
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  const PAD_X = 4 // % de respiro lateral
  const PLOT_TOP = 8 // % topo (espaço pro dot do pico)
  const PLOT_H = 76 // % altura da área plotável (resto = labels do eixo X)

  const coords = points.map((p, i) => ({
    x: PAD_X + (n > 1 ? (i / (n - 1)) * (100 - 2 * PAD_X) : 50),
    y: PLOT_TOP + (1 - p.value / max) * PLOT_H,
    label: p.label,
    value: p.value,
  }))

  const baseY = PLOT_TOP + PLOT_H
  const linePath = 'M ' + coords.map((c) => `${c.x} ${c.y}`).join(' L ')
  const areaPath = `${linePath} L ${coords[n - 1]?.x ?? 0} ${baseY} L ${coords[0]?.x ?? 0} ${baseY} Z`
  const gridRows = [0, 1, 2, 3] // do topo (max) até a base (0)

  return (
    <div className="relative w-full h-full flex text-[10px] min-h-[180px]">
      {/* eixo Y */}
      <div className="relative w-6 flex-none">
        {gridRows.map((k) => (
          <span
            key={k}
            className="absolute right-1 -translate-y-1/2 text-[#b4b1a9]"
            style={{ top: `${PLOT_TOP + (k / 3) * PLOT_H}%` }}
          >
            {Math.round((max * (3 - k)) / 3)}
          </span>
        ))}
      </div>

      {/* área de plot */}
      <div className="relative flex-1 min-w-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {gridRows.map((k) => {
            const y = PLOT_TOP + (k / 3) * PLOT_H
            return (
              <line key={k} x1="0" x2="100" y1={y} y2={y} stroke="#f0efec" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            )
          })}
          <path d={areaPath} fill="#6d5ae6" fillOpacity="0.09" />
          <path
            d={linePath}
            fill="none"
            stroke="#6d5ae6"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* dots (HTML = círculos perfeitos) */}
        {coords.map((c, i) => (
          <span
            key={i}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: i === todayIdx ? 11 : 8,
              height: i === todayIdx ? 11 : 8,
              background: i === todayIdx ? '#6d5ae6' : '#fff',
              border: '2.4px solid #6d5ae6',
              boxShadow: i === todayIdx ? '0 0 0 2.4px #fff' : undefined,
            }}
          />
        ))}

        {/* labels do eixo X */}
        {coords.map((c, i) => (
          <span
            key={i}
            className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap"
            style={{
              left: `${c.x}%`,
              fontWeight: i === todayIdx ? 700 : 400,
              color: i === todayIdx ? '#6d5ae6' : '#a3a09a',
            }}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function PatientsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['1', '5', '10', '15', '20', '25', '30'],
        datasets: [{
          data: [10, 11, 12, 14, 13, 16, 18],
          borderColor: '#6d5ae6',
          backgroundColor: 'rgba(109,90,230,0.06)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6d5ae6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#a3a09a' } },
          y: { display: false },
        },
      },
    })
    return () => { chartRef.current?.destroy() }
  }, [])

  return <canvas ref={canvasRef} />
}
