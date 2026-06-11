export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatarPercentual(valor: number, casas = 1): string {
  return `${valor.toFixed(casas).replace('.', ',')}%`
}
