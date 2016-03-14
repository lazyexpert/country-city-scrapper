var get = require('./modules/getPage')
var parser = require('./modules/parser')
var db = require('./modules/dbDriver')

var async = require('async')

COUNTRIES = []
FUNCTIONS = []

get("http://geo.koltyrin.ru/eng_country_list.php", function(err, data) {
  if(err) throw err

  // Parse html for country list
  COUNTRIES = parser.getCountryList(data)


  COUNTRIES.forEach( countryName => {

    // addCountry to database
    db.addCountry(countryName)

    // Collect functions for async
    FUNCTIONS.push( callback =>
        get("http://geo.koltyrin.ru/city.php?country=" + countryName, function(err, data) {
          if(err) return callback(err)

          parser.getCityList(data)
            .forEach(cityName => db.addCity(cityName, countryName, callback) )

        }))

  })

  // Execute async functions
  async.parallel(FUNCTIONS, () => console.log("finished") )

})
