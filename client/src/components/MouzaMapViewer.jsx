import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PLOT_POLYGONS, MOUZA_LOCATIONS } from '../data/mouzaGeoData'
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, Info, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MouzaMapViewer({
  highlightPlotId = null,
  initialMouza = 'DHANMONDI',
  height = '550px',
  onPlotSelect = null,
  showControls = true,
  interactive = true,
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layersGroupRef = useRef(null)
  const tileLayerRef = useRef(null)

  const [activeLayer, setActiveLayer] = useState('osm') // 'osm' | 'satellite'
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [activeMouza, setActiveMouza] = useState(initialMouza)
  const [mapReady, setMapReady] = useState(false)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Clean up if already exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const defaultLoc = MOUZA_LOCATIONS[initialMouza] || MOUZA_LOCATIONS.DHANMONDI

    const map = L.map(mapContainerRef.current, {
      center: defaultLoc.center,
      zoom: defaultLoc.zoom,
      zoomControl: false,
      attributionControl: false,
    })

    // Base OSM Layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    tileLayerRef.current = osmLayer
    mapInstanceRef.current = map

    // Layer group for polygons
    const layersGroup = L.layerGroup().addTo(map)
    layersGroupRef.current = layersGroup

    setMapReady(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Switch Base Layer (OSM vs Satellite)
  const handleLayerChange = (layerType) => {
    if (!mapInstanceRef.current) return
    setActiveLayer(layerType)

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current)
    }

    if (layerType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri, Maxar, Earthstar Geographics',
        }
      ).addTo(mapInstanceRef.current)
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}.png',
        {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }
      ).addTo(mapInstanceRef.current)
    }
  }

  // Draw Polygons whenever map is ready or highlightPlotId changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersGroupRef.current) return

    const map = mapInstanceRef.current
    const group = layersGroupRef.current
    group.clearLayers()

    let highlightedLayer = null

    PLOT_POLYGONS.forEach((plot) => {
      const isTarget = highlightPlotId ? plot.id === highlightPlotId : plot.isSeededTarget
      const isCurrentSelected = selectedPlot?.id === plot.id

      // Polygon styling
      const polygon = L.polygon(plot.coordinates, {
        color: plot.borderColor,
        fillColor: plot.color,
        fillOpacity: isTarget ? 0.65 : 0.4,
        weight: isTarget ? 3.5 : 2,
        dashArray: isTarget ? null : '3, 4',
      })

      // Plot Number Label Overlay in center of polygon
      const bounds = polygon.getBounds()
      const center = bounds.getCenter()

      const labelIcon = L.divIcon({
        className: 'custom-plot-label',
        html: `
          <div style="
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid ${plot.borderColor};
            color: #111827;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            font-family: 'Hind Siliguri', sans-serif;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            white-space: nowrap;
            pointer-events: none;
            transform: translate(-50%, -50%);
          ">
            দাগ ${plot.dagNumber}
          </div>
        `,
        iconSize: [0, 0],
      })

      const marker = L.marker(center, { icon: labelIcon, interactive: false })

      // Hover and Click events
      if (interactive) {
        polygon.on('mouseover', () => {
          polygon.setStyle({
            fillOpacity: 0.85,
            weight: 4,
          })
        })

        polygon.on('mouseout', () => {
          polygon.setStyle({
            fillOpacity: isTarget ? 0.65 : 0.4,
            weight: isTarget ? 3.5 : 2,
          })
        })

        polygon.on('click', () => {
          setSelectedPlot(plot)
          if (onPlotSelect) onPlotSelect(plot)
          map.panTo(center, { animate: true })
        })
      }

      polygon.addTo(group)
      marker.addTo(group)

      if (highlightPlotId && plot.id === highlightPlotId) {
        highlightedLayer = polygon
        setSelectedPlot(plot)
      }
    })

    // If highlightPlotId exists, auto-fit to that plot
    if (highlightedLayer) {
      map.fitBounds(highlightedLayer.getBounds(), { padding: [80, 80], maxZoom: 18 })
    }
  }, [mapReady, highlightPlotId])

  // Jump to Mouza
  const handleJumpToMouza = (mouzaKey) => {
    setActiveMouza(mouzaKey)
    const loc = MOUZA_LOCATIONS[mouzaKey]
    if (loc && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.center, loc.zoom, { duration: 1.2 })
    }
  }

  return (
    <div className="relative border border-govt-border rounded-lg overflow-hidden bg-gray-100 shadow-sm font-bangla">
      {/* Top Map Control Bar */}
      {showControls && (
        <div className="bg-white/95 backdrop-blur border-b border-govt-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10 relative">
          {/* Quick Mouza Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <MapPin size={14} className="text-govt-green" />
              মৌজা নির্বাচন:
            </span>
            {Object.keys(MOUZA_LOCATIONS).map((key) => {
              const m = MOUZA_LOCATIONS[key]
              const isCurrent = activeMouza === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleJumpToMouza(key)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    isCurrent
                      ? 'bg-govt-green text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {m.nameBn}
                </button>
              )
            })}
          </div>

          {/* Layer and Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded p-0.5 border border-gray-300 text-xs">
              <button
                type="button"
                onClick={() => handleLayerChange('osm')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeLayer === 'osm'
                    ? 'bg-white shadow-sm text-govt-green font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                মানচিত্র (Map)
              </button>
              <button
                type="button"
                onClick={() => handleLayerChange('satellite')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeLayer === 'satellite'
                    ? 'bg-white shadow-sm text-govt-green font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                স্যাটেলাইট (Satellite)
              </button>
            </div>

            <div className="flex items-center border border-gray-300 rounded bg-white">
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="p-1.5 hover:bg-gray-100 text-gray-700 border-r border-gray-200"
                title="জুম ইন"
                aria-label="জুম ইন"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="p-1.5 hover:bg-gray-100 text-gray-700"
                title="জুম আউট"
                aria-label="জুম আউট"
              >
                <ZoomOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur p-3 rounded-md shadow-md border border-govt-border text-xs max-w-xs pointer-events-auto">
        <div className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1 flex items-center justify-between">
          <span>মৌজা নকশা সংকেত (Legend)</span>
          <span className="text-[10px] text-gray-500 font-normal">স্কেল: ১৬″ = ১ মাইল</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-red-500 border border-red-700 shrink-0" />
            <span className="text-gray-700">আদালতের আদেশে অবরুদ্ধ (দাগ ৫০০১)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-700 shrink-0" />
            <span className="text-gray-700">খসড়া আদেশ বিবেচনাধীন (দাগ ৬০০২)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-green-600 border border-green-800 shrink-0" />
            <span className="text-gray-700">নিষ্কণ্টক ও প্রস্তুত (দাগ ৭০০৩)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-400/50 border border-dashed border-emerald-700 shrink-0" />
            <span className="text-gray-500">পার্শ্ববর্তী সাধারণ রেফারেন্স দাগ</span>
          </div>
        </div>
      </div>

      {/* North Compass Arrow (Top Right) */}
      <div className="absolute top-14 right-4 z-[400] bg-white/90 backdrop-blur p-2 rounded-full shadow border border-govt-border text-govt-green flex flex-col items-center pointer-events-none">
        <Compass size={22} className="text-govt-red animate-pulse" />
        <span className="text-[9px] font-bold text-gray-700">উ</span>
      </div>

      {/* Selected Plot Floating Card / Popup (Bottom Right) */}
      {selectedPlot && (
        <div className="absolute bottom-4 right-4 z-[400] bg-white p-4 rounded-lg shadow-xl border-t-4 border-t-govt-green border-x border-b border-govt-border max-w-sm w-full pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                {selectedPlot.mouzaNameBn} মৌজা | জে. এল. {selectedPlot.jlNumber}
              </div>
              <h4 className="text-lg font-bold text-govt-green leading-tight">
                দাগ নম্বর: <span className="font-mono text-gray-900">{selectedPlot.dagNumber}</span>
              </h4>
              <div className="text-xs text-gray-600">
                খতিয়ান: <span className="font-semibold text-gray-800">{selectedPlot.khatianNumber} ({selectedPlot.khatianType})</span> | পরিমাণ: <span className="font-bold text-gray-900">{selectedPlot.areaDecimal} শতাংশ</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPlot(null)}
              className="text-gray-400 hover:text-gray-600 text-sm p-1"
              aria-label="বন্ধ করুন"
            >
              ✕
            </button>
          </div>

          {/* Status Badge */}
          <div className="my-2.5 p-2 rounded text-xs font-semibold flex items-start gap-2 border"
            style={{
              backgroundColor: selectedPlot.status === 'BLOCKED_BY_VALID_ORDER' ? '#FEE2E2' : selectedPlot.status === 'REVIEW_REQUIRED' ? '#FEF3C7' : '#DCFCE7',
              borderColor: selectedPlot.borderColor,
              color: selectedPlot.status === 'BLOCKED_BY_VALID_ORDER' ? '#991B1B' : selectedPlot.status === 'REVIEW_REQUIRED' ? '#92400E' : '#166534',
            }}
          >
            {selectedPlot.status === 'BLOCKED_BY_VALID_ORDER' && <XCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
            {selectedPlot.status === 'REVIEW_REQUIRED' && <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />}
            {selectedPlot.status === 'CLEAR' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-700" />}
            <div>
              <div className="font-bold">{selectedPlot.statusLabelBn}</div>
              <p className="text-[11px] font-normal mt-0.5 leading-relaxed opacity-90">{selectedPlot.statusDescBn}</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {selectedPlot.id && !selectedPlot.id.startsWith('ref-') ? (
              <>
                <Link
                  to={`/parcels/${selectedPlot.id}`}
                  className="btn-primary text-xs py-1.5 px-3 flex-1 text-center flex items-center justify-center gap-1.5"
                >
                  <span>সম্পূর্ণ রেকর্ড দেখুন</span>
                  <ExternalLink size={12} />
                </Link>
                <Link
                  to={`/registry?parcelId=${selectedPlot.id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex-1 text-center"
                >
                  গেটের স্থিতি যাচাই
                </Link>
              </>
            ) : (
              <div className="text-[11px] text-gray-500 italic">
                * এটি একটি রেফারেন্স সংলগ্ন দাগ
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
