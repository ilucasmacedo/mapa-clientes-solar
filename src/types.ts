export type Regiao = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'

export interface Cliente {
  id: string
  empresa: string
  razaoSocial: string
  cnpj: string
  cidade: string
  estado: string
  regiao: Regiao
  valor: number
  lat: number
  lng: number
}

export interface Aeroporto {
  iata: string
  nome: string
  cidade: string
  estado: string
  lat: number
  lng: number
}

export interface ConfigViagem {
  pessoas: number
  dias: number
  valorDiariaHotel: number
  alimentacaoDiaPessoa: number
  deslocamentoPorKm: number
  passagemIdaVolta: boolean
}

export interface CustoDetalhado {
  passagem: number
  hotel: number
  alimentacao: number
  deslocamento: number
  total: number
}

export interface ClienteOrcamento {
  cliente: Cliente
  aeroportoProximo: Aeroporto
  distanciaAeroportoKm: number
  distanciaHubKm: number
  receita: number
  custoAlocado: number
  resultado: number
  participacaoReceita: number
}

export interface OrcamentoViagem {
  id: string
  clientes: Cliente[]
  hub: Aeroporto
  diasSugeridos: number
  kmDeslocamento: number
  custos: CustoDetalhado
  receita: number
  resultado: number
  margem: number
  clientesDetalhe: ClienteOrcamento[]
}

export interface HotelOpcao {
  nome: string
  avaliacao: string
  preco: number
  link: string
  selecionado?: boolean
}

export interface CustoViagem {
  label: string
  valor: number
  detalhe?: string
}

export interface ReferenciaViagem {
  label: string
  url: string
}

export interface ClienteViagemResumo {
  clienteId: string
  receita: number
  custoAlocado: number
  resultado: number
}

export interface GrupoHoteis {
  titulo: string
  hoteis: HotelOpcao[]
}

export interface ViagemPlanejada {
  id: string
  titulo: string
  rota: string
  periodo: string
  origem: string
  dias: number
  pessoas: number
  clienteIds: string[]
  custos: CustoViagem[]
  custoTotal: number
  receitaTotal: number
  resultado: number
  margem: number
  clientesResumo: ClienteViagemResumo[]
  gruposHoteis: GrupoHoteis[]
  referencias: ReferenciaViagem[]
  relatorioMarkdown: string
  nota?: string
}
