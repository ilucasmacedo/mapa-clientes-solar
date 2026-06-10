import type { Cliente, Regiao } from '../types'

export type FiltroExibicao = 'todos' | 'top30'

export interface FiltrosClientes {
  regiao: Regiao | 'todas'
  estado: string
  exibicao: FiltroExibicao
}

export const FILTROS_PADRAO: FiltrosClientes = {
  regiao: 'todas',
  estado: 'todos',
  exibicao: 'todos',
}

export function poolFiltrado(
  clientes: Cliente[],
  exibicao: FiltroExibicao,
): Cliente[] {
  if (exibicao === 'top30') {
    return [...clientes].sort((a, b) => b.valor - a.valor).slice(0, 30)
  }
  return clientes
}

export function filtrarClientes(
  clientes: Cliente[],
  filtros: FiltrosClientes,
): Cliente[] {
  let resultado = poolFiltrado(clientes, filtros.exibicao)

  if (filtros.regiao !== 'todas') {
    resultado = resultado.filter((c) => c.regiao === filtros.regiao)
  }

  if (filtros.estado !== 'todos') {
    resultado = resultado.filter((c) => c.estado === filtros.estado)
  }

  return resultado
}

export function estadosDisponiveis(clientes: Cliente[]): string[] {
  return [...new Set(clientes.map((c) => c.estado))].sort()
}

export const REGIOES: Regiao[] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
]
