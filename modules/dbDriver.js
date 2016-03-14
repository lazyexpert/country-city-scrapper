const pmongo = require('promised-mongo');
const db = pmongo('skill', ['country', 'city']);


module.exports = {

  addCity : function(name, country, callback) {
    if( name.length < 50 )
      db.city.insert({
        "city" : name,
        "country" : country
      })
      .then(data => callback(null))
      .catch(err => callback(err))
  },

  addCountry : function(name) {
    db.country.insert({
      "name" : name
    })
    .then( data => console.log("Country added:" + name))
    .catch( err => console.log("Country add error: " + err))
  }
}
