import { useState } from 'react'
import { Button, message, Tooltip } from 'antd'
import { AudioOutlined, LoadingOutlined } from '@ant-design/icons'
import { voiceService } from '@/services/voiceService'

interface VoiceInputProps {
  onResult: (text: string) => void
  disabled?: boolean
}

export default function VoiceInput({ onResult, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)

  const handleStartRecording = async () => {
    try {
      setIsRecording(true)
      message.info('开始录音...')

      await voiceService.startRecording(
        (result) => {
          message.success('识别完成')
          onResult(result.text)
          setIsRecording(false)
        },
        (error) => {
          message.error(`语音识别失败: ${error.message}`)
          setIsRecording(false)
        }
      )
    } catch (error: any) {
      message.error(error.message)
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    voiceService.stopRecording()
    setIsRecording(false)
    message.info('录音已停止')
  }

  return (
    <Tooltip title={isRecording ? '点击停止录音' : '点击开始语音输入'}>
      <Button
        type={isRecording ? 'primary' : 'default'}
        shape="circle"
        size="large"
        icon={isRecording ? <LoadingOutlined className="pulse-animation" /> : <AudioOutlined />}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={disabled}
        danger={isRecording}
      />
    </Tooltip>
  )
}
