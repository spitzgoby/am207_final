// import for writing data to file 
var fs = require('fs');
// MLB API modules
var gamesAPI = require('mlbgames');
var playersAPI = require('mlbplayers');
var startersAPI = require('mlbprobablepitchers');
// Local stat calculation modules
var hitting = require('./hitting');
var pitching = require('./pitching');
var winningpercentage = require('./winningpercentage');
// Test data files
var games = require('./games.json');
var players = require('./players.json');
var matchups = require('./pitchers.json');
    
//
// sample desired data object
// {
//   home: {
//     team: "nya",
//     fip: 3.76,
//     era: 3.12,
//     avg: .264,
//     ops: .342,
//     win_pct: .479
//   },
//   away: {
//     team: "tex",
//     fip: 3.41,
//     era: 3.01,
//     avg: .278,
//     ops: .359,
//     win_pct: .505
//   },
//   x: 0
// }
// 

wrangleData();


function wrangleData() {
  console.log('Wrangling Data');
  
  var rosters = hitting.buildRosters(players);
  var pitchers = pitching.buildPitcherMap(players);
  
  var gamesStats = [];
  games.forEach(function(game, i) {
    var matchup = matchups[i];
    if (matchup.id !== game.id) {
      // find correct matchup
    }
    
    var win_pct = winningpercentage.calculateTeamWinningPercentages(game);
    var awayHitting = hitting.calculateTeamBattingStats(rosters[game.away_code]);
    var awayPitching = pitching.calculatePitchingStats(pitchers[matchup.pitchers.away.id]);
    var homeHitting = hitting.calculateTeamBattingStats(rosters[game.home_code]);
    var homePitching = pitching.calculatePitchingStats(pitchers[matchup.pitchers.home.id]);
    var gameStats = { 
      away:{
        team:game.away_code,
        win_pct: win_pct.away,
        avg: awayHitting.avg,
        ops: awayHitting.ops,
        era: awayPitching.era,
        fip: awayPitching.fip },
      home:{
        team:game.home_code,
        win_pct: win_pct.home,
        avg: homeHitting.avg,
        ops: homeHitting.ops,
        era: homePitching.era,
        fip: homePitching.fip },
      x: (+game.linescore.r.home > +game.linescore.r.away) ? 1 : 0 };
    gamesStats.push(gameStats);
  });
  console.log(gamesStats);
}