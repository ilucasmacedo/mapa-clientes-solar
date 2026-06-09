import type { Cliente, ConfigViagem } from '../types'
import { formatarMoeda } from '../utils/format'
import { calcularOrcamentos } from '../utils/orcamento'
import { CalculadoraOrcamento } from './CalculadoraOrcamento'

interface PainelVisitasProps {
  clientes: Cliente[]
  selecionados: Set<string>
  config: ConfigViagem
  passagensPorViagem: Record<string, number>
  onToggle: (id: string) => void
  onConfigChange: (config: ConfigViagem) => void
  onPassagemChange: (viagemId: string, valor: number) => void
  onAplicarDiasSugeridos: (dias: number) => void
  onLimpar: () => void
}

export function PainelVisitas({
  clientes,
  selecionados,
  config,
  passagensPorViagem,
  onToggle,
  onConfigChange,
  onPassagemChange,
  onAplicarDiasSugeridos,
  onLimpar,
}: PainelVisitasProps) {
  const selecionadosLista = clientes.filter((c) => selecionados.has(c.id))
  const orcamentos = calcularOrcamentos(selecionadosLista, config, passagensPorViagem)

  const receitaTotal = orcamentos.reduce((acc, o) => acc + o.receita, 0)
  const custoTotal = orcamentos.reduce((acc, o) => acc + o.custos.total, 0)
  const resultadoTotal = receitaTotal - custoTotal

  return (
    <aside className="painel">
      <header className="painel-header">
        <div>
          <h1>Planejador de Visitas</h1>
          <p>Origem: São Paulo — selecione clientes para montar o orçamento</p>
        </div>
        {selecionados.size > 0 && (
          <button type="button" className="btn-secundario" onClick={onLimpar}>
            Limpar
          </button>
        )}
      </header>

      <section className="cards-resumo">
        <article className="card-resumo">
          <span>Selecionados</span>
          <strong>{selecionados.size}</strong>
        </article>
        <article className="card-resumo destaque-verde">
          <span>Receita</span>
          <strong>{formatarMoeda(receitaTotal)}</strong>
        </article>
        <article className="card-resumo destaque-vermelho">
          <span>Custo viagem</span>
          <strong>{formatarMoeda(custoTotal)}</strong>
        </article>
        <article
          className={`card-resumo ${resultadoTotal >= 0 ? 'destaque-azul' : 'destaque-vermelho'}`}
        >
          <span>Resultado</span>
          <strong>{formatarMoeda(resultadoTotal)}</strong>
        </article>
      </section>

      <CalculadoraOrcamento
        clientesSelecionados={selecionadosLista}
        config={config}
        passagensPorViagem={passagensPorViagem}
        onConfigChange={onConfigChange}
        onPassagemChange={onPassagemChange}
        onAplicarDiasSugeridos={onAplicarDiasSugeridos}
      />

      <section className="secao lista-clientes-secao">
        <h2>Todos os clientes ({clientes.length})</h2>
        <ul className="lista-clientes">
          {[...clientes]
            .sort((a, b) => b.valor - a.valor)
            .map((cliente) => {
              const ativo = selecionados.has(cliente.id)
              return (
                <li key={cliente.id}>
                  <button
                    type="button"
                    className={`item-cliente ${ativo ? 'ativo' : ''}`}
                    onClick={() => onToggle(cliente.id)}
                  >
                    <span className="item-cliente-info">
                      <strong>{cliente.empresa}</strong>
                      <small>
                        {cliente.cidade}/{cliente.estado} · {cliente.regiao}
                      </small>
                    </span>
                    <span className="item-cliente-valor">{formatarMoeda(cliente.valor)}</span>
                  </button>
                </li>
              )
            })}
        </ul>
      </section>
    </aside>
  )
}
