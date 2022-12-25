import React, { useCallback, useEffect, useRef, useState } from 'react'

// TODO Now that it works, refactor it to make it clean
const AudioComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const analyserRef = useRef<AnalyserNode>()
  const audioCtxRef = useRef<AudioContext>()
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode>()

  const handleClick = useCallback(() => {
    setIsPlaying((prev) => {
      prev ? audioRef.current?.pause() : audioRef.current?.play()

      return !prev
    })
  }, [])

  useEffect(() => {
    if (!audioRef.current || !isPlaying) {
      return
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
      analyserRef.current = audioCtxRef.current.createAnalyser()
      analyserRef.current.fftSize = 1024
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current)
      sourceRef.current.connect(audioCtxRef.current.destination)
      sourceRef.current.connect(analyserRef.current)
      canvasCtxRef.current = canvasRef.current?.getContext('2d') ?? undefined
    }

    if (!analyserRef.current) {
      return
    }

    const draw = () => {
      if (!analyserRef.current || !canvasRef.current || !canvasCtxRef.current) {
        return
      }

      const { width, height } = canvasRef.current

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      canvasCtxRef.current.clearRect(0, 0, width, height)
      canvasCtxRef.current.fillStyle = 'rgb(0, 0, 0)'
      canvasCtxRef.current.fillRect(0, 0, width, height)

      const barWidth = (width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] * height) / 255

        canvasCtxRef.current.fillStyle = `rgb(${dataArray[i]}, 50, 50)`
        canvasCtxRef.current.fillRect(x, height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      requestAnimationFrame(draw)
    }

    draw()
  }, [isPlaying])

  return (
    <>
      <canvas ref={canvasRef} width={1024} height={300}></canvas>
      <div className="vizWrapper">
        <audio src="/sound.mp3" ref={audioRef} loop />
        <button onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </>
  )
}

export default AudioComponent
