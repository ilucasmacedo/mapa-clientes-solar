export const ORIGEM = {
  lat: -25.4284,
  lng: -49.2733,
  label: 'Curitiba, PR',
}

export function distanciaKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const raio = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2

  return raio * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function estimarCustoPassagem(lat: number, lng: number): number {
  const km = distanciaKm(ORIGEM.lat, ORIGEM.lng, lat, lng)

  if (km < 300) return Math.round(180 + km * 0.85)
  if (km < 700) return Math.round(320 + km * 1.05)
  if (km < 1200) return Math.round(450 + km * 1.2)
  return Math.round(600 + km * 1.35)
}

export function distanciaDaOrigem(lat: number, lng: number): number {
  return Math.round(distanciaKm(ORIGEM.lat, ORIGEM.lng, lat, lng))
}