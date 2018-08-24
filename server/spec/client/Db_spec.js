describe('db', function () {
  var bigN = 99
  var db = new LocalStorageFacade()
  db.clear()

  var throwingFunction = function () {
    this.toString = function () {
      throw 1
    }
  }

  it('creates a db', function () {
    expect(db.set('a', 1)).toBeTruthy()  // setup a simple db
    expect(db.set('arr', [{'id': 1}, {'id': 2}])).toBeTruthy()
    expect(db.set(throwingFunction(), throwingFunction())).toBeTruthy()
  })

  it('gets some keys', function () {
    expect(db.get('a', null)).toEqual(1)  // valid GET
    expect(db.get('b', null)).toEqual(null)  // NOT valid GET
  })

  it('checks for some keys', function () {
    expect(db.has('a')).toBeTruthy()
    expect(db.remove('a')).toBeTruthy()
    expect(db.has('a')).toBeFalsy()
    expect(db.remove('a')).toBeFalsy()
  })

  it('removes from array', function () {
    expect(db.removeFromArray('a', 'id', 1)).toBeTruthy()
    db.removeFromArray('arr', 'id', 1)
    expect(db.get('arr', null).length).toEqual(1)
    db.removeFromArray('arr', 'id', 1)
    expect(db.get('arr', null).length).toEqual(1)
  })

  it('gets from array',function () {
    var newElement = {
      'id': 42
    }
    db.appendToArray('a', newElement)

    expect(db.getFromArray('a', 'id', 12, null)).toEqual(null)
    expect(db.getFromArray('a', 'id', 42, null)).toEqual(newElement)
  })

  it('adds to array', function () {
    for (var i = 0; i < bigN; i++) {
      expect(db.appendToArray('arr2', i)).toBeTruthy()
      expect(db.get('arr2', null).length).toEqual(i + 1)
    }
  })

  it('adds to value', function () {
    expect(db.addToNum('val', 4)).toBeTruthy()
    expect(db.get('val', null)).toEqual(4)

    expect(db.addToNum('val', 1)).toBeTruthy()
    expect(db.get('val', null)).toEqual(5)
  })

  it('closes the db', function () {
    expect(db.showContents()).toEqual(undefined)
    expect(db.clear()).toBeTruthy()
  })

  it('setups the db', function () {
    db.setup()
    var allKeys = ['controls', 'userWantsOut', 'outFile', 'change', 'label', 'entities', 'graph']
    expect(db.getAllKeys().sort()).toEqual(allKeys.sort())
  })
})
