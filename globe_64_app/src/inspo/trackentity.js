// https://community.cesium.com/t/tracked-entity-camera-heading/10497/3
var viewer = new Cesium.Viewer("cesiumContainer", {});

var positionProperty = new Cesium.SampledPositionProperty();
function addPolyline() {
  var arrObject = [
    { lng: 2.486083, lat: 46.174853 },
    { lng: 2.48607, lat: 46.17486 },
    { lng: 2.48617, lat: 46.17497 },
    { lng: 2.48621, lat: 46.17501 },
    { lng: 2.48617, lat: 46.17511 },
    { lng: 2.48611, lat: 46.17524 },
    { lng: 2.48608, lat: 46.1753 },
    { lng: 2.48606, lat: 46.17537 },
    { lng: 2.48607, lat: 46.17549 },
    { lng: 2.48608, lat: 46.17561 },
    { lng: 2.48608, lat: 46.17574 },
    { lng: 2.48607, lat: 46.17574 },
    { lng: 2.48607, lat: 46.17587 },
    { lng: 2.48606, lat: 46.17597 },
    { lng: 2.48608, lat: 46.17601 },
    { lng: 2.48622, lat: 46.17615 },
    { lng: 2.48626, lat: 46.17618 },
    { lng: 2.48617, lat: 46.17629 },
    { lng: 2.48604, lat: 46.17636 },
    { lng: 2.48602, lat: 46.17637 },
    { lng: 2.486125, lat: 46.17654 },
    { lng: 2.486131, lat: 46.176648 },
    { lng: 2.486138, lat: 46.176747 },
    { lng: 2.486163, lat: 46.176779 },
    { lng: 2.486288, lat: 46.176814 },
    { lng: 2.48648, lat: 46.176828 },
    { lng: 2.486653, lat: 46.176832 },
    { lng: 2.486647, lat: 46.176894 },
    { lng: 2.486653, lat: 46.17696 },
    { lng: 2.486669, lat: 46.17702 },
    { lng: 2.48668, lat: 46.17711 },
    { lng: 2.48687, lat: 46.1771 },
    { lng: 2.48729, lat: 46.17707 },
    { lng: 2.48727, lat: 46.17714 },
    { lng: 2.48732, lat: 46.17715 },
    { lng: 2.48765, lat: 46.1772 },
    { lng: 2.48781, lat: 46.17722 },
    { lng: 2.4881, lat: 46.17728 },
    { lng: 2.48823, lat: 46.17732 },
    { lng: 2.48845, lat: 46.17745 },
    { lng: 2.48897, lat: 46.17779 },
    { lng: 2.48919, lat: 46.17782 },
    { lng: 2.48984, lat: 46.17791 },
    { lng: 2.48985, lat: 46.17787 },
    { lng: 2.49009, lat: 46.1778 },
    { lng: 2.49054, lat: 46.17759 },
    { lng: 2.49079, lat: 46.17745 },
    { lng: 2.4911, lat: 46.17726 },
    { lng: 2.49164, lat: 46.17698 },
    { lng: 2.4922, lat: 46.17675 },
    { lng: 2.49234, lat: 46.17667 },
    { lng: 2.49244, lat: 46.176593 },
    { lng: 2.49239, lat: 46.17659 },
    { lng: 2.49242, lat: 46.17603 },
    { lng: 2.49246, lat: 46.17589 },
    { lng: 2.49255, lat: 46.17574 },
    { lng: 2.49259, lat: 46.17576 },
    { lng: 2.49265, lat: 46.17577 },
    { lng: 2.49339, lat: 46.1758 },
    { lng: 2.4936, lat: 46.1758 },
    { lng: 2.49375, lat: 46.17583 },
    { lng: 2.4941, lat: 46.17608 },
    { lng: 2.49427, lat: 46.17624 },
    { lng: 2.49433, lat: 46.17626 },
    { lng: 2.49435, lat: 46.17625 },
    { lng: 2.49435, lat: 46.17621 },
    { lng: 2.49417, lat: 46.17599 },
    { lng: 2.49406, lat: 46.17585 },
    { lng: 2.49402, lat: 46.17583 },
    { lng: 2.49399, lat: 46.17579 },
    { lng: 2.49387, lat: 46.17563 },
    { lng: 2.49381, lat: 46.17544 },
    { lng: 2.49385, lat: 46.17521 },
    { lng: 2.49401, lat: 46.17461 },
    { lng: 2.49407, lat: 46.17448 },
    { lng: 2.49412, lat: 46.1744 },
    { lng: 2.49465, lat: 46.17393 },
    { lng: 2.49474, lat: 46.17378 },
    { lng: 2.49481, lat: 46.17352 },
    { lng: 2.49577, lat: 46.17357 },
    { lng: 2.49602, lat: 46.17361 },
    { lng: 2.49606, lat: 46.17363 },
    { lng: 2.49613, lat: 46.17357 },
    { lng: 2.49625, lat: 46.17343 },
    { lng: 2.49691, lat: 46.17249 },
    { lng: 2.49705, lat: 46.17234 },
    { lng: 2.49725, lat: 46.17225 },
    { lng: 2.4975, lat: 46.1722 },
    { lng: 2.49803, lat: 46.17223 },
    { lng: 2.49823, lat: 46.17223 },
    { lng: 2.49838, lat: 46.17221 },
    { lng: 2.49855, lat: 46.17214 },
    { lng: 2.49869, lat: 46.17203 },
    { lng: 2.49904, lat: 46.1717 },
    { lng: 2.49926, lat: 46.17152 },
    { lng: 2.49948, lat: 46.17142 },
    { lng: 2.49972, lat: 46.17137 },
    { lng: 2.5008, lat: 46.17132 },
    { lng: 2.50122, lat: 46.17129 },
    { lng: 2.50147, lat: 46.17126 },
    { lng: 2.50172, lat: 46.17118 },
    { lng: 2.50229, lat: 46.17096 },
    { lng: 2.50285, lat: 46.17073 },
    { lng: 2.50476, lat: 46.16996 },
    { lng: 2.50503, lat: 46.16987 },
    { lng: 2.5054, lat: 46.16975 },
    { lng: 2.50569, lat: 46.16968 },
    { lng: 2.50668, lat: 46.16949 },
    { lng: 2.50728, lat: 46.1693 },
    { lng: 2.50794, lat: 46.16903 },
    { lng: 2.50848, lat: 46.1688 },
    { lng: 2.50927, lat: 46.1685 },
    { lng: 2.51023, lat: 46.16818 },
    { lng: 2.51042, lat: 46.16809 },
    { lng: 2.51095, lat: 46.16772 },
    { lng: 2.51142, lat: 46.16737 },
    { lng: 2.51259, lat: 46.16651 },
    { lng: 2.51261, lat: 46.16649 },
    { lng: 2.51249, lat: 46.16641 },
    { lng: 2.51215, lat: 46.16622 },
    { lng: 2.5112, lat: 46.1657 },
    { lng: 2.51102, lat: 46.16562 },
    { lng: 2.51066, lat: 46.16555 },
    { lng: 2.51049, lat: 46.16549 },
    { lng: 2.51042, lat: 46.16541 },
    { lng: 2.51038, lat: 46.16531 },
    { lng: 2.51031, lat: 46.16523 },
    { lng: 2.50993, lat: 46.16492 },
    { lng: 2.50986, lat: 46.16481 },
    { lng: 2.50977, lat: 46.16448 },
    { lng: 2.50942, lat: 46.1646 },
    { lng: 2.50818, lat: 46.16524 },
    { lng: 2.50799, lat: 46.16532 },
    { lng: 2.50783, lat: 46.16534 },
    { lng: 2.50766, lat: 46.16532 },
    { lng: 2.50711, lat: 46.16512 },
    { lng: 2.5054, lat: 46.16452 },
    { lng: 2.50366, lat: 46.16389 },
    { lng: 2.50248, lat: 46.16331 },
    { lng: 2.50229, lat: 46.16316 },
    { lng: 2.50218, lat: 46.16298 },
    { lng: 2.50211, lat: 46.16272 },
    { lng: 2.502, lat: 46.16234 },
    { lng: 2.50198, lat: 46.16228 },
    { lng: 2.50207, lat: 46.16223 },
    { lng: 2.50228, lat: 46.16207 },
    { lng: 2.50439, lat: 46.16034 },
    { lng: 2.50535, lat: 46.15963 },
    { lng: 2.50581, lat: 46.15929 },
    { lng: 2.50266, lat: 46.15752 },
    { lng: 2.50211, lat: 46.15726 },
    { lng: 2.50118, lat: 46.15687 },
    { lng: 2.50093, lat: 46.15676 },
    { lng: 2.50088, lat: 46.15676 },
    { lng: 2.50088, lat: 46.15672 },
    { lng: 2.50088, lat: 46.15676 },
    { lng: 2.50077, lat: 46.1568 },
    { lng: 2.49735, lat: 46.16023 },
    { lng: 2.49604, lat: 46.16153 },
    { lng: 2.49593, lat: 46.16171 },
    { lng: 2.49583, lat: 46.16184 },
    { lng: 2.49578, lat: 46.16188 },
    { lng: 2.49557, lat: 46.16199 },
    { lng: 2.49453, lat: 46.16236 },
    { lng: 2.49425, lat: 46.16245 },
    { lng: 2.49403, lat: 46.16248 },
    { lng: 2.49378, lat: 46.16248 },
    { lng: 2.49332, lat: 46.1624 },
    { lng: 2.4919, lat: 46.16205 },
    { lng: 2.49157, lat: 46.16198 },
    { lng: 2.49094, lat: 46.16195 },
    { lng: 2.48974, lat: 46.16187 },
    { lng: 2.48931, lat: 46.1619 },
    { lng: 2.48885, lat: 46.162 },
    { lng: 2.48853, lat: 46.1621 },
    { lng: 2.48848, lat: 46.16212 },
    { lng: 2.48861, lat: 46.16232 },
    { lng: 2.48876, lat: 46.16259 },
    { lng: 2.48905, lat: 46.16382 },
    { lng: 2.4892, lat: 46.16451 },
    { lng: 2.48926, lat: 46.16487 },
    { lng: 2.48925, lat: 46.16505 },
    { lng: 2.48915, lat: 46.16547 },
    { lng: 2.48888, lat: 46.16652 },
    { lng: 2.48884, lat: 46.16703 },
    { lng: 2.48908, lat: 46.16817 },
    { lng: 2.4891, lat: 46.16833 },
    { lng: 2.48908, lat: 46.1685 },
    { lng: 2.48899, lat: 46.16875 },
    { lng: 2.48885, lat: 46.16904 },
    { lng: 2.48874, lat: 46.1692 },
    { lng: 2.48836, lat: 46.16957 },
    { lng: 2.48826, lat: 46.16975 },
    { lng: 2.48815, lat: 46.1701 },
    { lng: 2.48812, lat: 46.17032 },
    { lng: 2.48813, lat: 46.1705 },
    { lng: 2.487237, lat: 46.174316 },
    { lng: 2.487306, lat: 46.174706 },
    { lng: 2.48729, lat: 46.17471 },
    { lng: 2.48729, lat: 46.17503 },
    { lng: 2.48729, lat: 46.17508 },
    { lng: 2.48722, lat: 46.1751 },
    { lng: 2.48717, lat: 46.17512 },
    { lng: 2.48631, lat: 46.17504 },
    { lng: 2.48621, lat: 46.17501 },
    { lng: 2.48612, lat: 46.17491 },
    { lng: 2.48607, lat: 46.17486 },
    { lng: 2.486083, lat: 46.174853 },
  ];

  var arrayPos = [];
  arrObject.forEach((item) => {
    arrayPos.push(Object.values(item));
  });

  arrayOfPositions = Cesium.Cartesian3.fromDegreesArray(arrayPos.flat());

  var lastPos = null;
  for (var j = 0; j < arrayOfPositions.length; j++) {
    if (lastPos) {
      var d = Cesium.Cartesian3.distance(lastPos, arrayOfPositions[j]);

      totalDistance += d;
    }
    lastPos = arrayOfPositions[j];
  }

  console.log("totalDistance:" + totalDistance);

  polyEntity = viewer.entities.add({
    polyline: {
      positions: arrayOfPositions,
      width: 2.0,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 0,
      }),
      clampToGround: true,
    },
  });
}

function addPointEntity() {
  animationStart = Cesium.JulianDate.fromDate(new Date(2020, 8, 6, 23));
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

  pointEntity = viewer.entities.add({
    name: "point",
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: animationStart,
        stop: animationStop,
      }),
    ]),
    position: positionProperty,
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    } /*,
    viewFrom : new Cesium.Cartesian3(-500, -500, 1000)*/,
  });
}

function setArrayHeadings() {
  var heading = 0;

  for (var i = 0; i < arrayOfPositions.length - 1; i++) {
    heading = getHeading(arrayOfPositions[i], arrayOfPositions[i + 1]);
    arrayHeadings.push(heading);
  }
}

function getHeading(cart1, cart2) {
  var CC3 = Cesium.Cartesian3;
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
  CC3.subtract(cart1, cart2, pathDir); //seems backwards
  CC3.normalize(pathDir, pathDir);
  let scale = CC3.dot(up, pathDir);
  CC3.multiplyByScalar(up, scale, temp);
  CC3.subtract(pathDir, temp, pathDir);

  //get ang from north
  let ang = CC3.angleBetween(north, pathDir); //I assume always positive

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

var arrayOfPositions = null;
var arrayHeadings = [];
var pointEntity = null;
var lastCurrentTime = null;
var polyEntity = null;

var animationDuration = 60;
var animationStart;
var animationStop;
var animationAltitude = 300;
var totalDistance = 0;

addPolyline();
addPointEntity();

var transform = Cesium.Transforms.eastNorthUpToFixedFrame(arrayOfPositions[0]);
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
      pointEntity,
      new Cesium.HeadingPitchRange(
        curH + deltaH,
        -Cesium.Math.toRadians(45),
        animationAltitude
      )
    )
    .then((res) => {
      //console.log('zoomTo finished for', res, i, Cesium.Math.toDegrees(curH + deltaH));
    });
});

var stopListener = viewer.clock.onStop.addEventListener(function (clock) {
  listener();

  viewer.clock.shouldAnimate = false;

  stopListener();
});

// Add a reset button, for convenience.
Sandcastle.addToolbarButton("Play", function () {
  viewer.clock.startTime = animationStart.clone();
  viewer.clock.stopTime = animationStop.clone();
  viewer.clock.currentTime = animationStart.clone();

  viewer.clock.shouldAnimate = true;
});

Sandcastle.addToolbarButton("Position/Orient camera", function () {
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
  CC3.multiplyByScalar(GC_UP, 333, GC_UP);
  CC3.add(GC_UP, currPos, currPos);
  CC3.subtract(currPos, CC3.multiplyByScalar(mydir, 333, new CC3()), currPos);
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
  mydir = rotateVector(mydir, myrig, (-45 * Math.PI) / 180);
  myup = rotateVector(myup, myrig, (-45 * Math.PI) / 180);

  //orient camera using rot mat
  viewer.scene.camera.direction = mydir;
  viewer.scene.camera.right = myrig;
  viewer.scene.camera.up = myup;
});
