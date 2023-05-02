/* SOME AUXILIARY METHODS USED IN THE BOT COMMANDS */
const js = require('jsonfile');

// Checks if value exists in array
function exists(data, search) {
    return data.findIndex(object => { return object[0].Title === search; });
}

// Search for movie name in database
async function search(movieName) {
    const url = global.url_init + movieName + global.apikey;

    const response = await fetch(url).then(res => res.json()).then(async function(response) { 
        return response; 
    });

    return response;
}

// Check if file exists. If not, creates file
function createFile(file){
    const data = {
        "watchlist": [],
        "movieRole": '',
        "pollTime": 60000,
        "winner": ""
    }

    js.writeFileSync(file, data, { spaces: 2 });

}

module.exports = {
    exists,
    search,
    createFile   
};