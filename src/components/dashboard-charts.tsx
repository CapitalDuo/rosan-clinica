'use client'

import { useEffect, useRef } from 'react'
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

export function DonutChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Confirmadas', 'Pendentes', 'Canceladas', 'Concluídas'],
        datasets: [{
          data: [32, 8, 5, 3],
          backgroundColor: ['#4caf50', '#f5a623', '#e74c3c', '#ccc'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
      },
    })
    return () => { chartRef.current?.destroy() }
  }, [])

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[140px] h-[140px] flex-shrink-0">
        <canvas ref={canvasRef} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="font-playfair text-[32px] font-extrabold tracking-tight leading-none block">48</span>
          <span className="text-xs text-muted">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {[
          { color: 'bg-green', label: 'Confirmadas', value: '32 (66,7%)' },
          { color: 'bg-orange', label: 'Pendentes', value: '8 (16,7%)' },
          { color: 'bg-red', label: 'Canceladas', value: '5 (10,4%)' },
          { color: 'bg-[#ccc]', label: 'Concluídas', value: '3 (6,2%)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[13px]">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
            <span className="text-muted flex-1">{item.label}</span>
            <span className="font-semibold whitespace-nowrap">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WeekChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
          data: [18, 22, 20, 24, 16, 8, 0],
          borderColor: '#1a1a1a',
          backgroundColor: 'rgba(26,26,26,0.05)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#1a1a1a',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (items) => {
                const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
                const dates = ['25 Mai', '26 Mai', '27 Mai', '28 Mai', '29 Mai', '30 Mai', '31 Mai']
                return days[items[0].dataIndex] + ', ' + dates[items[0].dataIndex]
              },
              label: (item) => item.raw + ' atendimentos',
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'normal' as const }, color: '#7a7a7a' } },
          y: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#7a7a7a', stepSize: 10 }, beginAtZero: true },
        },
      },
    })
    return () => { chartRef.current?.destroy() }
  }, [])

  return <canvas ref={canvasRef} />
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
        labels: ['1 Mai', '', '10 Mai', '', '20 Mai', '', '30 Mai'],
        datasets: [{
          data: [10, 11, 12, 14, 13, 16, 18],
          borderColor: '#1a1a1a',
          backgroundColor: 'rgba(26,26,26,0.04)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1a1a1a',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#7a7a7a' } },
          y: { display: false },
        },
      },
    })
    return () => { chartRef.current?.destroy() }
  }, [])

  return <canvas ref={canvasRef} />
}
