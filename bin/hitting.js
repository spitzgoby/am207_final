var buildRosters = function(players) {
  var teams = {};
  
  players.forEach(function(player) {
    var player = player.Player;
    
    if (player.type === 'batter') {
      var team = teams[player.team];
      
      if (!team) {
        team = [];
        teams[player.team] = team;
      }
      
      teams[player.team].push(player);
    }
  });
  
  return teams;
}

var calculateTeamBattingStats = function(team) {
  var teamAtBats = 0;
  var cumulativeAverage = 0;
  var cumulativeOPS = 0;
  team.forEach(function(player) {
    var season = player.season[0];
    ab = +season.ab;
    teamAtBats += ab;
    cumulativeAverage += (+season.avg * ab);
    cumulativeOPS += (+season.ops * ab);
  });
  
  return { avg: (cumulativeAverage / teamAtBats), ops: (cumulativeOPS / teamAtBats) };
}

module.exports.buildRosters = buildRosters;
module.exports.calculateTeamBattingStats = calculateTeamBattingStats;