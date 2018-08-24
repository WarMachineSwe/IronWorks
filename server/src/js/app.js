/**
 * Loads editor
 */
function loadEditor () {
  var hasLoadedGraph = DB.has('graph')
  if (!hasLoadedGraph) { // no graph in memory -> can load a new project
    DB.setup()

    var editorLoader = new EditorLoader()
    editorLoader.openProjectNameEditor()  // new name of project
  }

  editorLoader = new EditorLoader()
  editorLoader.setup()

  loadEventsEditor()
}

/**
 * Start app
 */
function start () {
  loadEditor()
  loadDragImages()
}

start()
