import { GeoJsonDataSource } from "resium";
import * as Cesium from "cesium";

/*
This component is only intended to be used for adding "virtual walks" and therefore has functions specific for this. 

I would prefer to use 3Dtiles for the randonnees, because with the geojson approach i keep it all in memory. 3Dtiles however would imply tiling them with a true Z value 
created from my terrain data and that pipeline doesn't exist. Yet.
The alternative to clamp them to the ground clientside via tileset transform doesn't seem feasible from an accuracy point of view

So, this approach will most likely be changed to a 3Dtile-based one in the future, when the pipeline is up to the task
*/
function Geojsons({
  geoJsonLayers,
  visibilityStateGeoJson,
  viewRef,
  setRCoords,
  setWalk,
}) {
  let geojsons;
  //let walk = false;
  //const [walk, setWalk] = useState(false);
  //const [rCoords, setRCoords] = useState(null);
  if (visibilityStateGeoJson) {
    geojsons = geoJsonLayers.features.map((a) => {
      return (
        <GeoJsonDataSource
          data={a}
          show={visibilityStateGeoJson}
          key={a["id"]}
          clampToGround={true}
          onLoad={(g) => {
            const entities = g.entities.values;

            for (let i = 0; i < entities.length; i++) {
              const entity = entities[i];
              entity.polyline.classificationType =
                Cesium.ClassificationType.TERRAIN;
            }
            3;
            40;
          }}
          onClick={(e, t) => {
            console.log(t.id.properties.getValue(new Cesium.JulianDate()).id);
            console.log(geoJsonLayers);
            const rId = t.id.properties.getValue(new Cesium.JulianDate()).id;
            const rando = geoJsonLayers.features.find((r) => r.id === rId);
            console.log(rando);
            setRCoords(rando.geometry.coordinates[0]);
            setWalk(true);
          }}
        />
      );
    });
  }
  return geojsons;
}

export default Geojsons;
