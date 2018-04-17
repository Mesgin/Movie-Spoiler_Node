const request = require('request')
const cheerio = require('cheerio')
const readlineSync = require('readline-sync')

console.log(`\nWelcome, I'm a Movie Spoiler Robot\n`)

let movieTitle = readlineSync.question('Which movie do you want me to spoil for you? ')
while (!movieTitle) {
    console.log('You should specify a name')
    movieTitle = readlineSync.question('Which movie do you want me to spoil for you? ')
}

let spoilerTime = readlineSync.question('In how many seconds do you want me to do this? ')
while (spoilerTime < 0) {
    console.log('Time should be a positive number')
    spoilerTime = readlineSync.question('In how many seconds do you want me to do this? ')
}

let googleSearchUrl = `https://www.google.ca/search?q=${movieTitle}+movie`

request(googleSearchUrl, function (err, response, body) {
    if (err) console.log(err)

    let $ = cheerio.load(body)
    let googleResults = []

    $('#res h3.r').each(function (i, elem) {
        googleResults[i] = $(this).text()
    });

    request(`https://api.themoviedb.org/3/search/movie?api_key=d730ddf7f4c9229a1877979dcfa57302&query=${movieTitle}`, function (err, response, data) {
        const dataObject = JSON.parse(data)

        if (dataObject.results.length === 0) {
            console.log(`\nThere is no movie with this title: ${movieTitle}\n`)
        } else {
            console.log(`\n**Spoiler Warning** about to spoil the movie "${movieTitle.toUpperCase()}" in ${spoilerTime} seconds`)
            
            let messageBeforeSpoil = googleResults.join('\n');
            
            console.log(`\n${messageBeforeSpoil}`)

            setTimeout(function () {
                console.log(`\nSpoiler : \n ${dataObject.results[0].overview}\n`)
            }, spoilerTime * 1000)
        }
    })

})