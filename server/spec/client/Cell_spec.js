describe('models the features  allowed on a Cell',function() {

   var el = new ElementHandler().createActor()
    var cell = new Cell(GRAPH.getLastCell())


    it('gets the linked value to the name passed to the method',function() {
        expect(cell.getAttr("text/text")).toBe("Actor")
        expect(cell.getAttr("attr")).toBeUndefined()
    })

    it('sets the attribute value with the passed value',function() {
        cell.setAttr("text/text","pippo")
        expect(cell.getAttr("text/text")).toEqual("pippo")
    })

    it('gets the type of the element wrapped in the cell',function() {
        expect(cell.getCellType()).toBe("a")
        expect(cell.getCellType() == "e").toBe(false)
    })

    it('gets the name of the element',function() {
        expect(cell.getAttr("text/text")).toBe("pippo")
    })

    it("sets a new name for the element wrapped in the cell",function() {
        cell.setNewName("ApplicationComponent")
        expect(cell.getAttr("text/text")).toEqual("ApplicationComponent")
        expect(cell.getAttr("text/text") == "Actor").toBe(false)
    })

    it("gets the full name of the element wrapped in the cell",function() {
        expect(cell.getFullCellType()).toBe("actor")
        expect(cell.getFullCellType() == "entity").toBe(false)
    })

    it("check if the element wrapped is a entity",function() {
        el=new ElementHandler().createEntity()
        cell = new Cell(GRAPH.getLastCell())
        expect(cell.isEntity()).toBe(true)
        expect(cell.isControl()).toBe(false)
        expect(cell.getFullCellType()).toBe('entity')
    })

    it("check if the element wrapped is a control",function() {
        el=new ElementHandler().createControl()
        cell = new Cell(GRAPH.getLastCell())
        expect(cell.isEntity()).toBe(false)
        expect(cell.isControl()).toBe(true)
        expect(cell.getFullCellType()).toBe('control')
    })

    it("check if the element wrapped is a model",function() {
        el=new ElementHandler().createBoundary()
        cell = new Cell(GRAPH.getLastCell())
        expect(cell.getFullCellType()).toBe('boundary')
        expect(cell.isModel()).toBe(true)
        cell.setAttr("type/text","l")
        expect(cell.isModel()).toBe(false)
        expect(cell.getFullCellType()).toBe('')
    })

    it("check if the function getCellName() give the right name",function() {
        el=new ElementHandler().createControl()
        cell = new Cell(GRAPH.getLastCell())
        expect(cell.getCellName()).toBe("Control")
    })


})

describe("models a request to find a specified cell by passing an id value through the canvas",function() {
    it("gets a cell from GRAPH passing his id",function() {
        new ElementHandler().createEntity()
        var id = GRAPH.getLastCell().id
        expect(getCanvasCellById(id)).toBe(GRAPH.getLastCell())
        new ElementHandler().createControl()
        expect(getCanvasCellById(id) == GRAPH.getLastCell()).toBe(false)
    })
})

describe("models a request to find a cell by passing an id through the Cell class",function() {
    it("gets a cell by passing his id",function() {
        new ElementHandler().createEntity()
        var id = GRAPH.getLastCell().id
        expect(getCellById(id)).toBeTruthy()
        new ElementHandler().createControl()
        var id2 = GRAPH.getLastCell().id
        expect(getCellById(id) == getCellById(id2)).toBe(false)
    })
})