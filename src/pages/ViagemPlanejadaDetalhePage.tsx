import { Link, Navigate, useParams } from 'react-router-dom'
import { NavApp } from '../components/NavApp'
import { clientes } from '../data/clientes'
import { getViagemPlanejada } from '../data/viagensPlanejadas'
import type { HotelOpcao } from '../types'
import { formatarMoeda, formatarPercentual } from '../utils/format'

function TabelaHoteis({ titulo, hoteis }: { titulo: string; hoteis: HotelOpcao[] }) {
  return (
    <section className="viagem-secao">
      <h3>{titulo}</h3>
      <div className="viagem-tabela-wrap">
        <table className="viagem-tabela">
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Avaliação</th>
              <th>Preço (2 quartos)</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {hoteis.map((hotel) => (
              <tr key={hotel.nome} className={hotel.selecionado ? 'linha-selecionada' : undefined}>
                <td>
                  {hotel.nome}
                  {hotel.selecionado && <span className="badge-selecionado">Escolhido</span>}
                </td>
                <td>{hotel.avaliacao}</td>
                <td>{formatarMoeda(hotel.preco)}</td>
                <td>
                  <a href={hotel.link} target="_blank" rel="noreferrer">
                    Booking.com
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ViagemPlanejadaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const viagem = id ? getViagemPlanejada(id) : undefined

  if (!viagem) {
    return <Navigate to="/viagens" replace />
  }

  const clientesViagem = viagem.clientesResumo.map((resumo) => {
    const cliente = clientes.find((c) => c.id === resumo.clienteId)
    return { ...resumo, cliente }
  })

  return (
    <div className="layout layout-viagens">
      <header className="app-header app-header-nav">
        <div className="header-titulo">
          <h1>{viagem.titulo}</h1>
          <NavApp />
        </div>
        <Link to="/viagens" className="btn-voltar-viagens">
          ← Voltar
        </Link>
      </header>

      <main className="viagens-conteudo viagem-detalhe">
        <section className="viagem-hero">
          <p className="viagem-meta">
            {viagem.periodo} · {viagem.dias} dias · {viagem.pessoas} pessoas · origem {viagem.origem}
          </p>
          <p className="viagem-rota">{viagem.rota}</p>
          <a
            href={viagem.relatorioMarkdown}
            target="_blank"
            rel="noreferrer"
            className="link-relatorio"
          >
            Abrir relatório completo (Markdown)
          </a>
        </section>

        <div className="viagem-resumo-grid viagem-resumo-grid-destaque">
          <div className="viagem-resumo-item">
            <span>Custo total</span>
            <strong>{formatarMoeda(viagem.custoTotal)}</strong>
          </div>
          <div className="viagem-resumo-item">
            <span>Receita combinada</span>
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

        <section className="viagem-secao">
          <h3>Clientes visitados</h3>
          <div className="viagem-tabela-wrap">
            <table className="viagem-tabela">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cidade</th>
                  <th>Receita</th>
                  <th>Custo alocado</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {clientesViagem.map(({ cliente, receita, custoAlocado, resultado }) =>
                  cliente ? (
                    <tr key={cliente.id}>
                      <td>{cliente.empresa}</td>
                      <td>
                        {cliente.cidade}/{cliente.estado}
                      </td>
                      <td>{formatarMoeda(receita)}</td>
                      <td>{formatarMoeda(custoAlocado)}</td>
                      <td className="positivo">{formatarMoeda(resultado)}</td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
          {viagem.nota && <p className="viagem-nota">{viagem.nota}</p>}
        </section>

        <section className="viagem-secao">
          <h3>Custos estimados</h3>
          <div className="viagem-tabela-wrap">
            <table className="viagem-tabela">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Detalhe</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {viagem.custos.map((custo) => (
                  <tr key={custo.label}>
                    <td>{custo.label}</td>
                    <td>{custo.detalhe ?? '—'}</td>
                    <td>{formatarMoeda(custo.valor)}</td>
                  </tr>
                ))}
                <tr className="linha-total">
                  <td colSpan={2}>Total geral</td>
                  <td>{formatarMoeda(viagem.custoTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {viagem.gruposHoteis.map((grupo) => (
          <TabelaHoteis key={grupo.titulo} titulo={grupo.titulo} hoteis={grupo.hoteis} />
        ))}

        <section className="viagem-secao">
          <h3>Links de referência</h3>
          <ul className="viagem-links">
            {viagem.referencias.map((ref) => (
              <li key={ref.url}>
                <a href={ref.url} target="_blank" rel="noreferrer">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
