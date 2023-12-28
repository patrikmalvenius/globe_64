import * as Cesium from "cesium";

import {
  Viewer,
  Scene,
  Globe,
  CameraFlyHome,
  ImageryLayerCollection,
} from "resium";
import Tilesets from "./layers/Tilesets";
import WmsLayers from "./layers/WmsLayers";
import WmtsBaseLayer from "./layers/WmtsBaseLayer";
import Geojsons from "./layers/Geojsons";
import { CustomEventHandlers } from "./eventhandlers/CustomEventHandlers";
import VirtualWalkEntity from "./layers/VirtualWalkEntity";
import { forwardRef, useRef } from "react";

const ViewerComponent = forwardRef(function ViewerComponent(
  {
    leftClickAction,
    setLeftClickAction,
    removeMeasures,
    setAddedEntity,
    rCoords,
    setWalk,
    tileLayers,
    visibilityStateTile,
    tilesetLoaded,
    geoJsonLayers,
    visibilityStateGeoJson,
    setRCoords,
    dummyCredit,
    appConfig,
    visibilityStateWms,
    wmtsBaseLayers,
    visibilityStateWmtsBaselayer,
    walk,
    mapConfig,
  },
  ref
) {
  const collectionRef = useRef();

  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
  return (
    <Viewer
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      ref={ref}
      creditContainer={dummyCredit}
      terrainProvider={undefined}
      //infoBox={false} - this needs to be kept on because other code (not investigated deeper) depends on it. = replace with similar
      baseLayerPicker={false}
      imageryProvider={false}
      baseLayer={false}
      geocoder={false}
      animation={false}
      timeline={false}
      homeButton={false}
      fullscreenButton={false}
      navigationHelpButton={false}
      scene3DOnly={true}
      requestRenderMode={false} //substitute this with true + rerender viewer ref in useeffect on visibilityState ?
      maximumRenderTimeChange={"Infinity"}
    >
      {" "}
      <CustomEventHandlers
        viewRef={ref}
        leftClickAction={leftClickAction}
        setLeftClickAction={setLeftClickAction}
        removeMeasures={removeMeasures}
        setAddedEntity={setAddedEntity}
      ></CustomEventHandlers>
      <Scene
        pickTranslucentDepth={true}
        useDepthPicking={true}
        sun={new Cesium.Sun()}
        skyAtmosphere={new Cesium.SkyAtmosphere()}
      />
      <Globe depthTestAgainstTerrain={true} />
      {walk ? (
        <VirtualWalkEntity viewRef={ref} rCoords={rCoords} setWalk={setWalk} />
      ) : null}
      <Tilesets
        tileLayers={tileLayers}
        visibilityStateTile={visibilityStateTile}
        tilesetLoaded={tilesetLoaded}
      />
      <Geojsons
        geoJsonLayers={geoJsonLayers}
        visibilityStateGeoJson={visibilityStateGeoJson}
        setWalk={setWalk}
        setRCoords={setRCoords}
      />
      <ImageryLayerCollection ref={collectionRef}></ImageryLayerCollection>
      <WmsLayers
        wmsUrl={appConfig ? appConfig["configs"][mapConfig].wms.url : null}
        visibilityStateWms={visibilityStateWms}
        collectionRef={collectionRef}
        setAddedEntity={setAddedEntity}
      />
      <WmtsBaseLayer
        wmtsBaseLayers={wmtsBaseLayers}
        visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
        collectionRef={collectionRef}
      />
      <CameraFlyHome duration={0}></CameraFlyHome>
    </Viewer>
  );
});
export default ViewerComponent;
