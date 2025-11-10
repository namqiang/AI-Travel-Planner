import { useEffect, useRef } from 'react'
import { Location } from '@/types'
import { mapService } from '@/services/mapService'

interface MapViewProps {
  locations?: Location[]
  center?: [number, number]
  height?: string | number
}

export default function MapView({ locations, center, height = '100%' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (mapRef.current && !initialized.current) {
      mapService.initMap('map-container', center)
      initialized.current = true
    }

    return () => {
      if (initialized.current) {
        mapService.destroy()
        initialized.current = false
      }
    }
  }, [])

  useEffect(() => {
    if (locations && locations.length > 0) {
      // 清除旧标记
      mapService.clearMarkers()

      // 添加新标记
      locations.forEach((location, index) => {
        mapService.addMarker(location, {
          label: {
            content: `${index + 1}`,
            direction: 'top',
          },
        })
      })

      // 绘制路线
      if (locations.length > 1) {
        mapService.drawRoute(locations)
      }

      // 调整视野
      mapService.fitView()
    }
  }, [locations])

  return (
    <div
      id="map-container"
      ref={mapRef}
      style={{
        width: '100%',
        height,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  )
}
