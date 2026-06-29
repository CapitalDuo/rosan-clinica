// Tela de bloqueio do módulo inteiro: exibida quando o período de teste gratuito
// encerrou e a clínica ainda não assinou um plano. Mostrada no lugar do conteúdo
// de todas as páginas, exceto Configurações (onde a clínica assina).
export function PlanoBloqueado() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="bg-card border border-border rounded-[18px] shadow-2xl px-8 py-10 max-w-md text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#fdeaea] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d24343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <h2 className="font-playfair text-[22px] font-extrabold tracking-tight mb-2">
            Período de teste encerrado
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Seu acesso de teste à plataforma terminou. Assine um plano para voltar a usar a agenda,
            os pacientes, o financeiro e o atendimento. Seus dados continuam salvos.
          </p>
        </div>
        <a
          href="/configuracoes"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#5b4bd4] text-white rounded-[13px] text-sm font-semibold hover:bg-[#4a3cb8] transition-all hover:-translate-y-px hover:shadow-lg"
        >
          Assinar um plano
        </a>
      </div>
    </div>
  )
}
