module.exports = {

  getCountryList : function(html) {
    return html.match(/<p>(.*)<\/p>/)[1]
      .split("</a>")
      .filter(el => /href/.test(el))
      .map( el => el.match(/eng_.*country=([^']+)/)[1] )
  },

  getCityList : function (html) {
    return html.match(/weight:bold;'>([^<]+|[\s\S]+)/g)
      .map( city => city.match(/>(.*)/)[1])
  }
}
