import gsap from 'gsap'

const colors = {
  dark: '#27272a',
  light: '#d4d4d8',
}

const darkColors: typeof colors = {
  dark: '#fff',
  light: '#404040',
}

interface Config {
  colors: typeof colors
  height: number
  mouseX: number
  mouseY: number
  width: number
}

interface Options {
  height?: number
  animate?: boolean
}

function canvas(
  el: HTMLCanvasElement | string,
  draw: (ctx: CanvasRenderingContext2D, config: Config) => void,
  options: Options = {},
) {
  const canvas =
    typeof el === 'string'
      ? (document.querySelector(el) as HTMLCanvasElement)
      : el!

  const parent = canvas.parentElement!

  const ctx =
    typeof el === 'string'
      ? (document.querySelector(el) as HTMLCanvasElement).getContext('2d')!
      : el.getContext('2d')!

  const { height = 0.5 } = options

  const config: Config = {
    width: 0,
    height: 0,
    colors: colors,
    mouseX: 0,
    mouseY: 0,
  }

  function resize() {
    canvas.width = parent.clientWidth
    canvas.height = height < 1 ? parent.clientWidth * height : height

    config.width = canvas.width
    config.height = canvas.height

    _draw()
  }

  function updateColorScheme() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    config.colors = dark ? darkColors : colors
    _draw()
  }

  function updateMousePos(e: MouseEvent) {
    gsap.to(config, {
      mouseX: e.clientX - canvas.getBoundingClientRect().left,
      mouseY: e.clientY - canvas.getBoundingClientRect().top,
    })
  }

  function _draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw(ctx, config)
  }

  resize()
  updateColorScheme()

  window.addEventListener('resize', resize)
  window.addEventListener('load', resize)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateColorScheme)

  // [ ] TODO: Add touch support
  canvas.addEventListener('mousemove', updateMousePos)

  config.mouseX = (config.width * 1) / 3
  config.mouseY = (config.height * 1) / 3

  function run() {
    _draw()
    if (options.animate) {
      requestAnimationFrame(run)
    }
  }

  run()
}

export { canvas }
