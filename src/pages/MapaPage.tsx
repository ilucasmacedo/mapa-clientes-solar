import { useMemo, useState } from 'react'
import { HeaderFiltros } from '../components/HeaderFiltros'
import { MapaClientes } from '../components/MapaClientes'
import { NavApp } from '../components/NavApp'
import { PainelVisitas } from '../components/PainelVisitas'
import { ResumoRegioes } from '../components/ResumoRegioes'
import { clientes } from '../data/clientes'
import type { ConfigViagem } from '../types'
import {
  criarFiltrosPadrao,
  estadosDisponiveis,
  filtrarClientes,
  limitesValor,
  poolPorValor,
} from '../utils/filtros'
import { CONFIG_PADRAO } from '../utils/orcamento'

const LIMITES_VALOR = limitesValor(clientes)

export function MapaPage() {
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [config, setConfig] = useState<ConfigViagem>(CONFIG_PADRAO)
  const [passagensPorViagem, setPassagensPorViagem] = useState<Record<string, number>>({})
  const [filtros, setFiltros] = useState(() => criarFiltrosPadrao(clientes))

  const pool = useMemo(() => poolPorValor(clientes, filtros), [filtros.valorMin, filtros.valorMax])

  const clientesFiltrados = useMemo(
    () => filtrarClientes(clientes, filtros),
    [filtros],
  )

  const estados = useMemo(() => estadosDisponiveis(pool), [pool])

  const receitaFiltrada = useMemo(
    () => clientesFiltrados.reduce((acc, c) => acc + c.valor, 0),
    [clientesFiltrados],
  )

  function toggleCliente(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function atualizarPassagem(viagemId: string, valor: number) {
    setPassagensPorViagem((prev) => ({ ...prev, [viagemId]: valor }))
  }

  async function exportarCarteira() {
    const { exportarCarteiraXlsx } = await import('../utils/exportarCarteira')
    exportarCarteiraXlsx(clientes)
  }

  const clientesSelecionados = clientes.filter((c) => selecionados.has(c.id))

  return (
    <div className="layout">
      <header className="app-header app-header-nav">
        <div className="header-titulo header-titulo-mapa">
          <h1>Mapa Clientes Solar</h1>
          <NavApp />
        </div>
        <HeaderFiltros
          filtros={filtros}
          limitesValor={LIMITES_VALOR}
          estados={estados}
          clientesVisiveis={clientesFiltrados.length}
          receitaFiltrada={receitaFiltrada}
          onChange={setFiltros}
          onLimpar={() => setFiltros(criarFiltrosPadrao(clientes))}
          onExportarCarteira={exportarCarteira}
        />
      </header>

      <div className="app">
        <div className="mapa-area">
          <MapaClientes
            clientes={clientesFiltrados}
            selecionados={selecionados}
            onToggle={toggleCliente}
          />
          <ResumoRegioes clientes={clientesFiltrados} />
        </div>
        <PainelVisitas
          clientes={clientesFiltrados}
          clientesSelecionados={clientesSelecionados}
          selecionados={selecionados}
          config={config}
          passagensPorViagem={passagensPorViagem}
          onToggle={toggleCliente}
          onConfigChange={setConfig}
          onPassagemChange={atualizarPassagem}
          onAplicarDiasSugeridos={(dias) => setConfig((c) => ({ ...c, dias }))}
          onLimpar={() => setSelecionados(new Set())}
        />
      </div>
    </div>
  )
}
