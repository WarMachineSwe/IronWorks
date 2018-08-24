var elements = require('../../ApplicationTier/FileGenerator/JavaGenerator/elements')
var java = require('../../ApplicationTier/FileGenerator/JavaGenerator/java')
var generator = require('../../ApplicationTier/FileGenerator/CodeGenerator/GetCode')

describe('Java code generator', function () {
  it('creates java package', function () {
    expect(new elements.Package('a.b').toString()).toEqual('package a.b;')
    expect(new elements.Package('a.b;').toString()).toEqual('package a.b;')
  })

  it('creates java scope', function () {
    expect(new elements.Scope('frebi').toString()).toEqual('error')
    expect(new elements.Scope('package').toString()).toEqual('')
    expect(new elements.Scope('PuBlIc').toString()).toEqual('public')
  })

  it('creates java type', function () {
    expect(new elements.Type('frebi').construct()).toEqual('Object')
    expect(new elements.Type('InT').construct()).toEqual('Integer')
    expect(new elements.Type('String').toString()).toEqual('String')
  })

  it('creates java parameter', function () {
    expect(new elements.Parameter('type', 'name').toString()).toEqual('type name')
    expect(new elements.Parameter('type', 0).toString()).toEqual('type 0')
  })

  it('creates java class attribute', function () {
    expect(new elements.Attribute('type', 'scope', 'name', 'value').toString()).toEqual('scope type name = value;')
    expect(new elements.Attribute('type', null, 'name', 'value;').toString()).toEqual('type name = value;')
    expect(new elements.Attribute('type', 'scope', 'name', null).toString()).toEqual('scope type name;')
  })

  it('creates java method signature', function () {
    expect(new elements.MethodSignature('scope', 'returnType', 'name', [], 'Exception').toString())
      .toEqual('scope returnType name() throws Exception')
    expect(new elements.MethodSignature('scope', 'returnType', 'name', [], null).toString())
      .toEqual('scope returnType name()')
    expect(
      new elements.MethodSignature(
        'scope', 'returnType', 'name', [new elements.Parameter('type', 'name')], 'Exception').toString()
    ).toEqual('scope returnType name(type name) throws Exception')
    expect(
      new elements.MethodSignature(
        'scope', 'returnType', 'name', [new elements.Parameter('type', 'name'), new elements.Parameter('type', 'name')], null
      ).toString()
    ).toEqual('scope returnType name(type name, type name)')
  })

  it('creates java method', function () {
    expect(
      new elements.Method(
        new elements.MethodSignature('scope', 'returnType', 'name', [], 'Exception'),
        'return returnType;\n',
        'wow such method'
      ).toString()
    ).toEqual(
      '// wow such method\n' +
      elements.INDENT + 'scope returnType name() throws Exception {\n' +
      'return returnType;\n' +
      elements.INDENT + '}'
    )
  })

  var emptyClass = new java.Class(
    'MyClass',
    new elements.Package(''),
    'public',
    [],
    []
  )

  var exampleClass = new java.Class(
    'MyClass',
    new elements.Package('package org.warmachine.ironworks.generated.MyClass'),
    'public',
    [new elements.Attribute('int', 'private', 'primaryKey', null), new elements.Attribute('String', 'private', 'myString', null)],
    [new elements.Attribute('int', 'private', 'primaryKey', null)]
  )

  it('creates java class', function () {
    expect(
      emptyClass.toString()
    ).toEqual(
      '\n' +
      '\n' +
      'import <SqlConnectionImport>.SqlConnection;\n' +
      'import java.sql.DriverManager;\n' +
      'import java.sql.Connection;\n' +
      'import java.sql.PreparedStatement;\n' +
      'import java.sql.ResultSet;\n' +
      'import java.sql.Date;\n' +
      'import java.util.HashMap;\n' +
      'import java.util.Map;\n' +
      '\n' +
      'public class MyClass {\n' +
      '\tprivate final SqlConnection sqlConnectionDriver = SqlConnection.getInstance();  // connection to SQL DB\n' +
      '\tprivate final Map<String, Object> cache = new HashMap<String, Object>();  // cache\n' +
      '\n' +
      '\t// Creates MyClass with specified values\n' +
      '\tpublic MyClass() {\n' +
      '\t\t\n' +
      '\t}\n' +
      '};'
    )


    expect(
      exampleClass.toString()
    ).toEqual(
      'package org.warmachine.ironworks.generated.MyClass;\n' +
      '\n' +
      'import <SqlConnectionImport>.SqlConnection;\n' +
      'import java.sql.DriverManager;\n' +
      'import java.sql.Connection;\n' +
      'import java.sql.PreparedStatement;\n' +
      'import java.sql.ResultSet;\n' +
      'import java.sql.Date;\n' +
      'import java.util.HashMap;\n' +
      'import java.util.Map;\n' +
      '\n' +
      'public class MyClass {\n' +
      '\tprivate int primaryKey;\n' +
      '\tprivate String myString;\n' +
      '\tprivate final SqlConnection sqlConnectionDriver = SqlConnection.getInstance();  // connection to SQL DB\n' +
      '\tprivate final Map<String, Object> cache = new HashMap<String, Object>();  // cache\n' +
      '\tprivate Integer primaryKeyCached = null;\n' +
      '\n' +
      '\t// Creates MyClass with specified values\n' +
      '\tpublic MyClass(int primaryKey, String myString) {\n' +
      '\t\tthis.primaryKey = primaryKey;\n' +
      '\t\tthis.myString = myString;\n' +
      '\t}\n' +
      '\n' +
      '\t// Gets primaryKey\n' +
      '\tpublic int getPrimaryKey() {\n' +
      '\t\treturn this.primaryKey;\n' +
      '\t}\n' +
      '\n' +
      '\t// Sets primaryKey\n' +
      '\tpublic void setPrimaryKey(int primaryKey) {\n' +
      '\t\tthis.primaryKey = primaryKey;\n' +
      '\t}\n' +
      '\n' +
      '\t// Gets myString\n' +
      '\tpublic String getMyString() {\n' +
      '\t\treturn this.myString;\n' +
      '\t}\n' +
      '\n' +
      '\t// Sets myString\n' +
      '\tpublic void setMyString(String myString) {\n' +
      '\t\tthis.myString = myString;\n' +
      '\t}\n' +
      '\n' +
      '\t// Creates table for MyClass with default values\n' +
      '\tpublic void create() throws Exception {\n' +
      '\t\tPreparedStatement stmt = sqlConnectionDriver.getStatement("INSERT INTO MYCLASS (PRIMARYKEY, MYSTRING) VALUES (?, ?)");\n' +
      '\t\tstmt.setInt(1, primaryKey);\n' +
      '\t\tstmt.setString(2, myString);\n' +
      '\t\tstmt.execute();\n' +
      '\t\tsqlConnectionDriver.close();\n' +
      '\t}\n' +
      '\n' +
      '\t// Reads all columns from MyClass table. If requested ID is cached, returns cached data\n' +
      '\tpublic Map read(int primaryKey) throws Exception {\n' +
      '\t\tif (this.primaryKeyCached.equals(primaryKey)) {  // cache is valid\n' +
      '\t\t\treturn cache;\n' +
      '\t\t}\n' +
      '\t\t\n' +
      '\t\tPreparedStatement stmt = sqlConnectionDriver.getStatement("SELECT * FROM MYCLASS WHERE PRIMARYKEY = ?");\n' +
      '\t\tstmt.setInt(1, primaryKey);\n' +
      '\t\t\n' +
      '\t\tResultSet resultTable = stmt.executeQuery();\n' +
      '\t\tint primaryKeyResult = resultTable.getInt(1);\n' +
      '\t\tString myStringResult = resultTable.getString(2);\n' +
      '\t\tsqlConnectionDriver.close();\n' +
      '\t\t\n' +
      '\t\t// insert new cached IDs\n' +
      '\t\tthis.primaryKeyCached = primaryKey;\n' +
      '\t\t\n' +
      '\t\t// insert new cached IDs\n' +
      '\t\tcache.put("PRIMARYKEY", new Integer(primaryKeyResult));\n' +
      '\t\tcache.put("MYSTRING", new String(myStringResult));\n' +
      '\t\treturn cache;\n' +
      '\t}\n' +
      '\n' +
      '\t// Updates all columns of MyClass table. Invalidates cache if necessary\n' +
      '\tpublic void update(String myString, int primaryKeySqlId) throws Exception {\n' +
      '\t\tif (this.primaryKeyCached.equals(primaryKeySqlId)) {  // write CAN invalidate cache\n' +
      '\t\t\tthis.primaryKeyCached = null;\n' +
      '\t\t}\n' +
      '\t\t\n' +
      '\t\tPreparedStatement stmt = sqlConnectionDriver.getStatement("UPDATE MYCLASS SET MYSTRING = ? WHERE PRIMARYKEY = ?");\n' +
      '\t\tstmt.setString(1, myString);\n' +
      '\t\tstmt.setInt(2, primaryKeySqlId);\n' +
      '\t\tstmt.execute();\n' +
      '\t\tsqlConnectionDriver.close();\n' +
      '\t}\n' +
      '\n' +
      '\t// Deletes from MyClass table\n' +
      '\tpublic void delete() throws Exception {\n' +
      '\t\tPreparedStatement stmt = sqlConnectionDriver.getStatement("DELETE FROM MYCLASS WHERE PRIMARYKEY = ?");\n' +
      '\t\tstmt.setInt(1, primaryKey);\n' +
      '\t\tstmt.execute();\n' +
      '\t\tsqlConnectionDriver.close();\n' +
      '\t}\n' +
      '};'
    )
  })

  var errorEntity = {}

  var exampleEntity = {
    entityId: '2320d162-337f-494b-a944-9e776045dc50',
    entityName: 'MyClass',
    package: 'org.warmachine.ironworks.generated.MyClass',
    dataFields: [
      {
        fieldType: 'INT',
        fieldName: 'primaryKey',
        primaryK: true,
        notNull: false
      },
      {
        fieldType: 'STRING',
        fieldName: 'myString',
        primaryK: false,
        notNull: false
      }
    ]
  }

  it('creates java class from entity', function () {
    var parser = new java.EntityParser(errorEntity)
    expect(function () {
      return parser.getData()
    }).toThrow()

    var parsedClass = new generator.JavaGenerator(exampleEntity).getCode()['data']
    expect(parsedClass).toEqual(exampleClass.toString())
  })
})
