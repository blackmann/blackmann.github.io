const Scene = function (artboard) {
  this.artboard = artboard
  this.children = Array.from({ length: 10_000 })
}

Scene.prototype.hitTest = function (x, y) {
  for (const child of this.children) {
    const node = child.hitTest(x, y)

    // scene tries to fill every part of the artboard at
    // the moment
    if (!node) {
      return [this]
    }

    if (!Array.isArray(node)) {
      return [node, this]
    }

    return [...node, this]
  }
}

Scene.prototype.render = function (ctx) {
  for (const child of this.children) {
    child.render(ctx)
  }
}

Scene.prototype.add = function (item) {
  this.children.push(item)
  this.artboard.render()
}

Scene.prototype.on = function (event) {
  console.log('event gotten', event)
}
