import p5 from 'p5'
import { canvasColors } from '../lib/canvas-colors'

new p5((p) => {
  const parent = document.getElementById('border-intersection-figure')

  p.setup = () => {
    p.createCanvas(parent.clientWidth, parent.clientWidth * 0.3)
    p.noCursor()
  }

  p.windowResized = () => {
    p.resizeCanvas(parent.clientWidth, parent.clientWidth * 0.3)
  }

  p.draw = () => {
    const buttonWidth = p.width * 0.25
    const buttonHeight = p.height * 0.17

    const cx = p.width / 2
    const cy = p.height / 2

    const mx = p.constrain(p.mouseX, 0, p.width)
    const my = p.constrain(p.mouseY, 0, p.height)

    p.background(canvasColors.background)
    p.rectMode(p.CENTER)

    p.fill(canvasColors.light)
    p.noStroke()
    p.arc(
      mx ?? cx,
      my ?? cy,
      buttonWidth * 1.5,
      buttonWidth * 1.5,
      0,
      Math.PI * 2,
    )

    p.push()

    p.clip(() => {
      p.rect(cx, cy, buttonWidth, buttonHeight, buttonHeight / 2)
    })

    p.fill(canvasColors.dark)
    p.arc(
      mx ?? cx,
      my ?? cy,
      buttonWidth * 1.5,
      buttonWidth * 1.5,
      0,
      Math.PI * 2,
    )

    p.pop()

    p.stroke(canvasColors.dark)
    p.strokeWeight(3)
    p.noFill()
    p.rect(cx, cy, buttonWidth, buttonHeight, buttonHeight / 2)
  }
}, document.getElementById('border-intersection-figure'))
