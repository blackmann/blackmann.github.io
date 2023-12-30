import gsap from 'gsap'
import p5 from 'p5'
import { canvasColors } from '../lib/canvas-colors'

let fillType = 'gradual'
const ANIMATION_DURATION = 0.3

const fillTypeRadios = document.querySelectorAll('input[name="fill-type"]')

fillTypeRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      fillType = radio.value
    }
  })
})

new p5((p) => {
  const parent = document.getElementById('border-intersection-figure')
  const state = {
    cursorScale: 0.5,
    mouseEntered: false,
    previousTween: null,
  }

  p.setup = () => {
    p.createCanvas(parent.clientWidth, parent.clientWidth * 0.4)
    p.noCursor()
  }

  p.windowResized = () => {
    p.resizeCanvas(parent.clientWidth, parent.clientWidth * 0.4)
  }

  p.draw = () => {
    const [cx, cy] = [p.width / 2, p.height / 2]
    const [mx, my] = [
      p.constrain(p.mouseX, 0, p.width),
      p.constrain(p.mouseY, 0, p.height),
    ]
    const buttonWidth = p.width * 0.3
    const buttonHeight = buttonWidth * 0.2
    const baseRadius = buttonHeight / 3

    const radius = baseRadius * state.cursorScale
    const targetScale = buttonWidth / 2 / baseRadius + (fillType === 'gradual' ? 5 : 7)

    const buttonShape = [cx, cy, buttonWidth, buttonHeight, buttonHeight / 2]

    p.clear()
    p.rectMode(p.CENTER)

    // [ ] Show buttons to toggle?

    // <cursor>
    // p.fill(canvasColors.light)
    // p.noStroke()
    // p.arc(mx, my, radius * 2, radius * 2, 0, Math.PI * 2)
    // </cursor>

    // <intersection>
    p.push()
    p.clip(() => {
      p.rect(...buttonShape)
    })

    p.fill(canvasColors.dark)
    p.arc(mx, my, radius * 2, radius * 2, 0, Math.PI * 2)
    p.pop()

    p.stroke(canvasColors.dark)
    p.strokeWeight(3)
    p.noFill()
    p.rect(...buttonShape)

    // </intersection>

    // <ray>
    const buttonPath = new Path2D()
    buttonPath.roundRect(
      cx - buttonWidth / 2,
      cy - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonHeight / 2,
    )

    const entered = p.drawingContext.isPointInPath(
      buttonPath,
      mx * p.pixelDensity(),
      my * p.pixelDensity(),
    )

    function _dx() {
      const rightEdge = cx + buttonWidth / 2
      const leftEdge = cx - buttonWidth / 2

      return Math.abs(cx - mx) <= 30
        ? buttonWidth / 2
        : mx > cx
          ? rightEdge - mx
          : mx - leftEdge
    }

    function _newScale() {
      const dx = _dx()
      return p.map(dx, 0, buttonWidth / 2, 0, targetScale)
    }

    const debugMsg = {
      entered,
      mx: mx,
      my: my,
      fillType,
      targetScale,
      currentScale: state.cursorScale,
    }

    debug(p, mx, my, JSON.stringify(debugMsg, null, 2))
    const scaleMultiplier = fillType === 'gradual' ? 0.5 : 0.9
    const startScale = Math.max(_newScale(), targetScale * scaleMultiplier)

    if (entered !== state.mouseEntered) {
      state.previousTween?.kill()

      state.mouseEntered = entered
      if (entered) {
        state.previousTween = gsap.to(state, {
          cursorScale: startScale,
          duration: ANIMATION_DURATION,
          ease: 'power4.out',
        })
      } else {
        state.previousTween = gsap.to(state, {
          cursorScale: 1,
          duration: ANIMATION_DURATION,
          ease: 'power4.out',
        })
      }
    }
    // </ray>

    // <scale>
    if (entered) {
      if (p.pmouseX !== p.mouseX) {
        const newScale = _newScale()

        if (newScale < startScale) {
          // state.cursorScale = startScale
          return
        }

        state.previousTween?.kill()

        state.previousTween = gsap.to(state, {
          cursorScale: newScale,
          duration: ANIMATION_DURATION,
          ease: 'power4.out',
        })
      }
    }
    // </scale>
  }
}, document.querySelector('#hover-circle-canvas'))

function debug(p, mx, my, data) {
  p.stroke(canvasColors.light)
  p.line(mx, 0, mx, 20)

  p.line(0, my, 20, my)

  p.line(mx, my - 5, mx, my + 5)
  p.line(mx - 5, my, mx + 5, my)

  p.fill(canvasColors.gray)
  p.textFont('IBM Plex Mono')
  p.noStroke()
  p.textSize(12)
  p.text(data, mx + 18, my + 6)
}
