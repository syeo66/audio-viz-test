import React, { useCallback, useEffect, useRef, useState } from 'react'

const AudioComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioCtxRef = useRef<AudioContext>()
  const analyserRef = useRef<AnalyserNode>()
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
      analyserRef.current.fftSize = 2048
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current)
      sourceRef.current.connect(audioCtxRef.current.destination)
      sourceRef.current.connect(analyserRef.current)
    }

    if (!analyserRef.current) {
      return
    }

    const interval = setInterval(() => {
      if (!analyserRef.current) {
        return
      }

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      console.log(dataArray)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <>
      <audio src="/sound.mp3" ref={audioRef} loop />
      <button onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
    </>
  )
}

export default AudioComponent
