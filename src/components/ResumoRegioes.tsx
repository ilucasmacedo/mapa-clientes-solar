import type { Cliente, Regiao } from '../types'
import { formatarMoeda } from '../utils/format'

interface ResumoRegioesProps {
  clientes: Cliente[]
}

const ORDEM_REGIOES: Regiao[] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
]

export function ResumoRegioes({ clientes }: ResumoRegioesProps) {
  const porRegiao = ORDEM_REGIOES.map((regiao) => {
    const lista = clientes.filter((c) => c.regiao === regiao)
    const total = lista.reduce((acc, c) => acc + c.valor, 0)
    const media = lista.length ? total / lista.length : 0

    return { regiao, quantidade: lista.length, total, media }
  }).filter((r) => r.quantidade > 0)

  return (
    <section className="regioes-bar">
      {porRegiao.map(({ regiao, quantidade, total, media }) => (
        <article key={regiao} className="regiao-card">
          <h3>{regiao}</h3>
          <p>{quantidade} cliente{quantidade !== 1 ? 's' : ''}</p>
          <p><strong>Total:</strong> {formatarMoeda(total)}</p>
          <p><strong>Ticket médio:</strong> {formatarMoeda(media)}</p>
        </article>
      ))}
    </section>
  )
}
