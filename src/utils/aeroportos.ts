import { aeroportos } from '../data/aeroportos'
import type { Aeroporto, Cliente } from '../types'
import { distanciaKm } from './geo'

export interface AeroportoComDistancia {
  aeroporto: Aeroporto
  distanciaKm: number
}

export function aeroportoMaisProximo(lat: number, lng: number): AeroportoComDistancia {
  let melhor = aeroportos[0]
  let menorDist = distanciaKm(lat, lng, melhor.lat, melhor.lng)

  for (const aeroporto of aeroportos.slice(1)) {
    const dist = distanciaKm(lat, lng, aeroporto.lat, aeroporto.lng)
    if (dist < menorDist) {
      menorDist = dist
      melhor = aeroporto
    }
  }

  return { aeroporto: melhor, distanciaKm: Math.round(menorDist) }
}

export function centroide(clientes: Cliente[]): { lat: number; lng: number } {
  if (clientes.length === 0) return { lat: 0, lng: 0 }
  const lat = clientes.reduce((acc, c) => acc + c.lat, 0) / clientes.length
  const lng = clientes.reduce((acc, c) => acc + c.lng, 0) / clientes.length
  return { lat, lng }
}

export function hubIdeal(clientes: Cliente[]): AeroportoComDistancia {
  const centro = centroide(clientes)
  return aeroportoMaisProximo(centro.lat, centro.lng)
}
