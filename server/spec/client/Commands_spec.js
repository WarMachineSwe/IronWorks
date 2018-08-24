describe('clearAll', function () {
    var cmd=new Commands()
    GRAPH.addCell(new RobustnessModel().createElement('a'))
    GRAPH.addCell(new RobustnessModel().createElement('b'))
    it('clear graph',function () {
        cmd.clearAll()
        expect(countHowManyCells()).toBe(0)
    })
});
describe('displayContents',function () {
    var cmd=new Commands()
    GRAPH.addCell(new RobustnessModel().createElement('a'))
    GRAPH.addCell(new RobustnessModel().createElement('b'))
    it('backup Graph',function () {
        expect(cmd.getGraphBackup()).toBeDefined()
    })
    it('generate JSON',function () {
        expect(cmd.generateJSON()).toBeDefined()
    })
    it('db backup',function () {
        expect(cmd.getDbBackup()).toBeDefined()
    })
    it('getBackup',function () {
        expect(cmd.getBackup()).toBeDefined()
    })
    it('loadJsonTruthy',function () {
        document.body.innerHTML = __html__['spec/client/template_spec.html']
        var goodResult = {
            'result': '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":26,"magnet":true,"cx":33.5,"cy":50}},"position":{"name":"left","args":{"dx":22,"dy":-35}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"9ef61b89-318a-494e-9bd4-66756cee41a8","z":1,"attrs":{"image":{"xlink:href":"img/Actor.png"},"type":{"text":"a"},"text":{"text":"Actor"}}}]}\n' +
            'e58c0a52729b53b544c78cd30581cc74e47a7090fcc3f25216a300cc41b8a32860fe73ad31be18cab177b163607308a00ce0ba3858139cb74fb8fe851d7e121c\n' +
            '[]\n' +
            'b25b294cb4deb69ea00a4c3cf3113904801b6015e5956bd019a8570b1fe1d6040e944ef3cdee16d0a46503ca6e659a25f21cf9ceddc13f352a3c98138c15d6af'
        }
        expect(cmd.loadJson({'target': goodResult})).toBeUndefined()

    })
    it('loadJsonFalsy',function () {
        document.body.innerHTML = __html__['spec/client/template_spec.html']
        var badResult = {
            'result': '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":26,"magnet":true,"cx":33.5,"cy":50}},"position":{"name":"left","args":{"dx":22,"dy":-35}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"9ef61b89-318a-494e-9bd4-66756cee41a8","z":1,"attrs":{"image":{"xlink:href":"img/Actor.png"},"type":{"text":"a"},"text":{"text":"Actor"}}}]}\n' +
            'e59c0afre52729b53b544c78cd30581cc74e47a7090fcc3f25216a300cc41b8a32860fe73ad31be18cab177b163607308a00ce0ba3858139cb74fb8fe851d7e121c\n' +
            '[]\n' +
            'b25b294cb4deb69ea00a4c3cf3113904801b6015e5956bd019a8570b1fe1d6040e944ef3cdee16d0a46503ca6e659a25f21cf9ceddc13f352a3c98138c15d6af'
        }
        expect(cmd.loadJson({'target': badResult})).toBeFalsy()
    })
    it('readJson',function () {
        var goodSampleFile = '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"cx":35.8,"cy":54.2}},"position":{"name":"left","args":{"dx":18.3,"dy":-40}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"419549c5-09da-4071-9c07-02d96cbf3eb3","z":1,"attrs":{"image":{"xlink:href":"img/Entity.png"},"type":{"text":"e"},"text":{"text":"MarcondinoDiro"}}}]}\n' +
            'ab208fae4470804cebd9665b40cbecde0f456738993342222c51039c4f885fb2fbfe8db4f5f6205530e4d38592dfb1491c165fb8e1bc52d7fe952a0090e87825\n' +
            '[{"entityId":"419549c5-09da-4071-9c07-02d96cbf3eb3","package":"org.warmachine.ironworks.generated","entityName":"MarcondinoDiro","dataFields":[]}]\n' +
            '26d0994e3b812da7f84cf88d5e92307df3c7b2eddb2227dc7ea26e113850140e68854f884199fec13cb0e2fdd03df232e74ca61e00a163cd98ebf293ce45f22e'
        document.body.innerHTML = __html__['spec/client/template_spec.html']
        document.getElementById('goodTestInput').setAttribute('value', goodSampleFile)
        expect(cmd.readJsonFile({'target':{'files':[{'name': 'sample.json'}],'result':document.getElementById('goodTestInput').getAttribute('value')}})).toBeTruthy()
    })
})

describe('ValidateDataField',function () {
    var cmd=new Commands();
    it('checkDataFields',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        var attr=cmd.getDataFields();
        var newName = document.getElementById('entity-label').value
        var newPackage = document.getElementById('entity-package').value
        expect(cmd.validateDataFields(newName,newPackage,attr)).toBeTruthy()
    })
    it('checkDataFieldsF',function () {
        document.body.innerHTML = __html__['spec/client/entityBox_spec.html']
        var attr=cmd.getDataFields();
        var newName = document.getElementById('entity-label').value
        var newPackage = document.getElementById('entity-package').value
        expect(cmd.validateDataFields(newName,newPackage,attr)).toBeFalsy()

    })
    it('checkDataFieldsIter',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxFalsy_spec.html']
        var attr=cmd.getDataFields();
        var newName = document.getElementById('entity-label').value
        var newPackage = document.getElementById('entity-package').value
        expect(cmd.validateDataFields(newName,newPackage,attr)).toBeFalsy()
    })
})

describe('SaveDataField',function () {
    var cmd=new Commands()
    it('saveDataFieldsF', function () {
        document.body.innerHTML = __html__['spec/client/entityBox_spec.html']
        expect(cmd.saveDataFields()).toBeFalsy();
    })
    it('saveDataFieldsT',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        expect(cmd.saveDataFields()).toBeTruthy();
    })
})

describe('getRawDataField', function () {
    var cmd=new Commands();
    it('try to get raw data fields',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        expect(cmd.getRawDataFields().length).toBe(2);
    })
  // todo it('try to get empty raw data fields',function () {
  //     expect(cmd.getRawDataFields().length).toBe(0);
  // })
})

describe('getDataField', function () {
    var cmd=new Commands();
    it('try to get raw data fields',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        expect(cmd.getDataFields()).toBeDefined();
    })
})

describe('resetDataField',function () {
    var cmd=new Commands();
    it('reset data fields',function () {
        document.body.innerHTML = __html__['spec/client/entityBoxTruthy_spec.html']
        cmd.resetDataField()
        expect(document.getElementById('entity-package').value).toBe('');
    })
})

describe('subControllersFunction',function () {
  var cmd = new Commands()
    it('getSubControls',function () {
        document.body.innerHTML = __html__['spec/client/subControl_spec.html']
        expect(cmd.getSubControls().length).toBe(2)
    })
  // todo it('try to get empty subControls data fields',function () {
  //     expect(cmd.getSubControls().length).toBe(0);
  // })
    it('validateControlData',function () {
        document.body.innerHTML = __html__['spec/client/subControl_spec.html']
        var newName = document.getElementById('entity-label').value
        var subControls = cmd.getSubControls()
        expect(cmd.validateControlData(newName,subControls)).toBeFalsy()
    })
    it('validateControlDataTruthy',function () {
        document.body.innerHTML = __html__['spec/client/subControlTruthy_spec.html']
        var newName = document.getElementById('entity-label').value
        var subControls = cmd.getSubControls()
        expect(cmd.validateControlData(newName,subControls)).toBeTruthy()
    })
    it('validateControlDataFor',function () {
        document.body.innerHTML = __html__['spec/client/subControlFalsy_spec.html']
        var newName = document.getElementById('entity-label').value
        var subControls = cmd.getSubControls()
        expect(cmd.validateControlData(newName,subControls)).toBeFalsy()
    })
})

describe('toolsCreation',function () {
    var cmd=new Commands();
    it('createToolsList',function () {
        expect(cmd.createToolsList().length).toBe(4)
    })
    it('createTools',function () {
        expect(cmd.createTools()).toBeDefined()
    })
    it('createFullTools',function () {
        var tools=cmd.createFullTools()
        expect(tools).toBeDefined()
    })
})
