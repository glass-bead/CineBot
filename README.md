# CineBot ![GitHub repo size](https://img.shields.io/github/repo-size/glass-bead/CineBot?logo=Github&&style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/glass-bead/CineBot?logo=Github&&style=flat-square)

![](https://github.com/glass-bead/CineBot/blob/main/assets/kirby_popcorn.png?raw=true)

This project is a Discord Bot written in JavaScript that helps server members organize movie nights. With this bot, users can search movies and add them to the watchlist. They can also create pools for voting and schedule movie nights with reminders!

## Technologies Used

This bot is built using a variety of technologies, including:

* [Discord.js](https://discord.js.org/): A powerful and flexible library for interacting with the Discord API (version 14.10.2)
* [Node.js](https://nodejs.org/en/about): A popular server-side JavaScript runtime (version 18.16.0)
* [npm](https://nodejs.dev/en/learn/an-introduction-to-the-npm-package-manager/): Standard package manager for Node.js (version 9.6.5)
* [IMDB API](https://www.omdbapi.com/): RESTful web service that provides data of movies from IMDB.com, including movie specifications, posters, ratings, etc.
* [Discord Developer Portal](https://discord.com/developers/applications): a platform that provides tools and resources for developers to create and manage applications that integrate with the Discord platform

**Note:** This project was built using the above versions of the technologies. Please note that using different versions of the technologies may result in compatibility issues or unexpected behavior.
You can update the versions of these technologies by editing the `package.json` file and running `npm install` to install the updated packages.

## Installation and Usage

To install the bot, first clone the repository to your local machine. Next, navigate to the project directory and run `npm install` to install all dependencies. Finally, create a `.env` file and add your Discord bot token, client id and server id, as follows:

```bash
TOKEN = the discord bot token goes here
CLIENT_ID = the client id goes here
GUILD_ID = the server id goes here
```

Run the follow to register the commands:
```bash
node register_comands.js
```

Run the discord bot with: 
```bash
node index.js
```

Once the bot is online. Type `/` (slash) in any channel to see a list of available commands. You can use any of the following commands:
| Command | Description |
| --- | --- |
| /search `movie-name` | Looks up a movie and displays movie details. The movie is not added to the watchlist |
| /add `movie-name`  | Adds movie to the watchlist, if not already submitted. Confirmation needed. |
| /remove `movie-name` | Removes movie from the watchlist if it has it. Confirmation needed.|
| /list| Returns the full watchlist, including who submitted each movie|
| /host `movie-name` `hour` `minute` | Schedules a movie night at the set time. Members can vote if they want to participate in the session and are notified when the time comes. |
| /poll| Creates a poll of 10 or less movies randomly picked from the watchlist for members to vote on. |
|/set `role`| Sets a role to be mentioned when hosting a movie night. Uses @everyone by default. (Administrator only)|
|/set `pool-time`| Sets the timer for members to vote on the movies' poll. Set to 1 min by default. (Administrator only)|


*© Glass Bead 2023*
