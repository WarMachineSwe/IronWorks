function EditorLoad() {
    $(window).on('load', function () {
        //Read the json file if is open in home page
        if (DB.get('file')) {
            readDBJson()
        }

        DB.set('change', false);

    });

    $(window).on('beforeunload', function () {
        return 'Are you sure you want to reload this page?'
    });

}

EditorLoad();