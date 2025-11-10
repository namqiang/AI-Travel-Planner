import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ApiConfig } from '@/types'
import { aiService } from '@/services/aiService'
import { voiceService } from '@/services/voiceService'
import { mapService } from '@/services/mapService'

interface ConfigContextType {
  config: ApiConfig
  updateConfig: (newConfig: Partial<ApiConfig>) => void
  isConfigured: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

const CONFIG_STORAGE_KEY = 'ai_travel_planner_config'

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>({})

  // 从 localStorage 加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
        applyConfig(parsed)
      } catch (error) {
        console.error('加载配置失败:', error)
      }
    }
  }, [])

  // 应用配置到各个服务
  const applyConfig = (newConfig: ApiConfig) => {
    // 配置 AI 服务
    if (newConfig.ai_api_key && newConfig.ai_provider) {
      aiService.configureProvider(
        newConfig.ai_provider,
        newConfig.ai_api_key,
        newConfig.ai_base_url,
        newConfig.ai_model
      )
    }

    // 配置语音服务
    if (newConfig.xunfei_app_id && newConfig.xunfei_api_key && newConfig.xunfei_api_secret) {
      voiceService.setConfig({
        appId: newConfig.xunfei_app_id,
        apiKey: newConfig.xunfei_api_key,
        apiSecret: newConfig.xunfei_api_secret,
      })
    }

    // 配置地图服务
    if (newConfig.amap_key) {
      mapService.setApiKey(newConfig.amap_key)
    }
  }

  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig))
    applyConfig(updatedConfig)
  }

  const isConfigured = !!(
    config.ai_api_key &&
    config.ai_provider &&
    config.xunfei_app_id &&
    config.xunfei_api_key &&
    config.xunfei_api_secret &&
    config.amap_key
  )

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isConfigured }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
