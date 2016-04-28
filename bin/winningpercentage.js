var calculateTeamWinningPercentages = function(game) {
  var homeWins = +game.home_win;
  var homeLosses = +game.home_loss;
  var awayWins = +game.away_win;
  var awayLosses = +game.away_loss;
  return { home: (homeWins/(homeWins+homeLosses)), away:(awayWins/(awayWins+awayLosses))};
}

module.exports.calculateTeamWinningPercentages = calculateTeamWinningPercentages;
