const GOOD_FILE_NAME_REGEX = new RegExp('^[A-Za-z0-9]{1,}$')
var cmd = new Commands()

/**
 * Loads editor
 */
function EditorLoader () {
  /**
   * Validates candidate for project name
   */
  this.canSetProjectName = function (candidate) {
    return GOOD_FILE_NAME_REGEX.test(candidate) && candidate.length > 0
  }

  /**
   * Sets name of project
   */
  this.setProjectName = function () {
    var name = DB.get('label', '')
    DB.set('outFile', name)
  }

  /**
   * Shows dialog to input project name and saves name
   */
  this.openProjectNameEditor = function () {
    var editor = new LabelsEditorButtonManager()
    editor.setup(this.canSetProjectName, this.setProjectName, false)

    var events = new EditorEventsManager()
    events.createTextInsert('Insert project\'s name')
  }

  this.setup = function () {
    $(window).on('load', function () {
      cmd.loadJsonFromDb() // read the json file if is open in home page
    })

    $(window).bind('beforeunload', function () {
      var hasChanged = DB.get('change', true)

      if (hasChanged) {
        DB.set('userWantsOut', true)

        setTimeout(function () { // executes this function when user presses 'cancel' in dialog (wants to stay in page)
          DB.set('userWantsOut', false)
        }, 1000)

        return 'Are you sure you want to leave?'
      }
    })
  }
}
