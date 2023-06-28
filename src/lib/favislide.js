const NAME = 'okgr'
let i = 0
const faviconLink = document.querySelector('link[rel=icon]')

setInterval(() => {
  const n = NAME[i]
  faviconLink.href = `/${n}.svg`

  i = (i + 1) % NAME.length
}, 5_000)
