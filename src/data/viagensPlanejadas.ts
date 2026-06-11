import { clientes } from './clientes'
import type { ClienteViagemResumo, ViagemPlanejada } from '../types'

function resumoClientes(clienteIds: string[], custoTotal: number): ClienteViagemResumo[] {
  const receitas = clienteIds.map((id) => {
    const cliente = clientes.find((c) => c.id === id)
    return { clienteId: id, receita: cliente?.valor ?? 0 }
  })
  const receitaTotal = receitas.reduce((acc, item) => acc + item.receita, 0)

  return receitas.map(({ clienteId, receita }) => {
    const custoAlocado = receitaTotal > 0 ? (custoTotal * receita) / receitaTotal : 0
    return {
      clienteId,
      receita,
      custoAlocado,
      resultado: receita - custoAlocado,
    }
  })
}

function totaisViagem(receitaTotal: number, custoTotal: number) {
  return {
    receitaTotal,
    custoTotal,
    resultado: receitaTotal - custoTotal,
    margem: receitaTotal > 0 ? ((receitaTotal - custoTotal) / receitaTotal) * 100 : 0,
  }
}

const NOITES_SANTOS = 2

const LINK_BOOKING_SANTOS =
  'https://www.booking.com/searchresults.pt-br.html?ss=Santos&checkin=2026-08-01&checkout=2026-08-03&group_adults=2&group_children=0&no_rooms=2'

const LINK_BOOKING_ARARAS =
  'https://www.booking.com/searchresults.pt-br.html?ss=Araras%2C+Estado+de+S%C3%A3o+Paulo&checkin=2026-08-03&checkout=2026-08-05&group_adults=2&group_children=0&no_rooms=2'

/** Preços originais do Booking para 3 noites (1 quarto) em Santos — rateio proporcional */
function hotelSantos2Quartos(preco3Noites1Quarto: number) {
  return (preco3Noites1Quarto / 3) * NOITES_SANTOS * 2
}

/** Preços originais do Booking para 2 noites (1 quarto) em Araras */
function hotelAraras2Quartos(preco2Noites1Quarto: number) {
  return preco2Noites1Quarto * 2
}

const HOTEL_SANTOS_ESCOLHIDO = hotelSantos2Quartos(697.95)
const HOTEL_ARARAS_ESCOLHIDO = hotelAraras2Quartos(525.15)

const CUSTO_CWB_SP_SANTOS_ARARAS =
  912.6 + 670 + 389.83 + HOTEL_SANTOS_ESCOLHIDO + HOTEL_ARARAS_ESCOLHIDO + 800

const IDS_CWB_SP_SANTOS_ARARAS = ['cliente-4', 'cliente-10'] as const
const RECEITA_CWB_SP_SANTOS_ARARAS = IDS_CWB_SP_SANTOS_ARARAS.reduce((acc, id) => {
  const cliente = clientes.find((c) => c.id === id)
  return acc + (cliente?.valor ?? 0)
}, 0)

const LINK_BOOKING_VOOS_CWB_RECIFE =
  'https://flights.booking.com/flights/CWB.AIRPORT-REC.AIRPORT/?type=ROUNDTRIP&adults=2&cabinClass=ECONOMY&from=CWB.AIRPORT&to=REC.AIRPORT&fromCountry=BR&toCountry=BR&depart=2026-06-23&return=2026-06-27'

const LINK_BOOKING_RECIFE =
  'https://www.booking.com/searchresults.pt-br.html?ss=Recife&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&group_children=0&no_rooms=2'

const NOITES_RECIFE = 4
const HOTEL_RECIFE_ESCOLHIDO = 200 * NOITES_RECIFE * 2

const CUSTO_SP_RECIFE =
  1874 + HOTEL_RECIFE_ESCOLHIDO + 500 + 250 + 800

const IDS_SP_RECIFE = ['cliente-1', 'cliente-16', 'cliente-23'] as const
const RECEITA_SP_RECIFE = IDS_SP_RECIFE.reduce((acc, id) => {
  const cliente = clientes.find((c) => c.id === id)
  return acc + (cliente?.valor ?? 0)
}, 0)

export const viagensPlanejadas: ViagemPlanejada[] = [
  {
    id: 'cwb-sp-santos-araras',
    titulo: 'Curitiba → SP → Santos → Araras',
    rota: 'Curitiba (voo) → São Paulo → Santos → Araras',
    periodo: '01 a 05 de agosto de 2026',
    origem: 'Curitiba',
    dias: 5,
    pessoas: 2,
    clienteIds: [...IDS_CWB_SP_SANTOS_ARARAS],
    custos: [
      { label: 'Voos (ida e volta, 2 pessoas)', valor: 912.6, detalhe: 'CWB ↔ CGH/GRU' },
      { label: 'Aluguel de carro (5 dias)', valor: 670 },
      { label: 'Combustível e pedágios', valor: 389.83, detalhe: 'SP → Santos → Araras → SP' },
      { label: 'Hospedagem em Santos (2 noites, 2 quartos)', valor: HOTEL_SANTOS_ESCOLHIDO },
      { label: 'Hospedagem em Araras (2 noites, 2 quartos)', valor: HOTEL_ARARAS_ESCOLHIDO },
      { label: 'Alimentação (5 dias, 2 pessoas)', valor: 800, detalhe: 'R$ 80/pessoa/dia' },
    ],
    ...totaisViagem(RECEITA_CWB_SP_SANTOS_ARARAS, CUSTO_CWB_SP_SANTOS_ARARAS),
    clientesResumo: resumoClientes([...IDS_CWB_SP_SANTOS_ARARAS], CUSTO_CWB_SP_SANTOS_ARARAS),
    gruposHoteis: [
      {
        titulo: 'Hospedagem em Santos (2 noites, 2 quartos separados)',
        hoteis: [
          {
            nome: 'Suíte Luxo com Piscina e Academia Stay Santos',
            avaliacao: '9,0 (Fantástico)',
            preco: hotelSantos2Quartos(697.95),
            link: LINK_BOOKING_SANTOS,
            selecionado: true,
          },
          {
            nome: 'Atlântico Inn Apart Hotel',
            avaliacao: '8,6 (Fabuloso)',
            preco: hotelSantos2Quartos(876.15),
            link: LINK_BOOKING_SANTOS,
          },
          {
            nome: 'Atlântico Golden Apart Hotel',
            avaliacao: '8,4 (Muito bom)',
            preco: hotelSantos2Quartos(976.05),
            link: LINK_BOOKING_SANTOS,
          },
        ],
      },
      {
        titulo: 'Hospedagem em Araras (2 noites, 2 quartos separados)',
        hoteis: [
          {
            nome: 'Trade Garden Hotel',
            avaliacao: '7,7 (Bom)',
            preco: hotelAraras2Quartos(525.15),
            link: LINK_BOOKING_ARARAS,
            selecionado: true,
          },
          {
            nome: 'Hotel Marques',
            avaliacao: '8,3 (Muito bom)',
            preco: hotelAraras2Quartos(679.05),
            link: LINK_BOOKING_ARARAS,
          },
          {
            nome: 'Lagoa Serena Flat Hotel',
            avaliacao: '8,3 (Muito bom)',
            preco: hotelAraras2Quartos(846.45),
            link: LINK_BOOKING_ARARAS,
          },
        ],
      },
    ],
    referencias: [
      {
        label: 'Google Flights — Voos Curitiba → São Paulo',
        url: 'https://www.google.com/travel/flights?q=voos%20Curitiba%20para%20S%C3%A3o%20Paulo%20agosto%202026',
      },
      {
        label: 'KAYAK — Aluguel de carros',
        url: 'https://www.kayak.com.br/Brasil-Aluguel-de-carros.33.crc.html',
      },
      {
        label: 'Booking.com — Hotéis em Santos',
        url: LINK_BOOKING_SANTOS,
      },
      {
        label: 'Booking.com — Hotéis em Araras',
        url: LINK_BOOKING_ARARAS,
      },
    ],
    relatorioMarkdown: '/relatorios/viagem-cwb-sp-santos-araras.md',
    nota: 'ALVA está cadastrada em Praia Grande; a hospedagem da viagem foi planejada em Santos (região da Baixada Santista).',
  },
  {
    id: 'sp-recife-maceio',
    titulo: 'Curitiba → Recife → Maceió',
    rota: 'Curitiba (voo) → Recife (base) → Maceió (LHT, D Solare, Verttec)',
    periodo: '23 a 27 de junho de 2026',
    origem: 'Curitiba',
    dias: 5,
    pessoas: 2,
    clienteIds: [...IDS_SP_RECIFE],
    custos: [
      {
        label: 'Voos (ida e volta, 2 pessoas)',
        valor: 1874,
        detalhe: 'CWB ↔ REC · ida 23/06 · volta 27/06 · Booking Flights',
      },
      {
        label: 'Hospedagem em Recife (4 noites, 2 quartos)',
        valor: HOTEL_RECIFE_ESCOLHIDO,
        detalhe: 'Hotel Luzeiros Recife (estimativa) · check-in 23/06',
      },
      { label: 'Aluguel de carro (5 dias)', valor: 500, detalhe: 'Carro econômico' },
      {
        label: 'Combustível e pedágios',
        valor: 250,
        detalhe: 'Recife ↔ Maceió (~270 km ida)',
      },
      { label: 'Alimentação (5 dias, 2 pessoas)', valor: 800, detalhe: 'R$ 80/pessoa/dia' },
    ],
    ...totaisViagem(RECEITA_SP_RECIFE, CUSTO_SP_RECIFE),
    clientesResumo: resumoClientes([...IDS_SP_RECIFE], CUSTO_SP_RECIFE),
    gruposHoteis: [
      {
        titulo: 'Hospedagem em Recife (4 noites, 2 quartos separados)',
        hoteis: [
          {
            nome: 'Hotel Luzeiros Recife',
            avaliacao: '3 estrelas · Centro',
            preco: 200 * NOITES_RECIFE * 2,
            link: 'https://www.booking.com/hotel/br/luzeiros-recife.pt-br.html?aid=304142&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&no_rooms=2',
            selecionado: true,
          },
          {
            nome: 'Rede Andrade Boa Viagem',
            avaliacao: '3 estrelas · Boa Viagem',
            preco: 250 * NOITES_RECIFE * 2,
            link: 'https://www.booking.com/hotel/br/rede-andrade-boa-viagem.pt-br.html?aid=304142&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&no_rooms=2',
          },
          {
            nome: 'Rede Andrade LG Inn',
            avaliacao: '3 estrelas · Boa Viagem',
            preco: 280 * NOITES_RECIFE * 2,
            link: 'https://www.booking.com/hotel/br/lg-inn.pt-br.html?aid=304142&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&no_rooms=2',
          },
          {
            nome: 'Allure Residence by Carpediem',
            avaliacao: '4 estrelas · Boa Viagem',
            preco: 320 * NOITES_RECIFE * 2,
            link: 'https://www.booking.com/hotel/br/allure-por-carpediem.pt-br.html?aid=304142&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&no_rooms=2',
          },
          {
            nome: 'Kastel Manibu Recife - Boa Viagem',
            avaliacao: '4 estrelas · Boa Viagem',
            preco: 350 * NOITES_RECIFE * 2,
            link: 'https://www.booking.com/hotel/br/hotel-manibu-recife.pt-br.html?aid=304142&checkin=2026-06-23&checkout=2026-06-27&group_adults=2&no_rooms=2',
          },
        ],
      },
    ],
    referencias: [
      {
        label: 'Booking Flights — Voos Curitiba → Recife (23–27/06)',
        url: LINK_BOOKING_VOOS_CWB_RECIFE,
      },
      {
        label: 'Booking.com — Hotéis em Recife (2 quartos, 23–27/06)',
        url: LINK_BOOKING_RECIFE,
      },
      {
        label: 'Rentcars — Aluguel de carros',
        url: 'https://www.rentcars.com/pt-br/tarifas',
      },
    ],
    relatorioMarkdown: '/relatorios/viagem-sp-recife.md',
    nota: 'Clientes LHT, D Solare e Verttec ficam em Maceió/AL (~270 km de Recife). Base da viagem em Recife com deslocamento de carro.',
  },
]

export function getViagemPlanejada(id: string): ViagemPlanejada | undefined {
  return viagensPlanejadas.find((v) => v.id === id)
}
