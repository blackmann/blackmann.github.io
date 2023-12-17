function applyGsapHoverEffect(el: string | HTMLElement | HTMLElement[]) {
  const elements = [
    typeof el === 'string' ? document.querySelectorAll(el) : el,
  ].flat()
}

export { applyGsapHoverEffect }
