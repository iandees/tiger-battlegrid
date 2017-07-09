'use strict';

var gju = require('geojson-utils');
var createRuler = require('cheap-ruler');
var tilebelt = require('@mapbox/tilebelt');

module.exports = function(data, tile, writeData, done) {
    var osm_highway_only = data.osm.osm.features.filter(function(f) {
        return f.properties.highway && (
            f.properties.highway == 'residential' ||
            f.properties.highway == 'secondary' ||
            f.properties.highway == 'primary' ||
            f.properties.highway == 'tertiary' ||
            f.properties.highway == 'motorway' ||
            f.properties.highway == 'motorway_link')
    });

    data.osm.osm.features.forEach(function(f) {
        if (f.properties.highway && (
            f.properties.highway == 'residential' ||
            f.properties.highway == 'secondary' ||
            f.properties.highway == 'primary' ||
            f.properties.highway == 'tertiary' ||
            f.properties.highway == 'motorway' ||
            f.properties.highway == 'motorway_link')) {

            var feature = {
                type: "Feature",
                properties: {
                    "highway": f.properties['highway'],
                    "stroke": "#ff0000",
                    "stroke-width": 4
                },
                geometry: f.geometry
            }
            writeData(JSON.stringify(feature) + '\n');
        }
    });

    var tiger_highway_only = data.tiger.tiger_roads.features.filter(function(f) {
        return f.properties.MTFCC && (
            f.properties.MTFCC == 'S1100' ||
            f.properties.MTFCC == 'S1200' ||
            f.properties.MTFCC == 'S1400' ||
            f.properties.MTFCC == 'S1630')
    });

    data.tiger.tiger_roads.features.forEach(function(f) {
        if (f.properties.MTFCC &&
           (f.properties.MTFCC == 'S1100' ||
            f.properties.MTFCC == 'S1200' ||
            f.properties.MTFCC == 'S1400' ||
            f.properties.MTFCC == 'S1630')) {

            var feature = {
                type: "Feature",
                properties: {
                    "mtfcc": f.properties['MTFCC'],
                    "stroke": "#0000ff",
                    "stroke-width": 2
                },
                geometry: f.geometry
            }
            writeData(JSON.stringify(feature) + '\n');
        }
    });

    var ruler = createRuler.fromTile(tile[1], tile[2]);

    var osm_length = 0.0;
    osm_highway_only.forEach(function(way) {
        var len = ruler.lineDistance(way.geometry.coordinates);
        if (len > 0) {
            osm_length += len;
        }
    });

    var tiger_length = 0.0;
    tiger_highway_only.forEach(function(way) {
        var len = ruler.lineDistance(way.geometry.coordinates);
        if (len > 0) {
            tiger_length += len;
        }
    });

    // console.log({'tile': tile, 'osm': osm_length, 'tiger': tiger_length})

    done(null, {'osm': osm_length, 'tiger': tiger_length});
};
