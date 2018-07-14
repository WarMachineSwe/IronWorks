function OperationClick() {

    function setOpsDataField() {
        /**
         * Save the datafield of a specified entity
         * */
        $('#salvaDF').on('click', function () {
            if (controlSaveDF()) {
                msg('Successfully saved', 'You have saved your information about this entity.');
            }
        });

        /**
         * If you click the button "Close" you close the entity description
         * */
        $('#annullaDF').on('click', function () {
            $('#descrizioneEntity').hide()
        })

        /**
         * Function to delete any data fields selected through the checkbox
         * It work only with the view but it used the DB (STEFANO)
         */
        $('#minus').on('click', function () {
            var counter = 0;
            var elementToRemove = 0; // number of elements to remove

            while (counter < INDEXDF) {
                if (document.getElementById('' + counter) !== null) {
                    if (document.getElementById('checkbox' + counter).checked === true) {
                        // update of the local storage obj
                        var aux = db.get('entities');
                        document.getElementById('' + counter).remove();
                        aux[searchIndexById(document.getElementById('idEntity').value)].dataFields.splice(counter - elementToRemove, 1);
                        db.set('entities', aux);
                        elementToRemove++
                    }
                }
                counter++
            }
        })

        /**
         * Create new datafield where insert some information on entity
         * */
        $('#plus').on('click', function () {
            var nuovoDF = document.createElement('div');
            nuovoDF.setAttribute('id', '' + indexDF);
            nuovoDF.setAttribute('class', 'data-content form-group form-inline');

            var checkboxCanc = document.createElement('input');
            checkboxCanc.setAttribute('id', 'checkbox' + indexDF);
            checkboxCanc.setAttribute('class', 'form-check-input position-static');
            checkboxCanc.type = 'checkbox';
            nuovoDF.appendChild(checkboxCanc);

            var scope = document.createElement('label');
            scope.setAttribute('id', 'textScopeDF' + indexDF);
            scope.setAttribute('class', 'label');
            var scopeText = document.createTextNode('Scope:');
            scope.appendChild(scopeText);
            nuovoDF.appendChild(scope);

            var scopeSelect = document.createElement('select');
            scopeSelect.setAttribute('id', 'scopeDF' + indexDF);
            scopeSelect.setAttribute('class', 'form-control');

            var scopeOption1 = document.createElement('option');
            var scope1 = document.createTextNode('private');
            scopeOption1.appendChild(scope1);
            scopeSelect.appendChild(scopeOption1);

            var scopeOption2 = document.createElement('option');
            var scope2 = document.createTextNode('package');
            scopeOption2.appendChild(scope2);
            scopeSelect.appendChild(scopeOption2);

            var scopeOption3 = document.createElement('option');
            var scope3 = document.createTextNode('protected');
            scopeOption3.appendChild(scope3);
            scopeSelect.appendChild(scopeOption3);

            var scopeOption4 = document.createElement('option');
            var scope4 = document.createTextNode('public');
            scopeOption4.appendChild(scope4);
            scopeSelect.appendChild(scopeOption4);

            nuovoDF.appendChild(scopeSelect);

            var tipo = document.createElement('label');
            tipo.setAttribute('id', 'typeDF' + indexDF);
            tipo.setAttribute('class', 'label');
            var tipoText = document.createTextNode('Tipo:');
            tipo.appendChild(tipoText);
            nuovoDF.appendChild(tipo);

            var tipoSelect = document.createElement('select');
            tipoSelect.setAttribute('class', 'form-control');
            tipoSelect.setAttribute('id', 'tipoDF' + indexDF);

            var tipoOption1 = document.createElement('option');
            var tipo1 = document.createTextNode('INT');
            tipoOption1.appendChild(tipo1);
            tipoSelect.appendChild(tipoOption1);

            var tipoOption2 = document.createElement('option');
            var tipo2 = document.createTextNode('DOUBLE');
            tipoOption2.appendChild(tipo2);
            tipoSelect.appendChild(tipoOption2);

            var tipoOption3 = document.createElement('option');
            var tipo3 = document.createTextNode('CHAR');
            tipoOption3.appendChild(tipo3);
            tipoSelect.appendChild(tipoOption3);

            var tipoOption4 = document.createElement('option');
            var tipo4 = document.createTextNode('STRING');
            tipoOption4.appendChild(tipo4);
            tipoSelect.appendChild(tipoOption4);

            var tipoOption5 = document.createElement('option');
            var tipo5 = document.createTextNode('BOOL');
            tipoOption5.appendChild(tipo5);
            tipoSelect.appendChild(tipoOption5);

            var tipoOption6 = document.createElement('option');
            var tipo6 = document.createTextNode('SHORT');
            tipoOption6.appendChild(tipo6);
            tipoSelect.appendChild(tipoOption6);

            var tipoOption7 = document.createElement('option');
            var tipo7 = document.createTextNode('BYTE');
            tipoOption7.appendChild(tipo7);
            tipoSelect.appendChild(tipoOption7);

            var tipoOption8 = document.createElement('option');
            var tipo8 = document.createTextNode('LONG');
            tipoOption8.appendChild(tipo8);
            tipoSelect.appendChild(tipoOption8);

            var tipoOption9 = document.createElement('option');
            var tipo9 = document.createTextNode('FLOAT');
            tipoOption9.appendChild(tipo9);
            tipoSelect.appendChild(tipoOption9);

            var tipoOption10 = document.createElement('option');
            var tipo10 = document.createTextNode('DECIMAL');
            tipoOption10.appendChild(tipo10);
            tipoSelect.appendChild(tipoOption10);

            var tipoOption11 = document.createElement('option');
            var tipo11 = document.createTextNode('DATE');
            tipoOption11.appendChild(tipo11);
            tipoSelect.appendChild(tipoOption11);

            nuovoDF.appendChild(tipoSelect);

            var nome = document.createElement('label');
            nome.setAttribute('id', 'textNameDF' + indexDF);
            nome.setAttribute('class', 'label');
            var nomeText = document.createTextNode(' Nome:');
            nome.appendChild(nomeText);
            nuovoDF.appendChild(nome);

            var nomeIn = document.createElement('input');
            nomeIn.setAttribute('id', 'nameDF' + indexDF);
            nomeIn.setAttribute('class', 'form-control');
            nomeIn.type = 'text';
            nuovoDF.appendChild(nomeIn);

            var primaryKey = document.createElement('label');
            primaryKey.setAttribute('class', 'label');
            primaryKey.setAttribute('id', 'primaryKeyDF' + indexDF);
            var primaryKeyText = document.createTextNode('Primary Key:');
            primaryKey.appendChild(primaryKeyText);
            nuovoDF.appendChild(primaryKey);

            var cb = document.createElement('input');
            cb.setAttribute('class', 'form-control');
            cb.setAttribute('id', 'primaryDF' + indexDF);
            cb.type = 'checkbox';
            nuovoDF.appendChild(cb);

            document.getElementById('dataField').appendChild(nuovoDF);

            indexDF++;

            if (indexDF === 20) {
                dim = indexDF + 20
            }
            if (indexDF < dim && indexDF % 2 === 0) {
                $('#descrizioneEntity').css({'height': 20 + indexDF * 5 + 'em'})
            }
        });
    }


    /**
     * On double click of an canvas' element you haveto show his entity description
     * */
    PAPER.on('cell:pointerdblclick', function (cell) {
        if (isEntity(cell)) {
            $('#descrizioneEntity').show();
            showEntityData(searchIdByCell(cell));
        }
    });


    /**
     * Creates event clickers to reset, save, open and generate
     */
    function setOpsOnClick() {
        $('#reset').on('click', function () {
            //Delete all elements in graph
            GRAPH.clear()

            //I don't know (STEFANO)
            var counter = 0
            if (DB.get('entities')) {
                counter = DB.get('entities').length
            }
            while (counter !== 0) {
                var aux = DB.get('entities')
                aux.pop()
                DB.set('entities', aux)
                counter--
            }

            //Delete all data field
            resetDataField();
            indexDF = 0;

            $('#descrizioneEntity').hide()

            //With this you can open a file without message
            DB.set('change', false)
        });

        // Generate json to download
        $('#save').on('click', function () {
            if (saveFile()) {
                DB.set('change', false);
                return;
            }
            msg('Error while saving', 'Please try again.')
        });

        // close error message (all type of message)
        $('#error-ok').on('click', function () {
            $('#error-msg').hide(); //ATTENZIONE: dovrei eliminare
            $('body').css({'overflow-y': 'scroll'});
            $('.delete').show()
        });

        // open a file json
        $('#open').on('click', function () {
            if (reloadPage(DB.get('change'), 'Are you sure you want to open another project?')) {
                document.getElementById('get_file').click();
                document.getElementById('get_file').addEventListener('change', function (evt) {
                    if (!openJsonFile(evt)) {
                        msg('Wrong file', 'You have uploaded a wrong file.')
                    }
                    else {
                        DB.set('change', false)
                    }
                }, false);
            }
        });

        //Close this project but if there is something that you haven't saved, the page signal it
        $('#close').on('click', function () {
            window.location.href = 'index.html'
            DB.clear()
        })

        // post codegen
        $('#generate').on('click', function () {
            var dataToSend = JSON.stringify({'entities': generateJSON()}) // todo test
            var req = new XMLHttpRequest()
            req.open('POST', '/codegen', true)
            req.onreadystatechange = handleCodegenResponse
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8') // enable json
            req.send(dataToSend)
        })
    }


    /**
     * Creates event clickers to reset and save label of links
     */
    function setSaveDelOnClick() {
        // Chiude la finestra di inserimento label
        $('#del-label').on('click', function (e) {
            e.preventDefault()
            e.stopPropagation()
            $('#window-label').hide()
            $('body').css({'overflow-y': 'scroll'})
            $('#name-label').css({'border-color': '#ced4da'})
            $('#name-label').val('')
            $('.delete').show()
        })

        // Salva quanto inserito nella label e la inserisce su etichetta
        $('#save-label').on('click', function (e) {
            e.preventDefault()
            e.stopPropagation()

            if ($('#name-label').val()) {
                $('#window-label').hide()
                $('body').css({'overflow-y': 'scroll'})
                $('.delete').show()

                // inserire la modifica dell'etichetta
                linkLabel.model.label(0, {
                    position: 0.5,
                    attrs: {
                        rect: {fill: 'white'},
                        text: {text: $('#name-label').val()}
                    }
                })
                $('#name-label').val('')
            } else {
                $('#name-label').css({'border-color': 'red'})
            }
        })
    }

    setOpsDataField();
    setOpsOnClick();
    setSaveDelOnClick();

}

OperationClick();
