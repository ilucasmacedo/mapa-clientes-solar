import type { Regiao } from '../types'
import { formatarMoeda } from '../utils/format'
import type { FiltrosClientes, LimitesValor } from '../utils/filtros'
import { filtrosAtivos, REGIOES } from '../utils/filtros'
import { FiltroFaixaValor } from './FiltroFaixaValor'

interface HeaderFiltrosProps {
  filtros: FiltrosClientes
  limitesValor: LimitesValor
  estados: string[]
  clientesVisiveis: number
  receitaFiltrada: number
  onChange: (filtros: FiltrosClientes) => void
  onLimpar: () => void
  onExportarCarteira: () => void
}

export function HeaderFiltros({
  filtros,
  limitesValor,
  estados,
  clientesVisiveis,
  receitaFiltrada,
  onChange,
  onLimpar,
  onExportarCarteira,
}: HeaderFiltrosProps) {
  function atualizar(partial: Partial<FiltrosClientes>) {
    onChange({ ...filtros, ...partial })
  }

  const faixaPersonalizada =
    filtros.valorMin !== limitesValor.min || filtros.valorMax !== limitesValor.max

  return (
    <>
      <div className="header-titulo header-stats">
        <p>
          {clientesVisiveis} cliente{clientesVisiveis !== 1 ? 's' : ''} · Receita total:{' '}
          <strong>{formatarMoeda(receitaFiltrada)}</strong>
          {faixaPersonalizada &&
            ` · ${formatarMoeda(filtros.valorMin)} – ${formatarMoeda(filtros.valorMax)}`}
        </p>
      </div>

      <div className="header-filtros">
        <FiltroFaixaValor
          min={limitesValor.min}
          max={limitesValor.max}
          valorMin={filtros.valorMin}
          valorMax={filtros.valorMax}
          onChange={(valorMin, valorMax) => atualizar({ valorMin, valorMax })}
        />

        <label>
          Região
          <select
            value={filtros.regiao}
            onChange={(e) =>
              atualizar({ regiao: e.target.value as Regiao | 'todas' })
            }
          >
            <option value="todas">Todas</option>
            {REGIOES.map((regiao) => (
              <option key={regiao} value={regiao}>
                {regiao}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select
            value={filtros.estado}
            onChange={(e) => atualizar({ estado: e.target.value })}
          >
            <option value="todos">Todos</option>
            {estados.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </label>

        {filtrosAtivos(filtros, limitesValor) && (
          <button type="button" className="btn-secundario" onClick={onLimpar}>
            Limpar filtros
          </button>
        )}

        <button
          type="button"
          className="btn-primario btn-exportar-carteira"
          onClick={onExportarCarteira}
        >
          Exportar carteira
        </button>
      </div>
    </>
  )
}
