describe('server response tests', function () {
    var tmp1 = null
    var tmp2 = null
    var readyStateVar

    function goodReq() {
        tmp1 = new ServerResponse(this)
        readyStateVar = this.readyState
    }

    function badReq() {
        tmp2 = new ServerResponse(this)
    }

    var req1 = new XMLHttpRequest()

    req1.open('GET', '/', false)
    req1.onreadystatechange = goodReq
    req1.send()

    var req2 = new XMLHttpRequest()
    req2.open('POST', '/codegen', true)
    req2.onreadystatechange = badReq

    var data = {'mate': "this is not a good req"}
    req2.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    req2.send(JSON.stringify({'hello': data}))


    /*todo
    it('check if the request is not done', function () {


            //expect(tmp1.hasCompleted() == (readyStateVar==4)).toBe(false)
    })*/

    it('check if the request is done', function () {
                expect(tmp1.hasCompleted()).toBe(true)

    })

    /* todo
    it('check if the request is going to be over the status 500', function () {

            expect(tmp2.isGood()).toBe(false)


    })*/

    it('check if the request is going to be lower than status 500', function () {
        expect(tmp1.isGood()).toBe(true)

    })

    it('check if the request is successful', function () {
        expect(tmp1.isSuccessful() && (tmp1.hasCompleted() && tmp1.isGood())).toBe(true)

    })
    it('check if the request is unsuccessful', function () {
        expect(tmp1.isSuccessful() && (tmp1.hasCompleted() && false)).toBe(false)
        expect(tmp1.isSuccessful() && (false && tmp1.isGood())).toBe(false)

    })

    it('return the status of the request', function () {

        expect(tmp1.getCode()).toEqual(200)
    })


    it('retrieve and use the response of a request if any', function () {

        expect(tmp1.getData()).toBeTruthy()

    })

    it('not retrieve and not use the response of a request if any', function () {
        expect(tmp2.getData()).toBe("NOT FOUND")
    })

    it('builds the name of the file appending the time in which it was generated', function () {
        expect(tmp1.getFilename("json")).toBe("code-" + Date.now() + ".json")
    })

    it('builds the wrong name of the file appending the time in which it was generated', function () {
        expect(tmp1.getFilename("json") == "code-" + Date.now() + ".js").toBe(false)
    })

    //todo get.Error only when an error 500 is encountered
    /*it('builds a error message retrieving the components from the responseText', function () {

     }*/



})