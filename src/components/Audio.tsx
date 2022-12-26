import React, { useCallback, useEffect, useRef, useState } from 'react'

import spectrum from '../renderers/spectrum'

const AudioComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stopRef = useRef<(() => void) | null>(null)

  const handleClick = useCallback(() => {
    if (!canvasRef.current || !audioRef.current) {
      return
    }

    setIsPlaying((prev) => {
      prev ? audioRef.current?.pause() : audioRef.current?.play()
      return !prev
    })

    if (!stopRef.current) {
      const { stop } = spectrum({ canvas: canvasRef.current, audio: audioRef.current })
      stopRef.current = stop
    }
  }, [])

  useEffect(() => {
    const copyAudio = audioRef.current

    return () => {
      stopRef.current?.()
      stopRef.current = null
      copyAudio?.pause()
    }
  }, [])

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
