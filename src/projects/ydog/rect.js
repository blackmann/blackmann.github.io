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

Rect.prototype.on = function (event) {
  switch (event) {
    case 'hover': {
      console.log('hovered')
    }
  }
}

Rect.prototype.hitTest = function (x, y) {
  if (x >= this.x && x <= this.x+this.width && y >= this.y && y <= this.y + this.height) {
    return this
  }
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
