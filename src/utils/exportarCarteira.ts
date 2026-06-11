import * as XLSX from 'xlsx'
import type { Cliente } from '../types'
import {
  montarDadosCarteira,
  montarResumoRegioes,
  nomeArquivoCarteira,
} from './carteiraDados'

function linhasCarteiraParaAoa(linhas: ReturnType<typeof montarDadosCarteira>) {
  const header = [
    'Ranking',
    'Empresa',
    'Razão Social',
    'CNPJ',
    'Cidade',
    'UF',
    'Região',
    'Valor Recorrência (R$)',
    'Latitude',
    'Longitude',
    'Km de Curitiba',
    'Aeroporto (IATA)',
    'Aeroporto',
    'Cidade do Aeroporto',
    'Km até Aeroporto',
    'Passagem Estimada CWB (R$)',
  ]

  const body = linhas.map((l) => [
    l.ranking,
    l.empresa,
    l.razaoSocial,
    l.cnpj,
    l.cidade,
    l.estado,
    l.regiao,
    l.valor,
    l.lat,
    l.lng,
    l.kmDaOrigem,
    l.aeroportoIata,
    l.aeroportoNome,
    l.aeroportoCidade,
    l.kmAteAeroporto,
    l.passagemEstimada,
  ])

  return [header, ...body]
}

function resumoRegioesParaAoa(resumo: ReturnType<typeof montarResumoRegioes>) {
  const header = ['Região', 'Qtd Clientes', 'Valor Total (R$)', 'Ticket Médio (R$)']
  const body = resumo.map((r) => [
    r.regiao,
    r.quantidade,
    r.valorTotal,
    Math.round(r.ticketMedio * 100) / 100,
  ])
  return [header, ...body]
}

function criarWorkbook(clientes: Cliente[]) {
  const linhas = montarDadosCarteira(clientes)
  const resumo = montarResumoRegioes(linhas)

  const wb = XLSX.utils.book_new()
  const wsCarteira = XLSX.utils.aoa_to_sheet(linhasCarteiraParaAoa(linhas))
  const wsResumo = XLSX.utils.aoa_to_sheet(resumoRegioesParaAoa(resumo))

  wsCarteira['!cols'] = [
    { wch: 8 },
    { wch: 42 },
    { wch: 42 },
    { wch: 20 },
    { wch: 22 },
    { wch: 6 },
    { wch: 14 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 12 },
    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 22 },
  ]

  XLSX.utils.book_append_sheet(wb, wsCarteira, 'Carteira')
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo por Região')

  return wb
}

export function exportarCarteiraXlsx(clientes: Cliente[], caminho?: string): void {
  const wb = criarWorkbook(clientes)
  XLSX.writeFile(wb, caminho ?? nomeArquivoCarteira())
}
