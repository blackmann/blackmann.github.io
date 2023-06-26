'use strict'

const Vec2D = function (x, y) {
  this.x = x
  this.y = y
}

Vec2D.prototype.isSame = function (v) {
  return v.x === this.x && v.y === this.y
}

const Rect = function ({
  name = 'Rectangle',
  width = 0,
  height = 0,
  x = 0,
  y = 0,
  fill = '#aaa',
} = {}) {
  this.width = width
  this.height = height
  this.x = x
  this.y = y
  this.fill = fill
  this.name = name
}

Rect.prototype.resizeTo = function (v) {
  const w = v.x - currentShape.x
  const h = v.y - currentShape.y

  this.width = w
  this.height = h
}

Rect.prototype.render = function (ctx) {
  ctx.save()
  ctx.beginPath()

  ctx.fillStyle = this.fill

  ctx.moveTo(this.x, this.y)
  ctx.lineTo(this.x + this.width, this.y)
  ctx.lineTo(this.x + this.width, this.y + this.height)
  ctx.lineTo(this.x, this.y + this.height)
  ctx.lineTo(this.x, this.y)

  ctx.fill()

  ctx.restore()
}

const ArtboardLegacy = function ({ target, type, onDragStart, onDrag, onDragEnd }) {
  const el = document.querySelector(target)

  if (type === 'canvas') {
    let targetEl
    if (el instanceof HTMLCanvasElement) {
      targetEl = el
    } else {
      targetEl = document.createElement('canvas')
      targetEl.style.background = '#f2f2f2'

      const { width, height } = el.getBoundingClientRect()
      targetEl.width = width
      targetEl.height = height

      this.width = targetEl.width
      this.height = targetEl.height

      targetEl.addEventListener('mousedown', (e) => {
        if (e.button !== 0) {
          return
        }

        this._dragStartTimeout = setTimeout(() => {
          this._mouseDown = true
          this._dragStart = new Vec2D(e.offsetX, e.offsetY)
        }, 30)
      })

      targetEl.addEventListener('mousemove', (e) => {
        if (this._mouseDown) {
          const move = new Vec2D(e.offsetX, e.offsetY)
          if (move.isSame(this._dragStart) && !this._isDragging) {
            return
          }

          !this._isDragging && onDragStart?.(this._dragStart)
          this._isDragging = true

          onDrag?.(move)
        }
      })

      targetEl.addEventListener('mouseup', (e) => {
        if (this._isDragging) {
          onDragEnd?.()
        }

        this._dragStart = null
        this._isDragging = false
        this._mouseDown = false
      })

      el.appendChild(targetEl)
    }

    this.ctx = targetEl.getContext('2d')
    this.targetEl = targetEl

    return
  }

  if (type === 'svg') {
    if (el instanceof SVGElement) {
      this.ctx = el
      return
    }

    this.ctx = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    el.appendChild(this.ctx)
    return
  }

  throw new Error('type should be `canvas` | `svg`')
}

ArtboardLegacy.prototype.renderScene = function (scene) {
  this.ctx.clearRect(0, 0, this.width, this.height)
  for (const item of scene.children) {
    item.render(this.ctx)
  }

  this.renderControls()
}

const CONTROLS_MARGIN = 10
const CONTROLS_HEIGHT = 25
const CONTROL_WIDTH = 25
const CONTROLS = [
  { name: 'Rectangle', pressed: true },
  { name: 'Circle', pressed: false },
  { name: 'Circle' },
  { name: 'Circle' },
]
const BR = 8

ArtboardLegacy.prototype.renderControls = function () {
  // shape controls

  this.ctx.save()

  CONTROLS.forEach((control, i) => {
    let borderRadius = (() => {
      if (i === 0 && CONTROLS.length === 1) {
        return BR
      }

      if (i == 0) {
        return [BR, 0, 0, BR]
      }

      if (i === CONTROLS.length - 1) {
        return [0, BR, BR, 0]
      }

      return 0
    })()

    let shiftUp = 2

    // shadow pass
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#aaa'
    this.ctx.lineWidth = 4
    this.ctx.fillStyle = '#aaa'

    const xi = i * (CONTROL_WIDTH + 2) + CONTROLS_MARGIN
    const yi = this.height - (CONTROLS_HEIGHT + CONTROLS_MARGIN)
    this.ctx.roundRect(xi, yi, CONTROL_WIDTH, CONTROLS_HEIGHT, borderRadius)
    this.ctx.stroke()

    if (!control.pressed) {
      shiftUp = 4
    }
    // this.ctx.fill()

    // surface pass
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#aaa'
    this.ctx.lineWidth = 4
    this.ctx.fillStyle = 'white'

    const x = i * (CONTROL_WIDTH + 2) + CONTROLS_MARGIN
    const y = this.height - (CONTROLS_HEIGHT + CONTROLS_MARGIN) - shiftUp
    this.ctx.roundRect(x, y, CONTROL_WIDTH, CONTROLS_HEIGHT, borderRadius)
    this.ctx.stroke()
    this.ctx.fill()
  })

  // color selection
  this.ctx.restore()

  console.log('rendered controls')
}

ArtboardLegacy.prototype.resize = function () {
  const { width, height } = this.targetEl.parentNode.getBoundingClientRect()
  this.targetEl.width = width
  this.targetEl.height = height

  this.width = width
  this.height = height
}

function createScene(artboard, outlineEl) {
  return {
    artboard,
    children: [],
    setArtboard(artboard) {
      this.artboard = artboard
      this.refresh()
    },
    add(child) {
      this.children.push(child)
      this.refresh()
    },
    remove(child) {
      this.children = this.children.filter((c) => c === child)
      this.refresh()
    },
    refresh() {
      this.artboard.renderScene(this)
      this.updateOutline()
    },
    updateOutline() {
      if (!outlineEl) {
        return
      }

      const els = []
      for (const child of this.children) {
        const li = document.createElement('div')
        li.innerHTML = /* html */ `
          ${child.name} <span class="meta">${child.width} x ${child.height}</span>
        `
        li.classList.add('outline-item')

        els.push(li)
      }

      outlineEl.replaceChildren(...els)
    },
  }
}

let currentShape = new Rect()
let dragStart = null

function createArtboard() {
  return new ArtboardLegacy({
    target: '.canvas',
    type: 'canvas',
    onDrag(v) {
      currentShape.resizeTo(v)
      artboard.renderScene(scene)
    },
    onDragStart(v) {
      currentShape.x = v.x
      currentShape.y = v.y
      scene.add(currentShape)
    },
    onDragEnd() {
      if (currentShape.width === 0 || currentShape.height === 0) {
        scene.remove(currentShape)
        return
      }

      scene.refresh()

      currentShape = new Rect()
    },
  })
}

// App

const artboard = createArtboard()
const scene = createScene(artboard, document.querySelector('.outline'))
scene.refresh()

window.addEventListener('resize', () => {
  setTimeout(() => {
    artboard.resize()
    scene.refresh()
  }, 30)
})
