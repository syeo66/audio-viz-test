import React, { useCallback, useRef, useState } from 'react'

const AudioComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const handleClick = useCallback(() => {
    setIsPlaying((prev) => {
      prev ? audioRef.current?.pause() : audioRef.current?.play()

      return !prev
    })
  }, [])

  return (
    <>
      <audio src="/sound.mp3" ref={audioRef} loop />
      <button onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
    </>
  )
}

export default AudioComponent
