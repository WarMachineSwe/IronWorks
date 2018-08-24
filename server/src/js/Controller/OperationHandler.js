const CANVAS_OFFSET = 130
var cmd = new Commands()

function OperationHandler () {
  /**
   * Saves all entities to db
   * */
  this.saveDataFields = function () {
    try {
      return cmd.saveDataFields()
    } catch (error) {
      return false
    }
  }

  /**
   * Removes all sub-controllers from screen
   * @param id {string} id of parent controller
   * @return {boolean} true iff operation was successful
   */
  this.removeSubControlFromScreen = function (id) {
    try {
      var main = DB.getFromArray('controls', 'id', id, null)
      var newSub = [] // save to db

      if (main !== null && main['sub'].length > 0) {
        main['sub'].forEach(function (sub) { // for each sub-control
          var subCell = GRAPH.getCell(sub['id'])
          if (subCell && subCell !== null) {
            subCell.remove() // remove control
          }

          newSub.push({
            'name': sub['name'],
            'link': sub['link']
          })
        })
      }

      var newControls = DB.get('controls', []) // substitute
      for (var i = 0; i < newControls.length; i++) {
        if (newControls[i]['id'] === id) {
          newControls[i]['sub'] = newSub
        }
      }
      DB.set('controls', newControls)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * Gets controls data
   * */
  this.getControlData = function () {
    try {
      return cmd.getControlData()
    } catch (error) {
      return false
    }
  }

  /**
   * Control that what have you clicked is a Entity
   * */
  this.getLinkTools = function () {
    return cmd.createTools()
  }

  /**
   * Control that what have you clicked is a Entity
   * */
  this.getFullLinkTools = function () {
    return cmd.createFullTools()
  }

  /**
   * Control that GRAPH is populated and go to download return true for success and false for any kind of problem
   * */
  this.saveFile = function () {
    if (GRAPH) {
      var jsonString = cmd.getBackup()
      var filename = DB.get('outFile') + '.json'
      cmd.downloadText(jsonString, filename)
      return true
    }
    return false
  }

  /**
   * Create a message to say something about the editor:
   * you have a project open and want open another? Are you sure that you don't want save?
   * */
  this.exitApp = function (msg) {
    var message = msg + '\n\nPress Ok to continue or Cancel to stay on the current page.'
    return confirm(message)
  }
}
