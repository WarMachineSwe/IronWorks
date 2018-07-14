function Commands() {

    /**
     * Displays JSON parsed in diagram
     * @param json {string} JSON file
     */
    function displayContents (json) {
        graph.clear() // pulizia preventiva per evitare che rimangano elementi html in canvas
        graph.fromJSON(json)
    }


    /**
     * Read a file that is uploaded in db .
     * It is used to open a file that is opened in homepage.
     * */
     function readdbJson() {
        var json = JSON.parse(db.get('file'))
        if (db.get('code')) {
            var entityUploaded = JSON.parse(db.get('code'))
            db.set('entities', entityUploaded)
        }
        displayContents(json)
        db.remove('file')
        db.remove('code')

    }

    /**
     * Read a file that is uploaded in db .
     * It is used to open a file that is opened in index.
     *
     * Fetches JSON file
     * @param evt {event} Event holding file
     */
     function readJsonFile(evt) {
        var file = evt.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                var parti = evt.target.result.split('\n');
                if (CryptoJS.SHA512(parti[0]) != parti[1] || CryptoJS.SHA512(parti[2]) != parti[3]) {
                    return false;
                }
                var jsonG = JSON.parse(parti[0]);
                var entityUploaded = JSON.parse(parti[2]);

                displayContents(jsonG);
                db.set('entities', entityUploaded)
            }
            reader.readAsText(file)
        }
        return true;
    }


    /**
     * This function must clear our db.entities where
     * we have saved all information about the persistent entity
     * */
    function resetDataField() {
        var counter = 0

        while (counter < INDEXDF) {
            document.getElementById('' + counter).remove()
            counter++
        }
    }

    /**
     * You can save all data field of the entity that now has been opened.
     * All the information is put in db.
     * */
    function saveDataField() {
        // add a new record of the entity at the bottom of the array
        var aux = db.get('entities')
        var idToRemove = searchIndexById(document.getElementById('idEntity').value)
        // save the data of any data field created in a var to be copied in the local storage
        var counter = 0
        // count the valid attributes element
        var countDF = 0
        var tmpDF = []

        while (counter < INDEXDF) {
            // check either the attributes of counter index was removed or not
            if (document.getElementById('' + counter) !== null) {
                tmpDF[countDF] = {fieldScope: '', fieldType: '', fieldName: '', primaryK: ''}
                tmpDF[countDF].fieldScope = document.getElementById('scopeDF' + counter).value
                tmpDF[countDF].fieldType = document.getElementById('tipoDF' + counter).value
                tmpDF[countDF].fieldName = document.getElementById('nameDF' + counter).value
                tmpDF[countDF].primaryK = document.getElementById('primaryDF' + counter).checked
                countDF++
            }
            counter++
        }

        aux.push({
            'entityId': document.getElementById('idEntity').value,
            'entityName': aux[idToRemove].entityName,
            'entityScope': document.getElementById('scopeEntity').value,
            'dataFields': tmpDF
        })
        // search the index to the previous entity cell in the local storage array to remove
        aux.splice(idToRemove, 1)
        // update the local storage with the new data of the entity
        db.set('entities', aux)
    }


    /**
     * Generates custom JSON for server
     * @returns {Array} List of attributes of entitites
     */
    function generateJSON () {
        var entities = [] // obj to send that cointains all attribute of entities
        var length = 0
        if(db.get('entities')) {
            length = db.get('entities').length
        }
        for (var i = 0; i < length; i++) {
            entities[i] = {
                'entityId' : db.get('entities')[i].entityId,
                'entityName': db.get('entities')[i].entityName,
                'entityScope': db.get('entities')[i].entityScope,
                'dataFields': db.get('entities')[i].dataFields
            }
        }

        return entities
    }


    /**
     * Matches the entityID with the cell id clicked
     * @param cell {joint.cell} cell clicked by the user
     * @returns {number} the index of the cell of local storage array
     */
    function searchIdbyCell (cell) {
        var counter = 0
        var aux = db.get('entities')
        while (cell.model.id !== aux[counter].entityId) {
            counter++
        }
        return counter
    }

    /**
     * Finds the index of the local storage array to update or delete
     * @param Id {int} id passed through the box
     * @returns {number} index of the cell of the local storage array which match the Id
     */
    function searchIndexById (Id) {
        var counter = 0
        var aux = db.get('entities')
        while (Id !== aux[counter].entityId) {
            counter++
        }
        return counter
    }
}