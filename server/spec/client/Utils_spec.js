describe('guid', function () {
  it('creates a unique UUID', function () {
    expect(guid().length).toEqual(4 * 8 + 4)

    expect(function () {
      var list = []
      var bigN = 99
      for (var i = 0; i < bigN; i++) {
        var newGuid = guid()
        if (list.includes(newGuid)) {
          return false
        }
        list.push(newGuid)
      }

      return true
    }).toBeTruthy()
  })
})

describe('hash', function () {
  var goodHashPairs = {
    'hashingThis': 'de224501e232e75008a3fa1c55ac18e5816ee5edbff45ecd4e35c2a326a36c3d74321f09d1709cdec172a46e53bb8ff2c80ae96c1216d5259d3f93f75d443eff',
    'wow': '74c0f1e8aee1f831980e96d0a7772a05f4945500d4cbdaf19817c983b4404e7d949e1c90fcdbeacb6efc6f334fd22eb706f94b9ee45c4b9d6bad6e0a79c77cfd'
  }
  var badHashPairs = {
    'hashingThis': 'de22ff',
    'wow': '74c0f1e8a7cfd'
  }

  it('checks a valid hash', function () {
    expect(function () {
      for (var key in goodHashPairs) {
        if (!validateHash(key, goodHashPairs[key], CryptoJS.SHA512)) {
          return false
        }
      }

      return true
    }).toBeTruthy()

    expect(function () {
      for (var key in badHashPairs) {
        if (validateHash(key, badHashPairs[key], CryptoJS.SHA512)) {
          return false
        }
      }

      return true
    }).toBeTruthy()
  })
})

describe('file checker', function () {
  var goodResult = {
    'result': '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":26,"magnet":true,"cx":33.5,"cy":50}},"position":{"name":"left","args":{"dx":22,"dy":-35}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"9ef61b89-318a-494e-9bd4-66756cee41a8","z":1,"attrs":{"image":{"xlink:href":"img/Actor.png"},"type":{"text":"a"},"text":{"text":"Actor"}}}]}\n' +
    'e58c0a52729b53b544c78cd30581cc74e47a7090fcc3f25216a300cc41b8a32860fe73ad31be18cab177b163607308a00ce0ba3858139cb74fb8fe851d7e121c\n' +
    '[]\n' +
    'b25b294cb4deb69ea00a4c3cf3113904801b6015e5956bd019a8570b1fe1d6040e944ef3cdee16d0a46503ca6e659a25f21cf9ceddc13f352a3c98138c15d6af'
  }
  var badResult = {
    'result': '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":26,"magnet":true,"cx":33.5,"cy":50}},"position":{"name":"left","args":{"dx":22,"dy":-35}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"9ef61b89-318a-494e-9bd4-66756cee41a8","z":1,"attrs":{"image":{"xlink:href":"img/Actor.png"},"type":{"text":"a"},"text":{"text":"Actor"}}}]}\n' +
    'e59c0afre52729b53b544c78cd30581cc74e47a7090fcc3f25216a300cc41b8a32860fe73ad31be18cab177b163607308a00ce0ba3858139cb74fb8fe851d7e121c\n' +
    '[]\n' +
    'b25b294cb4deb69ea00a4c3cf3113904801b6015e5956bd019a8570b1fe1d6040e944ef3cdee16d0a46503ca6e659a25f21cf9ceddc13f352a3c98138c15d6af'
  }

  it('checks a valid file input', function () {
    expect(validateFileInput({
      'target': goodResult
    })).toBeTruthy()

    expect(validateFileInput({
      'target': badResult
    })).toBeFalsy()
  })
})

describe('load JSON', function () {
  var sampleJson = {
    'result': '{"cells":[{"type":"devs.RobustnessModel","position":{"x":971.546875,"y":157.609375},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"cx":35.8,"cy":54.2}},"position":{"name":"left","args":{"dx":18.3,"dy":-40}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"e4d24810-7dc6-4170-96ba-7c704ed37006","z":1,"attrs":{"image":{"xlink:href":"img/Entity.png"},"type":{"text":"e"},"text":{"text":"Entity"}}},{"type":"devs.RobustnessModel","position":{"x":410.546875,"y":157.609375},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"opacity":"0.5","cy":54.8,"cx":37}},"position":{"name":"left","args":{"dx":18,"dy":-36}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"cb2ec32e-51dc-4186-88a7-2b7dc41805ad","z":2,"attrs":{"image":{"xlink:href":"img/Control.png"},"type":{"text":"c"},"text":{"text":"Control"}}}]}\n' + '9638ef8e930806264d7888e8188081b2cd7c3c16ab6966fbfb4aeda04d3c69a27ad8c586302713b6c71d16a9a1488e7069f8842ab2272bf619f8162a7620da42}\n' + '{"data":{"entities":[{"entityId":"e4d24810-7dc6-4170-96ba-7c704ed37006","package":"org.warmachine.ironworks.generated","entityName":"Entity","dataFields":[]}],"controls":[{"id":"cb2ec32e-51dc-4186-88a7-2b7dc41805ad","name":"Control","sub":[]}]}}\n' + 'a3b8f7376ab76db89bdc2d81fc0f46bba2dc4313d9975a842a120c0aaf8775936d87f3072043fa640557a02a0b4a31b9d6aeebb89741776c46d508a86fd3d347'
  }

  it('the data storage contains the data from the sampleJSON', function () {
    loadJsonToDb({'target': sampleJson})
    var dbGraph = JSON.stringify(DB.get('graph'))
    var dbControls = JSON.stringify(DB.get('controls'))
    var dbEntities = JSON.stringify(DB.get('entities'))

    expect(dbGraph).toEqual('{"cells":[{"type":"devs.RobustnessModel","position":{"x":971.546875,"y":157.609375},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"cx":35.8,"cy":54.2}},"position":{"name":"left","args":{"dx":18.3,"dy":-40}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"e4d24810-7dc6-4170-96ba-7c704ed37006","z":1,"attrs":{"image":{"xlink:href":"img/Entity.png"},"type":{"text":"e"},"text":{"text":"Entity"}}},{"type":"devs.RobustnessModel","position":{"x":410.546875,"y":157.609375},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"opacity":"0.5","cy":54.8,"cx":37}},"position":{"name":"left","args":{"dx":18,"dy":-36}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"cb2ec32e-51dc-4186-88a7-2b7dc41805ad","z":2,"attrs":{"image":{"xlink:href":"img/Control.png"},"type":{"text":"c"},"text":{"text":"Control"}}}]}')

    expect(dbControls).toEqual('[{"id":"cb2ec32e-51dc-4186-88a7-2b7dc41805ad","name":"Control","sub":[]}]')

    expect(dbEntities).toEqual('[{"entityId":"e4d24810-7dc6-4170-96ba-7c704ed37006","package":"org.warmachine.ironworks.generated","entityName":"Entity","dataFields":[]}]')
  })

  var goodSampleFile = '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"cx":35.8,"cy":54.2}},"position":{"name":"left","args":{"dx":18.3,"dy":-40}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"419549c5-09da-4071-9c07-02d96cbf3eb3","z":1,"attrs":{"image":{"xlink:href":"img/Entity.png"},"type":{"text":"e"},"text":{"text":"MarcondinoDiro"}}}]}\n' +
    'ab208fae4470804cebd9665b40cbecde0f456738993342222c51039c4f885fb2fbfe8db4f5f6205530e4d38592dfb1491c165fb8e1bc52d7fe952a0090e87825\n' +
    '[{"entityId":"419549c5-09da-4071-9c07-02d96cbf3eb3","package":"org.warmachine.ironworks.generated","entityName":"MarcondinoDiro","dataFields":[]}]\n' +
    '26d0994e3b812da7f84cf88d5e92307df3c7b2eddb2227dc7ea26e113850140e68854f884199fec13cb0e2fdd03df232e74ca61e00a163cd98ebf293ce45f22e'

  var badSampleFile = '{"cells":[{"type":"devs.RobustnessModel","position":{"x":50,"y":50},"inPorts":[""],"outPorts":[""],"ports":{"groups":{"in":{"attrs":{"magnet":"passive",".port-label":{"fill":"#000"},".port-body":{"fill":"transparent","stroke":"none","r":30,"magnet":true,"cx":35.8,"cy":54.2}},"position":{"name":"left","args":{"dx":18.3,"dy":-40}},"label":{"position":{"name":"left","args":{"y":10}}}},"out":{"position":{"name":"right"},"attrs":{".port-label":{"fill":"#000"},".port-body":{"fill":"#fff","stroke":"#000","r":10,"magnet":true}},"label":{"position":{"name":"right","args":{"y":10}}}}},"items":[{"id":"","group":"in","attrs":{".port-label":{"text":""}}}]},"size":{"width":80,"height":80},"angle":0,"id":"419549c5-09da-4071-9c07-02d96cbf3eb3","z":1,"attrs":{"image":{"xlink:href":"img/Entity.png"},"type":{"text":"e"},"text":{"text":"MarcondinoDiro"}}}]}\n' +
    'ab208fae4470804cebd9665b40cbecde0f456738993342222c51039c4f885fb2fbfe8db4f5f6205530e4d38592dfb1491c165fb8e1bc52d7fe952a0090e87825\n' +
    '[{"entity":"419549c5-09da-4071-9c07-02d96cbf3eb3","package":"org.warmachine.ironworks.generated","entityName":"MarcondinoDiro","dataFields":[]}]\n' +
    '26d0994e3b812da7f84cf88d5e92307df3c7b2eddb2227dc7ea26e113850140e68854f884199fec13cb0e2fdd03df232e74ca61e00a163cd98ebf293ce45f22e'

  // goodSampleFile = JSON.parse(goodSampleFile)
  // badSampleFile = JSON.parse(badSampleFile)

  it('check if the passed file is valid', function () {
    document.body.innerHTML = __html__['spec/client/template_spec.html']

    document.getElementById('badTestInput').setAttribute('value', badSampleFile)
    document.getElementById('goodTestInput').setAttribute('value', goodSampleFile)
    //console.log(document.getElementById('badTestInput').getAttribute('value'))
    // todo expect(readJsonFileHP({'target':{'files':[{'name': 'sample.json'}],'result':document.getElementById('badTestInput').getAttribute('value')}})).toBe(false)
    // need to load a file to tests this
  })
})


describe('Control position of canvas and its length', function () {
    it('Should validate coordinates in reference to min and max', function () {
        expect(validateCoordinate(5,10,2)).toBe(5);
        expect(validateCoordinate(5,10,20)).toBe(10);
        expect(validateCoordinate(5,10,7)).toBe(7);
    });

    it('Should Validate position in reference to canvas', function () {
        document.body.innerHTML = __html__['spec/client/template_spec.html'];
        expect(validatePosition(document.getElementById('canvas'),5,10)).toBe(10);
    });

    it('Should validate position to canvas', function () {
        document.body.innerHTML = __html__['spec/client/template_spec.html'];
        expect(validatePositionToCanvas(10,5)).toBe(10);
    });
})

describe('Checks if candidate is a good name for a label', function () {
    it('should check if candidate is a good name for a label', function () {
        expect(isValidLabelName(null)).toBe(false);
        expect(isValidLabelName('prova')).toBe(true)

    })
});
/*
describe('Checks if the move to a page run', function () {
    beforeEach(function () {
        document.body.innerHTML = __html__['spec/client/misc_spec.html']
    })

    it('Clears app data and goes to path', function () {
      var button = document.getElementById('here');
      expect(button.click()).toBeUndefined();
    })

    it('Jumps to anchor', function () {
        var button = document.getElementById('there');
        expect(button.click()).toBeUndefined();
    })


})*/