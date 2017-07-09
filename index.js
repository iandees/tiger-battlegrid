'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');

tileReduce({
  // bbox: [-87.8714, 41.7749, -87.4972, 41.9651],
  tiles: [[1144, 1583, 12]],
  zoom: 12,
  map: path.join(__dirname, '/map.js'),
  sources: [
    {name: 'osm', mbtiles: path.join('/Users/iandees/Downloads', 'united_states_of_america.mbtiles')},
    {name: 'tiger', mbtiles: path.join('/Users/iandees/Downloads', 'tiger_roads.mbtiles')}
  ]
})
.on('reduce', function(num) {
})
.on('end', function() {
});
