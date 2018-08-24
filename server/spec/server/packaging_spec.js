var packer = require('../../PresentationTier/CodegenRoute/packaging')

describe('Packaging utils', function () {
  it('finds the smallest string', function () {
    var lst = ['abc', 'b', 'c', 'ab', 'abc']

    expect(packer.smallestString(lst)).toEqual('b')
    expect(packer.smallestString([])).toEqual(null) // empty test
  })

  it('finds if the char is the same for all', function () {
    var lst = ['ab', 'bb', 'cb', 'ab', 'abc']
    var otherLst = ['a', 'b', 'c', 'ab', 'abc']

    expect(packer.isTheSameForAll('b', 1, lst)).toBeTruthy()
    expect(packer.isTheSameForAll('b', 1, otherLst)).toBeFalsy()
    expect(packer.isTheSameForAll(null, 1, lst)).toBeFalsy()
  })

  it('finds the longest substring starting at 0', function () {
    expect(packer.firstLongestCommonSubstring(['ab', 'aa', 'abc'])).toEqual('a')
    expect(packer.firstLongestCommonSubstring([])).toEqual(null)
    expect(packer.firstLongestCommonSubstring(['aab', 'aa', 'aabc'])).toEqual('aa')
    expect(packer.firstLongestCommonSubstring(['bab', 'aa', 'abc'])).toEqual('')
  })

  it('finds a suitable package for all packages', function () {
    var lst = ['a.b.c', 'a.b.c.d', 'a.b.e']

    expect(packer.getCommonPackage(lst)).toEqual('a.b')
    expect(packer.getCommonPackage(['a.b', 'c.d'])).toEqual(packer.DEFAULT_PACKAGE)
    expect(packer.getCommonPackage([])).toEqual(packer.DEFAULT_PACKAGE)
  })
})
