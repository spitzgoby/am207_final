
var fs = require('fs');
var mlbGame = require('mlbgames');
var mlbPlayer = require('mlbplayers');
var mlbprobablepitchers = require('mlbprobablepitchers');
var options = {
  path: 'year_2015/month_05/day_23/',
};

var mlbgame = new mlbGame(options);
var mlbplayer = new mlbPlayer(options);
// var mlbprobablepitchers = new mlbprobablepitchers(options);

// mlbprobablepitchers.get('2015/05/23', function(err, pitchers) {
//   fs.writeFile('pitchers.json', JSON.stringify(pitchers, null, 2));
// });

mlbgame.get(function(err, games) {
  fs.writeFile('games.json', JSON.stringify(games, null, 2));
});

// mlbplayer.get(function(err, players) {
//   fs.writeFile('players.json', JSON.stringify(players, null, 2));
// });