describe('models the saving of a String as project name',function() {

    var ed = new EditorLoader()


    it('evaluates if the passed String is valid',function() {
        expect(ed.canSetProjectName("pippo")).toBe(true)
        expect(ed.canSetProjectName("")).toBe(false)
        expect(ed.canSetProjectName("dsja_][dw")).toBe(false)
    })

    it('set the name of the project',function() {
        DB.set('label','pippo')
        ed.setProjectName()
        expect(DB.get('outFile')).toBe('pippo')
    })

    //todo openProjectNameEditor && setup
    

})