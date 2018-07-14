function UnixDateTime (unixTimestampSeconds) {
  if (unixTimestampSeconds < 0) {
    throw Error('Cannot parse negative timestamps')
  }

  this.unixTimestampMs = unixTimestampSeconds * 1000
  this.date = new Date(this.unixTimestampMs)
  var utcOffsetMinutes = this.date.getTimezoneOffset()
  this.utcDate = new Date(this.unixTimestampMs + utcOffsetMinutes * 60 * 1000)

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
