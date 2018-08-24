/**
 * Models date and time under Unix
 * @param unixTimestampSeconds
 */
function UnixDateTime (unixTimestampSeconds) {
  if (unixTimestampSeconds < 0) {
    throw Error('Cannot parse negative timestamps')
  }

  this.unixTimestampMs = unixTimestampSeconds * 1000
  this.date = new Date(this.unixTimestampMs)
  var utcOffsetMinutes = this.date.getTimezoneOffset()
  this.utcDate = new Date(this.unixTimestampMs + utcOffsetMinutes * 60 * 1000)

  /**
   * Parses date and time
   * @return {{hours: number, minutes: string, seconds: string}} date and time
   */
  this.getTime = function () {
    var hours = this.utcDate.getHours()
    var minutes = '0' + this.utcDate.getMinutes()
    var seconds = '0' + this.utcDate.getSeconds()
    return {
      'hours': hours,
      'minutes': minutes.substr(-2),
      'seconds': seconds.substr(-2)
    }
  }

  /**
   * Parses date
   * @return {{day: string, month: string, year: number}} date
   */
  this.getDate = function () {
    var day = '0' + this.utcDate.getDate()
    var month = '0' + (parseInt(this.utcDate.getMonth()) + 1).toString()
    var year = this.utcDate.getFullYear()
    return {
      'day': day.substr(-2),
      'month': month,
      'year': year
    }
  }

  /**
   * Converts object to string representation
   * @returns {string} Class written in Java-like syntax
   */
  this.toString = function () {
    var time = this.getTime()
    var date = this.getDate()
    var out = date['year'] + '-' + date['month'] + '-' + date['day']
    out += ' ' + time['hours'] + ':' + time['minutes'] + ':' + time['seconds']
    return out
  }
}

module.exports = {
  'UnixDateTime': UnixDateTime
}
