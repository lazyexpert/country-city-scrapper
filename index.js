const pmongo = require('promised-mongo');
const db = pmongo('skill', ['country', 'city']);

var get = require('./modules/getPage')
var async = require('async')

COUNTRIES = []
FUNCTIONS = []

get("http://geo.koltyrin.ru/eng_country_list.php", function(err, data) {
  if(err) throw err

  COUNTRIES = data
    .match(/<p>(.*)<\/p>/)[1]
    .split("</a>")
    .filter(el => /href/.test(el))
    .map( el => el.match(/eng_.*country=([^']+)/)[1] )

  // Collect functions for async
  COUNTRIES.forEach( name => {
    FUNCTIONS.push(
      function(callback) {
        get("http://geo.koltyrin.ru/city.php?country=" + name, function(err, data) {
          if(err) throw err

          db.country.insert({
            "name" : name
          })

          var country = data.match(/h1[^>]*>(.*)<\/h1/,'gmi')[1]
          var cities = data.match(/weight:bold;'>([^<]+|[\s\S]+)/g)
          cities.forEach(city => {
            var name = city.match(/>(.*)/)[1]

            if( name.length < 50 ){
              db.city.insert({
                "city" : name,
                "country" : country
              }).then(function(data) {
                callback(null)
              }).catch(function(err) {
                callback(err)
              })
            }
          })
        })
      }
    )
  })

  async.parallel(FUNCTIONS, function() {
    console.log("finished")
  })
})
