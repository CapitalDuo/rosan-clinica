import { KpiCard } from '@/components/kpi-card'
import { CalendarIcon, UsersIcon, DollarIcon, ClockIcon } from '@/components/icons'
import { DonutChart, WeekChart, PatientsChart } from '@/components/dashboard-charts'

const todayAppointments = [
  { time: '09:00', dur: '50 min', name: 'Maria Silva', type: 'Consulta de retorno', status: 'confirmada' as const, dot: 'bg-blue' },
  { time: '10:00', dur: '60 min', name: 'João Santos', type: 'Avaliação inicial', status: 'confirmada' as const, dot: 'bg-green' },
  { time: '11:00', dur: '50 min', name: 'Carla Oliveira', type: 'Consulta nutricional', status: 'confirmada' as const, dot: 'bg-orange' },
  { time: '14:00', dur: '50 min', name: 'Lucas Ferreira', type: 'Acompanhamento', status: 'pendente' as const, dot: 'bg-orange' },
  { time: '15:00', dur: '50 min', name: 'Ana Paula Costa', type: 'Consulta de retorno', status: 'confirmada' as const, dot: 'bg-blue' },
]

const upcomingAppointments = [
  { title: 'Consulta de retorno', patient: 'Mariana Lima', date: '27 Mai, 10:00', dot: 'bg-blue' },
  { title: 'Avaliação inicial', patient: 'Fernando Mendes', date: '27 Mai, 11:00', dot: 'bg-green' },
  { title: 'Consulta nutricional', patient: 'Juliana Martins', date: '27 Mai, 14:00', dot: 'bg-orange' },
  { title: 'Acompanhamento', patient: 'Rafael Souza', date: '28 Mai, 09:00', dot: 'bg-orange' },
  { title: 'Consulta de retorno', patient: 'Beatriz Almeida', date: '28 Mai, 10:00', dot: 'bg-blue' },
]

const statusStyles = {
  confirmada: 'bg-green-light text-green',
  pendente: 'bg-orange-light text-orange',
  cancelada: 'bg-red-light text-red',
}

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-10 pt-7">
        <div>
          <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Bom dia, Dr. Rodrigo</h1>
          <p className="text-sm text-muted mt-0.5">Aqui está o resumo da sua agenda e atendimentos de hoje.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[10px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer">
          + Nova consulta
        </button>
      </div>

      {/* Content */}
      <div className="px-10 pt-7 pb-10">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          <KpiCard
            icon={<CalendarIcon className="w-[22px] h-[22px]" />}
            label="Consultas hoje"
            value="12"
            change="+2 em relação a ontem"
            color="blue"
          />
          <KpiCard
            icon={<UsersIcon className="w-[22px] h-[22px]" />}
            label="Pacientes atendidos"
            value="38"
            change="+8 essa semana"
            color="green"
          />
          <KpiCard
            icon={<DollarIcon className="w-[22px] h-[22px]" />}
            label="Faturamento do mês"
            value="R$ 28.450,00"
            change="+18% em relação ao mês anterior"
            color="orange"
            valueSmall
          />
          <KpiCard
            icon={<ClockIcon className="w-[22px] h-[22px]" />}
            label="Próxima consulta"
            value="09:00"
            change="Maria Silva"
            color="purple"
          />
        </div>

        {/* Agenda + Upcoming */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Agenda de hoje */}
          <div className="bg-card border border-border rounded-[14px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-base font-bold">Agenda de hoje</h2>
              <span className="text-[13px] text-muted font-medium cursor-pointer hover:text-text transition-colors">Ver agenda completa</span>
            </div>
            <div className="flex flex-col">
              {todayAppointments.map((apt, i) => (
                <div key={i} className={`flex items-center gap-4 py-3.5 ${i < todayAppointments.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="min-w-[52px]">
                    <div className="text-sm font-bold">{apt.time}</div>
                    <div className="text-[11px] text-muted">{apt.dur}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${apt.dot}`} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{apt.name}</div>
                    <div className="text-xs text-muted">{apt.type}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-md ${statusStyles[apt.status]}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center pt-4 border-t border-border mt-1">
              <span className="text-[13px] text-muted font-medium cursor-pointer hover:text-text">Ver todas as consultas de hoje &#8964;</span>
            </div>
          </div>

          {/* Próximos compromissos */}
          <div className="bg-card border border-border rounded-[14px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-base font-bold">Próximos compromissos</h2>
            </div>
            <div className="flex flex-col">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} className={`flex items-center gap-3.5 py-[13px] ${i < upcomingAppointments.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${apt.dot}`} />
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold">{apt.title}</div>
                    <div className="text-xs text-muted">{apt.patient}</div>
                  </div>
                  <div className="text-xs text-muted font-medium whitespace-nowrap">{apt.date}</div>
                </div>
              ))}
            </div>
            <div className="text-center pt-4 border-t border-border mt-1">
              <span className="text-[13px] text-muted font-medium cursor-pointer hover:text-text">Ver todos os próximos</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-card border border-border rounded-[14px] p-6">
            <h3 className="font-playfair text-sm font-bold mb-5">Consultas por status</h3>
            <DonutChart />
          </div>
          <div className="bg-card border border-border rounded-[14px] p-6">
            <h3 className="font-playfair text-sm font-bold mb-5">Atendimentos da semana</h3>
            <div className="h-[150px]">
              <WeekChart />
            </div>
          </div>
          <div className="bg-card border border-border rounded-[14px] p-6">
            <h3 className="font-playfair text-sm font-bold mb-5">Pacientes novos (mês)</h3>
            <div className="font-playfair text-[40px] font-extrabold tracking-tighter leading-none mb-1">18</div>
            <div className="text-xs text-green font-medium mb-4">+5 em relação ao mês anterior</div>
            <div className="h-[90px]">
              <PatientsChart />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
