const canvas = document.querySelector('#canvas')
const artboard = new Artboard(canvas)

const scene = new Scene(artboard)
artboard.add(scene)


for (var i = 0; i < 10_000; i++) {
  scene.children[i] = new Rect({ width: 30, height: 30 })
}

artboard.render()
