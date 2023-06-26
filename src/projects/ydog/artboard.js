
const Artboard = function(canvas) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.items = []
  this.width = canvas.width
  this.height = canvas.height

  canvas.style.background = '#f2f2f2'

  this._mouseDownTimeout = null
  this._activeEventItems = []
  this._mouseDownEvent = null

  this.resize()
  coordinateEvents.call(this)
}

Artboard.prototype.add = function (item) {
  this.items.push(item)
}

Artboard.prototype.render = function () {
  for (const item of this.items) {
    item.render(this.ctx)
  }
}

Artboard.prototype.resize = function () {
  const { width, height } = this.canvas.parentNode.getBoundingClientRect()
    this.canvas.width = width
    this.canvas.height = height

    this.width = width
    this.height = height
}

/** @this Artboard */
function coordinateEvents() {
  canvas.addEventListener('mousemove', (e) => {
    clearTimeout(this._mouseDownTimeout)
    // console.time('hittest')
    const x = e.offsetX
    const y = e.offsetY

    if (this._mouseDownEvent) {
      publishEvent(this._activeEventItems, 'dragstart', this._mouseDownEvent)
    }

    for (const item of this.items) {
      const nodes = item.hitTest(x, y)
      publishEvent(nodes, 'hover', nodes)
    }

    // console.timeEnd('hittest')
  })

  canvas.addEventListener('mousedown', (e) => {
    clearTimeout(this._mouseDownTimeout)

    const x = e.offsetX
    const y = e.offsetY

    // capture the mousedonw even which will be used later
    // as with the click or long press event dispatch
    this._mouseDownEvent = e

    for (const item of this.items) {
      this._activeEventItems = item.hitTest(x, y)
      if (this._activeEventItems) {
        break
      }
    }

    this._mouseDownTimeout = setTimeout(() => {
      this._mouseDownEvent = null
      publishEvent(this._activeEventItems, 'longpress', e)
    }, 100)
  })

  canvas.addEventListener('mouseup', (e) => {
    clearTimeout(this._mouseDownTimeout)

    const eventName = this._mouseDownEvent ? 'dragend' : 'click'
    this._mouseDownEvent = null
    publishEvent(this._activeEventItems, eventName, e)

    return
  })

  window.addEventListener('resize', () => {
    this.resize()
  })
}

function publishEvent(targets, eventName, event) {
  for (const node of targets) {
    if (node.on?.(eventName, event) === false) {
      break
    }
  }
}