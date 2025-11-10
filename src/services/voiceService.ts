import CryptoJS from 'crypto-js'
import { VoiceRecognitionResult } from '@/types'

interface XunfeiConfig {
  appId: string
  apiKey: string
  apiSecret: string
}

export class VoiceService {
  private config: XunfeiConfig | null = null
  private recognition: any = null
  private isRecording = false
  private resultText = ''
  private onResultCallback: ((result: VoiceRecognitionResult) => void) | null = null

  constructor(config?: XunfeiConfig) {
    if (config) {
      this.config = config
    }
  }

  setConfig(config: XunfeiConfig) {
    this.config = config
  }

  // 生成讯飞 WebSocket 认证 URL
  private generateAuthUrl(): string {
    if (!this.config) {
      throw new Error('科大讯飞配置未设置')
    }

    const { appId, apiKey, apiSecret } = this.config
    const url = 'wss://iat-api.xfyun.cn/v2/iat'
    const host = 'iat-api.xfyun.cn'
    const path = '/v2/iat'
    const date = new Date().toUTCString()

    // 生成签名
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
    const signature = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    const signatureBase64 = CryptoJS.enc.Base64.stringify(signature)

    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureBase64}"`
    const authorization = btoa(authorizationOrigin)

    return `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`
  }

  // 开始录音识别
  async startRecording(onResult: (result: VoiceRecognitionResult) => void, onError?: (error: Error) => void): Promise<void> {
    if (!this.config) {
      throw new Error('请先在设置页面配置科大讯飞 API')
    }

    if (this.isRecording) {
      throw new Error('正在录音中')
    }

    try {
      // 重置结果文本
      this.resultText = ''
      this.onResultCallback = onResult

      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      this.isRecording = true

      // 创建 WebSocket 连接
      const ws = new WebSocket(this.generateAuthUrl())
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      ws.onopen = () => {
        console.log('WebSocket 连接已建立')

        // 发送开始参数
        const params = {
          common: {
            app_id: this.config!.appId,
          },
          business: {
            language: 'zh_cn',
            domain: 'iat',
            accent: 'mandarin',
            vad_eos: 3000,
          },
          data: {
            status: 0,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
          },
        }

        ws.send(JSON.stringify(params))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('收到 WebSocket 消息:', data)

        if (data.code !== 0) {
          console.error('识别错误:', data)
          onError?.(new Error(data.message || '识别失败'))
          return
        }

        if (data.data && data.data.result) {
          const words = data.data.result.ws.map((w: any) =>
            w.cw.map((c: any) => c.w).join('')
          ).join('')

          this.resultText += words
          console.log('当前识别文本:', this.resultText)

          // 如果是最终结果
          if (data.data.status === 2) {
            console.log('识别完成，最终文本:', this.resultText)
            onResult({
              text: this.resultText,
              confidence: 1,
            })
            // 清除回调，避免在 stopRecording 中重复触发
            this.onResultCallback = null
          }
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
        onError?.(new Error('语音识别连接失败'))
        this.stopRecording()
      }

      ws.onclose = () => {
        console.log('WebSocket 连接已关闭')
        this.stopRecording()
      }

      // 处理音频数据
      processor.onaudioprocess = (e) => {
        if (!this.isRecording) return

        const inputData = e.inputBuffer.getChannelData(0)
        const output = new Int16Array(inputData.length)

        for (let i = 0; i < inputData.length; i++) {
          output[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768))
        }

        if (ws.readyState === WebSocket.OPEN) {
          // 将音频数据转换为 base64
          const audioData = btoa(
            String.fromCharCode(...new Uint8Array(output.buffer))
          )

          // 发送 JSON 格式的音频数据
          ws.send(JSON.stringify({
            data: {
              status: 1, // 1 表示持续传输中
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: audioData,
            },
          }))
        }
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      // 保存引用以便停止
      this.recognition = {
        ws,
        stream,
        audioContext,
        processor,
        source,
      }

    } catch (error) {
      this.isRecording = false
      throw error
    }
  }

  // 停止录音
  stopRecording() {
    if (!this.isRecording || !this.recognition) return

    const { ws, stream, audioContext, processor, source } = this.recognition

    // 发送结束标识
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        data: {
          status: 2,
        },
      }))

      // 等待一小段时间让服务器返回最终结果
      setTimeout(() => {
        // 如果有识别文本且回调还未触发，手动触发
        if (this.resultText && this.onResultCallback) {
          console.log('手动触发识别结果:', this.resultText)
          this.onResultCallback({
            text: this.resultText,
            confidence: 1,
          })
          this.onResultCallback = null
        }
        ws.close()
      }, 500)
    }

    // 清理资源
    processor.disconnect()
    source.disconnect()
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    audioContext.close()

    this.isRecording = false
    this.recognition = null
  }

  // 检查是否正在录音
  getIsRecording(): boolean {
    return this.isRecording
  }
}

export const voiceService = new VoiceService()
