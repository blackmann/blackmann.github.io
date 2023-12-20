const lightColors = {
  dark: '#27272a',
  light: '#d4d4d8',
  background: '#e4e4e7',
}

const darkColors: typeof lightColors = {
  dark: '#fff',
  light: '#404040',
  background: '#262626',
}

const colors: typeof darkColors = { ...lightColors }

function updateColorScheme() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  Object.assign(colors, dark ? darkColors : lightColors)
}

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', updateColorScheme)

updateColorScheme()

export { colors as canvasColors }
