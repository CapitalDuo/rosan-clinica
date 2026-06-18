'use client'

import { useState } from 'react'

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${on ? 'bg-green' : 'bg-border'}`}
    >
      <span
        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 shadow-sm transition-[left] ${on ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  )
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-6 mb-5">
      <div className="font-playfair text-base font-bold mb-5 pb-3.5 border-b border-border">{title}</div>
      {children}
    </div>
  )
}

function ConfigRow({ label, desc, value, toggle, defaultOn }: {
  label: string
  desc?: string
  value?: string
  toggle?: boolean
  defaultOn?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-b-0">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs text-muted mt-0.5">{desc}</div>}
      </div>
      {toggle ? <Toggle defaultOn={defaultOn} /> : <div className="text-sm text-muted">{value}</div>}
    </div>
  )
}

export function ConfigView() {
  return (
    <div className="px-10 pt-7 pb-10">
      <ConfigSection title="Perfil da Clínica">
        <ConfigRow label="Nome da clínica" desc="Nome exibido no sistema" value="Rosan Clínica Integrativa" />
        <ConfigRow label="CNPJ" value="12.345.678/0001-90" />
        <ConfigRow label="Telefone" value="(11) 99999-0000" />
        <ConfigRow label="E-mail" value="contato@rosanclinica.com.br" />
      </ConfigSection>

      <ConfigSection title="Notificações">
        <ConfigRow label="Lembrete de consulta" desc="Enviar lembrete 24h antes da consulta" toggle defaultOn />
        <ConfigRow label="Confirmação por WhatsApp" desc="Solicitar confirmação via mensagem" toggle defaultOn />
        <ConfigRow label="E-mail pós-consulta" desc="Enviar resumo da consulta por e-mail" toggle />
      </ConfigSection>

      <ConfigSection title="Horário de Funcionamento">
        <ConfigRow label="Segunda a Sexta" value="08:00 – 18:00" />
        <ConfigRow label="Sábado" value="08:00 – 12:00" />
        <ConfigRow label="Domingo" value="Fechado" />
      </ConfigSection>
    </div>
  )
}
