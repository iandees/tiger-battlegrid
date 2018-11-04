'use strict';

var tileReduce = require('@mapbox/tile-reduce');
var path = require('path');

tileReduce({
  zoom: 12,
  map: path.join(__dirname, '/map.js'),
  sources: [
    {name: 'osm', mbtiles: path.join('/mnt/osmqa', 'united_states_of_america.mbtiles'), raw: true},
    {name: 'tiger', mbtiles: path.join('/mnt/osmqa', 'tiger2018_tiles.mbtiles'), raw: true}
  ]
})
.on('reduce', function(num) {
})
.on('end', function() {
});
