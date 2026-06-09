import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ConfigViagem, OrcamentoViagem } from '../types'
import { formatarMoeda } from './format'

interface ExportarPdfParams {
  orcamentos: OrcamentoViagem[]
  config: ConfigViagem
  totais: { receita: number; custos: number; resultado: number }
}

type DocComTabela = jsPDF & { lastAutoTable: { finalY: number } }

function pdfText(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function dataHoje(): string {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function nomeArquivo(): string {
  const iso = new Date().toISOString().slice(0, 10)
  return `orcamento-visita-${iso}.pdf`
}

function truncar(texto: string, max: number): string {
  return texto.length > max ? `${texto.slice(0, max - 1)}…` : texto
}

export function exportarOrcamentoPdf({
  orcamentos,
  config,
  totais,
}: ExportarPdfParams): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margem = 14
  let y = margem

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Orcamento de Visita Comercial', margem, y)

  y += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text(pdfText(`Gerado em ${dataHoje()} · Origem: Sao Paulo, SP`), margem, y)

  y += 10
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Parametros da viagem', margem, y)

  y += 2
  autoTable(doc, {
    startY: y,
    margin: { left: margem, right: margem },
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    head: [['Item', 'Valor']],
    body: [
      ['Equipe', `${config.pessoas} pessoa(s)`],
      ['Duracao', `${config.dias} dia(s)`],
      ['Diaria hotel / pessoa', formatarMoeda(config.valorDiariaHotel)],
      ['Alimentacao / dia / pessoa', formatarMoeda(config.alimentacaoDiaPessoa)],
      ['Deslocamento', `${formatarMoeda(config.deslocamentoPorKm)} / km`],
      ['Passagem', config.passagemIdaVolta ? 'Ida e volta' : 'Somente ida'],
    ],
  })

  y = (doc as DocComTabela).lastAutoTable.finalY + 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo geral', margem, y)

  y += 2
  autoTable(doc, {
    startY: y,
    margin: { left: margem, right: margem },
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    head: [['Receita total', 'Custo total', 'Resultado']],
    body: [[
      formatarMoeda(totais.receita),
      formatarMoeda(totais.custos),
      formatarMoeda(totais.resultado),
    ]],
  })

  y = (doc as DocComTabela).lastAutoTable.finalY + 12

  for (let i = 0; i < orcamentos.length; i++) {
    const orcamento = orcamentos[i]

    if (y > 250) {
      doc.addPage()
      y = margem
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Viagem ${i + 1}`, margem, y)

    y += 5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(
      pdfText(
        `Hub sugerido: ${orcamento.hub.iata} — ${orcamento.hub.nome} (${orcamento.hub.cidade}/${orcamento.hub.estado})`,
      ),
      margem,
      y,
    )
    doc.setTextColor(0, 0, 0)

    y += 2
    autoTable(doc, {
      startY: y,
      margin: { left: margem, right: margem },
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      head: [['Custo', 'Valor']],
      body: [
        [
          `Passagem (${config.pessoas} pax${config.passagemIdaVolta ? ', i/v' : ''})`,
          formatarMoeda(orcamento.custos.passagem),
        ],
        [`Hotel (${config.dias}d x ${config.pessoas}p)`, formatarMoeda(orcamento.custos.hotel)],
        [
          `Alimentacao (${config.dias}d x ${config.pessoas}p)`,
          formatarMoeda(orcamento.custos.alimentacao),
        ],
        [
          `Deslocamento (${orcamento.kmDeslocamento} km i/v)`,
          formatarMoeda(orcamento.custos.deslocamento),
        ],
        ['Total da viagem', formatarMoeda(orcamento.custos.total)],
        ['Receita esperada', formatarMoeda(orcamento.receita)],
        [
          `Resultado (${orcamento.margem.toFixed(1)}%)`,
          formatarMoeda(orcamento.resultado),
        ],
      ],
    })

    y = (doc as DocComTabela).lastAutoTable.finalY + 6

    autoTable(doc, {
      startY: y,
      margin: { left: margem, right: margem },
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 52 },
        1: { cellWidth: 28 },
        2: { cellWidth: 22 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 24 },
      },
      head: [
        [
          'Empresa',
          'Cidade',
          'Aeroporto',
          'Receita',
          'Custo alocado',
          'Resultado',
        ],
      ],
      body: orcamento.clientesDetalhe.map((det) => [
        pdfText(truncar(det.cliente.empresa, 38)),
        pdfText(`${det.cliente.cidade}/${det.cliente.estado}`),
        `${det.aeroportoProximo.iata} (${det.distanciaAeroportoKm} km)`,
        formatarMoeda(det.receita),
        formatarMoeda(det.custoAlocado),
        formatarMoeda(det.resultado),
      ]),
    })

    y = (doc as DocComTabela).lastAutoTable.finalY + 14
  }

  const totalPaginas = doc.getNumberOfPages()
  for (let p = 1; p <= totalPaginas; p++) {
    doc.setPage(p)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(
      `Mapa Clientes Solar · Pagina ${p} de ${totalPaginas}`,
      margem,
      290,
    )
  }

  doc.save(nomeArquivo())
}
