import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MapaPage } from './pages/MapaPage'
import { ViagemPlanejadaDetalhePage } from './pages/ViagemPlanejadaDetalhePage'
import { ViagensPlanejadasPage } from './pages/ViagensPlanejadasPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapaPage />} />
        <Route path="/viagens" element={<ViagensPlanejadasPage />} />
        <Route path="/viagens/:id" element={<ViagemPlanejadaDetalhePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
