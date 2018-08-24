//todo non riesco a trovare un modo per assegnare la funzione come parametro
/*
describe('addNewEmptyDataField',function () {
    var eem=new EditorEventsManager()
    it('tries to add new empty dataField',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        var test=eem.addNewEmptyDataField(2,'omg',eem.addNewEmptyDataFieldForEntity)
        expect(test).toBeDefined()
    })
})
*/

describe('countCurrentDataFields',function () {
    var eem=new EditorEventsManager()
    it('tries to count current data Fields',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        expect(eem.countCurrentDataFields()).toBe(2)
    })
})

describe('currentlyEditedElementId', function () {
    var eem=new EditorEventsManager()
    it('tries to get currently edited elementId',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        var idEntity=document.getElementById('idEntity').value
        expect(idEntity).toBe(eem.currentlyEditedElementId())
    })
});

describe('createNewEmptyDataFieldForEntity',function () {
    var eem=new EditorEventsManager()
    it('tries to get new entity empty field',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        var el=eem.addNewEmptyDataFieldForEntity()
        expect(el).toBeDefined()
    })
})

describe('createNewEmptyDataFieldForControl',function () {
    var eem=new EditorEventsManager()
    it('tries to get new entity empty field',function () {
        document.body.innerHTML = __html__['spec/client/subControlTruthy_spec.html']
        var el=eem.addNewEmptyDataFieldForControl()
        expect(el).toBeDefined()
    })
})

/*
describe('updateControlData',function () {
    var eem=new EditorEventsManager()
    it('tries to update control data false',function () {
        document.body.innerHTML = __html__['spec/client/subControlTruthy_spec.html']
        var id=eem.currentlyEditedElementId()
        expect(eem.updateControlData(id)).toBeFalsy()
    })
})
*/