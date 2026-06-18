export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string
          data: string
          hora_fim: string
          hora_inicio: string
          id: string
          lembrete_enviado: boolean
          notas: string | null
          paciente_id: string
          profissional_id: string
          status: string
          tipo_consulta_id: string | null
          updated_at: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          data: string
          hora_fim: string
          hora_inicio: string
          id?: string
          lembrete_enviado?: boolean
          notas?: string | null
          paciente_id: string
          profissional_id: string
          status?: string
          tipo_consulta_id?: string | null
          updated_at?: string
          valor?: number | null
        }
        Update: Partial<Database["public"]["Tables"]["agendamentos"]["Insert"]>
        Relationships: []
      }
      clinica: {
        Row: {
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          logo_url: string | null
          nome: string
          onboarding_completo: boolean
          onboarding_step: number
          subtitulo: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          onboarding_completo?: boolean
          onboarding_step?: number
          subtitulo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["clinica"]["Insert"]>
        Relationships: []
      }
      conversas: {
        Row: {
          canal: string
          created_at: string
          id: string
          instancia_id: string | null
          mensagens_nao_lidas: number
          paciente_id: string
          status: string
          ultima_mensagem_at: string | null
          updated_at: string
        }
        Insert: {
          canal?: string
          created_at?: string
          id?: string
          instancia_id?: string | null
          mensagens_nao_lidas?: number
          paciente_id: string
          status?: string
          ultima_mensagem_at?: string | null
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["conversas"]["Insert"]>
        Relationships: []
      }
      horarios_funcionamento: {
        Row: {
          aberto: boolean
          clinica_id: string
          dia_semana: number
          hora_fim: string | null
          hora_inicio: string | null
          id: string
        }
        Insert: {
          aberto?: boolean
          clinica_id: string
          dia_semana: number
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
        }
        Update: Partial<Database["public"]["Tables"]["horarios_funcionamento"]["Insert"]>
        Relationships: []
      }
      mensagens: {
        Row: {
          conteudo: string
          conversa_id: string
          created_at: string
          entregue: boolean
          erro: string | null
          id: string
          lida: boolean
          midia_nome: string | null
          midia_url: string | null
          remetente_id: string | null
          remetente_tipo: string
          tipo_midia: string
          whatsapp_message_id: string | null
        }
        Insert: {
          conteudo: string
          conversa_id: string
          created_at?: string
          entregue?: boolean
          erro?: string | null
          id?: string
          lida?: boolean
          midia_nome?: string | null
          midia_url?: string | null
          remetente_id?: string | null
          remetente_tipo: string
          tipo_midia?: string
          whatsapp_message_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["mensagens"]["Insert"]>
        Relationships: []
      }
      notificacao_config: {
        Row: {
          ativo: boolean
          clinica_id: string
          id: string
          tipo: string
        }
        Insert: {
          ativo?: boolean
          clinica_id: string
          id?: string
          tipo: string
        }
        Update: Partial<Database["public"]["Tables"]["notificacao_config"]["Insert"]>
        Relationships: []
      }
      paciente_tags: {
        Row: { paciente_id: string; tag_id: string }
        Insert: { paciente_id: string; tag_id: string }
        Update: Partial<{ paciente_id: string; tag_id: string }>
        Relationships: []
      }
      pacientes: {
        Row: {
          avatar_url: string | null
          cliente_desde: string | null
          clinica_id: string | null
          codigo: number
          cor: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          documento: string | null
          email: string | null
          endereco: string | null
          id: string
          iniciais: string | null
          nome: string
          observacoes: string | null
          plano_id: string | null
          status: string
          telefone: string | null
          updated_at: string
          valor_plano: number | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          cliente_desde?: string | null
          clinica_id?: string | null
          codigo?: number
          cor?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          documento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          iniciais?: string | null
          nome: string
          observacoes?: string | null
          plano_id?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          valor_plano?: number | null
          whatsapp?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["pacientes"]["Insert"]>
        Relationships: []
      }
      planos: {
        Row: { id: string; nome: string; tipo: string }
        Insert: { id?: string; nome: string; tipo?: string }
        Update: Partial<{ id: string; nome: string; tipo: string }>
        Relationships: []
      }
      profissionais: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          clinica_id: string | null
          cor: string | null
          created_at: string
          email: string | null
          especialidade: string | null
          id: string
          iniciais: string | null
          nome: string
          registro: string | null
          role: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          clinica_id?: string | null
          cor?: string | null
          created_at?: string
          email?: string | null
          especialidade?: string | null
          id?: string
          iniciais?: string | null
          nome: string
          registro?: string | null
          role?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["profissionais"]["Insert"]>
        Relationships: []
      }
      prontuarios: {
        Row: {
          agendamento_id: string | null
          anexos: Json | null
          created_at: string
          descricao: string
          diagnostico: string | null
          id: string
          paciente_id: string
          prescricao: string | null
          profissional_id: string
        }
        Insert: {
          agendamento_id?: string | null
          anexos?: Json | null
          created_at?: string
          descricao: string
          diagnostico?: string | null
          id?: string
          paciente_id: string
          prescricao?: string | null
          profissional_id: string
        }
        Update: Partial<Database["public"]["Tables"]["prontuarios"]["Insert"]>
        Relationships: []
      }
      tags: {
        Row: { cor: string | null; id: string; nome: string }
        Insert: { cor?: string | null; id?: string; nome: string }
        Update: Partial<{ cor: string; id: string; nome: string }>
        Relationships: []
      }
      tipos_consulta: {
        Row: { cor: string; duracao_padrao: string | null; id: string; nome: string }
        Insert: { cor: string; duracao_padrao?: string | null; id?: string; nome: string }
        Update: Partial<{ cor: string; duracao_padrao: string; id: string; nome: string }>
        Relationships: []
      }
      transacoes: {
        Row: {
          agendamento_id: string | null
          created_at: string
          data: string
          descricao: string | null
          forma_pagamento: string | null
          id: string
          paciente_id: string
          status: string
          tipo: string
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          forma_pagamento?: string | null
          id?: string
          paciente_id: string
          status?: string
          tipo: string
          valor: number
        }
        Update: Partial<Database["public"]["Tables"]["transacoes"]["Insert"]>
        Relationships: []
      }
      whatsapp_eventos: {
        Row: {
          created_at: string
          id: string
          instancia_id: string
          payload: Json | null
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          instancia_id: string
          payload?: Json | null
          tipo: string
        }
        Update: Partial<Database["public"]["Tables"]["whatsapp_eventos"]["Insert"]>
        Relationships: []
      }
      whatsapp_instancias: {
        Row: {
          api_key: string | null
          api_url: string | null
          clinica_id: string
          created_at: string
          id: string
          nome_instancia: string
          numero: string
          qrcode_base64: string | null
          qrcode_expires_at: string | null
          status: string
          ultimo_ping: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_url?: string | null
          clinica_id: string
          created_at?: string
          id?: string
          nome_instancia: string
          numero: string
          qrcode_base64?: string | null
          qrcode_expires_at?: string | null
          status?: string
          ultimo_ping?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["whatsapp_instancias"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
