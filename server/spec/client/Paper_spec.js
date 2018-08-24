describe('create graph for editor', function () {
    it('returns a graph object', function () {
        var graph=createGraph();
        expect(graph).toBeDefined();
    })
})

describe('count the number of cells in graph',function () {
    it('returns the number of cells in graph',function () {
        var graph=createGraph();
        graph.addCell(new RobustnessModel().createElement('a'));
        graph.addCell(new RobustnessModel().createElement('b'));
        graph.addCell(new RobustnessModel().createElement('c'));
        expect(countHowManyCellInGraph(graph)).toBe(3);
    })
})

describe('count the number of cells in GRAPH,',function () {
    it('returns the number of cells in GRAPH ',function () {
        var cmd=new Commands()
        cmd.clearAll();
        GRAPH.addCell(new RobustnessModel().createElement('a'))
        expect(countHowManyCells()).toBe(1)
    })
})

describe('create canvas', function () {
    it('returns Paper',function () {
        expect(createCanvas()).toBeDefined()
    })
})
