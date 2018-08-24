/**
 * Clears app data and goes to path
 * @param path {string} URL to go to
 */
function goToPage (path) {
  DB.clear()
  DB.set('change', false)  // there has been no change in data
  window.location.href = path
}

/**
 * Jumps to anchor
 * @param anchor {string} URL to go to
 */
function jumpTo (anchor) {
  try {
    var top = document.getElementById(anchor).offsetTop
    window.scrollTo(0, top)
  } catch (error) {
  }
}

/**
 * Calculates averages of time spent generating user data
 */
function debugTimes () {
  var n_events = TIMER_DEBUG.length
  console.log('Found ' + n_events + ' events')
  var creationTime = {
    'min': Infinity,
    'max': 0,
    'average': 0
  }
  var serverTime = {
    'min': Infinity,
    'max': 0,
    'average': 0
  }
  var processingTime = {
    'min': Infinity,
    'max': 0,
    'average': 0
  }

  for (var i = 0; i < TIMER_DEBUG.length; i++) {
    var creation = TIMER_DEBUG[i]['sentAt'] - TIMER_DEBUG[i]['createAt'] // calculate
    var server = TIMER_DEBUG[i]['receivedAt'] - TIMER_DEBUG[i]['sentAt']
    var proc = TIMER_DEBUG[i]['processedAt'] - TIMER_DEBUG[i]['receivedAt']

    if (creation < creationTime['min']) {  // update min
      creationTime['min'] = creation
    }
    if (server < serverTime['min']) {
      serverTime['min'] = server
    }
    if (proc < processingTime['min']) {
      processingTime['min'] = proc
    }

    if (creation > creationTime['max']) {  // update max
      creationTime['max'] = creation
    }
    if (server > serverTime['max']) {
      serverTime['max'] = server
    }
    if (proc > processingTime['max']) {
      processingTime['max'] = proc
    }

    creationTime['average'] += creation / n_events // update average
    serverTime['average'] += server / n_events
    processingTime['average'] += proc / n_events
  }

  console.log('Time spent creating request:')
  console.log('min:     ' + creationTime['min'])
  console.log('average: ' + creationTime['average'])
  console.log('max:     ' + creationTime['max'])

  console.log('Time spent serving request:')
  console.log('min:     ' + serverTime['min'])
  console.log('average: ' + serverTime['average'])
  console.log('max:     ' + serverTime['max'])

  console.log('Time spent processing response:')
  console.log('min:     ' + processingTime['min'])
  console.log('average: ' + processingTime['average'])
  console.log('max:     ' + processingTime['max'])
}
