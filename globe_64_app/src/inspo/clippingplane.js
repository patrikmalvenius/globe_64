
//Sandcastle_Begin
var viewer = new Cesium.Viewer('cesiumContainer');
var tileset = new Cesium.Cesium3DTileset({
	url: Cesium.IonResource.fromAssetId(1240402),
	show: true,
	dynamicScreenSpaceError : true,
});
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
// lien menu
var viewModel = {
    decoup : true,
    trou : false
};
var toolbar = document.getElementById('toolbar');
Cesium.knockout.track(viewModel);
Cesium.knockout.applyBindings(viewModel, toolbar);

var dig_point = [];
var hole_pts = [];
var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());

var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(function(event) {

		var earthPosition = viewer.camera.pickEllipsoid(event.position);
		var longitudeString = Cesium.Cartographic.fromCartesian(earthPosition).longitude*Cesium.Math.DEGREES_PER_RADIAN;
		var latitudeString = Cesium.Cartographic.fromCartesian(earthPosition).latitude*Cesium.Math.DEGREES_PER_RADIAN;
        
    points.add({
      position : earthPosition,
      color : Cesium.Color.WHITE
    });
   
    
    dig_point.push(new Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString));
    
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function(event) {
        hole_pts = Array.from(dig_point);
        clipplanes();
        dig_point = [];
        points.removeAll();

}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

function clipplanes(){
    var pointsLength = hole_pts.length;
    var clippingPlanes = [];
    for (var i = 0; i < pointsLength; ++i) {
        var nextIndex = (i + 1) % pointsLength;
        var midpoint = Cesium.Cartesian3.add(hole_pts[i], hole_pts[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
        var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        var right = Cesium.Cartesian3.subtract(hole_pts[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);
        var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);
        if (!viewModel.trou){normal = Cesium.Cartesian3.multiplyByScalar(normal, -1 ,normal);}
        var plane = new Cesium.Plane.fromPointNormal(midpoint, normal);
        var clippingPlane = new Cesium.ClippingPlane.fromPlane(plane);
        clippingPlanes.push(clippingPlane);
    }
    viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes : clippingPlanes,
        edgeColor: Cesium.Color.WHITE,
    });
	tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
		planes : clippingPlanes,
		edgeColor: Cesium.Color.WHITE,
        unionClippingRegions: viewModel.trou,
        enabled: viewModel.decoup,
        modelMatrix: Cesium.Matrix4.inverse(tileset.root.computedTransform, new Cesium.Matrix4())
	});
}

Cesium.knockout.getObservable(viewModel, 'decoup').subscribe(function(value) {
    viewer.scene.globe.clippingPlanes.enabled = value;
    tileset.clippingPlanes.enabled = value;
});

Cesium.knockout.getObservable(viewModel, 'trou').subscribe(function(value) {
    clipplanes();
});
