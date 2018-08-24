describe('Prettify images', function () {
  it('checks images src', function () {
    document.body.innerHTML = __html__['spec/client/app_spec.html'] // loads html

    // document.getElementsByClassName("frontdrop")[0].click()
    expect(
      function () {
        dropToMouse(null)
      }
    ).toThrow()

    var cmd = new Commands()
    cmd.clearAll()

    dropActor()
    dropBoundary()
    dropEntity()
    dropControl()

    expect(countHowManyCells()).toEqual(4)
    expect(mouseToCanvasPosition(0, 0)[0]).toBeLessThan(0)
    expect(mouseToCanvasPosition(0, 0)[1]).toBeLessThan(0)
  })
})
