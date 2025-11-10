import { Location } from '@/types'

declare const AMap: any

// 扩展 Window 接口
declare global {
  interface Window {
    AMap: any
  }
}

export class MapService {
  private map: any = null
  private markers: any[] = []
  private apiKey: string = ''

  setApiKey(key: string) {
    this.apiKey = key
  }

  // 初始化地图
  initMap(containerId: string, center?: [number, number]): void {
    if (!window.AMap) {
      console.error('高德地图 SDK 未加载')
      return
    }

    try {
      this.map = new AMap.Map(containerId, {
        zoom: 12,
        center: center || [116.397428, 39.90923], // 默认北京
        mapStyle: 'amap://styles/normal',
        viewMode: '2D', // 改为 2D 模式，避免 3D 加载问题
      })

      // 异步加载控件插件
      AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
        if (this.map && window.AMap.Scale && window.AMap.ToolBar) {
          this.map.addControl(new AMap.Scale())
          this.map.addControl(new AMap.ToolBar())
        }
      })
    } catch (error) {
      console.error('地图初始化失败:', error)
    }
  }

  // 添加标记
  addMarker(location: Location, options?: any): any {
    if (!this.map) return null

    // 验证坐标是否有效
    if (!location.longitude || !location.latitude ||
        isNaN(location.longitude) || isNaN(location.latitude)) {
      console.warn('无效的坐标:', location)
      return null
    }

    const marker = new AMap.Marker({
      position: [location.longitude, location.latitude],
      title: location.name,
      ...options,
    })

    marker.setMap(this.map)
    this.markers.push(marker)

    // 添加信息窗口
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h4 style="margin: 0 0 8px 0;">${location.name}</h4>
          <p style="margin: 0; color: #666;">${location.address}</p>
        </div>
      `,
    })

    marker.on('click', () => {
      infoWindow.open(this.map, marker.getPosition())
    })

    return marker
  }

  // 清除所有标记
  clearMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null)
    })
    this.markers = []
  }

  // 绘制路线
  drawRoute(locations: Location[]): void {
    if (!this.map || locations.length < 2) return

    const path = locations.map(loc => [loc.longitude, loc.latitude])

    const polyline = new AMap.Polyline({
      path,
      strokeColor: '#1890ff',
      strokeWeight: 6,
      strokeOpacity: 0.8,
      lineJoin: 'round',
      lineCap: 'round',
    })

    polyline.setMap(this.map)

    // 添加箭头
    const arrows = locations.slice(0, -1).map((loc, index) => {
      const nextLoc = locations[index + 1]
      return new AMap.Marker({
        position: [
          (loc.longitude + nextLoc.longitude) / 2,
          (loc.latitude + nextLoc.latitude) / 2,
        ],
        content: '<div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 12px solid #1890ff;"></div>',
        offset: new AMap.Pixel(-6, -6),
      })
    })

    arrows.forEach(arrow => arrow.setMap(this.map))
  }

  // 调整视野以显示所有标记
  fitView(): void {
    if (!this.map || this.markers.length === 0) return
    this.map.setFitView()
  }

  // 设置地图中心
  setCenter(longitude: number, latitude: number): void {
    if (!this.map) return
    this.map.setCenter([longitude, latitude])
  }

  // 地理编码 - 地址转坐标
  async geocode(address: string): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!window.AMap) {
        resolve(null)
        return
      }

      AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new AMap.Geocoder()

        geocoder.getLocation(address, (status: string, result: any) => {
          if (status === 'complete' && result.info === 'OK') {
            const location = result.geocodes[0].location
            resolve({
              name: address,
              address: result.geocodes[0].formattedAddress,
              longitude: location.lng,
              latitude: location.lat,
            })
          } else {
            resolve(null)
          }
        })
      })
    })
  }

  // 路线规划
  async planRoute(start: Location, end: Location, waypoints?: Location[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.AMap) {
        reject(new Error('高德地图 SDK 未加载'))
        return
      }

      AMap.plugin('AMap.Driving', () => {
        const driving = new AMap.Driving({
          map: this.map,
          panel: 'route-panel',
        })

        const waypointPositions = waypoints?.map(wp => ({
          lnglat: [wp.longitude, wp.latitude],
          name: wp.name,
        }))

        driving.search(
          [start.longitude, start.latitude],
          [end.longitude, end.latitude],
          { waypoints: waypointPositions },
          (status: string, result: any) => {
            if (status === 'complete') {
              resolve(result)
            } else {
              reject(new Error('路线规划失败'))
            }
          }
        )
      })
    })
  }

  // 销毁地图
  destroy(): void {
    if (this.map) {
      this.map.destroy()
      this.map = null
    }
    this.markers = []
  }
}

export const mapService = new MapService()
