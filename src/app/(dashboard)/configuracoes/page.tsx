import { ConfigView } from '@/components/config-view'

export default function ConfiguracoesPage() {
  return (
    <>
      <div className="flex items-center justify-between px-10 pt-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Configurações</h1>
      </div>
      <ConfigView />
    </>
  )
}
