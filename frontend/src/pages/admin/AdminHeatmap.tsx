import React, { useState, useEffect } from 'react'
import { MapPin, Filter, Layers, AlertCircle, Info } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getHeatmapData } from '../../api/grievances'

export default function AdminHeatmap() {
  const [points, setPoints] = useState<any[]>([
    {
      id: 1,
      ticket_id: 'GS-ROAD-2026-001001',
      lat: 20.2961,
      lng: 85.8245,
      category: 'road',
      status: 'pending',
      description: 'Balipatna highway pothole repairs',
    },
    {
      id: 2,
      ticket_id: 'GS-WATER-2026-001002',
      lat: 20.4625,
      lng: 85.8830,
      category: 'water',
      status: 'in_progress',
      description: 'Salepur block non-functional tubewell',
    },
    {
      id: 3,
      ticket_id: 'GS-RATION-2026-001003',
      lat: 19.8135,
      lng: 85.8312,
      category: 'ration',
      status: 'resolved',
      description: 'Puri Satyabadi PDS dealer issue',
    },
    {
      id: 4,
      ticket_id: 'GS-HEALTH-2026-001004',
      lat: 21.4669,
      lng: 83.9812,
      category: 'health',
      status: 'pending',
      description: 'Sambalpur PHC medicine shortage',
    },
    {
      id: 5,
      ticket_id: 'GS-EDUCATION-2026-001005',
      lat: 19.3149,
      lng: 84.7941,
      category: 'education',
      status: 'in_progress',
      description: 'Ganjam primary school roof leakage',
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadHeatmap()
  }, [])

  const loadHeatmap = async () => {
    try {
      const data = await getHeatmapData()
      if (data && data.length > 0) {
        setPoints(data)
      }
    } catch (err) {
      console.warn('Using pre-populated GIS points')
    }
  }

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'road':
        return '#EF4444' // red
      case 'water':
        return '#3B82F6' // blue
      case 'ration':
        return '#F59E0B' // amber
      case 'health':
        return '#10B981' // green
      case 'education':
        return '#8B5CF6' // purple
      default:
        return '#64748B' // slate
    }
  }

  const filteredPoints =
    selectedCategory === 'all'
      ? points
      : points.filter((p) => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Odisha Grievance GIS Heatmap
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Geographic distribution of citizen complaints across blocks and districts.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
          >
            <option value="all">All Categories ({points.length})</option>
            <option value="road">Roads & Infra</option>
            <option value="water">Water & Sanitation</option>
            <option value="ration">Ration / PDS</option>
            <option value="health">Health & Hospital</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-md">
        <div className="h-[550px] w-full rounded-2xl overflow-hidden relative">
          <MapContainer
            center={[20.5, 84.8]}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredPoints.map((pt) => (
              <CircleMarker
                key={pt.id || pt.ticket_id}
                center={[pt.lat, pt.lng]}
                radius={10}
                pathOptions={{
                  color: getMarkerColor(pt.category),
                  fillColor: getMarkerColor(pt.category),
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 max-w-[200px]">
                    <div className="font-mono font-bold text-slate-900">{pt.ticket_id}</div>
                    <div className="capitalize text-slate-600 font-semibold">
                      Category: {pt.category}
                    </div>
                    <div className="text-slate-500">{pt.description}</div>
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold uppercase text-[10px]">
                      Status: {pt.status}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <span className="font-bold text-slate-800">Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Road/Infra</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Water/Sanitation</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Ration/PDS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Health</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Education</span>
          </div>
        </div>
      </div>
    </div>
  )
}

