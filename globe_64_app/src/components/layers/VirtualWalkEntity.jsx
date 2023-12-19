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

    function setArrayHeadings() {
      for (var i = 0; i < arrayOfPositions.length - 1; i++) {
        const heading = getHeading(
          arrayOfPositions[i],
          arrayOfPositions[i + 1]
        );
        arrayHeadings.push(heading);
      }
    }

    function getHeading(cart1, cart2) {
      var CC3 = Cesium.Cartesian3;
      const CC3_0 = new CC3(0, 0, 0);
      let pathDir = new CC3();
      let temp = new CC3();
      let GD_transform = new Cesium.Matrix4();
      Cesium.Transforms.eastNorthUpToFixedFrame(
        viewer.scene.camera.position,
        viewer.scene.globe.ellipsoid,
        GD_transform
      );
      let east = new CC3(GD_transform[0], GD_transform[1], GD_transform[2]);
      let north = new CC3(GD_transform[4], GD_transform[5], GD_transform[6]);
      let up = new CC3(GD_transform[8], GD_transform[9], GD_transform[10]);
      //pathDir is 1st leg projected onto horizontal plane
      let ang;
      // if we have two identical coordinates passed in this will break, therefore this check
      // and in that case we are fine returning an angle of 0
      if (!CC3.equals(cart1, cart2)) {
        CC3.subtract(cart1, cart2, pathDir);

        CC3.normalize(pathDir, pathDir);
        let scale = CC3.dot(up, pathDir);
        CC3.multiplyByScalar(up, scale, temp);
        CC3.subtract(pathDir, temp, pathDir);
        ang = CC3.angleBetween(north, pathDir); //I assume always positive
      } else {
        ang = 0;
      }

      if (CC3.dot(east, pathDir) < 0) {
        ang *= -1;
      } //get sign of ang

      ang += Cesium.Math.PI;

      return ang; //in radians
    }

    function camLookAt(transform) {
      viewer.camera.lookAtTransform(
        transform,
        new Cesium.HeadingPitchRange(0, -Cesium.Math.PI_OVER_FOUR, 1000)
      );

      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }

    calcDistanceAndSpeed();
    createAnimationData();

    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(
      arrayOfPositions[0]
    );
    camLookAt(transform);

    setArrayHeadings(); //set heading for every position in arrayOfPositions

    var listener = viewer.clock.onTick.addEventListener(function (clock) {
      //i have no idea what this does compared to the camera settings below, in followCamera
      //here we do a viewer.zoomTo, and in followCamera we set the camera position
      //do a test to find out what does what and if one can be deleted!
      var curH = 0;
      var deltaH = 0;
      var nextH = 0;
      //compute index of arrayHeadings relative to clock currentTime
      var secs = Cesium.JulianDate.secondsDifference(
        clock.currentTime,
        clock.startTime
      );
      var i = Math.floor(arrayOfPositions.length * (secs / animationDuration));
      var virgule = (arrayOfPositions.length * (secs / animationDuration)) % 1;

      if (i < arrayHeadings.length) {
        curH = arrayHeadings[i];

        if (i < arrayHeadings.length - 1) {
          nextH = arrayHeadings[i + 1];
          deltaH = virgule * (nextH - curH);
        } else {
          nextH = 0;
          deltaH = 0;
        }
      }

      viewer
        .zoomTo(
          viewer.entities.getById("randopointidentifier"),
          new Cesium.HeadingPitchRange(
            curH + deltaH,
            -Cesium.Math.toRadians(45),
            animationAltitude
          )
        )
        .then((res) => {
          //console.log('zoomTo finished for', res, i, Cesium.Math.toDegrees(curH + deltaH));
        });
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
