var fipConstant = 3.10; // approximate value, exact for 2014

var setFipConstant = function(constant) {
  fipConstant = constant;
}

var buildPitcherMap = function(players) {
  var pitcherMap = {};
  players.forEach(function(player) {
    var player = player.Player;
    if (player.type === 'pitcher') {
      pitcherMap[player.id] = player;
    }
  });
  
  return pitcherMap;
}

var calculatePitchingStats = function(player, year) {
  var season = player.season[0];
  return {
    fip: ((13 * +season.hr) + (3 * +season.bb) - (2 * +season.so))/+season.ip + fipConstant,
    era: +season.era
  };
}

module.exports.buildPitcherMap = buildPitcherMap;
module.exports.calculatePitchingStats = calculatePitchingStats;