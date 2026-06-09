import { useState } from 'react'
import { MapaClientes } from './components/MapaClientes'
import { PainelVisitas } from './components/PainelVisitas'
import { ResumoRegioes } from './components/ResumoRegioes'
import { clientes } from './data/clientes'
import type { ConfigViagem } from './types'
import { CONFIG_PADRAO } from './utils/orcamento'
import './App.css'

function App() {
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [config, setConfig] = useState<ConfigViagem>(CONFIG_PADRAO)
  const [passagensPorViagem, setPassagensPorViagem] = useState<Record<string, number>>({})

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

  return (
    <div className="app">
      <div className="mapa-area">
        <MapaClientes
          clientes={clientes}
          selecionados={selecionados}
          onToggle={toggleCliente}
        />
        <div className="mapa-legenda">
          <strong>Legenda</strong>
          <span><i className="dot alto" /> Alto valor</span>
          <span><i className="dot medio" /> Médio</span>
          <span><i className="dot baixo" /> Baixo</span>
          <span><i className="dot selecionado" /> Selecionado</span>
          <span className="legenda-dica">Tamanho do círculo = valor do cliente</span>
        </div>
        <ResumoRegioes clientes={clientes} />
      </div>
      <PainelVisitas
        clientes={clientes}
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
  )
}

export default App
