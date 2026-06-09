import { useMemo } from 'react'
import type { Cliente, ConfigViagem } from '../types'
import { formatarMoeda } from '../utils/format'
import { calcularOrcamentos, estimarPassagemPorPessoa } from '../utils/orcamento'

interface CalculadoraOrcamentoProps {
  clientesSelecionados: Cliente[]
  config: ConfigViagem
  passagensPorViagem: Record<string, number>
  onConfigChange: (config: ConfigViagem) => void
  onPassagemChange: (viagemId: string, valor: number) => void
  onAplicarDiasSugeridos: (dias: number) => void
}

function CampoNumero({
  label,
  value,
  min = 0,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min?: number
  step?: number
  onChange: (v: number) => void
}) {
  return (
    <label className="campo-config">
      {label}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(n)
        }}
      />
    </label>
  )
}

export function CalculadoraOrcamento({
  clientesSelecionados,
  config,
  passagensPorViagem,
  onConfigChange,
  onPassagemChange,
  onAplicarDiasSugeridos,
}: CalculadoraOrcamentoProps) {
  const orcamentos = useMemo(
    () => calcularOrcamentos(clientesSelecionados, config, passagensPorViagem),
    [clientesSelecionados, config, passagensPorViagem],
  )

  const totais = useMemo(() => {
    const receita = orcamentos.reduce((acc, o) => acc + o.receita, 0)
    const custos = orcamentos.reduce((acc, o) => acc + o.custos.total, 0)
    return { receita, custos, resultado: receita - custos }
  }, [orcamentos])

  const diasSugeridosMax = orcamentos.reduce(
    (max, o) => Math.max(max, o.diasSugeridos),
    1,
  )

  function atualizar(partial: Partial<ConfigViagem>) {
    onConfigChange({ ...config, ...partial })
  }

  async function exportarPdf() {
    const { exportarOrcamentoPdf } = await import('../utils/exportarPdf')
    exportarOrcamentoPdf({ orcamentos, config, totais })
  }

  if (clientesSelecionados.length === 0) return null

  return (
    <div className="calculadora" id="orcamento-impressao">
      <header className="calc-header">
        <div>
          <h2>Calculadora de viagem</h2>
          <p>Monte o orçamento para apresentar ao cliente</p>
        </div>
        <button type="button" className="btn-primario" onClick={exportarPdf}>
          Exportar PDF
        </button>
      </header>

      <section className="config-grid">
        <CampoNumero
          label="Pessoas"
          value={config.pessoas}
          min={1}
          onChange={(pessoas) => atualizar({ pessoas: Math.max(1, pessoas) })}
        />
        <CampoNumero
          label="Dias de viagem"
          value={config.dias}
          min={1}
          onChange={(dias) => atualizar({ dias: Math.max(1, dias) })}
        />
        <CampoNumero
          label="Diária hotel/pessoa (R$)"
          value={config.valorDiariaHotel}
          min={0}
          step={10}
          onChange={(valorDiariaHotel) => atualizar({ valorDiariaHotel })}
        />
        <CampoNumero
          label="Alimentação/dia/pessoa (R$)"
          value={config.alimentacaoDiaPessoa}
          min={0}
          step={5}
          onChange={(alimentacaoDiaPessoa) => atualizar({ alimentacaoDiaPessoa })}
        />
        <CampoNumero
          label="Deslocamento (R$/km)"
          value={config.deslocamentoPorKm}
          min={0}
          step={0.1}
          onChange={(deslocamentoPorKm) => atualizar({ deslocamentoPorKm })}
        />
        <label className="campo-config checkbox-config">
          <input
            type="checkbox"
            checked={config.passagemIdaVolta}
            onChange={(e) => atualizar({ passagemIdaVolta: e.target.checked })}
          />
          Passagem ida e volta
        </label>
        {diasSugeridosMax !== config.dias && (
          <button
            type="button"
            className="btn-secundario btn-dias-sugeridos"
            onClick={() => onAplicarDiasSugeridos(diasSugeridosMax)}
          >
            Usar {diasSugeridosMax} dias sugeridos
          </button>
        )}
      </section>

      <section className="cards-resumo cards-total">
        <article className="card-resumo destaque-verde">
          <span>Receita total</span>
          <strong>{formatarMoeda(totais.receita)}</strong>
        </article>
        <article className="card-resumo destaque-vermelho">
          <span>Custo total</span>
          <strong>{formatarMoeda(totais.custos)}</strong>
        </article>
        <article
          className={`card-resumo ${totais.resultado >= 0 ? 'destaque-azul' : 'destaque-vermelho'}`}
        >
          <span>Resultado</span>
          <strong>{formatarMoeda(totais.resultado)}</strong>
        </article>
      </section>

      {orcamentos.map((orcamento, index) => {
        const passagemPorPessoa =
          passagensPorViagem[orcamento.id] ??
          estimarPassagemPorPessoa(orcamento.hub.lat, orcamento.hub.lng)

        return (
          <article key={orcamento.id} className="viagem-card">
            <header className="viagem-header">
              <h3>
                Viagem {index + 1}
                {orcamentos.length > 1 && ` · ${orcamento.clientes.length} clientes`}
              </h3>
              <p>
                Hub sugerido: <strong>{orcamento.hub.iata}</strong> —{' '}
                {orcamento.hub.nome} ({orcamento.hub.cidade}/{orcamento.hub.estado})
              </p>
            </header>

            <div className="viagem-custos">
              <label className="campo-passagem">
                Passagem por pessoa (R$)
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={Math.round(passagemPorPessoa)}
                  onChange={(e) => {
                    const valor = Number(e.target.value)
                    if (Number.isFinite(valor)) onPassagemChange(orcamento.id, valor)
                  }}
                />
              </label>
              <ul className="lista-custos">
                <li>
                  <span>Passagem ({config.pessoas} pax{config.passagemIdaVolta ? ', i/v' : ''})</span>
                  <strong>{formatarMoeda(orcamento.custos.passagem)}</strong>
                </li>
                <li>
                  <span>Hotel ({config.dias}d × {config.pessoas}p)</span>
                  <strong>{formatarMoeda(orcamento.custos.hotel)}</strong>
                </li>
                <li>
                  <span>Alimentação ({config.dias}d × {config.pessoas}p)</span>
                  <strong>{formatarMoeda(orcamento.custos.alimentacao)}</strong>
                </li>
                <li>
                  <span>Deslocamento ({orcamento.kmDeslocamento} km i/v)</span>
                  <strong>{formatarMoeda(orcamento.custos.deslocamento)}</strong>
                </li>
                <li className="total-linha">
                  <span>Total da viagem</span>
                  <strong>{formatarMoeda(orcamento.custos.total)}</strong>
                </li>
              </ul>
            </div>

            <div className="viagem-resultado">
              <span>Receita: {formatarMoeda(orcamento.receita)}</span>
              <span className={orcamento.resultado >= 0 ? 'positivo' : 'negativo'}>
                Resultado: {formatarMoeda(orcamento.resultado)} ({orcamento.margem.toFixed(1)}%)
              </span>
            </div>

            <ul className="lista-clientes-orcamento">
              {orcamento.clientesDetalhe.map((det) => (
                <li key={det.cliente.id} className="cliente-orcamento">
                  <div>
                    <strong>{det.cliente.empresa}</strong>
                    <small>
                      {det.cliente.cidade}/{det.cliente.estado} · Aeroporto próximo:{' '}
                      {det.aeroportoProximo.iata} ({det.distanciaAeroportoKm} km) · Hub:{' '}
                      {det.distanciaHubKm} km
                    </small>
                  </div>
                  <div className="cliente-orcamento-valores">
                    <span className="receita">{formatarMoeda(det.receita)}</span>
                    <span className="custo">− {formatarMoeda(det.custoAlocado)}</span>
                    <span className={det.resultado >= 0 ? 'positivo' : 'negativo'}>
                      = {formatarMoeda(det.resultado)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </div>
  )
}
