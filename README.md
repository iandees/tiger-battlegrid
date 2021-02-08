# TIGER Battlegrid

A reimplementation of the now-defunct [TIGER / OSM "Battlegrid" map](https://wiki.openstreetmap.org/wiki/TIGER_Battlegrid) using tile-reduce and [OSM QA Tiles](https://osmlab.github.io/osm-qa-tiles/).

This project consumes [TIGER roads vector tiles](https://github.com/iandees/tiger-tiles), the United States [OpenStreetMap QA Tiles](https://osmlab.github.io/osm-qa-tiles/) extract, and matches them. The resulting GeoJSON output represents segments that exist in TIGER but don't exist in OpenStreetMap. This output could be useful in finding areas of the map that haven't been mapped yet. It could also indicate TIGER data that is erroneous (because OSM has been more recently updated).

## Refreshing the layer

### Get fresh data

1. Download the source data as a couple mbtiles files:

   ```
   mkdir -p /mnt/osmqa
   curl -L https://hot-qa-tiles.s3.amazonaws.com/latest.country/united_states_of_america.mbtiles.gz | gzip -dc > /mnt/osmqa/united_states_of_america.mbtiles
   curl -L https://s3.amazonaws.com/data.openstreetmap.us/tiger2020_expanded_roads.mbtiles > /mnt/osmqa/tiger2020_tiles.mbtiles
   ```

### Install software

1. Get the source code if you haven't already:

   ```
   cd /tmp
   curl -L https://github.com/iandees/tiger-battlegrid/archive/master.tar.gz | tar zxf -
   cd tiger-battlegrid-master/
   ```

1. Install tippecanoe:

   ```
   sudo apt-get install libsqlite3-dev zlib1g-dev
   cd /tmp
   curl -L https://github.com/mapbox/tippecanoe/archive/1.34.3.tar.gz | tar zxf -
   cd tippecanoe-1.34.3/
   make -j$(nproc)
   sudo make install
   ```

1. Install Node and NPM:

   ```
   sudo apt-get update
   sudo apt-get install -y npm python-is-python3
   ```

1. Fix Ubuntu/npm/node-sqlite3 problems:

   ```
   sudo npm install --global node-gyp@latest
   npm config set node_gyp $(npm prefix -g)/lib/node_modules/node-gyp/bin/node-gyp.js
   ```

1. Install Node dependencies:

   ```
   npm install
   ```

### Create a new tileset

1. Run the matching process and pipe it through Tippecanoe to generate an mbtiles dataset:

   ```
   mkdir /mnt/osmqa/tmp

   node index.js | \
   tippecanoe \
       --no-line-simplification \
       --buffer=0 \
       --read-parallel \
       --temporary-directory=/mnt/osmqa/tmp \
       --maximum-zoom=12 \
       -o /mnt/osmqa/missing_tiger.mbtiles
   ```

### Upload the tileset to Mapbox

1. Install [Mapbox command line tools](https://github.com/mapbox/mapbox-cli-py)

   ```
   sudo apt-get install -y python3-pip
   pip3 install --user mapboxcli
   ```

1. Create a new [access token](https://www.mapbox.com/account/access-tokens) with all "uploads" permissions. Save the access token (you won't see it again) locally. Treat it like a password and don't share it with anyone.

1. Store the access token for the Mapbox command line interface.

   ```
   export MAPBOX_ACCESS_TOKEN=<secret_token>
   ```

1. Upload the tileset to Mapbox, replacing the existing dataset.

   ```
   ~/.local/bin/mapbox upload tiger2020-delta /mnt/osmqa/missing_tiger.mbtiles
   ```
