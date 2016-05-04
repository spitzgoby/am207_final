// import file system for reading/writing data
var fs = require('fs');

// base directory for data files
var dir = '../data/';
// get all filenames in data directory
var dataFileNames = fs.readdirSync(dir);

// read each file and concat into larger array
var combinedData = [];
dataFileNames.forEach(function(fileName) {
  var games = JSON.parse(fs.readFileSync(dir+fileName, 'utf8'));
  console.log('Read: ', fileName);
  combinedData = combinedData.concat(games);
});
// write combined array to disk
fs.writeFile(dir+'combinedMLBData.json', JSON.stringify(combinedData), 'utf-8', function(err) {
  console.log(err);
});