describe('Prettify images', function () {
  it('checks images src', function () {
    document.body.innerHTML = __html__['spec/client/prettify_spec.html'] // loads html

    var elementsHandler = new ElementHandler()
    elementsHandler.createActor() // place actor
    var id = GRAPH.getCells()[0].id  // get actor image
    var image = new CellBackgroundImage(id)

    console.log(image)

    highlightImage(id)
    expect(image.getCurrentImageSrc()).toContain('_live')

    killImage(id)
    expect(image.getCurrentImageSrc()).toEqual(image.getDeadSrc())
  })
})
