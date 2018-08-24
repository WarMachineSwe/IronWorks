describe('Miscellaneous functions', function () {
  it('tests page redirection', function () {
    goToPage('#hello')

    expect(window.location.href).toContain('/context.html#hello')
    expect(DB.get('change', true)).toBeFalsy()
  })

  it('tests anchor redirection', function () {
    expect(function () {
      jumpTo('#wow')
    }).toBeDefined()
  })
})
