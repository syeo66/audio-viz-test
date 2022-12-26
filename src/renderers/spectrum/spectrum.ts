interface SpectrumInput {
  audio: HTMLAudioElement
  canvas: HTMLCanvasElement
}

const nodes = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>()
let audioCtx: AudioContext | null = null

const getSource = (audio: HTMLAudioElement) => {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }

  if (nodes.has(audio)) {
    return nodes.get(audio) as MediaElementAudioSourceNode
  }

  const source = audioCtx.createMediaElementSource(audio)
  nodes.set(audio, source)
  return source
}

const spectrum = ({ canvas, audio }: SpectrumInput) => {
  let isRunning = true

  const source = getSource(audio)

  if (!audioCtx) {
    return {
      stop: () => void 0,
    }
  }

  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 1024
  const canvasCtx = canvas.getContext('2d')

  source.connect(audioCtx.destination)
  source.connect(analyser)

  const draw = () => {
    if (!isRunning || !canvasCtx) {
      return
    }

    const { width, height } = canvas

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    canvasCtx.clearRect(0, 0, width, height)
    canvasCtx.fillStyle = 'rgb(0, 0, 0)'
    canvasCtx.fillRect(0, 0, width, height)

    const barWidth = (width / bufferLength) * 2.5
    let barHeight
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] * height) / 255

      canvasCtx.fillStyle = `rgb(${dataArray[i]}, 50, 50)`
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }

    requestAnimationFrame(draw)
  }

  draw()

  return {
    stop: () => {
      isRunning = false
    },
  }
}

export default spectrum
