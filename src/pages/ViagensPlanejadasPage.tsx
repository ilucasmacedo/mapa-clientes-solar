import { Link } from 'react-router-dom'
import { NavApp } from '../components/NavApp'
import { clientes } from '../data/clientes'
import { viagensPlanejadas } from '../data/viagensPlanejadas'
import { formatarMoeda, formatarPercentual } from '../utils/format'

export function ViagensPlanejadasPage() {
  return (
    <div className="layout layout-viagens">
      <header className="app-header app-header-nav">
        <div className="header-titulo">
          <h1>Viagens planejadas</h1>
          <NavApp />
        </div>
        <p className="header-subtitulo-viagens">
          Orçamentos fechados com links de referência para voos, carro e hospedagem.
        </p>
      </header>

      <main className="viagens-conteudo">
        <div className="viagens-lista">
          {viagensPlanejadas.map((viagem) => {
            const clientesViagem = viagem.clienteIds
              .map((id) => clientes.find((c) => c.id === id))
              .filter(Boolean)

            return (
              <article key={viagem.id} className="viagem-card">
                <div className="viagem-card-cabecalho">
                  <div>
                    <h2>{viagem.titulo}</h2>
                    <p className="viagem-meta">
                      {viagem.periodo} · {viagem.dias} dias · {viagem.pessoas} pessoas · origem{' '}
                      {viagem.origem}
                    </p>
                    <p className="viagem-rota">{viagem.rota}</p>
                  </div>
                  <Link to={`/viagens/${viagem.id}`} className="btn-viagem-detalhe">
                    Ver detalhes
                  </Link>
                </div>

                <div className="viagem-clientes-chips">
                  {clientesViagem.map(
                    (c) =>
                      c && (
                        <span key={c.id} className="viagem-chip">
                          {c.empresa} — {c.cidade}/{c.estado}
                        </span>
                      ),
                  )}
                </div>

                <div className="viagem-resumo-grid">
                  <div className="viagem-resumo-item">
                    <span>Custo total</span>
                    <strong>{formatarMoeda(viagem.custoTotal)}</strong>
                  </div>
                  <div className="viagem-resumo-item">
                    <span>Receita</span>
                    <strong className="positivo">{formatarMoeda(viagem.receitaTotal)}</strong>
                  </div>
                  <div className="viagem-resumo-item">
                    <span>Resultado</span>
                    <strong className="positivo">{formatarMoeda(viagem.resultado)}</strong>
                  </div>
                  <div className="viagem-resumo-item">
                    <span>Margem</span>
                    <strong className="positivo">{formatarPercentual(viagem.margem)}</strong>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
