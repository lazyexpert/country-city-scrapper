var http = require('http')

module.exports = function(url, callback) {
  var cb = function(res) {
    var str = ''

    //another chunk of data has been recieved, so append it to `str`
    res.on('data', chunk => str += chunk )

    //the whole response has been recieved, so we just print it out here
    res.on('end', () => callback(null, str))
  }

  http.get(url, cb).on('error', err => callback(err) )
}
