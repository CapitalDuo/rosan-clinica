import { ConfigTabs } from '@/components/config-tabs'

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="px-10 pt-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted mt-0.5">Dados da clínica, equipe, agenda e suporte</p>
      </div>
      <ConfigTabs />
      {children}
    </>
  )
}
