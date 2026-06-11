import type { Cliente, Regiao } from '../types'

export interface FiltrosClientes {
  regiao: Regiao | 'todas'
  estado: string
  valorMin: number
  valorMax: number
}

export interface LimitesValor {
  min: number
  max: number
}

export function limitesValor(clientes: Cliente[]): LimitesValor {
  const valores = clientes.map((c) => c.valor)
  return {
    min: Math.min(...valores),
    max: Math.max(...valores),
  }
}

export function criarFiltrosPadrao(clientes: Cliente[]): FiltrosClientes {
  const limites = limitesValor(clientes)
  return {
    regiao: 'todas',
    estado: 'todos',
    valorMin: limites.min,
    valorMax: limites.max,
  }
}

export function filtrarClientes(
  clientes: Cliente[],
  filtros: FiltrosClientes,
): Cliente[] {
  let resultado = clientes.filter(
    (c) => c.valor >= filtros.valorMin && c.valor <= filtros.valorMax,
  )

  if (filtros.regiao !== 'todas') {
    resultado = resultado.filter((c) => c.regiao === filtros.regiao)
  }

  if (filtros.estado !== 'todos') {
    resultado = resultado.filter((c) => c.estado === filtros.estado)
  }

  return resultado
}

export function poolPorValor(clientes: Cliente[], filtros: FiltrosClientes): Cliente[] {
  return clientes.filter(
    (c) => c.valor >= filtros.valorMin && c.valor <= filtros.valorMax,
  )
}

export function filtrosAtivos(filtros: FiltrosClientes, limites: LimitesValor): boolean {
  return (
    filtros.regiao !== 'todas' ||
    filtros.estado !== 'todos' ||
    filtros.valorMin !== limites.min ||
    filtros.valorMax !== limites.max
  )
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
