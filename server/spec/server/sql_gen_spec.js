var elements = require('../../ApplicationTier/FileGenerator/SqlGenerator/elements')
var sql = require('../../ApplicationTier/FileGenerator/SqlGenerator/sql')
var utils = require('../../ApplicationTier/FileGenerator/SqlGenerator/utils')
var generator = require('../../ApplicationTier/FileGenerator/CodeGenerator/GetCode')

describe('Sql code generator', function () {
  it('creates SQL type', function () {
    expect(new elements.Type('frebi').toString()).toEqual('error')
    expect(new elements.Type('InT').toString()).toEqual('INTEGER')
    expect(new elements.Type('decimal').toString()).toEqual('DECIMAL(30,9)')
  })

  it('gets SQL attribute name', function () {
    expect(utils.getSqlAttributeName('hello')).toEqual('HELLO')
    expect(utils.getSqlAttributeName('hello world')).toEqual('HELLO_WORLD')
  })

  it('gets SQL table name', function () {
    expect(utils.getSqlAttributeName('table')).toEqual('TABLE')
    expect(utils.getSqlAttributeName('table name  here')).toEqual('TABLE_NAME_HERE')
  })

  it('creates attribute', function () {
    expect(new elements.Attribute('type', false, 'name', false).toString()).toEqual('NAME: error')
    expect(new elements.Attribute('int', true, 'my name', false).toString()).toEqual('MY_NAME: INTEGER PRIMARY KEY')
    expect(new elements.Attribute('int', false, 'my name', true).toString()).toEqual('MY_NAME: INTEGER NOT NULL')
    expect(new elements.Attribute('int', true, 'my name', true).toString()).toEqual('MY_NAME: INTEGER PRIMARY KEY' +
      ' NOT NULL')
  })

  var exampleTable = new sql.Table(
    'mytable',
    [
      new elements.Attribute('string', false, 'myString', true),
      new elements.Attribute('int', true, 'my pretty name', false)
    ]
  )

  it('creates sql table', function () {
    expect(exampleTable.toString()).toEqual(
      'CREATE TABLE MYTABLE (\n' +
      '\tMYSTRING: VARCHAR(60) NOT NULL,\n' +
      '\tMY_PRETTY_NAME: INTEGER PRIMARY KEY\n' +
      ')'
    )
  })

  var errorEntity = {}

  var justNameEntity = {
    'entityName': 'name'
  }

  var exampleEntity = {
    entityId: '2320d162-337f-494b-a944-9e776045dc50',
    entityName: 'MyTable',
    dataFields: [
      {
        fieldType: 'STRING',
        fieldName: 'myString',
        primaryK: false,
        notNull: true
      },
      {
        fieldType: 'INT',
        fieldName: 'my pretty name',
        primaryK: true,
        notNull: false
      }
    ]
  }

  it('creates sql table from raw entity', function () {
    expect(function () {
      new sql.EntityParser(errorEntity)
    }).toThrow()

    expect(function () {
      new sql.EntityParser(justNameEntity)
    }).toThrow()

    var parsedClass = new generator.SqlGenerator(exampleEntity).getCode()['data']
    expect(parsedClass).toEqual(exampleTable.toString())
  })
})
