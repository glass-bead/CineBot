/* SOME AUXILIARY METHODS USED IN THE BOT COMMANDS */


// Search for movie name in database
async function search(movieName) {
    const url = global.url_init + movieName + global.apikey;

    const response = await fetch(url).then(res => res.json()).then(async function(response) { 
        return response; 
    });

    return response;
}

module.exports = {
    search   
};