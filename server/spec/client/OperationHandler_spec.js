describe('saveDataField',function () {
    var op=new OperationHandler()
    it('should save entity dataFields', function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        expect(op.saveDataFields()).toBeDefined();
    });
  // todo it('should\'nt save entity dataFields',function () {
  //     expect(op.saveDataFields()).toBeFalsy()
  // })
})

describe('removeSubControlFromScreen',function () {
    var op = new OperationHandler()
    it('should remove subControl', function () {
        document.body.innerHTML = __html__['spec/client/subControlTruthy_spec.html']
        var id = '1bb34ca5-3fb5-2f70-570e-97a2df56491a'
        expect(op.removeSubControlFromScreen(id)).toBeTruthy()
    })
})

describe('getControlData',function () {
    var op= new OperationHandler()
    it('should get controlData',function () {
        document.body.innerHTML = __html__['spec/client/subControlTruthy_spec.html']
        expect(op.getControlData()).toBeDefined()
    })
    it('shouldnt get controlData',function () {
        document.body.innerHTML = __html__['spec/client/subControlFalsy_spec.html']
        expect(op.getControlData()).toBeFalsy()
    })
})

describe('getLinkTools',function () {
    var op=new OperationHandler()
    it('should create partial tools',function () {
        expect(op.getLinkTools()).toBeDefined()
    })
    it('should create full tools',function () {
        expect(op.getFullLinkTools()).toBeDefined()

    })
})

//todo : mi da errore
/*
describe('saveFile',function () {
    var op=new OperationHandler()
    it('should save file',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']

        expect(op.saveFile()).toBeTruthy()
    })
})
*/
describe('exitApp', function () {
    var op=new OperationHandler()
    it('should exit from app',function () {
      var msg = 'stoUscendoDaQui'
        expect(op.exitApp(msg)).toBeFalsy()
    })
});
