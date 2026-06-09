export type Regiao = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'

export interface Cliente {
  id: string
  empresa: string
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
