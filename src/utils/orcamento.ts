import type {
  Cliente,
  ClienteOrcamento,
  ConfigViagem,
  OrcamentoViagem,
} from '../types'
import { aeroportoMaisProximo, hubIdeal } from './aeroportos'
import { distanciaKm, estimarCustoPassagem } from './geo'

const RAIO_CLUSTER_KM = 300

export const CONFIG_PADRAO: ConfigViagem = {
  pessoas: 1,
  dias: 2,
  valorDiariaHotel: 200,
  alimentacaoDiaPessoa: 80,
  deslocamentoPorKm: 1.5,
  passagemIdaVolta: true,
}

export function chaveCidade(cliente: Cliente): string {
  return `${cliente.cidade}-${cliente.estado}`
}

export function idViagem(clientes: Cliente[]): string {
  return clientes
    .map((c) => c.id)
    .sort()
    .join('|')
}

export function agruparEmViagens(clientes: Cliente[]): Cliente[][] {
  const restantes = [...clientes]
  const clusters: Cliente[][] = []

  while (restantes.length > 0) {
    const seed = restantes.shift()!
    const cluster = [seed]

    let i = 0
    while (i < restantes.length) {
      const candidato = restantes[i]
      const pertence = cluster.some(
        (membro) =>
          distanciaKm(membro.lat, membro.lng, candidato.lat, candidato.lng) <=
          RAIO_CLUSTER_KM,
      )
      if (pertence) {
        cluster.push(candidato)
        restantes.splice(i, 1)
      } else {
        i++
      }
    }

    clusters.push(cluster)
  }

  return clusters
}

function cidadesUnicas(clientes: Cliente[]): Cliente[] {
  const mapa = new Map<string, Cliente>()
  for (const cliente of clientes) {
    mapa.set(chaveCidade(cliente), cliente)
  }
  return [...mapa.values()]
}

export function sugerirDias(clientes: Cliente[]): number {
  const cidades = cidadesUnicas(clientes)
  return Math.max(1, cidades.length)
}

export function estimarPassagemPorPessoa(hubLat: number, hubLng: number): number {
  return estimarCustoPassagem(hubLat, hubLng)
}

export function calcularOrcamentoViagem(
  clientes: Cliente[],
  config: ConfigViagem,
  passagemPorPessoa: number,
): OrcamentoViagem {
  const hubInfo = hubIdeal(clientes)
  const hub = hubInfo.aeroporto
  const cidades = cidadesUnicas(clientes)
  const diasSugeridos = sugerirDias(clientes)

  let kmDeslocamento = 0
  for (const cidade of cidades) {
    const km = distanciaKm(hub.lat, hub.lng, cidade.lat, cidade.lng)
    if (km > 15) kmDeslocamento += km * 2
  }
  kmDeslocamento = Math.round(kmDeslocamento)

  const multiplicadorPassagem = config.passagemIdaVolta ? 2 : 1
  const passagem = passagemPorPessoa * config.pessoas * multiplicadorPassagem
  const hotel = config.dias * config.pessoas * config.valorDiariaHotel
  const alimentacao = config.dias * config.pessoas * config.alimentacaoDiaPessoa
  const deslocamento = kmDeslocamento * config.deslocamentoPorKm
  const total = passagem + hotel + alimentacao + deslocamento

  const receita = clientes.reduce((acc, c) => acc + c.valor, 0)
  const resultado = receita - total
  const margem = receita > 0 ? (resultado / receita) * 100 : 0

  const clientesDetalhe: ClienteOrcamento[] = clientes.map((cliente) => {
    const proximo = aeroportoMaisProximo(cliente.lat, cliente.lng)
    const distHub = Math.round(distanciaKm(hub.lat, hub.lng, cliente.lat, cliente.lng))
    const participacao = receita > 0 ? cliente.valor / receita : 0

    return {
      cliente,
      aeroportoProximo: proximo.aeroporto,
      distanciaAeroportoKm: proximo.distanciaKm,
      distanciaHubKm: distHub,
      receita: cliente.valor,
      custoAlocado: total * participacao,
      resultado: cliente.valor - total * participacao,
      participacaoReceita: participacao,
    }
  })

  return {
    id: idViagem(clientes),
    clientes,
    hub,
    diasSugeridos,
    kmDeslocamento,
    custos: { passagem, hotel, alimentacao, deslocamento, total },
    receita,
    resultado,
    margem,
    clientesDetalhe,
  }
}

export function calcularOrcamentos(
  clientesSelecionados: Cliente[],
  config: ConfigViagem,
  passagensPorViagem: Record<string, number>,
): OrcamentoViagem[] {
  const clusters = agruparEmViagens(clientesSelecionados)

  return clusters.map((cluster) => {
    const viagemId = idViagem(cluster)
    const hub = hubIdeal(cluster).aeroporto
    const passagemPorPessoa =
      passagensPorViagem[viagemId] ?? estimarPassagemPorPessoa(hub.lat, hub.lng)

    return calcularOrcamentoViagem(cluster, config, passagemPorPessoa)
  })
}
