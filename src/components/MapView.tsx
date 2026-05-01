import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Attack } from '@/types'
import { SEVERITY_COLOR } from '@/lib/data'

interface Props {
  attacks: Attack[]
  onSelect: (a: Attack) => void
}

export default function MapView({ attacks, onSelect }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: 500, width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      {attacks.map(a => (
        <CircleMarker
          key={a.id}
          center={[a.lat, a.lng]}
          radius={Math.max(6, a.risk_score / 12)}
          pathOptions={{
            color: SEVERITY_COLOR[a.severity] || '#6b7280',
            fillColor: SEVERITY_COLOR[a.severity] || '#6b7280',
            fillOpacity: 0.6,
            weight: 1.5,
          }}
          eventHandlers={{ click: () => onSelect(a) }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', fontSize: 12, minWidth: 180 }}>
              <strong>{a.name}</strong><br />
              <span style={{ color: '#9ca3af' }}>{a.date} · {a.type}</span><br />
              <span>Risk: {a.risk_score}/100</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
