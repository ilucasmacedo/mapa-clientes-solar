import type { Regiao } from '../types'
import { formatarMoeda } from '../utils/format'
import type { FiltrosClientes } from '../utils/filtros'
import { REGIOES } from '../utils/filtros'

interface HeaderFiltrosProps {
  filtros: FiltrosClientes
  estados: string[]
  clientesVisiveis: number
  receitaFiltrada: number
  onChange: (filtros: FiltrosClientes) => void
  onExportarCarteira: () => void
}

export function HeaderFiltros({
  filtros,
  estados,
  clientesVisiveis,
  receitaFiltrada,
  onChange,
  onExportarCarteira,
}: HeaderFiltrosProps) {
  function atualizar(partial: Partial<FiltrosClientes>) {
    onChange({ ...filtros, ...partial })
  }

  return (
    <header className="app-header">
      <div className="header-titulo">
        <h1>Mapa Clientes Solar</h1>
        <p>
          {clientesVisiveis} cliente{clientesVisiveis !== 1 ? 's' : ''} · Receita total:{' '}
          <strong>{formatarMoeda(receitaFiltrada)}</strong>
          {filtros.exibicao === 'top30' && ' · Top 30 global'}
        </p>
      </div>

      <div className="header-filtros">
        <label>
          Ranking
          <select
            value={filtros.exibicao}
            onChange={(e) =>
              atualizar({ exibicao: e.target.value as FiltrosClientes['exibicao'] })
            }
          >
            <option value="todos">Todos os clientes</option>
            <option value="top30">Top 30 maiores</option>
          </select>
        </label>

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

        {(filtros.regiao !== 'todas' ||
          filtros.estado !== 'todos' ||
          filtros.exibicao !== 'todos') && (
          <button
            type="button"
            className="btn-secundario"
            onClick={() =>
              onChange({
                regiao: 'todas',
                estado: 'todos',
                exibicao: 'todos',
              })
            }
          >
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
    </header>
  )
}
