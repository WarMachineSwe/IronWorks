function ElementHandler(){

    this.createActor = function(){
         graph.addCell(new RobustnessModel().createElement('a'))
    }

    this.createBoundary = function(){
         graph.addCell(new RobustnessModel().createElement('b'))
    }

    this.createController = function(){
         graph.addCell(new RobustnessModel().createElement('c'))
    }

    this.createEntity = function(){
        var obj = new RobustnessModel().createElement('e')

        graph.addCell(obj)

        var aux = db.get('entities')
        aux.push({
            'entityId': graph.getLastCell().id,
            'entityName': obj['_previousAttributes'].attrs.text.text,
            'entityScope': '',
            'dataFields': []
        })
        
        db.set('entities', aux)
        console.log(generateJSON())
    }

}