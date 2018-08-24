/**
 * Facade for the localStorage
 */
function LocalStorageFacade () {
  var self = this

  /**
   * Retrieves element in localstorage
   * @param key {string} key of element
   * @param out {obj} if simple retrieval fails, return this
   * @returns {null} || {obj} localstorage element
   */
  this.get = function (key, out) {
    try {
      var raw = localStorage.getItem(key)
      if (raw !== null) {
        return JSON.parse(raw)
      }

      throw raw
    } catch (error) {
      return out
    }
  }

  /**
   * Checks if localStorage has elements that match that key
   * @param key {string} key of element
   * @returns {boolean} true iff there is an obj with the key in the localstorage
   */
  this.has = function (key) {
    var result = this.get(key, null)
    return result !== null
  }

  /**
   * Sets obj to key in localStorage
   * @param key {string} key of element
   * @param value {obj} element to set
   * @returns {boolean} true iff set has completed successfully
   */
  this.set = function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Removes obj with key from localStorage
   * @param key {string} key of element
   * @returns {boolean} true iff removal has completed successfully
   */
  this.remove = function (key) {
    if (!this.has(key)) {
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Removes obj with key from localStorage
   * @param arrayKey key for array
   * @param comparisonKey key to compare elements
   * @param keyToRemove id of element to remove
   * @returns {boolean} true iff removal has completed successfully
   */
  this.removeFromArray = function (arrayKey, comparisonKey, keyToRemove) {
    try {
      var array = this.get(arrayKey, [])
      for (var i = 0; i < array.length; i++) {
        if (array[i][comparisonKey] === keyToRemove) {
          array.splice(i, 1)  // remove
        }
      }
      this.set(arrayKey, array)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Gets obj with key from localStorage
   * @param arrayKey key for array
   * @param comparisonKey key to compare elements
   * @param keyToGet id of element to get
   * @param out {obj} return this if error
   * @returns {obj} item of array
   */
  this.getFromArray = function (arrayKey, comparisonKey, keyToGet, out) {
    try {
      var array = this.get(arrayKey, [])
      for (var i = 0; i < array.length; i++) {
        if (array[i][comparisonKey] === keyToGet) {
          return array[i]
        }
      }

      return out
    } catch (error) {
      return out
    }
  }

  /**
   * Gets list of key in localStorage
   * @returns {Array} List of keys in localStorage
   */
  this.getAllKeys = function () {
    var keys = []
    Object.keys(localStorage).forEach(function (key) {
      keys.push(key)
    })
    return keys
  }

  /**
   * Clears localStorage
   * @returns {boolean} true iff clearing has completed successfully
   */
  this.clear = function () {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Appends item to array in localStorage
   * @param key {string} key of array
   * @param value {obj} item to append
   * @returns {boolean} true iff operation has completed successfully
   */
  this.appendToArray = function (key, value) {
    try {
      var array = this.get(key, [])
      array.push(value)
      this.set(key, array)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Adds value to array in localStorage
   * @param key {string} key of array
   * @param value {obj} value to add
   * @returns {boolean} true iff operation has completed successfully
   */
  this.addToNum = function (key, value) {
    try {
      var num = Number(this.get(key, 0))
      this.set(key, num + value)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Setups main keyscan
   */
  this.reset = function () {
    this.clear()
    this.set('graph', {}) // joint graph
    this.set('entities', []) // list of entities in graph
    this.set('controls', []) // list of controls in graph
    this.set('userWantsOut', false)  // use wants to exit app
    this.set('change', false) // user has edited the project
    this.set('outFile', 'ironworks') // project output filename
    this.set('label', '') // current label name
  }

  /**
   * Setups main keys
   */
  this.setup = function () {
    this.reset()
  }

  /**
   * Shows localStorage content
   */
  this.showContents = function () {
    this.getAllKeys().forEach(function (key) {
      var value = self.get(key, '')
      console.log('%c' + key + '%c: ' + value, 'color:red', 'color:white')
    })
  }
}

var DB = new LocalStorageFacade() // local storage driver
