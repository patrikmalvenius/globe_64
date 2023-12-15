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
  var pointEntity = null;
  var lastCurrentTime = null;
  var polyEntity = null;
  var arrayPos;
  var animationDuration;
  var animationStart;
  var animationStop;
  var animationAltitude = 300;
  var totalDistance = 0;

  useMemo(() => {
    async function getZValues() {
      const arrayCartographic = rCoords.map((coord) =>
        Cesium.Cartographic.fromDegrees(coord[0], coord[1])
      );
      console.log("arrayCartographic", arrayCartographic);
      const arrayPosTerrainLoaded = await Cesium.sampleTerrainMostDetailed(
        viewer.terrainProvider,
        arrayCartographic,
        true
      );

      arrayPos = arrayPosTerrainLoaded.map((carto) => {
        const carte = Cesium.Cartographic.toCartesian(carto);
        return carte;
      });
      console.log("arrayPosarrayPosarrayPos", arrayPos);
      console.log(
        "wantrthis",
        Cesium.Cartesian3.fromDegreesArray([-115.0, 37.0, -107.0, 33.0])
      );
      doAllTogether();
    }
    getZValues();
  }, [rCoords]);
  function doAllTogether() {
    function addPolyline() {
      //var arrayPos = rCoords; //rCoords must be x,y only, i e geojson = 2D

      arrayOfPositions = arrayPos; //Cesium.Cartesian3.fromDegreesArrayHeights(
      // arrayPos.flat()
      // );

      var lastPos = null;
      //calculate the totaldistance. we need this to....?
      for (var j = 0; j < arrayOfPositions.length; j++) {
        if (lastPos) {
          var d = Cesium.Cartesian3.distance(lastPos, arrayOfPositions[j]);

          totalDistance += d;
        }
        lastPos = arrayOfPositions[j];
      }
      //we set the walking speed to 25 km/h
      animationDuration = (totalDistance / 1000) * 144;
      console.log("totalDistance", totalDistance);
      console.log("animationDuration", animationDuration);
    }

    function addPointEntity() {
      animationStart = Cesium.JulianDate.fromDate(new Date());
      animationStop = Cesium.JulianDate.addSeconds(
        animationStart,
        animationDuration,
        new Cesium.JulianDate()
      );

      var lastTime = null;
      var lastPos = null;
      var heading = 0;

      for (var i = 0; i < arrayOfPositions.length; i++) {
        if (i === 0) {
          lastTime = animationStart;
          lastPos = arrayOfPositions[0];
        } else {
          var d = Cesium.Cartesian3.distance(lastPos, arrayOfPositions[i]);
          var stepTime = (d * animationDuration) / totalDistance;

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
      var heading = 0;

      for (var i = 0; i < arrayOfPositions.length - 1; i++) {
        heading = getHeading(arrayOfPositions[i], arrayOfPositions[i + 1]);
        arrayHeadings.push(heading);
      }
    }

    function getHeading(cart1, cart2) {
      console.log("GETHEADING");
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

    addPolyline();
    addPointEntity();

    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(
      arrayOfPositions[0]
    );
    camLookAt(transform);

    setArrayHeadings(); //set heading for every position in arrayOfPositions

    var curH = 0;
    var deltaH = 0;
    var nextH = 0;

    var listener = viewer.clock.onTick.addEventListener(function (clock) {
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

      //console.log('i, virgule, curH, realH', i, virgule, Cesium.Math.toDegrees(curH), Cesium.Math.toDegrees(curH + deltaH));

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

      //raise camera up 333 meters, put back 333 meters
      CC3.multiplyByScalar(GC_UP, 2, GC_UP);
      CC3.add(GC_UP, currPos, currPos);
      CC3.subtract(currPos, CC3.multiplyByScalar(mydir, 2, new CC3()), currPos);
      viewer.scene.camera.position = currPos;
      function rotateVector(rotatee, rotater, angleRad) {
        var CC3 = Cesium.Cartesian3;
        var rotated = new CC3();
        var dotS = CC3.dot(rotatee, rotater);
        var base = CC3.multiplyByScalar(rotater, dotS, new CC3());
        var vpa = CC3.subtract(rotatee, base, new CC3());
        var cx = CC3.multiplyByScalar(vpa, Math.cos(angleRad), new CC3());
        var vppa = CC3.cross(rotater, vpa, new CC3());
        var cy = CC3.multiplyByScalar(vppa, Math.sin(angleRad), new CC3());
        var temp = CC3.add(base, cx, new CC3());
        var rotated = CC3.add(temp, cy, new CC3());
        return rotated;
      }
      //mydir = rotateVector(mydir, myrig, (-45 * Math.PI) / 180);
      //myup = rotateVector(myup, myrig, (-45 * Math.PI) / 180);

      //orient camera using rot mat
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
