// https://community.cesium.com/t/tracked-entity-camera-heading/10497/3
import { Entity, PolylineGraphics, PointGraphics } from "resium";
import { useMemo } from "react";
import * as Cesium from "cesium";
function VirtualWalkEntity({ rCoords, viewRef, walk, setWalk }) {
  console.log("ENTERING WALK");
  console.log(rCoords);
  const viewer = viewRef.current.cesiumElement;
  var positionProperty = new Cesium.SampledPositionProperty();
  var arrayOfPositions = null;
  var arrayHeadings = [];
  var animationDuration;
  var animationStart;
  var animationStop;
  var animationAltitude = 2;
  var totalDistance = 0;

  useMemo(() => {
    async function getZValues() {
      //we pick z-values for the walk from the actual terrain to avoid mismatch between z in walk and z on terrain
      const arrayCartographic = rCoords.map((coord) =>
        Cesium.Cartographic.fromDegrees(coord[0], coord[1])
      );
      const arrayPosTerrainLoaded = await Cesium.sampleTerrainMostDetailed(
        viewer.terrainProvider,
        arrayCartographic,
        true
      );

      arrayOfPositions = arrayPosTerrainLoaded.map((carto) => {
        const carte = Cesium.Cartographic.toCartesian(carto);
        return carte;
      });

      createAnimation();
    }
    getZValues();
  }, [rCoords]);
  function createAnimation() {
    function calcDistanceAndSpeed() {
      //calculate total distance of the walk + animationduration which essentially sets the speed
      //this approach implies that the vertices of the walks need to be equi...distansical
      //the test data is chopped in 5 m segments
      //but i will consider doing this clientside instead
      var lastPos = null;
      //calculate the totaldistance.
      for (var j = 0; j < arrayOfPositions.length; j++) {
        if (lastPos) {
          var d = Cesium.Cartesian3.distance(lastPos, arrayOfPositions[j]);

          totalDistance += d;
        }
        lastPos = arrayOfPositions[j];
      }
      //we set the walking speed to 25 km/h
      animationDuration = (totalDistance / 1000) * 144;
    }

    function createAnimationData() {
      //populate the SamplePositionProperty that is used to animate the walk with data
      //this is an object with a Time and a Position
      animationStart = Cesium.JulianDate.fromDate(new Date());
      animationStop = Cesium.JulianDate.addSeconds(
        animationStart,
        animationDuration,
        new Cesium.JulianDate()
      );

      let lastTime = null;
      let lastPos = null;

      for (var i = 0; i < arrayOfPositions.length; i++) {
        if (i === 0) {
          lastTime = animationStart;
          lastPos = arrayOfPositions[0];
        } else {
          let d = Cesium.Cartesian3.distance(lastPos, arrayOfPositions[i]);
          let stepTime = (d * animationDuration) / totalDistance;

          lastTime = Cesium.JulianDate.addSeconds(
            lastTime,
            stepTime,
            new Cesium.JulianDate()
          );

          lastPos = arrayOfPositions[i];
        }
        positionProperty.addSample(lastTime, lastPos);
      }
    }

    calcDistanceAndSpeed();
    createAnimationData();

    var listener = viewer.clock.onTick.addEventListener(function (clock) {
      followCamera();
    });

    var stopListener = viewer.clock.onStop.addEventListener(function (clock) {
      listener();

      viewer.clock.shouldAnimate = false;
      setWalk(false);

      stopListener();
    });

    // Add a reset button, for convenience.
    /* Sandcastle.addToolbarButton("Play", function () {
      viewer.clock.startTime = animationStart.clone();
      viewer.clock.stopTime = animationStop.clone();
      viewer.clock.currentTime = animationStart.clone();
  
      viewer.clock.shouldAnimate = true;
    });*/

    function followCamera() {
      var secs = Cesium.JulianDate.secondsDifference(
        viewer.clock.currentTime,
        viewer.clock.startTime
      );
      var slightlyBefore = Cesium.JulianDate.addSeconds(
        animationStart,
        secs - 0.2,
        new Cesium.JulianDate()
      );
      var now = Cesium.JulianDate.addSeconds(
        animationStart,
        secs,
        new Cesium.JulianDate()
      );

      var prevPos = new Cesium.Cartesian3();
      var currPos = new Cesium.Cartesian3();
      prevPos = positionProperty.getValue(slightlyBefore);
      currPos = positionProperty.getValue(now);

      if (currPos == undefined || prevPos == undefined) {
        console.log("a position is missing");
        return;
      }

      //vectors have to have magnitude, so these can't be equal
      if (
        currPos.x === prevPos.x &&
        currPos.y === prevPos.y &&
        currPos.z === prevPos.z
      ) {
        console.log("equal, can't get heading");
        return;
      }

      //make a rot mat
      var CC3 = Cesium.Cartesian3;
      var mydir = new CC3();
      mydir = CC3.subtract(currPos, prevPos, new CC3());
      CC3.normalize(mydir, mydir);
      var GC_UP = new CC3();
      CC3.normalize(viewer.scene.camera.position, GC_UP); //GC_UP
      var myrig = new CC3();
      var myup = new CC3();
      myrig = CC3.cross(mydir, GC_UP, new CC3());
      myup = CC3.cross(myrig, mydir, new CC3());

      CC3.multiplyByScalar(GC_UP, animationAltitude, GC_UP);
      CC3.add(GC_UP, currPos, currPos);
      CC3.subtract(
        currPos,
        CC3.multiplyByScalar(mydir, animationAltitude, new CC3()),
        currPos
      );
      viewer.scene.camera.position = currPos;

      viewer.scene.camera.direction = mydir;
      viewer.scene.camera.right = myrig;
      viewer.scene.camera.up = myup;
    }
    //setWalk(false);
    viewer.clock.startTime = animationStart.clone();
    viewer.clock.stopTime = animationStop.clone();
    viewer.clock.currentTime = animationStart.clone();
    viewer.clock.shouldAnimate = true;
  }

  return (
    <>
      <Entity>
        <PolylineGraphics
          positions={arrayOfPositions}
          width={5.0}
          material={
            new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 20,
            })
          }
        />
      </Entity>
      <Entity
        name={"point"}
        id={"randopointidentifier"}
        availability={
          new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start: animationStart,
              stop: animationStop,
            }),
          ])
        }
        position={positionProperty}
        orientation={new Cesium.VelocityOrientationProperty(positionProperty)}
      >
        {" "}
        <PointGraphics
          pixelSize={20}
          color={Cesium.Color.RED}
          outlineColor={Cesium.Color.BLACK}
          outlineWidth={10}
          heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
        />
      </Entity>
    </>
  );
}

export default VirtualWalkEntity;
