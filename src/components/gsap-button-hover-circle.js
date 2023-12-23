import gsap from 'gsap'
import p5 from 'p5'
import { canvasColors } from '../lib/canvas-colors'

let fillType
const SETTLED_POINTER_RADIUS = 10
const START_POINTER_SCALE = 7
let mouseEnter = false
const appState = {
  circleScale: 1,
}

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

  p.setup = () => {
    p.createCanvas(parent.clientWidth, parent.clientWidth * 0.4)
  }

  p.windowResized = () => {
    p.resizeCanvas(parent.clientWidth, parent.clientWidth * 0.4)
  }

  p.draw = () => {
    const [cx, cy] = [p.width / 2, p.height / 2]
    const [mx, my] = [p.constrain(p.mouseX, 0, p.width), p.constrain(p.mouseY, 0, p.height)]
    const buttonWidth = p.width * 0.3
    const buttonHeight = buttonWidth * 0.2

    p.clear()
    p.rectMode(p.CENTER)

    // draw cursor
    p.fill(canvasColors.light)
    p.noStroke()
    p.arc(mx, my, buttonWidth/2, buttonWidth/2, 0, Math.PI * 2)

    p.push()
    p.clip(() => {
      p.rect(cx, cy, buttonWidth, buttonHeight, buttonWidth / 2)
    })

    p.fill(canvasColors.dark)
    p.arc(mx, my, buttonWidth/2, buttonWidth/2, 0, Math.PI * 2)
    p.pop()

    p.stroke(canvasColors.dark)
    p.strokeWeight(3)
    p.noFill()
    p.rect(cx, cy, buttonWidth, buttonHeight, buttonWidth / 2)
  }
}, document.querySelector('#hover-circle-canvas'))

