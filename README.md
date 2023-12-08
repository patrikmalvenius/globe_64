# globe_64

CesiumJS/Resium

Application for visualization of 3D-data. Currently supports configuring of available 3D-tiles, background maps (draped over terrain) and WMS (draped over terrain). Users can change WMS in-app. Should work genreally but only tested on IGN WMS + MapServer (WMS must be able to serve in 4326)
Terrain is, alas, hardcoded in code, not in config. 
You can have several parellell configs, set config in appConfig.json. Also includes basic tools for measuring (elevation on ground, distance between points). Search French adresses through BAN API. DragDrop KML, GeoJson, CZML (do you have any CZML?)

## Work in progress: 

* Add "virtual tour" of hiking paths

## Work not yet in progress

* Bundle app with backend to create basic data for the app (terrain, 3D-tiles)
* DragDrop 3D-models (think it would work already if you have CZML) (implementation details highly unknown. Which kind of models? OBJ? Georeferenced or interface for georeferencing?)

