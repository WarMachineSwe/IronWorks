/**
 * Facade for the localStorage
 */
function LocalStorageFacade () {
  /**
   * Retrieves element in localstorage
   * @param key {string} key of element
   * @returns {null} || {obj} localstorage element
   */
  this.get = function (key) {
    try {
      var raw = localStorage.getItem(key)
      return JSON.parse(raw)
    } catch (error) {
      return null
    }
  }

  /**
   * Checks if localStorage has elements that match that key
   * @param key {string} key of element
   * @returns {boolean} true iff there is an obj with the key in the localstorage
   */
  this.has = function (key) {
    var result = this.get(key)
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
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Gets list of key in localStorage
   * @returns {Array} List of keys in localStorage
   */
  this.getAllKeys = function () {
    var keys = []
    for (var key in localStorage) {
      keys.push(key)
    }
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
      var array = this.get(key)
      array.push(value)
      this.set(key, value)
      return true
    } catch (error) {
      return false
    }
  }
}
