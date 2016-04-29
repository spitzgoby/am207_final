var create = function(start, stop, step) {
  if (start && !stop) {
    console.log(stop);
    stop = start;
    start = 0;
  }
  
  if (!step) {
    step = 1;
  }
  
  var range = [];
  for (var i = start; i < stop; i += step) {
    range.push(i);
  }
  
  return range;
}

module.exports.create = create;