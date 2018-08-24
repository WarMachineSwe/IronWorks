describe('ErrorHandler message', function () {
  it('models a good message to print on the screen in case of errors', function () {
    document.body.innerHTML = __html__['spec/client/template_spec.html']

    var err = new ErrorHandler()
    err.msg('Good tests errorHandler', 'this is a good behavior')

    var msgContent = document.getElementById('error-msg-content')
    var msgTitle = msgContent.children[0]
    var msgText = document.getElementById('error-text')

    expect(msgText.innerHTML).toBe('this is a good behavior')
    expect(msgTitle.innerHTML).toBe('Good tests errorHandler')

    err.msg('Good 1 tests errorHandler', 'this is a good behavior')
    expect(msgTitle.innerHTML).toBe('Good 1 tests errorHandler')

    var button = document.getElementById('error-ok')
    var errorBox = document.getElementById('error-msg')
    button.click()
    expect(errorBox.style.display).toEqual('none')
    })
})
