import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'
import type { Cliente } from '../types'
import { formatarMoeda } from '../utils/format'
import { distanciaDaOrigem, ORIGEM } from '../utils/geo'
import 'leaflet/dist/leaflet.css'

interface MapaClientesProps {
  clientes: Cliente[]
  selecionados: Set<string>
  onToggle: (id: string) => void
}

function raioDoMarcador(valor: number, min: number, max: number): number {
  if (max === min) return 12
  const ratio = (valor - min) / (max - min)
  return 8 + ratio * 18
}

function corDoMarcador(valor: number, min: number, max: number, selecionado: boolean): string {
  if (selecionado) return '#f59e0b'
  if (max === min) return '#2563eb'
  const ratio = (valor - min) / (max - min)
  if (ratio > 0.66) return '#16a34a'
  if (ratio > 0.33) return '#2563eb'
  return '#64748b'
}

export function MapaClientes({ clientes, selecionados, onToggle }: MapaClientesProps) {
  const valores = clientes.map((c) => c.valor)
  const min = Math.min(...valores)
  const max = Math.max(...valores)

  return (
    <MapContainer
      center={[-14.235, -51.9253]}
      zoom={4}
      className="mapa"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={[ORIGEM.lat, ORIGEM.lng]}
        radius={10}
        pathOptions={{
          color: '#ffffff',
          weight: 3,
          fillColor: '#dc2626',
          fillOpacity: 1,
        }}
      >
        <Tooltip permanent direction="right" offset={[8, 0]}>
          Origem: {ORIGEM.label}
        </Tooltip>
      </CircleMarker>

      {clientes.map((cliente) => {
        const selecionado = selecionados.has(cliente.id)
        const raio = raioDoMarcador(cliente.valor, min, max)
        const cor = corDoMarcador(cliente.valor, min, max, selecionado)

        return (
          <CircleMarker
            key={cliente.id}
            center={[cliente.lat, cliente.lng]}
            radius={raio}
            pathOptions={{
              color: selecionado ? '#b45309' : '#ffffff',
              weight: selecionado ? 3 : 2,
              fillColor: cor,
              fillOpacity: 0.85,
            }}
            eventHandlers={{
              click: () => onToggle(cliente.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              <strong>{cliente.cidade}/{cliente.estado}</strong>
              <br />
              {formatarMoeda(cliente.valor)}
            </Tooltip>
            <Popup>
              <div className="popup-cliente">
                <strong>{cliente.empresa}</strong>
                <p>{cliente.cidade} — {cliente.estado} ({cliente.regiao})</p>
                <p><strong>Valor:</strong> {formatarMoeda(cliente.valor)}</p>
                <p><strong>Distância de Curitiba:</strong> {distanciaDaOrigem(cliente.lat, cliente.lng)} km</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(cliente.id)
                  }}
                >
                  {selecionado ? 'Remover da visita' : 'Adicionar à visita'}
                </button>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
