function OperationHandler() {

    /**
     * It control that db exists and do the save of all entities*/
    function controlSaveDF() {
        if (db.get('entities')) {
            saveDataField();
            return true
        }
        return false
    }


    /**
     * It is the function that is used to show any type of message (error or not)
     * */
    function msg(title, message) {
        var msgToSignal = document.createElement('div');
        msgToSignal.setAttribute('class', 'overlay');
        msgToSignal.setAttribute('id', 'error-msg');

        var content = document.createElement('div');
        content.setAttribute('id', 'error-msg-content');
        msgToSignal.appendChild(content);

        var textTitle = document.createElement('h3');
        textTitle.appendChild(title);
        content.appendChild(textTitle);

        var textMsg = document.createElement('p');
        textMsg.appendChild(message);
        content.appendChild(textMsg);

        var button = document.createElement('button');
        button.setAttribute('class', 'btn btn-outline-secondary');
        button.setAttribute('id', 'error-ok');
        var buttonText = document.createTextNode('OK');
        button.appendChild(buttonText);
        content.appendChild(button);

        $('body').css({'overflow': 'hidden'})
        $('.delete').hide()
        $('#error-msg').show()
    }


    /**
     * Loads inner data of entity in entity box
     * @param index {int} entity index
     */
    function showEntityData(index) {
        resetDataField();
        var aux = db.get('entities'); // parse result
        document.getElementById('idEntity').value = aux[index].entityId;// todo cannot set property of null
        document.getElementById('nomeEntity').value = aux[index].entityName;
        document.getElementById('scopeEntity').value = aux[index].entityScope;

        if (aux[index].dataFields !== null) {
            indexDF = 0;
            var counter = 0;
            while (counter < aux[index].dataFields.length) {
                $('#plus').click();
                document.getElementById('scopeDF' + counter).value = aux[index].dataFields[counter].fieldScope;
                document.getElementById('tipoDF' + counter).value = aux[index].dataFields[counter].fieldType;
                document.getElementById('nameDF' + counter).value = aux[index].dataFields[counter].fieldName;
                document.getElementById('primaryDF' + counter).checked = aux[index].dataFields[counter].primaryK;

                counter++
            }

            indexF = aux[index].dataFields.length
        } else {
            indexDF = 0
        }
    }

    /**
     * Control that what have you clicked is a Entity
     * */
    function isEntity(cell) {
        if(cell.model.attr('type/text') === 'e')
            return true;
        return false;
    }


    /**
     * Control that graph is populated and go to download return true for success and false for any kind of problem
     * */
    function saveFile() {
        if (graph) {
            var jsonString = JSON.stringify(graph.toJSON()) + '\n' + JSON.stringify(generateJSON());
            var filename = 'myDiagram.json';
            downloadText(jsonString, filename);
            return true
        }
        return false
    }

    /**
     * It is only a way to create a link between model and view
     * */
    function openJsonFile(evt) {
        return readJsonFile(evt)
    }

}