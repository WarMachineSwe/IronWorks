var proxy = require('../../PresentationTier/CodegenRoute/proxyGenHandler')

describe('proxy validator', function () {
  it('validates a JAVA package', function () {
    expect(proxy.isValidPackage('a')).toBeTruthy()
    expect(proxy.isValidPackage('a.b')).toBeTruthy()
    expect(proxy.isValidPackage('a.b.c')).toBeTruthy()

    expect(proxy.isValidPackage('a.b;')).toBeFalsy()
    expect(proxy.isValidPackage('a,b')).toBeFalsy()
    expect(proxy.isValidPackage('a1.b')).toBeTruthy()
  })
})
