import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export const PLANS = {
  basico: {
    slug: 'basico' as const,
    nome: 'Básico',
    priceId: process.env.STRIPE_PRICE_BASICO!,
    preco: 'R$ 247/mês',
    descricao: 'Agenda, Pacientes, Financeiro',
    features: ['Agenda ilimitada', 'Gestão de pacientes', 'Controle financeiro', 'Suporte por e-mail'],
  },
  completo: {
    slug: 'completo' as const,
    nome: 'Completo',
    priceId: process.env.STRIPE_PRICE_COMPLETO!,
    preco: 'R$ 349/mês',
    descricao: 'Tudo + WhatsApp e Agente de IA',
    features: ['Tudo do Básico', 'Atendimento via WhatsApp', 'Agente de IA', 'Suporte prioritário'],
  },
} as const
