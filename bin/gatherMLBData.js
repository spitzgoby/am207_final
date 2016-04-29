"use strict";
// node packages
const fs = require('fs');
// MLB API modules
const gamesAPI = require('mlbgames');
const playersAPI = require('mlbplayers');
const startersAPI = require('mlbprobablepitchers');
// Local stat calculation modules
const hitting = require('./hitting');
const pitching = require('./pitching');
const winningpercentage = require('./winningpercentage');
// Integer array creation
const range = require('./range');
// MLB season dates for data pulling
const dates = require('./dates.json');
    
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
var dir = '../data/';

var apiDates = [];
dates.forEach(function(season) {
  var year = season.year;
  season.months.forEach(function(month) {
    range.create(month.firstDay,month.lastDay+1).forEach(function(day) {
      if (day < 10) day = '0'+day;
      apiDates.push({
        fileName: dir + year +'_'+ month.month +'_'+ day +'.json',
        games: 'year_'+ year +'/month_'+ month.month +'/day_'+ day +'/',
        players: 'year_'+ year +'/month_'+ month.month +'/day_'+ day +'/',
        matchups: year +'/'+ month.month +'/'+ day
      });
    });
  });
});

// start the whole process running
processDate(apiDates, 0);

function processDate(apiDates, index) {
  if (index < apiDates.length) {
    gatherData(apiDates[index], index);
  } else {
    Console.log('Finished gathering data');
  }
}

function gatherData(apiDate, index) {
  console.log('--------------------------------------------------------------');
  console.log('Gathering data for: '+ apiDate.matchups);
  
  // create mlb and data objects
  console.log(apiDate);
  var mlbgames = new gamesAPI({ path: apiDate.games });
  var mlbplayers = new playersAPI({ path: apiDate.players });
  var games, players, matchups;
  var count = 0; // async counter
  
  // make api requests
  console.log('Gathering games data...')
  mlbgames.get(function(err, data) {
    if (err) {
      handleAPIError(err, index);
    }
    else {
      console.log('Games data retrived');
      games = data;
      count += 1;
    }
    if (count == 3) {
      wrangleData(games, players, matchups, apiDate.fileName);
      processDate(apiDates, index+1);
    }
  });
  
  console.log('Gathering players data...');
  mlbplayers.get(function(err, data) {
    if (err) {
      handleAPIError(err, index);
    }
    else {
      console.log('Players data retrieved');
      players = data;
      count += 1;
    }
    if (count == 3) {
      wrangleData(games, players, matchups, apiDate.fileName);
      processDate(apiDates, index+1);
    }
  });
  
  console.log('Gathering pitching matchups data...');
  startersAPI.get(apiDate.matchups, function(err, data) {
    if (err) {
      handleAPIError(err, index);
    }
    else {
      console.log('Pitching matchups data retrieved');
      matchups = data;
      count += 1;
    }
    if (count == 3) {
      wrangleData(games, players, matchups, apiDate.fileName);
      processDate(apiDates, index+1);
    }
  });
}

function handleAPIError(err, index) {
  if (err.code === 'ECONNRESET') {
    // connection was reset, continue gathering data at current location
    processDate(apiDates, index);
  } else {
    console.error(err);
  }
}

function wrangleData(games, players, matchups, fileName, index) {
  console.log('Cleaning data and wrangling into proper format...');
  var rosters = hitting.buildRosters(players);
  var pitchers = pitching.buildPitcherMap(players);
  
  var gamesStats = [];
  games.forEach(function(game, i) {
    if (game.linescore) {
      var matchup = matchups[i];
      // if (matchup.id !== game.id) {
      //   for (var i = 0; i < matchups.length; i++) {
      //     if (matchups[i].id === game.id) {
      //       matchup = matchups[i];
      //       break;
      //     }
      //   }
      // }
      
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
    }
  });
  
  fs.writeFile(fileName, JSON.stringify(gamesStats));
}