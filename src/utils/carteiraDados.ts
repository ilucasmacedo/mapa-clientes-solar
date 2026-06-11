import type { Cliente, Regiao } from '../types'
import { aeroportoMaisProximo } from './aeroportos'
import { distanciaDaOrigem, estimarCustoPassagem } from './geo'

export interface LinhaCarteira {
  ranking: number
  empresa: string
  razaoSocial: string
  cnpj: string
  cidade: string
  estado: string
  regiao: Regiao
  valor: number
  lat: number
  lng: number
  kmDaOrigem: number
  aeroportoIata: string
  aeroportoNome: string
  aeroportoCidade: string
  kmAteAeroporto: number
  passagemEstimada: number
}

export interface LinhaResumoRegiao {
  regiao: Regiao
  quantidade: number
  valorTotal: number
  ticketMedio: number
}

export function formatarCnpj(cnpj: string): string {
  const digitos = cnpj.replace(/\D/g, '')
  if (digitos.length !== 14) return cnpj
  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`
}

export function montarDadosCarteira(clientes: Cliente[]): LinhaCarteira[] {
  return [...clientes]
    .sort((a, b) => b.valor - a.valor)
    .map((cliente, index) => {
      const aeroporto = aeroportoMaisProximo(cliente.lat, cliente.lng)
      return {
        ranking: index + 1,
        empresa: cliente.empresa,
        razaoSocial: cliente.razaoSocial,
        cnpj: formatarCnpj(cliente.cnpj),
        cidade: cliente.cidade,
        estado: cliente.estado,
        regiao: cliente.regiao,
        valor: cliente.valor,
        lat: cliente.lat,
        lng: cliente.lng,
        kmDaOrigem: distanciaDaOrigem(cliente.lat, cliente.lng),
        aeroportoIata: aeroporto.aeroporto.iata,
        aeroportoNome: aeroporto.aeroporto.nome,
        aeroportoCidade: aeroporto.aeroporto.cidade,
        kmAteAeroporto: aeroporto.distanciaKm,
        passagemEstimada: estimarCustoPassagem(
          aeroporto.aeroporto.lat,
          aeroporto.aeroporto.lng,
        ),
      }
    })
}

export function montarResumoRegioes(linhas: LinhaCarteira[]): LinhaResumoRegiao[] {
  const regioes: Regiao[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

  return regioes
    .map((regiao) => {
      const lista = linhas.filter((l) => l.regiao === regiao)
      const valorTotal = lista.reduce((acc, l) => acc + l.valor, 0)
      return {
        regiao,
        quantidade: lista.length,
        valorTotal,
        ticketMedio: lista.length ? valorTotal / lista.length : 0,
      }
    })
    .filter((r) => r.quantidade > 0)
}

export function nomeArquivoCarteira(): string {
  const iso = new Date().toISOString().slice(0, 10)
  return `carteira-clientes-${iso}.xlsx`
}
