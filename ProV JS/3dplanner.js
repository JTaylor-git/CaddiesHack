var viewer; // Cesium Viewer
var handler; // Cesium Handler
var mapMode = 2; // 1 = 2D, 2 = 3D
var terrainMode = 1; // 1 = flat, 2 = hills
var terrainProvider;
var mapMarkers = [];
var mapMarkers2 = [];
var mapLines = [];
var mapLines2 = [];
var mapCircles = [];
var mode = 0;
var dispersionMode = 0;
var initName = "";
var initHole = 1;
var distLat1 = 0;
var distLon1 = 0;
var distLat2 = 0;
var distLon2 = 0;
var elevationReqTimestamp = [];
var elevationLat = [];
var elevationLon = [];
var elevation = [];
var elevation2Lat = [];
var elevation2Lon = [];
var elevation2 = [];
var elevationTimestamp = 0;
var viewTimestamp = 0;
var teeGridCount = 0;
var greenGridCount = 0;
var greenSlopesCount = 0;
var greenSlopesBearing = 0;
var greenContoursCount = 0;
var distCount = 0;
var coneCount = 0;
var bestClubID = [];
	
async function bodyOnLoadHandler()
{
	initProfile();
	initCourseData(0);
	populateCourseSelect();
	initSelectedUnits();
	initTeeCircles();
	initLineColor();
	initLineBrightness();
	initCircleColor();
	initCircleBrightness();
	initAutoRotate();
	initCompass();
	initDispersion();
	initCones();
	processLinkParameters();
	document.getElementById("saveasinput").value = initName;
	document.getElementById("layerselect").selectedIndex = 0;
	document.getElementById("terrainselect").selectedIndex = 0;
	document.getElementById("geheightselect").selectedIndex = 0;
	document.getElementById("greenspeedselect").selectedIndex = 4;
	document.getElementById("greenslopecolorselect").selectedIndex = 0;
	document.getElementById("greenslopesizeselect").selectedIndex = 1;
	document.getElementById("greenslopebrightnessselect").selectedIndex = 4;
	document.getElementById("greencontourselect").selectedIndex = 1;
	document.getElementById("greencontourminselect").selectedIndex = 0;
	document.getElementById("greencontourbrightnessselect").selectedIndex = 4;
	setSelectedHole(initHole);
	var p = navigator.platform;
	if (p == "iPad" || p == "iPhone")
	{
		document.getElementById('maptd').style.width = '65%';
		document.getElementById('buttontd').style.width = '25%';
	}
	bodyOnResizeHandler();
	var imageryProvider = await newBingMapsImageryProviderSatelliteAsync();
	var baseLayer = new Cesium.ImageryLayer(imageryProvider);
	terrainProvider = new Cesium.EllipsoidTerrainProvider();
	viewer = new Cesium.Viewer(
		'mapdiv',
		{
			baseLayer : baseLayer,
			terrainProvider : terrainProvider,
			animation : false,
			baseLayerPicker : false,
			fullscreenButton : false,
			vrButton : false,
			geocoder : false,
			homeButton : false,
			infoBox : true,
			sceneModePicker : false,
			selectionIndicator : false,
			timeline : false,
			useDefaultRenderLoop : true
		});
	viewer.scene.globe.maximumScreenSpaceError = 2.0;
	viewer.scene.globe.showGroundAtmosphere = false;
	viewer.scene.screenSpaceCameraController._zoomFactor = 50/minWheel;
	viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
	viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
	handler.setInputAction(mapLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	handler.setInputAction(mapRightClickHandler, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	handler.setInputAction(mapMouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	handler.setInputAction(mapWheelHandler, Cesium.ScreenSpaceEventType.WHEEL);
	if (mapMode == 2 && getCourseHoles(currentCourseID()) < 1) toggle3D();
	zoomToCourseHole(0, initHole, true, true, 0);
	window.setTimeout(compassRenderLoop, 1000);
	window.setTimeout(refreshElevation, 3000);
	window.setTimeout(viewerRenderLoop, 5000);
	window.setTimeout(satelliteProviderLoop1, 5000);
	startHeartbeat("3dplanner", 60);
}

var minWheel = 1000000;
function mapWheelHandler(wheel)
{
	var w = Math.abs(wheel);
	if (w < 1.0) w = 1.0;
	if (w < minWheel)// || w > 100*minWheel)
	{
		minWheel = w;
		viewer.scene.screenSpaceCameraController._zoomFactor = 50/minWheel;
	}
}

var fastRenderStopTime = 0;
function fastRender(seconds)
{
	var t = Date.now() + Math.round(1000*seconds) + 500;
	if (fastRenderStopTime < t)
		fastRenderStopTime = t;
}

function viewerRenderLoop()
{
	viewer.useDefaultRenderLoop = false;
	viewer.resize();
	viewer.render();
	var renderDelay = 50;
	if (Date.now() < fastRenderStopTime)
	{
		viewer.scene.screenSpaceCameraController._zoomFactor = 20;
		renderDelay = 20;
	}
	else
	{
		viewer.scene.screenSpaceCameraController._zoomFactor = 50;
	}
	window.setTimeout(viewerRenderLoop, renderDelay);
}

function flyToHeightAboveGround(lat, lon, hlat, hlon, heightAboveGround, heading, angle, durationSeconds)
{
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(hlat, hlon));
	flyToHeightAboveEllipsoid(lat, lon, h + heightAboveGround, heading, angle, durationSeconds);
}

function flyToHeightAboveEllipsoid(lat, lon, heightAboveEllipsoid, heading, angle, durationSeconds)
{
	fastRender(durationSeconds);
	viewer.camera.flyTo({
		destination : Cesium.Cartesian3.fromDegrees(lon, lat, heightAboveEllipsoid),
		orientation : {
			heading : heading * Math.PI / 180,
			pitch : angle * Math.PI / 180,
			roll : 0
		},
		duration : durationSeconds
	});
}

var compassCanvas = null;
var compassCtx = null;
var weatherCanvas = null;
var weatherCtx = null;

function initCompass()
{
	compassCanvas = document.getElementById("compasscanvas");
	compassCtx = compassCanvas.getContext("2d");
	weatherCanvas = document.getElementById("weathercanvas");
	weatherCtx = weatherCanvas.getContext("2d");
}

function compassRenderLoop()
{
	var cameraHeading = viewer.camera.heading;
	var theta = -cameraHeading;
	var c = Math.cos(theta);
	var s = Math.sin(theta);
	var x = []; var y = [];
	// Cross
	x[0] = -6; y[0] = 0;
	x[1] = 6; y[1] = 0;
	x[2] = 0; y[2] = -6;
	x[3] = 0; y[3] = 6;
	// North
	x[4] = -3; y[4] = 8;
	x[5] = -3; y[5] = 17;
	x[6] = 3; y[6] = 9;
	x[7] = 3; y[7] = 18;
	// South
	x[8] = -3; y[8] = -16;
	x[9] = -3; y[9] = -17;
	x[10] = 2; y[10] = -17;
	x[11] = 3; y[11] = -17;
	x[12] = 3; y[12] = -13;
	x[13] = 2; y[13] = -13;
	x[14] = -2; y[14] = -13;
	x[15] = -3; y[15] = -13;
	x[16] = -3; y[16] = -9;
	x[17] = -2; y[17] = -9;
	x[18] = 3; y[18] = -9;
	x[19] = 3; y[19] = -10;
	// East
	x[20] = 16; y[20] = -4;
	x[21] = 10; y[21] = -4;
	x[22] = 10; y[22] = 4;
	x[23] = 16; y[23] = 4;
	x[24] = 10; y[24] = 0;
	x[25] = 16; y[25] = 0;
	// West
	x[26] = -16; y[26] = 4;
	x[27] = -15; y[27] = -4;
	x[28] = -13; y[28] = 0;
	x[29] = -11; y[29] = -4;
	x[30] = -10; y[30] = 4;
	var x2 = []; var y2 = [];
	for (var i = 0; i <= 30; ++i)
	{
		x2[i] = 20 + 0.9*(c*x[i] + s*y[i]);
		y2[i] = 20 + 0.9*(s*x[i] - c*y[i]);
	}
	compassCtx.clearRect(0,0,40,40);
	compassCtx.lineWidth = 1;
	compassCtx.strokeStyle = "#FF0000";
	compassCtx.beginPath();
	// North
	compassCtx.moveTo(x2[4],y2[4]);
	compassCtx.lineTo(x2[5],y2[5]);
	compassCtx.lineTo(x2[6],y2[6]);
	compassCtx.lineTo(x2[7],y2[7]);
	compassCtx.stroke();
	compassCtx.strokeStyle = "#888888";
	compassCtx.beginPath();
	// Cross
	compassCtx.moveTo(x2[0],y2[0]);
	compassCtx.lineTo(x2[1],y2[1]);
	compassCtx.moveTo(x2[2],y2[2]);
	compassCtx.lineTo(x2[3],y2[3]);
	// South
	compassCtx.moveTo(x2[8],y2[8]);
	compassCtx.lineTo(x2[9],y2[9]);
	compassCtx.lineTo(x2[10],y2[10]);
	compassCtx.lineTo(x2[11],y2[11]);
	compassCtx.lineTo(x2[12],y2[12]);
	compassCtx.lineTo(x2[13],y2[13]);
	compassCtx.lineTo(x2[14],y2[14]);
	compassCtx.lineTo(x2[15],y2[15]);
	compassCtx.lineTo(x2[16],y2[16]);
	compassCtx.lineTo(x2[17],y2[17]);
	compassCtx.lineTo(x2[18],y2[18]);
	compassCtx.lineTo(x2[19],y2[19]);
	// East
	compassCtx.moveTo(x2[20],y2[20]);
	compassCtx.lineTo(x2[21],y2[21]);
	compassCtx.lineTo(x2[22],y2[22]);
	compassCtx.lineTo(x2[23],y2[23]);
	compassCtx.moveTo(x2[24],y2[24]);
	compassCtx.lineTo(x2[25],y2[25]);
	// West
	compassCtx.moveTo(x2[26],y2[26]);
	compassCtx.lineTo(x2[27],y2[27]);
	compassCtx.lineTo(x2[28],y2[28]);
	compassCtx.lineTo(x2[29],y2[29]);
	compassCtx.lineTo(x2[30],y2[30]);
	compassCtx.stroke();
	if (weatherIndex >= 0)
		renderWind(cameraHeading);
	var renderDelay = 500;
	if (Date.now() < fastRenderStopTime)
		renderDelay = 100;
	window.setTimeout(compassRenderLoop, renderDelay);
}

function renderWind(cameraHeading)
{
	var theta = weatherWindBearing*(Math.PI/180.0) - cameraHeading;
	var k = (weatherWindSpeed > 0 ? 1.4 : 0.0);
	var c = Math.cos(theta);
	var s = Math.sin(theta);
	var x = []; var y = [];
	x[0] =  0; y[0] =  10;
	x[1] = -3; y[1] =   6;
	x[2] =  3; y[2] =   6;
	x[3] =  0; y[3] = -10;
	var x2 = []; var y2 = [];
	for (var i = 0; i <= 3; ++i)
	{
		x2[i] = 20 + k*(c*x[i] + s*y[i]);
		y2[i] = 20 + k*(s*x[i] - c*y[i]);
	}
	weatherCtx.clearRect(0,0,40,40);
	weatherCtx.lineWidth = 1;
	weatherCtx.strokeStyle = "#888888";
	weatherCtx.beginPath();
	weatherCtx.moveTo(x2[0],y2[0]);
	weatherCtx.lineTo(x2[1],y2[1]);
	weatherCtx.moveTo(x2[0],y2[0]);
	weatherCtx.lineTo(x2[2],y2[2]);
	weatherCtx.moveTo(x2[0],y2[0]);
	weatherCtx.lineTo(x2[3],y2[3]);
	weatherCtx.stroke();
}

function bodyOnResizeHandler()
{
	var x = document.getElementById("mapdiv");
	x.style.height = Math.round(window.innerHeight - 10).toString() + 'px';
}

function layerHelp()
{
	alert("Use this drop-down to select the imagery to display. The 'Terrain' overlay is based on the SRTM 1 Arc-Second Global Dataset between 60-degrees north and 56-degrees south, and the ASTER GDEM V3 Dataset above 60-degrees north and below 56-degrees south. Note that the bright lines on the Terrain overlay are 10-metre contours. The 'Lidar' overlay is currently only available in the United States and England. Note that the Lidar imagery is generated on-demand and typically takes around 10-20 seconds to load. If it has not loaded after 30 seconds, it probably means it is not available in your region.");
}

async function layerSelectHandler()
{
	setMode(0);
	var i = document.getElementById("layerselect").selectedIndex;
	var layers = viewer.scene.imageryLayers;
	while (layers.length > 1) layers.remove(layers.get(layers.length - 1), true);
	satelliteProvider = 0;
	if (i == 1)
	{
		var courseID = currentCourseID();
		var courseName = getCourseNameFromID(courseID);
		if (courseName == "") courseName = cleanString(document.getElementById("saveasinput").value);
		var minLat = getCourseMinLat(courseID);
		var minLon = getCourseMinLon(courseID);
		var maxLat = getCourseMaxLat(courseID);
		var maxLon = getCourseMaxLon(courseID);
		getProVisualizerTerrainData1(minLat, minLon, maxLat, maxLon, 200, viewer, courseName);
	}
	else if (i == 2)
	{
		var courseID = currentCourseID();
		var minLat = getCourseMinLat(courseID);
		var minLon = getCourseMinLon(courseID);
		var maxLat = getCourseMaxLat(courseID);
		var maxLon = getCourseMaxLon(courseID);
		var dx = geogDist(minLat, minLon, minLat, maxLon);
		var dy = geogDist(minLat, minLon, maxLat, minLon);
		var degToRad = Math.PI / 180.0;
		var azimuth = 0.0;
		var altitude = 40.0;
		var zFactor = 1.0;
		if (minLat > 45 && maxLat < 65 && minLon > -15 && maxLon < 10 && dx < 10000 && dy < 10000)
		{
			// England
			minLat = Math.round(moveLat(minLat, minLon, 200, 180)*10000)/10000;
			minLon = Math.round(moveLon(minLat, minLon, 200, 270)*10000)/10000;
			maxLat = Math.round(moveLat(maxLat, maxLon, 200,   0)*10000)/10000;
			maxLon = Math.round(moveLon(maxLat, maxLon, 200,  90)*10000)/10000;
			dx = 2*geogDist(minLat, minLon, minLat, maxLon)/Math.cos(((minLat+maxLat)/2)*Math.PI/180.0);
			dy = 2*geogDist(minLat, minLon, maxLat, minLon);
			var k = Math.sqrt(1+dx*dy)/3500.0;
			if (k > 1.0) { dx /= k; dy /= k; }
			var url = 'https://environment.data.gov.uk/geoservices/datasets/13787b9a-26a4-4775-8523-806d13af58fc/wms?';
			url += 'VERSION=1.3.0';
			url += '&SERVICE=WMS';
			url += '&REQUEST=GetMap';
			url += '&LAYERS=Lidar_Composite_Hillshade_DTM_1m';
			url += '&STYLES=hillshade';
			url += '&CRS=CRS%3A84';
			url += '&BBOX='+minLon.toString()+'%2C'+minLat.toString()+'%2C'+maxLon.toString()+'%2C'+maxLat.toString();
			url += '&WIDTH='+Math.round(dx).toString();
			url += '&HEIGHT='+Math.round(dy).toString();
			url += '&FORMAT=image%2Fpng';
			url += '&TRANSPARENT=TRUE';
			url += '&BGCOLOR=0xFF0000';
			layers.addImageryProvider(new Cesium.SingleTileImageryProvider(
			{
				url : url,
				rectangle : new Cesium.Rectangle(minLon*degToRad, minLat*degToRad, maxLon*degToRad, maxLat*degToRad)
			}));
		}
		if (minLat > 99954 && maxLat < 65 && minLon > -10 && maxLon < 0 && dx < 10000 && dy < 10000)
		{
			// Scotland
			minLat = Math.round(moveLat(minLat, minLon, 200, 180)*10000)/10000;
			minLon = Math.round(moveLon(minLat, minLon, 200, 270)*10000)/10000;
			maxLat = Math.round(moveLat(maxLat, maxLon, 200,   0)*10000)/10000;
			maxLon = Math.round(moveLon(maxLat, maxLon, 200,  90)*10000)/10000;
			dx = 2*geogDist(minLat, minLon, minLat, maxLon)/Math.cos(((minLat+maxLat)/2)*Math.PI/180.0);
			dy = 2*geogDist(minLat, minLon, maxLat, minLon);
			var k = Math.sqrt(1+dx*dy)/3500.0;
			if (k > 1.0) { dx /= k; dy /= k; }
			layers.addImageryProvider(new Cesium.SingleTileImageryProvider(
			{
				url : 'https://srsp-ows.jncc.gov.uk/ows?service=WMS&request=GetMap&layers=scotland%3Ascotland-lidar-5-dtm&styles=scotland%3Alidar-dem&format=image%2Fpng&transparent=true&version=1.1.1&tiled=true&bbox='+minLon.toString()+'%2C'+minLat.toString()+'%2C'+maxLon.toString()+'%2C'+maxLat.toString()+'&srs=EPSG%3A4326&width='+Math.round(dx).toString()+'&height='+Math.round(dy).toString(),
				rectangle : new Cesium.Rectangle(minLon*degToRad, minLat*degToRad, maxLon*degToRad, maxLat*degToRad)
			}));
		}
		if (minLat > 0 && maxLat < 90 && minLon > -180 && maxLon < -20 && dx < 10000 && dy < 10000)
		{
			// United States
			minLat = Math.round(moveLat(minLat, minLon, 200, 180)*10000)/10000;
			minLon = Math.round(moveLon(minLat, minLon, 200, 270)*10000)/10000;
			maxLat = Math.round(moveLat(maxLat, maxLon, 200,   0)*10000)/10000;
			maxLon = Math.round(moveLon(maxLat, maxLon, 200,  90)*10000)/10000;
			dx = 2*geogDist(minLat, minLon, minLat, maxLon)/Math.cos(((minLat+maxLat)/2)*Math.PI/180.0);
			dy = 2*geogDist(minLat, minLon, maxLat, minLon);
			var k = Math.sqrt(1+dx*dy)/3500.0;
			if (k > 1.0) { dx /= k; dy /= k; }
			var url = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?';
			url += 'f=image';
			url += '&bandIds=';
			url += '&renderingRule=' + encodeURIComponent('%7B"rasterFunction"%3A"Hillshade","rasterFunctionArguments"%3A%7B"Azimuth"%3A'+azimuth.toString()+',"Altitude"%3A'+altitude.toString()+',"ZFactor"%3A'+zFactor.toString()+'%7D,"variableName"%3A"DEM"%7D');
			url += '&bbox='+minLon.toString()+'%2C'+minLat.toString()+'%2C'+maxLon.toString()+'%2C'+maxLat.toString();
			url += '&imageSR=4326&bboxSR=4326&size='+Math.round(dx).toString()+'%2C'+Math.round(dy).toString();
			layers.addImageryProvider(new Cesium.SingleTileImageryProvider(
			{
				url : url,
				rectangle : new Cesium.Rectangle(minLon*degToRad, minLat*degToRad, maxLon*degToRad, maxLat*degToRad)
			}));
		}
		var s = document.getElementById('saveasinput').value;
		if (s != null && s.indexOf('!!esri') == 0) { var layer = layers.addImageryProvider(newEsriImageryProviderSatellite(17)); layer.alpha = 0.25; return; }
		if (s != null && s.indexOf('!!osm')  == 0) { var layer = layers.addImageryProvider(newOSMImageryProviderMap(17));        layer.alpha = 0.25; return; }
	}
	else if (i == 3)
	{
		var s = document.getElementById('saveasinput').value;
		if (s != null && s.indexOf('!!esri16') == 0) { layers.addImageryProvider(newEsriImageryProviderSatellite(16)); return; }
		if (s != null && s.indexOf('!!esri17') == 0) { layers.addImageryProvider(newEsriImageryProviderSatellite(17)); return; }
		if (s != null && s.indexOf('!!esri18') == 0) { layers.addImageryProvider(newEsriImageryProviderSatellite(18)); return; }
		if (s != null && s.indexOf('!!esri') == 0) { layers.addImageryProvider(newEsriImageryProviderSatellite(19)); return; }
		if (s != null && s.indexOf('!!nasa') == 0) { layers.addImageryProvider(newNasaImageryProviderTerrain()); return; }
		if (s != null && s.indexOf('!!osm') == 0) { layers.addImageryProvider(newOSMImageryProviderMap(18)); return; }
		var imageryProvider = await newBingMapsImageryProviderMapAsync();
		var layer = new Cesium.ImageryLayer(imageryProvider);
		layers.add(layer);
	}
}

function showGreenSlopePanel() { document.getElementById('greenslopediv').style.display = '';     document.getElementById('greencontourdiv').style.display = '';     }
function hideGreenSlopePanel() { document.getElementById('greenslopediv').style.display = 'none'; document.getElementById('greencontourdiv').style.display = 'none'; }

function terrainSelectHandler()
{
	hideGreenSlopePanel();
	terrainMode = 1 + document.getElementById("terrainselect").selectedIndex;
	if (terrainMode == 2)
	{
		var courseID = currentCourseID();
		var courseName = getCourseNameFromID(courseID);
		if (courseName == "") courseName = cleanString(document.getElementById("saveasinput").value);
		var minLat = getCourseMinLat(courseID);
		var minLon = getCourseMinLon(courseID);
		var maxLat = getCourseMaxLat(courseID);
		var maxLon = getCourseMaxLon(courseID);
		if (minLat == 0 && minLon == 0 && maxLat == 0 && maxLon == 0)
		{
			alert('Please select course.');
			document.getElementById("terrainselect").selectedIndex = 0;
			terrainMode = 1;
			return;
		}
		getProVisualizerTerrainData1(minLat, minLon, maxLat, maxLon, 200, null, courseName);
		getProVisualizerTerrainData2(minLat, minLon, maxLat, maxLon, 10000, null);
		getProVisualizerTerrainData3(minLat, minLon, maxLat, maxLon, 50000, null);
		getNewProVisualizerTerrainProvider();
	}
	else
	{
		terrainProvider = new Cesium.EllipsoidTerrainProvider();
		viewer.terrainProvider = terrainProvider;
		zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 3);
	}
}

function getNewProVisualizerTerrainProvider()
{
	if (terrainMode != 2) return;
	if (!terrain1Ready || !terrain2Ready || !terrain3Ready)
	{
		window.setTimeout(getNewProVisualizerTerrainProvider, 500);
		return;
	}
	terrainProvider = newProVisualizerTerrainProvider();
	viewer.terrainProvider = terrainProvider;
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 3);
	if (terrain1AllowSlopes)
		showGreenSlopePanel();
}

function zoomInClickHandler()
{
	setMode(0);
	var p = viewer.camera.positionCartographic;
	var k = 180.0/Math.PI;
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(p.latitude*k, p.longitude*k));
	var dh = p.height - h;
	viewer.camera.moveForward(0.2*dh);
}

function zoomOutClickHandler()
{
	setMode(0);
	var p = viewer.camera.positionCartographic;
	var k = 180.0/Math.PI;
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(p.latitude*k, p.longitude*k));
	var dh = p.height - h;
	viewer.camera.moveBackward(0.25*dh);
}

function rotateLeftClickHandler()  { rotateClickHandler( 11.25); }
function rotateRightClickHandler() { rotateClickHandler(-11.25); }

var rotateHeight = 0;
var rotateRadius = 0;
var rotateLat = 0;
var rotateLon = 0;
var rotatePrevLat = -1;
var rotatePrevLon = 0;
var rotatePrevH = 0;
var rotatePrevB = 0;

function rotateClickHandler(deltaBearing)
{
	setMode(0);

	var p = viewer.camera.positionCartographic;
	var b = viewer.camera.heading*180.0/Math.PI;
	var lat = Cesium.Math.toDegrees(p.latitude);
	var lon = Cesium.Math.toDegrees(p.longitude);
	var h0 = p.height;
	var h1 = p.height - (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	if (geogDist(lat, lon, rotatePrevLat, rotatePrevLon) > 1.0 || Math.abs(h0 - rotatePrevH) > 1.0 || Math.abs(b - rotatePrevB) > 1.0)
	{
		// Default when looking above horizon...
		rotateHeight = h0;
		rotateRadius = h1*10;
		rotateLat = moveLat(lat, lon, rotateRadius, b);
		rotateLon = moveLon(lat, lon, rotateRadius, b);
		var h2 = p.height - (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(rotateLat, rotateLon));

		// If looking below horizon...
		var ray = new Cesium.Ray(viewer.camera.position, viewer.camera.direction);
		var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		if (cartesian)
		{
			var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			var lat2 = Cesium.Math.toDegrees(cartographic.latitude);
			var lon2 = Cesium.Math.toDegrees(cartographic.longitude);
			var d = geogDist(lat, lon, lat2, lon2);
			var dMax = h1*10; if (dMax < 100) dMax = 100;
			if (d > dMax) d = dMax;
			rotateRadius = d;
			rotateLat = moveLat(lat, lon, rotateRadius, b);
			rotateLon = moveLon(lat, lon, rotateRadius, b);
		}
		var courseID = currentCourseID();
		var hole = currentHole();
		if (rotateRadius > 10.0 && hole == 0)
		{
			// Snap to course centre...
			var minLat = getCourseMinLat(courseID);
			var minLon = getCourseMinLon(courseID);
			var maxLat = getCourseMaxLat(courseID);
			var maxLon = getCourseMaxLon(courseID);
			var dLat = maxLat - minLat;
			var dLon = maxLon - minLon;
			if (dLat > 0 && dLat < 1 && dLon > 0 && dLon < 1)
			{
				var centreLat = (minLat + maxLat)/2;
				var centreLon = (minLon + maxLon)/2;
				var d2 = geogDist(lat, lon, centreLat, centreLon);
				var b2 = geogBearing(lat, lon, centreLat, centreLon);
				while (b2 < b - 180.0) b2 += 360.0;
				while (b2 > b + 180.0) b2 -= 360.0;
				var td = 1.0 - Math.abs(d2 - rotateRadius)/10000.0;
					var tb = 1.0 - Math.abs(b2 - b)/30.0;
				if (td > 0 && tb > 0)
				{
					var t = td*tb;
					rotateLat = (1 - t)*rotateLat + t*centreLat;
					rotateLon = (1 - t)*rotateLon + t*centreLon;
					rotateRadius = geogDist(lat, lon, rotateLat, rotateLon);
				}
			}
		}
		else if (rotateRadius > 1.0 && hole > 0)
		{
			// Choose radius to rotate nicely around pin position...
			var teeLat = getCourseHoleTeeLat(courseID, hole);
			var teeLon = getCourseHoleTeeLon(courseID, hole);
			var pinLat = getCourseHolePinLat(courseID, hole);
			var pinLon = getCourseHolePinLon(courseID, hole);
			if ((teeLat != 0 || teeLon != 0) && (pinLat != 0 || pinLon != 0))
			{
				var d2 = geogDist(lat, lon, pinLat, pinLon);
				var b2 = geogBearing(lat, lon, pinLat, pinLon);
				while (b2 < b - 180.0) b2 += 360.0;
				while (b2 > b + 180.0) b2 -= 360.0;
				var db = b - b2;
				if (Math.abs(db) < 45)
				{
					var d = (d2+50+0.7*h1)/(2*Math.cos(db*Math.PI/180.0));
					if (d > d2) d = d2;
					rotateLat = moveLat(lat, lon, d, b);
					rotateLon = moveLon(lat, lon, d, b);
					rotateRadius = d;
				}
			}
		}
	}
	var b2 = (rotateRadius > 1.0 ? geogBearing(lat, lon, rotateLat, rotateLon) : b);
	b2 += deltaBearing;
	while (b2 <   0.0) b2 += 360.0;
	while (b2 > 360.0) b2 -= 360.0;
	var lat2 = moveLat(rotateLat, rotateLon, rotateRadius, b2+180);
	var lon2 = moveLon(rotateLat, rotateLon, rotateRadius, b2+180);
	var h = rotateHeight;
	var h2 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat2, lon2));
	if (h < h2 + 2) h = h2 + 2;
	viewer.camera.setView({
		destination : Cesium.Cartesian3.fromDegrees(lon2, lat2, h),
		orientation : {
			heading : b2 * Math.PI / 180,
			pitch : viewer.camera.pitch,
			roll : 0
		}
	});
	rotatePrevLat = lat2;
	rotatePrevLon = lon2;
	rotatePrevH = h;
	rotatePrevB = b2;
}

function setMode(newMode)
{
	if (newMode == mode && mode != 9) return;

	document.getElementById("setTeeButton").style.backgroundColor = "";
	document.getElementById("setPinButton").style.backgroundColor = "";
	document.getElementById("setTarget1Button").style.backgroundColor = "";
	document.getElementById("setTarget2Button").style.backgroundColor = "";
	document.getElementById("setTarget3Button").style.backgroundColor = "";
	document.getElementById("distanceButton").style.backgroundColor = "";
	document.getElementById("distanceButton2").style.backgroundColor = "";
	document.getElementById("clearDistanceButton").style.backgroundColor = "";

	if (mode == 9)
	{
		document.getElementById("symboldivA").style.backgroundColor = "";
		document.getElementById("symboldivB").style.backgroundColor = "";
		document.getElementById("symboldivC").style.backgroundColor = "";
		document.getElementById("symboldivD").style.backgroundColor = "";
		document.getElementById("symboldivE").style.backgroundColor = "";
		document.getElementById("symboldivF").style.backgroundColor = "";
		document.getElementById("symboldiv1").style.backgroundColor = "";
		document.getElementById("symboldiv2").style.backgroundColor = "";
		document.getElementById("symboldiv3").style.backgroundColor = "";
		document.getElementById("symboldiv4").style.backgroundColor = "";
		document.getElementById("symboldiv5").style.backgroundColor = "";
		document.getElementById("symboldiv6").style.backgroundColor = "";
		document.getElementById("symboldivT").style.backgroundColor = "";
		document.getElementById("symboldivX").style.backgroundColor = "";
		document.getElementById("symboldivL").style.backgroundColor = "";
		document.getElementById("symboldivM").style.backgroundColor = "";
		document.getElementById("symboldivN").style.backgroundColor = "";
		document.getElementById("symboldivO").style.backgroundColor = "";
		document.getElementById("symboldivZ").style.backgroundColor = "";
	}

	mode = newMode;

	var c = "#00FFFF";
	var c2 = "rgba(0,255,255,0.2)";

	if      (mode == 1) document.getElementById("setTeeButton").style.backgroundColor = c;
	else if (mode == 2) document.getElementById("setPinButton").style.backgroundColor = c;
	else if (mode == 3) document.getElementById("setTarget1Button").style.backgroundColor = c;
	else if (mode == 4) document.getElementById("setTarget2Button").style.backgroundColor = c;
	else if (mode == 5) document.getElementById("setTarget3Button").style.backgroundColor = c;
	else if (mode == 6) document.getElementById("distanceButton").style.backgroundColor = c;
	else if (mode == 7) document.getElementById("distanceButton2").style.backgroundColor = c;
	else if (mode == 8) document.getElementById("clearDistanceButton").style.backgroundColor = c;
	else if (mode == 9)
	{
		if (activeSymbol == 'A') document.getElementById("symboldivA").style.backgroundColor = c2;
		if (activeSymbol == 'B') document.getElementById("symboldivB").style.backgroundColor = c2;
		if (activeSymbol == 'C') document.getElementById("symboldivC").style.backgroundColor = c2;
		if (activeSymbol == 'D') document.getElementById("symboldivD").style.backgroundColor = c2;
		if (activeSymbol == 'E') document.getElementById("symboldivE").style.backgroundColor = c2;
		if (activeSymbol == 'F') document.getElementById("symboldivF").style.backgroundColor = c2;
		if (activeSymbol == '1') document.getElementById("symboldiv1").style.backgroundColor = c2;
		if (activeSymbol == '2') document.getElementById("symboldiv2").style.backgroundColor = c2;
		if (activeSymbol == '3') document.getElementById("symboldiv3").style.backgroundColor = c2;
		if (activeSymbol == '4') document.getElementById("symboldiv4").style.backgroundColor = c2;
		if (activeSymbol == '5') document.getElementById("symboldiv5").style.backgroundColor = c2;
		if (activeSymbol == '6') document.getElementById("symboldiv6").style.backgroundColor = c2;
		if (activeSymbol == 'T') document.getElementById("symboldivT").style.backgroundColor = c2;
		if (activeSymbol == 'X') document.getElementById("symboldivX").style.backgroundColor = c2;
		if (activeSymbol == 'L') document.getElementById("symboldivL").style.backgroundColor = c2;
		if (activeSymbol == 'M') document.getElementById("symboldivM").style.backgroundColor = c2;
		if (activeSymbol == 'N') document.getElementById("symboldivN").style.backgroundColor = c2;
		if (activeSymbol == 'O') document.getElementById("symboldivO").style.backgroundColor = c2;
		if (activeSymbol == 'Z') document.getElementById("symboldivZ").style.backgroundColor = c2;
	}

	setDistDiv('');
	setDistDiv1('');
	setDistDiv2('');
	setDistDiv3('');
}

function initSelectedUnits()
{
	document.getElementById('unitselect').selectedIndex = (getDistanceUnit() == "m" ? 1 : 0);
}

function selectUnitHandler()
{
	setMode(0);
	setDistanceUnit(document.getElementById('unitselect').selectedIndex == 1 ? "m" : "y");
	refreshView();
	setWeatherData();
}

function initTeeCircles()
{
	document.getElementById('teecircleselect').selectedIndex = getTeeCircles();
}

function selectTeeCirclesHandler()
{
	setMode(0);
	setTeeCircles(document.getElementById('teecircleselect').selectedIndex.toString());
	refreshView();
}

function teeCirclePlusHandler()
{
	setMode(0);
	var i = getTeeCircles() - 1;
	if (i < 0) return;
	setTeeCircles(i.toString());
	document.getElementById('teecircleselect').selectedIndex = i;
	refreshView();
}

function teeCircleMinusHandler()
{
	setMode(0);
	var i = getTeeCircles() + 1;
	if (i > 13) return;
	setTeeCircles(i.toString());
	document.getElementById('teecircleselect').selectedIndex = i;
	refreshView();
}

function initCones()
{
	document.getElementById('conesselect').selectedIndex = 0;
}

function selectConesHandler()
{
	setMode(0);
	if (coneCount >= 3)
		refreshView();

	conesHandler();
}

function conesHandler()
{
	setMode(0);
	if (coneCount >= 3)
	{
		refreshView();
		return;
	}

	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee position.")
		return;
	}
	for (var shot = 1; shot <= par - 2; ++shot)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
		if (shot > 1)
		{
			lat1 = getCourseHoleTargetLat(courseID, hole, shot-1);
			lon1 = getCourseHoleTargetLon(courseID, hole, shot-1);
		}
		if (shot < par - 2)
		{
			lat2 = getCourseHoleTargetLat(courseID, hole, shot);
			lon2 = getCourseHoleTargetLon(courseID, hole, shot);
		}
		var d = geogDist(lat1, lon1, lat2, lon2);
		if (d < 1)
		{
			alert("Tee/Targets/Pin too close together.");
			return;
		}
		var bearing = geogBearing(lat1, lon1, lat2, lon2);
		var brightness = 0.03 * getCircleBrightness();
		var c = getCircleColor();
		var color = new Cesium.Color(1,1,0,brightness);
		if (c == 1) color = new Cesium.Color(0.5,1.0,0.5,brightness);
		if (c == 2) color = new Cesium.Color(0.5,1.0,1.0,brightness);
		if (c == 3) color = new Cesium.Color(1.0,1.0,1.0,brightness);
		var conesIndex = document.getElementById('conesselect').selectedIndex;
		var a = 10;
		var b = 5;
		var k = 180.0/Math.PI;
		if (conesIndex == 0) { a = 6; b = 3; }
		if (conesIndex == 1) { a = 8; b = 4; }
		if (conesIndex == 2) { a = 10; b = 5; }
		if (conesIndex == 3) { a = 0.10*k; b = 0.05*k; }
		if (conesIndex == 4) { a = 0.12*k; b = 0.06*k; }
		if (conesIndex == 5) { a = 0.14*k; b = 0.07*k; }
		if (conesIndex == 6) { a = 0.16*k; b = 0.08*k; }
		if (conesIndex == 7) { a = 0.18*k; b = 0.09*k; }
		if (conesIndex == 8) { a = 0.20*k; b = 0.10*k; }
		for (var i = -a; i <= a; i += b)
		{
			if (i == 0) i += b;
			var lat3 = lat1;
			var lon3 = lon1;
			var lat4 = moveLat(lat1, lon1, d+10, bearing+i);
			var lon4 = moveLon(lat1, lon1, d+10, bearing+i);
			if (i == 0)
			{
				lat3 = moveLat(lat1, lon1, d, bearing);
				lon3 = moveLon(lat1, lon1, d, bearing);
			}
			var coords = [];
			var h2 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat2, lon2));
			var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
			var h4 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat4, lon4));
			var dh = Math.abs(i)/5.0;
			if (h4 < h2 - dh) h4 = h2 - dh;
			if (h4 > h2 + dh) h4 = h2 + dh;
			coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
			coords.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
			var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: color } }); 
			mapLines2.push(line);
		}
	}
	coneCount += 1;
}

function initDispersion()
{
	var i = getDispersionProfileID();
	document.getElementById('dispersionselect').selectedIndex = i;
	document.getElementById('nrlselect').selectedIndex = getNRL();
	if (i == 11)
	{
		document.getElementById('nrlselectdiv').style.display = 'none';
		document.getElementById('customdispersionbuttondiv').style.display = '';
		refreshCustomDispersion();
	}
}

function selectDispersionHandler()
{
	setMode(0);
	var i = document.getElementById('dispersionselect').selectedIndex;
	setDispersionProfileID(i.toString());
	refreshView();
	if (i == 11)
	{
		document.getElementById('nrlselectdiv').style.display = 'none';
		document.getElementById('customdispersionbuttondiv').style.display = '';
		refreshCustomDispersion();
	}
	else
	{
		document.getElementById('customdispersiondiv').style.display = 'none';
		document.getElementById('customdispersionbuttondiv').style.display = 'none';
		document.getElementById('nrlselectdiv').style.display = '';
	}
}

function refreshCustomDispersion()
{
	var s = "<table/>";
	s += "<tr>";
	s += "<td></td>";
	s += "<td align='left'>Left</td>";
	s += "<td align='left'>Right</td>";
	s += "<td align='left'>Long</td>";
	s += "<td align='left'>Short</td>";
	s += "<td align='center'>Shape</td>";
	s += "</tr>";
	s += "<tr>";
	s += "<td></td>";
	s += "<td><button style='width: 50%;' onclick='increaseSpreadL(-1)'>+</button><button style='width: 50%;' onclick='decreaseSpreadL(-1)'>-</button></td>";
	s += "<td><button style='width: 50%;' onclick='increaseSpreadR(-1)'>+</button><button style='width: 50%;' onclick='decreaseSpreadR(-1)'>-</button></td>";
	s += "<td><button style='width: 50%;' onclick='increaseSpreadO(-1)'>+</button><button style='width: 50%;' onclick='decreaseSpreadO(-1)'>-</button></td>";
	s += "<td><button style='width: 50%;' onclick='increaseSpreadS(-1)'>+</button><button style='width: 50%;' onclick='decreaseSpreadS(-1)'>-</button></td>";
	s += "<td>";
	s += "<button style='padding: 0px;' onclick='setShape(-1,-2)'><div style='width: 20px;'>L</div></button>";
	s += "<button style='padding: 0px;' onclick='setShape(-1,-1)'><div style='width: 20px;'>-</div></button>";
	s += "<button style='padding: 0px;' onclick='setShape(-1, 0)'><div style='width: 20px;'>N</div></button>";
	s += "<button style='padding: 0px;' onclick='setShape(-1, 1)'><div style='width: 20px;'>-</div></button>";
	s += "<button style='padding: 0px;' onclick='setShape(-1, 2)'><div style='width: 20px;'>R</div></button>";
	s += "</td></tr>";
	for (var i = 0; i <= 16; ++i)
	{
		if (true || getClubFlag(i))
		{
			var id = i.toString();
			var name = getClubName(i);
			var spreadL = getClubSpreadL(i);
			var spreadR = getClubSpreadR(i);
			var spreadO = getClubSpreadO(i);
			var spreadS = getClubSpreadS(i);
			var shape = getClubShape(i);
			s += "<tr>";
			s += "<td>" + name + "</td>";
			s += "<td><input type='textbox' readonly style='width: 50px;' value='" + spreadL.toString() + "'><button onclick='increaseSpreadL("+id+")'>+</button><button onclick='decreaseSpreadL("+id+")'>-</button></td>";
			s += "<td><input type='textbox' readonly style='width: 50px;' value='" + spreadR.toString() + "'><button onclick='increaseSpreadR("+id+")'>+</button><button onclick='decreaseSpreadR("+id+")'>-</button></td>";
			s += "<td><input type='textbox' readonly style='width: 50px;' value='" + spreadO.toString() + "'><button onclick='increaseSpreadO("+id+")'>+</button><button onclick='decreaseSpreadO("+id+")'>-</button></td>";
			s += "<td><input type='textbox' readonly style='width: 50px;' value='" + spreadS.toString() + "'><button onclick='increaseSpreadS("+id+")'>+</button><button onclick='decreaseSpreadS("+id+")'>-</button></td>";
			s += "<td>";
			s += "<button style='padding: 0px;' onclick='setShape("+id+",-2)'><div style='width: 20px;"; if (shape == -2) s += " background-color: #00FFFF;"; s += "'>L</div></button>";
			s += "<button style='padding: 0px;' onclick='setShape("+id+",-1)'><div style='width: 20px;"; if (shape == -1) s += " background-color: #00FFFF;"; s += "'>-</div></button>";
			s += "<button style='padding: 0px;' onclick='setShape("+id+", 0)'><div style='width: 20px;"; if (shape ==  0) s += " background-color: #00FFFF;"; s += "'>N</div></button>";
			s += "<button style='padding: 0px;' onclick='setShape("+id+", 1)'><div style='width: 20px;"; if (shape ==  1) s += " background-color: #00FFFF;"; s += "'>-</div></button>";
			s += "<button style='padding: 0px;' onclick='setShape("+id+", 2)'><div style='width: 20px;"; if (shape ==  2) s += " background-color: #00FFFF;"; s += "'>R</div></button>";
			s += "</td></tr>";
		}
	}
	s += "<tr>";
	s += "<td></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadL()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadR()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadO()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadS()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='hideCustomDispersion()'>OK</button></td>";
	s += "</tr>";
	s += "</table>";
	document.getElementById('customdispersiondiv').innerHTML = s;
}

function setShape(club, shape)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubShape(i, shape); }
	else setClubShape(club, shape);
	refreshCustomDispersion();
}

function increaseSpreadL(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadL(i, getClubSpreadL(i)+1); }
	else setClubSpreadL(club, getClubSpreadL(club)+1);
	refreshCustomDispersion();
}

function decreaseSpreadL(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadL(i, getClubSpreadL(i)-1); }
	else setClubSpreadL(club, getClubSpreadL(club)-1);
	refreshCustomDispersion();
}

function increaseSpreadR(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadR(i, getClubSpreadR(i)+1); }
	else setClubSpreadR(club, getClubSpreadR(club)+1);
	refreshCustomDispersion();
}

function decreaseSpreadR(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadR(i, getClubSpreadR(i)-1); }
	else setClubSpreadR(club, getClubSpreadR(club)-1);
	refreshCustomDispersion();
}

function increaseSpreadO(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadO(i, getClubSpreadO(i)+1); }
	else setClubSpreadO(club, getClubSpreadO(club)+1);
	refreshCustomDispersion();
}

function decreaseSpreadO(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadO(i, getClubSpreadO(i)-1); }
	else setClubSpreadO(club, getClubSpreadO(club)-1);
	refreshCustomDispersion();
}

function increaseSpreadS(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadS(i, getClubSpreadS(i)+1); }
	else setClubSpreadS(club, getClubSpreadS(club)+1);
	refreshCustomDispersion();
}

function decreaseSpreadS(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadS(i, getClubSpreadS(i)-1); }
	else setClubSpreadS(club, getClubSpreadS(club)-1);
	refreshCustomDispersion();
}

function resetSpreadL()
{
	if (!confirm("Reset Left Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadL(i, getClubSpreadLDefault(i));
	refreshCustomDispersion();
}

function resetSpreadR()
{
	if (!confirm("Reset Right Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadR(i, getClubSpreadRDefault(i));
	refreshCustomDispersion();
}

function resetSpreadO()
{
	if (!confirm("Reset Long Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadO(i, getClubSpreadODefault(i));
	refreshCustomDispersion();
}

function resetSpreadS()
{
	if (!confirm("Reset Short Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadS(i, getClubSpreadSDefault(i));
	refreshCustomDispersion();
}

function hideCustomDispersion()
{
	document.getElementById('customdispersiondiv').style.display = 'none';
	refreshView();
}

function customDispersionEditHandler()
{
	var x = document.getElementById('customdispersiondiv');
	if (x.style.display == 'none')
	{
		x.style.display = '';
		refreshCustomDispersion();
	}
	else
	{
		x.style.display = 'none';
		refreshView();
	}
}

function selectNRLHandler()
{
	setMode(0);
	setNRL(document.getElementById('nrlselect').selectedIndex.toString());
	refreshView();
}

function initLineColor()
{
	document.getElementById('linecolorselect').selectedIndex = getLineColor();
}

function selectLineColorHandler()
{
	setMode(0);
	setLineColor(document.getElementById('linecolorselect').selectedIndex.toString());
	refreshView();
}

function initLineBrightness()
{
	document.getElementById('linebrightnessselect').selectedIndex = getLineBrightness();
}

function selectLineBrightnessHandler()
{
	setMode(0);
	setLineBrightness(document.getElementById('linebrightnessselect').selectedIndex.toString());
	refreshView();
}

function initCircleColor()
{
	document.getElementById('circlecolorselect').selectedIndex = getCircleColor();
}

function selectCircleColorHandler()
{
	setMode(0);
	setCircleColor(document.getElementById('circlecolorselect').selectedIndex.toString());
	refreshView();
}

function initCircleBrightness()
{
	document.getElementById('circlebrightnessselect').selectedIndex = getCircleBrightness();
}

function selectCircleBrightnessHandler()
{
	setMode(0);
	setCircleBrightness(document.getElementById('circlebrightnessselect').selectedIndex.toString());
	refreshView();
}

function initAutoRotate()
{
	document.getElementById('autorotateselect').selectedIndex = getAutoRotate();
}

function selectAutoRotateHandler()
{
	setMode(0);
	setAutoRotate(document.getElementById('autorotateselect').selectedIndex.toString());
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 3);
}

function populateCourseSelect()
{
	var x = document.getElementById('courseselect');
	
	while (x.length > 0)
		x.remove(x.length - 1);

	x.add(new Option("<New Course>", "0"), null);

	var n = getNumCourses();
	for (var i = 0; i < n; ++i)
	{
		var name = getCourseName(i);
		var id = getCourseID(i).toString();
		var j = 1;
		while (j < x.length && name > x.options[j].text)
			++j;
		if (j < x.length)
			x.add(new Option(name, id), j);
		else
			x.add(new Option(name, id));
	}
}

function currentCourseID()
{
	return Number(document.getElementById("courseselect").value);
}

function currentHole()
{
	return Number(document.getElementById("holeselect").value);
}

function currentShot()
{
	return Number(document.getElementById("shotselect").value);
}

function setSelectedCourse(courseID)
{
	var x = document.getElementById("courseselect");
	for (var i = 0; i < x.length; ++i)
	{
		if (Number(x.options[i].value) == courseID)
			x.selectedIndex = i;
	}
}

function setSelectedHole(hole)
{
	if (hole < 0)
		hole = 18;
	if (hole > 18)
		hole = 0;
	document.getElementById("holeselect").selectedIndex = hole;
	setSelectedShot(0);
}

function setSelectedShot(shot)
{
	if (currentHole() <= 0)
		shot = 0;
	else
	{
		var max = getCourseHolePar(currentCourseID(), currentHole()) - 1;
		if (max < 0)
			max = 0;
		if (shot < 0)
			shot = max;
		if (shot > max)
			shot = 0;
	}
	document.getElementById("shotselect").selectedIndex = shot;
}

function selectCourseHandler()
{
	setMode(0);
	hideWeather();
	document.getElementById("saveasinput").value = "";
	document.getElementById("savebutton").style.backgroundColor = "";
	initCourseData(0);
	setSelectedHole(0);
	document.getElementById("layerselect").selectedIndex = 0;
	layerSelectHandler();
	document.getElementById("terrainselect").selectedIndex = 0;
	terrainSelectHandler();
	if (mapMode == 2) toggle3D();
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 5);
}

function selectHoleHandler()
{
	setMode(0);
	setSelectedShot(0);
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectShotHandler()
{
	setMode(0);
	setSelectedShot(currentShot());
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 2);
}

function selectNextHoleHandler()
{
	setMode(0);
	setSelectedHole(currentHole() + 1);
	setSelectedShot(0);
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectPrevHoleHandler()
{
	setMode(0);
	setSelectedHole(currentHole() - 1);
	setSelectedShot(0);
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectNextShotHandler()
{
	if (currentHole() < 1)
	{
		selectNextHoleHandler();
		return;
	}
	setMode(0);
	setSelectedShot(currentShot() + 1);
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 2);
}

function selectPrevShotHandler()
{
	if (currentHole() < 1)
	{
		selectPrevHoleHandler();
		return;
	}
	setMode(0);
	setSelectedShot(currentShot() - 1);
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 2);
}

function toggle3D()
{
	setMode(0);
	if (mapMode == 1)
	{
		mapMode = 2;
		document.getElementById('toggle3dbutton').innerHTML = "2D/<b>3D</b>";
		document.getElementById('2dcontrolsdiv').style.display = "none";
		document.getElementById('3dcontrolsdiv').style.display = "";
		viewer.scene.globe.maximumScreenSpaceError = 2.0;
	}
	else
	{
		mapMode = 1;
		document.getElementById('toggle3dbutton').innerHTML = "<b>2D</b>/3D";
		document.getElementById('3dcontrolsdiv').style.display = "none";
		document.getElementById('2dcontrolsdiv').style.display = "";
		viewer.scene.globe.maximumScreenSpaceError = 1.0;
	}
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 3);
}

var heightMultiplier = get3DHeightMultiplier();
var offsetMultiplier = get3DOffsetMultiplier();
var angleIncrement   = get3DAngleIncrement();

function heightPlusHandler()
{
	heightMultiplier *= 1.1;
	set3DHeightMultiplier(heightMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function heightMinusHandler()
{
	if (30 * heightMultiplier > 2.0) heightMultiplier /= 1.1;
	set3DHeightMultiplier(heightMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function heightResetHandler()
{
	heightMultiplier = 1.0;
	set3DHeightMultiplier(heightMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function offsetPlusHandler()
{
	offsetMultiplier *= 1.1;
	set3DOffsetMultiplier(offsetMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function offsetMinusHandler()
{
	if (60 * offsetMultiplier > 5) offsetMultiplier /= 1.1;
	set3DOffsetMultiplier(offsetMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function offsetResetHandler()
{
	offsetMultiplier = 1.0;
	set3DOffsetMultiplier(offsetMultiplier)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function anglePlusHandler()
{
	if (angleIncrement < 5) angleIncrement += 1.0;
	set3DAngleIncrement(angleIncrement)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function angleMinusHandler()
{
	if (angleIncrement > -45) angleIncrement -= 1.0;
	set3DAngleIncrement(angleIncrement)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function angleResetHandler()
{
	angleIncrement = 0.0;
	set3DAngleIncrement(angleIncrement)
	zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), true, true, 1);
}

function saveCourseAsHandler()
{
	setMode(0);
	var id1 = currentCourseID();
	var par = getCoursePar(id1);
	if (par == 0)
	{
		alert("Please map at least one hole.");
		return;
	}
	var courseName = cleanString(document.getElementById("saveasinput").value);
	if (courseName == "")
	{
		alert("Please enter course name.");
		return;
	}
	if (getCourseIDFromName(courseName) > 0)
	{
		alert(courseName + " already exists.\nPlease enter unique name.");
		return;
	}
	var id2 = createCourse(courseName);
	copyCourseData(id1, id2);
	initCourseData(0);
	populateCourseSelect();
	setSelectedCourse(id2);
	document.getElementById("saveasinput").value = "";
	document.getElementById("savebutton").style.backgroundColor = "";
}

function setInfoDiv1(s)
{
	var x = document.getElementById('infodiv1');
	x.innerHTML = s;
}

function setInfoDiv2(s)
{
	var x = document.getElementById('infodiv2');
	x.innerHTML = s;
}

function setInfoDiv3(s)
{
	var x = document.getElementById('infodiv3');
	x.innerHTML = s;
}

function setInfoDiv4(s)
{
	var x = document.getElementById('infodiv4');
	x.innerHTML = s;
}

function clearInfo()
{
	setInfoDiv1("&nbsp;");
	setInfoDiv2("&nbsp;");
	setInfoDiv3("&nbsp;");
	setInfoDiv4("&nbsp;");
}

function setHelpInfo()
{
	setInfoDiv1("Select course from drop-down list above.");
	setInfoDiv2("Or search pre-mapped courses <a href='features/atoz.php'>here</a>.");
	setInfoDiv3("Or map new course using buttons below.");
	setInfoDiv4("&nbsp;");
}

function setInfo()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var shot = currentShot();
	var info = "&nbsp;";

	if (hole == 0)
	{

		var par = getCoursePar(courseID);
		var len = getCourseLength(courseID);
		if (par == 0 || len == 0)
		{
			setHelpInfo();
			return;
		}
		else
		{
			info = "Par " + par.toString() + ", " + len.toString() + " " + myUnitName();
		}
	}
	else
	{
		var teeLat = getCourseHoleTeeLat(courseID, hole);
		var teeLon = getCourseHoleTeeLon(courseID, hole);
		var pinLat = getCourseHolePinLat(courseID, hole);
		var pinLon = getCourseHolePinLon(courseID, hole);
		if (teeLat == 0 && teeLon == 0)
		{
			info = "Set Tee Position";
		}
		else if (pinLat == 0 && pinLon == 0)
		{
			info = "Set Pin Position";
		}
		else
		{
			var par = getCourseHolePar(courseID, hole);
			var len = getCourseHoleLength(courseID, hole);
			info = "Par " + par.toString() + ", " + len.toString() + " " + myUnitName();
			if (par >= 4)
			{
				info += " (";
				for (var i = 1; i <= par - 2; ++i)
				{
					if (i > 1)
						info += " + ";
					info += getCourseHoleShotLength(courseID, hole, i).toString();
				}
				info += ")";
			}
		}
	}

	setInfoDiv1(info);
}

function setDistDiv(s)
{
	document.getElementById('distanceDiv').innerHTML = s;
}

function setDistDiv1(s)
{
	document.getElementById('distanceDiv1').innerHTML = s;
}

function setDistDiv2(s)
{
	document.getElementById('distanceDiv2').innerHTML = s;
}

function setDistDiv3(s)
{
	document.getElementById('distanceDiv3').innerHTML = s;
}

function mapLeftClickHandler(click)
{
	mapClickHandler(click, 1);
}

function mapRightClickHandler(click)
{
	mapClickHandler(click, 2);
}

function mapMouseMoveHandler(move)
{
	if (mode == 3 || mode == 4 || mode == 5)
	{
		var mousePos = new Cesium.Cartesian2(move.endPosition.x, move.endPosition.y);
		var ray = viewer.camera.getPickRay(mousePos);
		var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		if (!cartesian) return;
		var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
		var lat = Cesium.Math.toDegrees(cartographic.latitude);
		var lon = Cesium.Math.toDegrees(cartographic.longitude);
		var courseID = currentCourseID();
		var hole = currentHole();
		var lat1 = getCourseHoleTeeLat(courseID, hole);
		var lon1 = getCourseHoleTeeLon(courseID, hole);
		var lat2 = getCourseHolePinLat(courseID, hole);
		var lon2 = getCourseHolePinLon(courseID, hole);
		if (mode == 4)
		{
			lat1 = getCourseHoleTargetLat(courseID, hole, 1);
			lon1 = getCourseHoleTargetLon(courseID, hole, 1);
		}
		if (mode == 5)
		{
			lat1 = getCourseHoleTargetLat(courseID, hole, 2);
			lon1 = getCourseHoleTargetLon(courseID, hole, 2);
		}
		if (lat1 != 0 || lon1 != 0)
		{
			var d = geogDist(lat1, lon1, lat, lon);
			var s = Math.round(metresToMyUnits(d)).toString();
			if (lat2 != 0 || lon2 != 0)
			{
				d = geogDist(lat, lon, lat2, lon2);
				s += " + " + Math.round(metresToMyUnits(d)).toString();
			}
			if      (mode == 3) setDistDiv1(s);
			else if (mode == 4) setDistDiv2(s);
			else if (mode == 5) setDistDiv3(s);
		}
	}
	if (mode == 6 || mode == 7)
	{
		if (distLat1 == 0 && distLon1 == 0) return;
		var mousePos = new Cesium.Cartesian2(move.endPosition.x, move.endPosition.y);
		var ray = viewer.camera.getPickRay(mousePos);
		var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		if (!cartesian) return;
		var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
		var lat = Cesium.Math.toDegrees(cartographic.latitude);
		var lon = Cesium.Math.toDegrees(cartographic.longitude);
		distLat2 = Math.round(lat*999999)/999999;
		distLon2 = Math.round(lon*999999)/999999;
		var d = geogDist(distLat1, distLon1, distLat2, distLon2);
		setDistDiv(formatDist(d));
	}
}

function mapClickHandler(click, button)
{
	var mousePos = new Cesium.Cartesian2(click.position.x, click.position.y);
	var ray = viewer.camera.getPickRay(mousePos);
	//var cartesian = viewer.camera.pickEllipsoid(mousePos, viewer.scene.globe.ellipsoid);
	var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

	if (!cartesian)
		return;

	var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

	var lat = Cesium.Math.toDegrees(cartographic.latitude);
	var lon = Cesium.Math.toDegrees(cartographic.longitude);

	var courseID = currentCourseID();
	var hole = currentHole();

	document.getElementById('coordsdiv').innerHTML = "";
	var s = document.getElementById('saveasinput').value;
	if (s != null && s.indexOf('!!stimp') == 0)
	{
		var coords = "<table>";
		var r = -0.05;
		while (r > -0.20)
		{
			var dt = 0.05;
			var s = 0.0;
			var v = 1.8;//1.83;
			while (v > 0.01)
			{
				s += v*dt;
				var dv = deltaPuttSpeed(v, 0.0, 0.0, r, dt);
				if (dv < 0.0)
					v += dv;
				else
				{
					dv = deltaPuttSpeed(v, 0.0, 0.0, r, dt);
					v = 0.0;
				}
			}
			var feet = s * 3.0 * 1760.0 / 1609.344;
			if (Math.round(feet*1000) % 1000 == 0)
			{
				coords += "<tr>";
				coords += "<td>" + (Math.round(feet*1000)/1000).toString() + "</td>";
				coords += "<td>" + (Math.round(r*10000)/10000).toString() + "</td>";
				coords += "</tr>";
			}
			r -= 0.000005;
		}
		coords += "</table>";
		document.getElementById('coordsdiv').innerHTML = coords;
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!dispersion') == 0)
	{
		var coords = "<table>";
		for (yards = 100; yards <= 300; yards += 10)
		{
			for (k = 0; k <= 10; ++k)
			{
			var dispersionMultiplier = 1.0 + k*0.1;
			var sumX2 = 0;
			var sumY2 = 0;
			var sumR2 = 0;
			var sumR = 0;
			var dist = yards * 1609.344 / 1760;
			for (var i = 0; i < 100000; ++i)
			{
				// Distance Error
				// -8% to +6%
				var x = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
				x = 14*x - 7; // Normal distribution -7 .. +7
				if (dist < 90) x *= 1 + (90 - dist)/45; // Distance error gradually increases below 90 metres
				x = x - 1; // Normal distribution -8 .. +6
				x = x*dist/100; // Normal distribution -8% .. +6%
				if (x < 0) x *= dispersionMultiplier;

				// Direction Error
				// +/- 3/5/7 degrees at 100/200/300 yards
				var max = 1 + 2*dist/90; // 3/5/7 at 100/200/300 yards
				var y = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
				y = 2*max*y - max; // Normal distribution -max .. +max
				y *= dispersionMultiplier;
				y = (dist + x)*y*Math.PI/180; // Convert degrees to metres

				// Wind and bounce
				// Up to 5% in random direction
				var z = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
				z = 10*z - 5; // Normal distribution -5 .. +5
				var dist2 = z*dist/100; // Normal distribution -5% .. +5%
				var theta = Math.random()*2*Math.PI;
				x += dist2*Math.cos(theta);
				y += dist2*Math.sin(theta);

				sumX2 += x*x;
				sumY2 += y*y;
				sumR2 += x*x + y*y;
				sumR += Math.sqrt(x*x + y*y);
			}
			// 95% confidence = 2 standard deviations (4 for spread)
			// 99.7% confidence = 3 standard deviations (6 for spread)
			var spreadX = Math.round(6*100*(Math.sqrt(sumX2/100000))*1760/1609.344)/100; // Long/Short
			var spreadY = Math.round(6*100*(Math.sqrt(sumY2/100000))*1760/1609.344)/100; // Left/Right
			var spreadR = Math.round(6*100*(Math.sqrt(sumR2/100000))*1760/1609.344)/100; // Total
			var proximity = Math.round(100*(sumR/100000)*1760/1609.344)/100;
			if (k == 0) coords += "<tr><td>" + yards.toString() + "</td>";
			coords += "<td>&nbsp;" + spreadY.toString() + "</td>";
			}
			coords += "</tr>";
		}
		coords += "</table>";
		document.getElementById('coordsdiv').innerHTML = coords;
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!coords1') == 0)
	{
		document.getElementById('coordsdiv').innerHTML =
			(Math.round(lat*1000000)/1000000.0).toString() + "," +
			(Math.round(lon*1000000)/1000000.0).toString() + "," +
			(Math.round(getProVisualizerTerrainHeight(lat,lon)*100)/100.0);
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!coords2') == 0)
	{
		var coords = "";
		coords += (Math.round(getCourseHoleTeeLat(courseID,hole)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTeeLon(courseID,hole)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHolePinLat(courseID,hole)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHolePinLon(courseID,hole)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLat(courseID,hole,1)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLon(courseID,hole,1)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLat(courseID,hole,2)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLon(courseID,hole,2)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLat(courseID,hole,3)*1000000)/1000000.0).toString() + ",";
		coords += (Math.round(getCourseHoleTargetLon(courseID,hole,3)*1000000)/1000000.0).toString();
		document.getElementById('coordsdiv').innerHTML = coords;
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!coords3') == 0)
	{
		var minLat = getCourseMinLat(courseID) - 0.001;
		var maxLat = getCourseMaxLat(courseID) + 0.001;
		var minLon = getCourseMinLon(courseID) - 0.001;
		var maxLon = getCourseMaxLon(courseID) + 0.001;
		var coords = "<small>";
		coords += "function elevationOverride_XXXX(lat, lon)<br/>{<br/>";
		coords += "if (lat > "+minLat.toString()+" && lat < "+maxLat.toString()+" && lon > "+minLon.toString()+" && lon < "+maxLon.toString()+")<br/>{<br/>var e;<br/>";
		for (var hole = 1; hole <= 18; ++hole)
		{
			coords += "e = elevHole(lat,lon,";
			coords += (Math.round(getCourseHoleTeeLat(courseID,hole)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTeeLon(courseID,hole)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHolePinLat(courseID,hole)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHolePinLon(courseID,hole)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLat(courseID,hole,1)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLon(courseID,hole,1)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLat(courseID,hole,2)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLon(courseID,hole,2)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLat(courseID,hole,3)*1000000)/1000000.0).toString() + ",";
			coords += (Math.round(getCourseHoleTargetLon(courseID,hole,3)*1000000)/1000000.0).toString();
			coords += ",,,,,,20,40,40,40,30); if (e > -9999) return e;<br/>";
		}
		coords += "}<br/>return -1000000;<br/>}<br/></small>";
		document.getElementById('coordsdiv').innerHTML = coords;
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!bbox') == 0)
	{
		var buffer = 200;
		if (s.length > 6) buffer = parseInt(s.substr(6));
		var minLat = getCourseMinLat(courseID);
		var minLon = getCourseMinLon(courseID);
		var maxLat = getCourseMaxLat(courseID);
		var maxLon = getCourseMaxLon(courseID);
		minLat = Math.round(moveLat(minLat, minLon, buffer, 180)*1000000)/1000000;
		minLon = Math.round(moveLon(minLat, minLon, buffer, 270)*1000000)/1000000;
		maxLat = Math.round(moveLat(maxLat, maxLon, buffer,   0)*1000000)/1000000;
		maxLon = Math.round(moveLon(maxLat, maxLon, buffer,  90)*1000000)/1000000;
		var coords = "BBox with ";
		coords += buffer.toString() + "m buffer = ";
		coords += minLat.toString() + " ";
		coords += minLon.toString() + " ";
		coords += maxLat.toString() + " ";
		coords += maxLon.toString();
		document.getElementById('coordsdiv').innerHTML = coords;
		if (mode == 0)
			return;
	}
	else if (s != null && s.indexOf('!!hdt') == 0)
	{
		document.getElementById('coordsdiv').innerHTML = "";
		if (terrain1 == null || terrain1.heights == null || terrain1.heights.length != terrain1NumLat * terrain1NumLon) { alert("No terrain!"); return; }
		var minH = 9999;
		var maxH = -9999;
		var n = terrain1NumLat * terrain1NumLon;
		for (var i = 0; i < n; ++i)
		{
			var h = terrain1.heights[i];
			if (h >= 0 && h < 9999)
			{
				if (h < minH) minH = h;
				if (h > maxH) maxH = h;
			}
		}
		if (maxH < 0) return;
		var minLat = Math.round(terrain1MinLat*1000000)/1000000.0;
		var maxLat = Math.round(terrain1MaxLat*1000000)/1000000.0;
		var minLon = Math.round(terrain1MinLon*1000000)/1000000.0;
		var maxLon = Math.round(terrain1MaxLon*1000000)/1000000.0;
		var avgLat = (minLat + maxLat)/2;
		var dLat = geogDist(minLat, minLon, maxLat, minLon);
		var dLon = geogDist(avgLat, minLon, avgLat, maxLon);
		var res = 1;
		if (s.indexOf('!!hdt2') == 0) res = 2;
		if (s.indexOf('!!hdt3') == 0) res = 3;
		if (s.indexOf('!!hdt4') == 0) res = 4;
		if (s.indexOf('!!hdt5') == 0) res = 5;
		var numLat = 2 + Math.round(dLat / res);
		var numLon = 2 + Math.round(dLon / res);
		numLon = Math.round(numLon / Math.cos(avgLat*Math.PI/180.0));
		var h0 = Math.round(minH - 50);
		if (h0 < 0) h0 = 0;
		var urlPrefix = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/';
		var source = 1;
		if (minLon > -15)
		{
			urlPrefix = 'https://environment.data.gov.uk/image/rest/services/SURVEY/LIDAR_Composite_1m_DTM_2022_TSR/ImageServer/';
			source = 2;
			var k = (numLat * numLon)/16000000.0;
			if (k > 1.0) { numLat /= k; numLon /= k; }
		}
		var h00 = h0;
		while (h0 < maxH + 50)
		{
			h1 = h0 + 50;
			var colorMap = "%5B";
			for (var h = h0; h < h1; ++h)
			{
				var dh = h - h00;
				var r = 5 + 10*(Math.floor(dh)%25);
				var g = 5 + 10*(Math.floor(dh/25)%25);
				var b = 5 + 10*(Math.floor(dh/625)%25);
				if (h > h0) colorMap += ",";
				colorMap += "%5B" + h.toString() + "," + r.toString() + "," + g.toString() + "," + b.toString() + "%5D";
			}
			colorMap += "%5D";
			var url = urlPrefix + 'exportImage?f=image&bandIds=&renderingRule={"rasterFunction"%3A"Colormap",%22rasterFunctionArguments"%3A{"Colormap"%3A'+colorMap+'},"variableName"%3A"DEM"}&bbox='+minLon.toString()+'%2C'+minLat.toString()+'%2C'+maxLon.toString()+'%2C'+maxLat.toString()+'&imageSR=4326&bboxSR=4326&size='+numLon.toString()+'%2C'+numLat.toString()+'&format=png';
			window.open(url, "_blank");
			h0 = h1;
		}
		document.getElementById('coordsdiv').innerHTML = "h00 = " + h00.toString() + " ";
		document.getElementById('coordsdiv').innerHTML += "terrainList.push(";
		document.getElementById('coordsdiv').innerHTML += "{name:''";
		document.getElementById('coordsdiv').innerHTML += ",source:" + source.toString();
		document.getElementById('coordsdiv').innerHTML += ",minLat:" + minLat.toString();
		document.getElementById('coordsdiv').innerHTML += ",minLon:" + minLon.toString();
		document.getElementById('coordsdiv').innerHTML += ",maxLat:" + maxLat.toString();
		document.getElementById('coordsdiv').innerHTML += ",maxLon:" + maxLon.toString();
		document.getElementById('coordsdiv').innerHTML += ",numLat:" + numLat.toString();
		document.getElementById('coordsdiv').innerHTML += ",numLon:" + numLon.toString();
		document.getElementById('coordsdiv').innerHTML += "});";
		if (mode == 0)
			return;
	}

	var repeatDispersionCount = 0;
	if (dispersionMode == 1)
		repeatDispersionCount = mapMarkers2.length;

	dispersionMode = 0;

	if (mode == 0)
	{
		if (hole > 0)
		{
			var lat2 = getCourseHolePinLat(courseID, hole);
			var lon2 = getCourseHolePinLon(courseID, hole);
			if (geogDist(lat, lon, lat2, lon2) < 0.5) { lat = lat2; lon = lon2; }
			if ((greenSlopesCount > 0 || greenContoursCount > 0) && geogDist(lat, lon, lat2, lon2) < myUnitsToMetres(50))
			{
				var opToRemove = (button == 1 ? 1 : 2);
				if (removePuttHistory(opToRemove, lat, lon, 0.5) > 0) selectGreenSlopesHandler();
				else if (button == 1) addPuttLine(lat, lon);
				else setPuttTarget(lat, lon);
				return;
			}
			if (geogDist(lat, lon, lat2, lon2) < 10) { setPinHandler(); dispersionMode = 1; return; }
			lat2 = getCourseHoleTeeLat(courseID, hole);
			lon2 = getCourseHoleTeeLon(courseID, hole);
			if (geogDist(lat, lon, lat2, lon2) < 10) { setTeeHandler(); dispersionMode = 1; return; }
			lat2 = getCourseHoleTargetLat(courseID, hole, 1);
			lon2 = getCourseHoleTargetLon(courseID, hole, 1);
			if (geogDist(lat, lon, lat2, lon2) < 10) { setTargetHandler(1); dispersionMode = 1; return; }
			lat2 = getCourseHoleTargetLat(courseID, hole, 2);
			lon2 = getCourseHoleTargetLon(courseID, hole, 2);
			if (geogDist(lat, lon, lat2, lon2) < 10) { setTargetHandler(2); dispersionMode = 1; return; }
			lat2 = getCourseHoleTargetLat(courseID, hole, 3);
			lon2 = getCourseHoleTargetLon(courseID, hole, 3);
			if (geogDist(lat, lon, lat2, lon2) < 10) { setTargetHandler(3); dispersionMode = 1; return; }
		}
		return;
	}

	if (mode == 6)
	{
		if (distLat1 == 0 && distLon1 == 0)
		{
			distLat1 = Math.round(lat*999999)/999999;
			distLon1 = Math.round(lon*999999)/999999;
			setDistDiv("Click End");
		}
		else
		{
			distLat2 = Math.round(lat*999999)/999999;
			distLon2 = Math.round(lon*999999)/999999;
			var d = geogDist(distLat1, distLon1, distLat2, distLon2);
			if (d < 5) return;
			addDist(distLat1, distLon1, distLat2, distLon2);
			if (button == 2) setMode(0);
			setDistDiv(formatDist(d));
			var i = getCourseHoleMeasures(courseID, hole);
			setCourseHoleMeasure(courseID, hole, i, encodeMeasure(distLat1, distLon1, distLat2, distLon2));
			distLat1 = 0;
			distLon1 = 0;
		}
		return;
	}

	if (mode == 7)
	{
		distLat2 = Math.round(lat*999999)/999999;
		distLon2 = Math.round(lon*999999)/999999;
		var d = geogDist(distLat1, distLon1, distLat2, distLon2);
		if (d < 5) return;
		addDist(distLat1, distLon1, distLat2, distLon2);
		if (button == 2) setMode(0);
		setDistDiv(formatDist(d));
		var i = getCourseHoleMeasures(courseID, hole);
		setCourseHoleMeasure(courseID, hole, i, encodeMeasure(distLat1, distLon1, distLat2, distLon2));
		return;
	}

	if (mode == 8)
	{
		var n = getCourseHoleMeasures(courseID, hole);
		var best = -1;
		var bestDist = 2;
		for (var i = 0; i < n; ++i)
		{
			var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
			var d = geogDist(lat, lon, x.lat1, x.lon1) + geogDist(lat, lon, x.lat2, x.lon2) - geogDist(x.lat1, x.lon1, x.lat2, x.lon2);
			if (d < bestDist) { best = i; bestDist = d; }
		}
		if (best >= 0)
		{
			for (var j = best; j < n - 1; ++j)
				setCourseHoleMeasure(courseID, hole, j, getCourseHoleMeasure(courseID, hole, j + 1));
			deleteCourseHoleMeasure(courseID, hole, n - 1);
			refreshView();
			--n;
			if (n == 0) setMode(0);
			else setDistDiv("Click Map");
			if (mapMode == 2 && n > 0)
			{
				for (var k = 0; k < n; ++k)
				{
					var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, k));
					addDist(x.lat1, x.lon1, x.lat2, x.lon2);
				}
			}
			return;
		}
		setMode(0);
		return;
	}

	if (mode == 9)
	{
		if (activeSymbol == 'Z')
		{
			var n = getCourseHoleSymbols(courseID, hole);
			var best = -1;
			var bestDist = 10;
			for (var i = 0; i < n; ++i)
			{
				var x = decodeSymbol(getCourseHoleSymbol(courseID, hole, i));
				var d = geogDist(lat, lon, x.lat, x.lon);
				if (d < bestDist) { best = i; bestDist = d; }
			}
			if (best >= 0)
			{
				for (var j = best; j < n - 1; ++j)
					setCourseHoleSymbol(courseID, hole, j, getCourseHoleSymbol(courseID, hole, j + 1));
				deleteCourseHoleSymbol(courseID, hole, n - 1);
				refreshView();
				--n;
				if (n == 0) setMode(0);
				return;
			}
			setMode(0);
			return;
		}
		else
		{
			var n = getCourseHoleSymbols(courseID, hole);
			if (n >= 50)
			{
				alert("Max 50 symbols per hole.");
				setMode(0);
				return;
			}
			var theta = 0 - getCourseHoleBearing(courseID, hole);
			addSymbol(lat, lon, activeSymbol, theta);
			setCourseHoleSymbol(courseID, hole, n, encodeSymbol(lat, lon, activeSymbol));
			if (activeSymbol != 'T' && activeSymbol != 'X') setMode(0);
			return;
		}
	}

	if (hole == 0)
	{
		setMode(0);
		return;
	}

	if (mode == 1)
	{
		setCourseHoleTeeLat(courseID, hole, lat);
		setCourseHoleTeeLon(courseID, hole, lon);
	}
	else if (mode == 2)
	{
		setCourseHolePinLat(courseID, hole, lat);
		setCourseHolePinLon(courseID, hole, lon);
	}
	else if (mode >= 3 && mode <= 5)
	{
		setCourseHoleTargetLat(courseID, hole, mode - 2, lat);
		setCourseHoleTargetLon(courseID, hole, mode - 2, lon);
	}

	if (courseID == 0)
		document.getElementById("savebutton").style.backgroundColor = "#FF8888";

	if (button == 1)
		setMode(0);

	normalizeCourseHoleTargets(courseID, hole);
	refreshView();

	while (mapMarkers2.length < repeatDispersionCount)
		dispersionHandler();
}

function searchHandler()
{
	var searchstring = document.getElementById("saveasinput").value;
	if (searchstring == null) searchstring = "";
	searchstring = cleanString(searchstring);
	if (searchstring == "")
	{
		alert("Please enter course address, town or postcode.");
		return;
	}
	setMode(0);
	initCourseData(0);
	setSelectedCourse(0);
	setSelectedHole(1);
	refreshView();
	document.getElementById("savebutton").style.backgroundColor = "";
	doXHR("findonmap", "s=" + searchstring);
	if (window.XMLHttpRequest)
	{
		var req = 'https://nominatim.openstreetmap.org/search?q=' + searchstring + '&format=json&polygon=0&addressdetails=0';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
				searchResultHandler(xhr.responseText);
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function searchResultHandler(responseText)
{
	var results = JSON.parse(responseText);
	if (results == null || results.length < 1)
	{
		alert('Address not found. Please try again.');
		return;
	}

	var bb = results[0].boundingbox;
	if (bb && bb.length == 4)
	{
		var lat1 = Number(bb[0]);
		var lat2 = Number(bb[1]);
		var lon1 = Number(bb[2]);
		var lon2 = Number(bb[3]);
		zoomToBounds(lat1,lat2,lon1,lon2);
	}
	else
	{
		alert("Search result has no bounding box. Please try again.");
	}
}

function zoomToBounds(minLat, maxLat, minLon, maxLon)
{
	var lat = (minLat + maxLat) / 2;
	var lon = (minLon + maxLon) / 2;
	var height = geogDist(minLat, minLon, maxLat, maxLon);
	if (height < 1000) height = 1000;
	if (height > 1000000) height = 1000000;
	var heading = 0;
	var angle = -90;
	var durationSeconds = 3;
	flyToHeightAboveGround(lat, lon, lat, lon, height, heading, angle, durationSeconds);
}

function setTeeHandler()
{
	if (currentHole() == 0)
	{
		alert("Please select hole.");
	}
	else if (mode == 1)
	{
		setMode(0);
	}
	else
	{
		setMode(1);
	}
}

function setPinHandler()
{
	if (currentHole() == 0)
	{
		alert("Please select hole.");
	}
	else if (mode == 2)
	{
		setMode(0);
	}
	else
	{
		setMode(2);
	}
}

function setTargetHandler(i)
{
	if (currentHole() == 0)
	{
		alert("Please select hole.");
	}
	else if (mode == 2 + i)
	{
		setMode(0);
	}
	else
	{
		setMode(2 + i);
	}
}

function zoomTeeHandler()
{
	setMode(0);
	if (currentHole() == 0) { alert('Please select hole.'); return; }
	var lat = getCourseHoleTeeLat(currentCourseID(), currentHole());
	var lon = getCourseHoleTeeLon(currentCourseID(), currentHole());
	if (lat == 0 && lon == 0) return;
	var h = 90 + (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	if ((mapMode == 1 && Math.abs(viewer.camera.positionCartographic.height - h) < 0.1) || (mapMode == 2 && viewer.camera.pitch < - Math.PI / 3))
	{
		zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), false, false, 2)
		return;
	}
	var height = 90;
	var heading = viewer.camera.heading * 180 / Math.PI;
	var angle = -90;
	var durationSeconds = 2;
	flyToHeightAboveGround(lat, lon, lat, lon, height, heading, angle, durationSeconds);
}

function zoomPinHandler()
{
	setMode(0);
	if (currentHole() == 0) { alert('Please select hole.'); return; }
	var lat = getCourseHolePinLat(currentCourseID(), currentHole());
	var lon = getCourseHolePinLon(currentCourseID(), currentHole());
	if (lat == 0 && lon == 0) return;
	var h = 60 + (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	if ((mapMode == 1 && Math.abs(viewer.camera.positionCartographic.height - h) < 0.1) || (mapMode == 2 && viewer.camera.pitch < - Math.PI / 3))
	{
		zoomToCourseHoleShot(currentCourseID(), currentHole(), currentShot(), false, false, 2)
		return;
	}
	var height = 60;
	var heading = viewer.camera.heading * 180 / Math.PI;
	var angle = -90;
	var durationSeconds = 2;
	flyToHeightAboveGround(lat, lon, lat, lon, height, heading, angle, durationSeconds);
}

function clearTeeHandler()
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTeeLat(currentCourseID(), currentHole(), 0);
	setCourseHoleTeeLon(currentCourseID(), currentHole(), 0);
	refreshView();
}

function clearPinHandler()
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHolePinLat(currentCourseID(), currentHole(), 0);
	setCourseHolePinLon(currentCourseID(), currentHole(), 0);
	refreshView();
}

function clearTargetHandler(i)
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTargetLat(currentCourseID(), currentHole(), i, 0);
	setCourseHoleTargetLon(currentCourseID(), currentHole(), i, 0);
	normalizeCourseHoleTargets(currentCourseID(), currentHole());
	refreshView();
}

function setTargetMaxHandler(i)
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTargetMax(currentCourseID(), currentHole(), i);
	normalizeCourseHoleTargets(currentCourseID(), currentHole());
	refreshView();
}

function setTargetDeltaHandler(i, delta)
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTargetDelta(currentCourseID(), currentHole(), i, delta);
	normalizeCourseHoleTargets(currentCourseID(), currentHole());
	refreshView();
}

function setTargetPlusHandler(i)
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTargetDelta(currentCourseID(), currentHole(), i, 5);
	normalizeCourseHoleTargets(currentCourseID(), currentHole());
	refreshView();
}

function setTargetMinusHandler(i)
{
	setMode(0);
	if (currentHole() == 0) return;
	setCourseHoleTargetDelta(currentCourseID(), currentHole(), i, -5);
	normalizeCourseHoleTargets(currentCourseID(), currentHole());
	refreshView();
}

function teeGridHandler()
{
	if (teeGridCount >= 1)
	{
		refreshView();
		return;
	}

	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee position.")
		return;
	}
	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);
	if (par >= 4)
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		lon2 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
	{
		alert("Tee/Targets/Pin too close together.");
		return;
	}
	var bearingY = geogBearing(lat1, lon1, lat2, lon2);
	var dLatY = moveLat(lat2, lon2, myUnitsToMetres(1), bearingY) - lat2;
	var dLonY = moveLon(lat2, lon2, myUnitsToMetres(1), bearingY) - lon2;
	var bearingX = bearingY + 90;
	var dLatX = moveLat(lat2, lon2, myUnitsToMetres(1), bearingX) - lat2;
	var dLonX = moveLon(lat2, lon2, myUnitsToMetres(1), bearingX) - lon2;
	var circleBrightness = document.getElementById('circlebrightnessselect').selectedIndex;
	var gridBrightness1 = 0.040 * circleBrightness;
	var gridBrightness2 = 0.015 * circleBrightness;
	var gridColor1 = new Cesium.Color(1,1,1,gridBrightness1);
	var gridColor2 = new Cesium.Color(1,1,1,gridBrightness2);
	for (var y = -50; y <= 100; y += 10)
	{
		var coords = [];
		for (var x = -50; x <= 50; x += 2)
		{
			var lat = lat1 + y*dLatY +x*dLatX;
			var lon = lon1 + y*dLonY +x*dLonX;
			var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
			coords.push(Cesium.Cartesian3.fromDegrees(lon, lat, h));
		}
		var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: (y % 50 == 0 ? gridColor1 : gridColor2) } });
		mapLines2.push(line);
	}
	teeGridCount += 1;
}

function greenGridHandler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee position.")
		return;
	}
	if (greenGridCount == 6)
	{
		refreshView();
		return;
	}
	else if (greenGridCount == 3)
	{
		refreshView();
		if (par < 5)
			return;
		greenGridCount = 3;
	}

	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenGridCount >= 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenGridCount >= 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 2);
		lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	}
	else if (par == 6)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	}
	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
	{
		alert("Tee/Targets/Pin too close together.");
		return;
	}
	var bearingY = geogBearing(lat1, lon1, lat2, lon2);
	var dLatY = moveLat(lat2, lon2, myUnitsToMetres(1), bearingY) - lat2;
	var dLonY = moveLon(lat2, lon2, myUnitsToMetres(1), bearingY) - lon2;
	var bearingX = bearingY + 90;
	var dLatX = moveLat(lat2, lon2, myUnitsToMetres(1), bearingX) - lat2;
	var dLonX = moveLon(lat2, lon2, myUnitsToMetres(1), bearingX) - lon2;
	var gridBrightness1 = (greenGridCount % 3 == 0 ? 0.02 : 0.01) * getCircleBrightness();
	var gridBrightness2 = 0.01 * getCircleBrightness();
	var gridColor1 = new Cesium.Color(1,1,1,gridBrightness1);
	var gridColor2 = new Cesium.Color(1,1,1,gridBrightness2);
	var step = 10;
	if (greenGridCount % 3 == 1) step = 5;
	if (greenGridCount % 3 == 2) step = 1;
	for (var y = -30; y <= 30; y += step)
	{
		var coords = [];
		for (var x = -30; x <= 30; x += 1)
		{
			var lat = lat2 + y*dLatY +x*dLatX;
			var lon = lon2 + y*dLonY +x*dLonX;
			var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
			coords.push(Cesium.Cartesian3.fromDegrees(lon, lat, h));
		}
		var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: (y % 10 == 0 ? gridColor1 : gridColor2) } });
		mapLines2.push(line);
	}
	for (var x = -30; x <= 30; x += step)
	{
		var coords = [];
		for (var y = -30; y <= 30; y += 1)
		{
			var lat = lat2 + y*dLatY +x*dLatX;
			var lon = lon2 + y*dLonY +x*dLonX;
			var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
			coords.push(Cesium.Cartesian3.fromDegrees(lon, lat, h));
		}
		var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: (x % 10 == 0 ? gridColor1 : gridColor2) } });
		mapLines2.push(line);
	}
	if (greenGridCount >= 3)
	{
		var coords = [];
		var lat3 = lat2 - 30*dLatY;
		var lon3 = lon2 - 30*dLonY;
		var h1 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat1, lon1));
		var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
		coords.push(Cesium.Cartesian3.fromDegrees(lon1, lat1, h1));
		coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
		var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: (greenGridCount == 3 ? gridColor1 : gridColor2) } });
		mapLines2.push(line);
	}
	greenGridCount += 1;
}

function selectGreenSpeedHandler()
{
	if (greenSlopesCount == 0) { greenSlopesHandler(); return; }
	var n1 = greenGridCount;
	var n2 = greenSlopesCount;
	var n3 = greenContoursCount;
	if (n2 < 1) n2 = 1;
	refreshView();
	var i = 0;
	for (i = 0; i < n1; ++i) greenGridHandler();
	for (i = 0; i < n2; ++i) greenSlopesHandler(false);
	for (i = 0; i < n3; ++i) greenContoursHandler();
	if (n2 > 0) replayPuttHistory();
}

function selectGreenSlopesHandler()
{
	if (greenSlopesCount == 0) { greenSlopesHandler(); return; }
	var n1 = greenGridCount;
	var n2 = greenSlopesCount;
	var n3 = greenContoursCount;
	if (n2 < 1) n2 = 1;
	refreshView();
	var i = 0;
	for (i = 0; i < n1; ++i) greenGridHandler();
	for (i = 0; i < n2; ++i) greenSlopesHandler(false);
	for (i = 0; i < n3; ++i) greenContoursHandler();
	if (n2 > 0) replayPuttHistory();
}

function selectGreenContoursHandler()
{
	if (greenContoursCount == 0) { greenContoursHandler(); return; }
	var n1 = greenGridCount;
	var n2 = greenSlopesCount;
	var n3 = greenContoursCount;
	if (n3 < 1) n3 = 1;
	refreshView();
	var i = 0;
	for (i = 0; i < n1; ++i) greenGridHandler();
	for (i = 0; i < n2; ++i) greenSlopesHandler(false);
	for (i = 0; i < n3; ++i) greenContoursHandler();
	if (n2 > 0) replayPuttHistory();
}

function greenSlopesHandler(clearHistory = true)
{
	setMode(0);
	if (clearHistory) clearPuttHistory();
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee position.")
		return;
	}
	if (greenSlopesCount != 0)
	{
		refreshView();
		return;
	}
	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 2);
		lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	}
	else if (par == 6)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	}
	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
	{
		alert("Tee/Targets/Pin too close together.");
		return;
	}
	var bearingY = geogBearing(lat1, lon1, lat2, lon2);
	var dLatY = moveLat(lat2, lon2, myUnitsToMetres(1), bearingY) - lat2;
	var dLonY = moveLon(lat2, lon2, myUnitsToMetres(1), bearingY) - lon2;
	var bearingX = bearingY + 90;
	var dLatX = moveLat(lat2, lon2, myUnitsToMetres(1), bearingX) - lat2;
	var dLonX = moveLon(lat2, lon2, myUnitsToMetres(1), bearingX) - lon2;
	var gridBrightness = 0.05*document.getElementById("greenslopebrightnessselect").value;
	var gridColor = [];
	gridColor[0] = new Cesium.Color(1.00, 1.00, 1.00, gridBrightness);//White
	gridColor[1] = new Cesium.Color(1.00, 1.00, 0.80, gridBrightness);
	gridColor[2] = new Cesium.Color(1.00, 1.00, 0.60, gridBrightness);
	gridColor[3] = new Cesium.Color(1.00, 1.00, 0.40, gridBrightness);
	gridColor[4] = new Cesium.Color(1.00, 1.00, 0.20, gridBrightness);
	gridColor[5] = new Cesium.Color(1.00, 1.00, 0.00, gridBrightness);//Yellow
	gridColor[6] = new Cesium.Color(0.95, 0.80, 0.00, gridBrightness);
	gridColor[7] = new Cesium.Color(0.90, 0.60, 0.00, gridBrightness);
	gridColor[8] = new Cesium.Color(0.85, 0.40, 0.00, gridBrightness);
	gridColor[9] = new Cesium.Color(0.80, 0.20, 0.00, gridBrightness);
	gridColor[10] = new Cesium.Color(0.75, 0.00, 0.00, gridBrightness);//Red
	gridColor[11] = new Cesium.Color(0.60, 0.00, 0.00, gridBrightness);
	gridColor[12] = new Cesium.Color(0.45, 0.00, 0.00, gridBrightness);
	gridColor[13] = new Cesium.Color(0.30, 0.00, 0.00, gridBrightness);
	gridColor[14] = new Cesium.Color(0.15, 0.00, 0.00, gridBrightness);
	gridColor[15] = new Cesium.Color(0.00, 0.00, 0.00, gridBrightness);//Black
	var colorFactor = 1000.0 / getRedSlope();
	var sizeIndex = document.getElementById("greenslopesizeselect").selectedIndex;
	var addNumbers = false;
	if (sizeIndex >= 4) { addNumbers = true; sizeIndex -= 4; }
	var lengthFactor = 1.0 + 0.5*sizeIndex;
	for (var x = -30; x <= 30; x += 1)
	{
		for (var y = -30; y <= 30; y += 1)
		{
			var lat3 = lat2 + y*dLatY + x*dLatX;
			var lon3 = lon2 + y*dLonY + x*dLonX;
			var hg = getProVisualizerTerrainHeightAndGradient(lat3, lon3, 0.5, bearingX, bearingY);
			var gx = hg.g1;
			var gy = hg.g2;
			var absgx = Math.abs(gx);
			var absgy = Math.abs(gy);
			var absgsum = absgx + absgy;
			if (absgsum > 0.001)
			{
				var k = 1.0;
				if (absgx > absgy) { var yx = absgy/absgx; k = Math.sqrt(1 + yx*yx); }
				else               { var xy = absgx/absgy; k = Math.sqrt(1 + xy*xy); }
				var g = (absgx + absgy)/k;
				var colorIndex = Math.floor(g*colorFactor);
				if (colorIndex > 15) colorIndex = 15;
				if (addNumbers && ((x+30) % 2 == 1) && ((y+30) % 2 == 1))
				{
					var lat4 = lat3 - (gx*dLatX + gy*dLatY);
					var lon4 = lon3 - (gx*dLonX + gy*dLonY);
					var lat5 = lat3 + (gx*dLatX + gy*dLatY);
					var lon5 = lon3 + (gx*dLonX + gy*dLonY);
					var theta = 180.0 - geogBearing(lat4, lon4, lat5, lon5);
					var k2 = (3.0 + sizeIndex)/100.0;
					var text = Math.round(g*100).toString();
					addText(text, lat3, lon3, theta, k2, k2, gridColor[colorIndex], hg.h, gx, bearingX, gy, bearingY);
				}
				else
				{
					var k2 = 2.0*lengthFactor*Math.sqrt(10*g)/(10*g);
					var g1 = k2*(gx/k);
					var g2 = k2*(gy/k);
					var lat4 = lat3 - (g1*dLatX + g2*dLatY);
					var lon4 = lon3 - (g1*dLonX + g2*dLonY);
					var lat5 = lat3 + (g1*dLatX + g2*dLatY);
					var lon5 = lon3 + (g1*dLonX + g2*dLonY);
					var d45 = geogDist(lat4, lon4, lat5, lon5);
					var b45 = geogBearing(lat4, lon4, lat5, lon5);
					var lat6 = moveLat(lat4, lon4, 0.2*d45, b45-45.0);
					var lon6 = moveLon(lat4, lon4, 0.2*d45, b45-45.0);
					var lat7 = moveLat(lat4, lon4, 0.2*d45, b45+45.0);
					var lon7 = moveLon(lat4, lon4, 0.2*d45, b45+45.0);
					var h4 = getProVisualizerTerrainHeight(lat4, lon4);
					var h5 = getProVisualizerTerrainHeight(lat5, lon5);
					var h6 = getProVisualizerTerrainHeight(lat6, lon6);
					var h7 = getProVisualizerTerrainHeight(lat7, lon7);
					var coords = [];
					coords.push(Cesium.Cartesian3.fromDegrees(lon5, lat5, h5));
					coords.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
					coords.push(Cesium.Cartesian3.fromDegrees(lon6, lat6, h6));
					coords.push(Cesium.Cartesian3.fromDegrees(lon7, lat7, h7));
					coords.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
					var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: gridColor[colorIndex] } });
					mapLines2.push(line);
				}
			}
		}
	}
	greenSlopesCount += 1;
	greenSlopesBearing = bearingY;
}

function addGradient(lat, lon)
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1) { return; }
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0) { return; }
	var par = getCourseHolePar(courseID, hole);
	if (par < 3) { return; }
	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 2);
		lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	}
	else if (par == 6)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	}
	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1) { return; }
	var bearingY = geogBearing(lat1, lon1, lat2, lon2);
	var bearingX = bearingY + 90;
	var hg = getProVisualizerTerrainHeightAndGradient(lat, lon, 0.5, bearingX, bearingY);
	var gx = hg.g1;
	var gy = hg.g2;
	var absgx = Math.abs(gx);
	var absgy = Math.abs(gy);
	var absgsum = absgx + absgy;
	if (absgsum > 0.001)
	{
		var k = 1.0;
		if (absgx > absgy) { var yx = absgy/absgx; k = Math.sqrt(1 + yx*yx); }
		else               { var xy = absgx/absgy; k = Math.sqrt(1 + xy*xy); }
		var g = (absgx + absgy)/k;
		var dLatY = moveLat(lat, lon, myUnitsToMetres(1), bearingY) - lat;
		var dLonY = moveLon(lat, lon, myUnitsToMetres(1), bearingY) - lon;
		var dLatX = moveLat(lat, lon, myUnitsToMetres(1), bearingX) - lat;
		var dLonX = moveLon(lat, lon, myUnitsToMetres(1), bearingX) - lon;
		var lat4 = lat - (gx*dLatX + gy*dLatY);
		var lon4 = lon - (gx*dLonX + gy*dLonY);
		var lat5 = lat + (gx*dLatX + gy*dLatY);
		var lon5 = lon + (gx*dLonX + gy*dLonY);
		var text = Math.round(g*100).toString();
		var theta = 180.0 - geogBearing(lat4, lon4, lat5, lon5);
		var hgrad1 = gx;
		var htheta1 = bearingX;
		var hgrad2 = gy;
		var htheta2 = bearingY;
		var gridBrightness = 0.07 * getCircleBrightness();
		var gridColor = [];
		gridColor[0] = new Cesium.Color(1.00, 1.00, 1.00, gridBrightness);//White
		gridColor[1] = new Cesium.Color(1.00, 1.00, 0.80, gridBrightness);
		gridColor[2] = new Cesium.Color(1.00, 1.00, 0.60, gridBrightness);
		gridColor[3] = new Cesium.Color(1.00, 1.00, 0.40, gridBrightness);
		gridColor[4] = new Cesium.Color(1.00, 1.00, 0.20, gridBrightness);
		gridColor[5] = new Cesium.Color(1.00, 1.00, 0.00, gridBrightness);//Yellow
		gridColor[6] = new Cesium.Color(0.95, 0.80, 0.00, gridBrightness);
		gridColor[7] = new Cesium.Color(0.90, 0.60, 0.00, gridBrightness);
		gridColor[8] = new Cesium.Color(0.85, 0.40, 0.00, gridBrightness);
		gridColor[9] = new Cesium.Color(0.80, 0.20, 0.00, gridBrightness);
		gridColor[10] = new Cesium.Color(0.75, 0.00, 0.00, gridBrightness);//Red
		gridColor[11] = new Cesium.Color(0.60, 0.00, 0.00, gridBrightness);
		gridColor[12] = new Cesium.Color(0.45, 0.00, 0.00, gridBrightness);
		gridColor[13] = new Cesium.Color(0.30, 0.00, 0.00, gridBrightness);
		gridColor[14] = new Cesium.Color(0.15, 0.00, 0.00, gridBrightness);
		gridColor[15] = new Cesium.Color(0.00, 0.00, 0.00, gridBrightness);//Black
		var colorFactor = 1000.0 / getRedSlope();
		var colorIndex = Math.floor(g*colorFactor);
		if (colorIndex > 15) colorIndex = 15;
		var sizeIndex = document.getElementById("greenslopesizeselect").selectedIndex;
		if (sizeIndex >= 4) { sizeIndex -= 4; }
		var k2 = (3.0 + sizeIndex)/100.0;
		addText(text, lat, lon, theta, k2, k2, gridColor[colorIndex], hg.h, hgrad1, htheta1, hgrad2, htheta2);
	}
}

function deltaPuttSpeed(speed, gradientF, gradientL, rollingGradient, dt)
{
	var rollingGradientAtSpeed = rollingGradient*(1.0 + 0.2*speed);
	var deltaSpeedF = 4.0*dt*(rollingGradientAtSpeed - gradientF);
	var deltaSpeedL = -4.0*dt*gradientL*(1.0 - 1.0/(1.0 + 10.0*speed));
	var vF = speed + deltaSpeedF;
	if (vF < 0.001) return -speed;
	var vL = deltaSpeedL;
	var vv = vF*vF + vL*vL;
	var newSpeed = (vv < 0.0001 ? 0.0 : Math.sqrt(vv));
	return newSpeed - speed;
}

function deltaPuttBearing(speed, gradientF, gradientL, rollingGradient, dt)
{
	var rollingGradientAtSpeed = rollingGradient*(1.0 + 0.2*speed);
	var deltaSpeedF = 4.0*dt*(rollingGradientAtSpeed - gradientF);
	var deltaSpeedL = -4.0*dt*gradientL*(1.0 - 1.0/(1.0 + 10.0*speed));
	var vF = speed + deltaSpeedF;
	if (vF < 0.001) return 0.0;
	var vL = deltaSpeedL;
	var db = Math.atan2(-vL, vF)*180.0/Math.PI;
	return db;
}

var puttTargetLat = 0;
var puttTargetLon = 0;
var puttHistoryOp = [];
var puttHistoryLat = [];
var puttHistoryLon = [];

function clearPuttHistory()
{
	puttTargetLat = 0;
	puttTargetLon = 0;
	puttHistoryOp = [];
	puttHistoryLat = [];
	puttHistoryLon = [];
}

function appendPuttHistory(op, lat, lon)
{
	var n = puttHistoryOp.length;
	puttHistoryOp[n] = op;
	puttHistoryLat[n] = lat;
	puttHistoryLon[n] = lon;
}

function removePuttHistory(opToRemove, lat, lon, d)
{
	var numRemoved = 0;
	var n = puttHistoryOp.length;
	var i = 0;
	while (i < n)
	{
		if (puttHistoryOp[i] == opToRemove && geogDist(lat, lon, puttHistoryLat[i], puttHistoryLon[i]) < d)
		{
			var k = 1;
			if (opToRemove == 1 ) { while (i+k < n && puttHistoryOp[i+k] == 2) ++k; }
			for (var j = i+k; j < n; ++j)
			{
				puttHistoryOp[j-k] = puttHistoryOp[j];
				puttHistoryLat[j-k] = puttHistoryLat[j];
				puttHistoryLon[j-k] = puttHistoryLon[j];
			} 
			numRemoved += k;
			n -= k;
		}
		else
		{
			i += 1;
		}
	}
	puttHistoryOp.length -= numRemoved;
	puttHistoryLat.length -= numRemoved;
	puttHistoryLon.length -= numRemoved;
	return numRemoved;
}

function replayPuttHistory()
{
	var copyOp = [];
	var copyLat = [];
	var copyLon = [];
	var n = puttHistoryOp.length;
	for (var i = 0; i < n; ++i)
	{
		copyOp[i] = puttHistoryOp[i];
		copyLat[i] = puttHistoryLat[i];
		copyLon[i] = puttHistoryLon[i];
	} 
	clearPuttHistory();
	var n = copyOp.length;
	for (var i = 0; i < n; ++i)
	{
		if (copyOp[i] == 1) setPuttTarget(copyLat[i], copyLon[i]);
		else if (copyOp[i] == 2) addPuttLine(copyLat[i], copyLon[i]);
	}
}

function setPuttTarget(lat, lon)
{
	var snapLat = 0;
	var snapLon = 0;
	var snapDist = 0.5;
	var snapIndex = -1;
	var n = puttHistoryOp.length;
	for (var i = 0; i < n; ++i)
	{
		if (puttHistoryOp[i] == 1)
		{
			var d = geogDist(lat, lon, puttHistoryLat[i], puttHistoryLon[i]);
			if (d < snapDist)
			{
				snapLat = puttHistoryLat[i];
				snapLon = puttHistoryLon[i];
				snapDist = d;
				snapIndex = i;
			}
		}
	}
	if (snapIndex >= 0)
	{
		lat = snapLat;
		lon = snapLon;
	}
	appendPuttHistory(1, lat, lon);
	puttTargetLat = lat;
	puttTargetLon = lon;
	if (snapIndex >= 0 && snapIndex == n - 1)
	{
		var tenFeet = 10.0 * 1609.344 / (3.0 * 1760.0);
		for (var i = 0; i < 8; ++i)
		{
			var bearing = greenSlopesBearing + i*45;
			var lat2 = moveLat(lat, lon, tenFeet, bearing);
			var lon2 = moveLon(lat, lon, tenFeet, bearing);
			addPuttLine(lat2, lon2, false);
		}
	}
	else
	{
		addHoleMarker(lat, lon);
	}
}

function getRollingGradient()
{
	var greenSpeed = 8 + document.getElementById("greenspeedselect").selectedIndex;
	var rollingGradient = -0.0707;
	switch (greenSpeed)
	{
	case 8: rollingGradient = -0.1368; break;
	case 9: rollingGradient = -0.1213; break;
	case 10: rollingGradient = -0.1091; break;
	case 11: rollingGradient = -0.0990; break;
	case 12: rollingGradient = -0.0907; break;
	case 13: rollingGradient = -0.0836; break;
	case 14: rollingGradient = -0.0776; break;
	case 15: rollingGradient = -0.0724; break;
	default: alert("Unexpected green speed.");
	}
	return rollingGradient;
}

function getRedSlope()
{
	var i = document.getElementById("greenslopecolorselect").selectedIndex;
	if (i > 0) return 4+i;
	var rollingGradient = getRollingGradient();
	return -100.0*rollingGradient;
}

function addPuttLine(lat, lon, addToHistory = true)
{
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1) { alert("Please select hole."); return; }
	if (puttTargetLat == 0 && puttTargetLon == 0)
	{
		puttTargetLat = getCourseHolePinLat(courseID, hole);
		puttTargetLon = getCourseHolePinLon(courseID, hole);
	}
	if (puttTargetLat == 0 && puttTargetLon == 0) { alert("Please set pin position."); return; }
	var d = geogDist(lat, lon, puttTargetLat, puttTargetLon);
	if (d > 50) { alert("Max 50 metres."); return; }
	if (addToHistory) appendPuttHistory(2, lat, lon);
	var rollingGradient = getRollingGradient();
	var brightness = 0.07 * getCircleBrightness();
	var color1 = new Cesium.Color(1.00, 1.00, 1.00, brightness);
	var color2 = new Cesium.Color(0.00, 1.00, 1.00, brightness*0.5);
	var color3 = new Cesium.Color(0.00, 1.00, 1.00, brightness);
	var dt = 0.05;
	var bearing0 = geogBearing(lat, lon, puttTargetLat, puttTargetLon);
	var distMax = d + 10.0;
	var tol = d * 10.0 * Math.PI/180.0; // 10 degrees
	var bearingDelta = 2.0; // 2 degrees
	var iMax = 10;
	var speedAtHole = 0.1;
	var finished = false;
	for (var i = 0; i <= iMax; ++i)
	{
		tol *= 0.5;
		bearingDelta *= 0.5;
		finished = false;
		var n = 0;
		while (n < 360 && !finished)
		{
			var lat2 = puttTargetLat;
			var lon2 = puttTargetLon;
			var speed = speedAtHole;
			var dist = 0.0;
			var bearingF = bearing0;
			if (n % 2 == 0) bearingF += bearingDelta*n/2;
			else bearingF -= bearingDelta*(n+1)/2;
			bearing1 = bearingF;
			var bearingL = bearingF - 90;
			var hg = getProVisualizerTerrainHeightAndGradient(lat2, lon2, 0.5, bearingF, bearingL);
			var h2 = hg.h;
			var coords = [];
			var lats = [];
			var lons = [];
			if (i == iMax) { coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2)); lats.push(lat2); lons.push(lon2); }
			while (dist < distMax && speed > 0.001 && !finished)
			{
				var ds = speed*dt;
				dist += ds;
				var lat3 = moveLat(lat2, lon2, ds, bearingF + 180.0);
				var lon3 = moveLon(lat2, lon2, ds, bearingF + 180.0);
				var gradientF = hg.g1;
				var gradientL = hg.g2;
				var deltaSpeed = deltaPuttSpeed(speed, gradientF, gradientL, rollingGradient, dt);
				var deltaBearing = deltaPuttBearing(speed, gradientF, gradientL, rollingGradient, dt);
				var d2 = geogDist(lat, lon, lat2, lon2);
				var d3 = geogDist(lat, lon, lat3, lon3);
				if (d2 + d3 < ds + tol)
				{
					finished = true;
					if (i == iMax)
					{
						var t = d2/ds;
						var dLat = lat3 - lat2;
						var dLon = lon3 - lon2;
						lat3 = lat2 + t*dLat;
						lon3 = lon2 + t*dLon;
					}
				}
				lat2 = lat3;
				lon2 = lon3;
				speed -= deltaSpeed;
				bearingF -= deltaBearing;
				bearingL = bearingF - 90;
				hg = getProVisualizerTerrainHeightAndGradient(lat2, lon2, 0.5, bearingF, bearingL);
				h2 = hg.h;
				if (i == iMax) { coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2)); lats.push(lat2); lons.push(lon2); }
			}
			if (finished)
			{
				if (i < iMax)
				{
					bearing0 = bearing1;
				}
				else
				{
					var lat0 = lat2;
					var lon0 = lon2;
					var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: color1 } });
					mapLines2.push(line);
					//for (var j = 1; j <= lats.length; j += 20) addBallMarker(lats[lats.length - j], lons[lons.length - j]);
					coords = [];
					coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
					if (speed < 0.01) speed = 0.01;
					var d1 = geogDist(lat2, lon2, puttTargetLat, puttTargetLon);
					var d2 = 0.0;
					while (speed > 0.001)
					{
						d2 += speed*dt;
						var lat3 = moveLat(lat2, lon2, speed*dt, bearingF);
						var lon3 = moveLon(lat2, lon2, speed*dt, bearingF);
						var deltaSpeed = deltaPuttSpeed(speed, 0.0, 0.0, rollingGradient, dt);
						lat2 = lat3;
						lon2 = lon3;
						speed += deltaSpeed;
						if (d2 <= d1)
						{
							h2 = getProVisualizerTerrainHeight(lat2, lon2);
							coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
						}
					}
					if (d2 <= d1)
					{
						var lat3 = moveLat(lat2, lon2, 0.05, bearingF+90.0);
						var lon3 = moveLon(lat2, lon2, 0.05, bearingF+90.0);
						var h3 = getProVisualizerTerrainHeight(lat3, lon3);
						coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
						var lat3 = moveLat(lat2, lon2, 0.05, bearingF-90.0);
						var lon3 = moveLon(lat2, lon2, 0.05, bearingF-90.0);
						var h3 = getProVisualizerTerrainHeight(lat3, lon3);
						coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
						coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
					}
					var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: color2 } });
					mapLines2.push(line);
					var k = 0.02;
					var theta = (bearingF - geogBearing(lat0, lon0, puttTargetLat, puttTargetLon))*Math.PI/180.0;
					while (theta < -Math.PI) theta += 2*Math.PI;
					while (theta >  Math.PI) theta -= 2*Math.PI;
					var d3 = Math.abs(d1*theta);
					var text1 = Math.round(100*d1).toString();
					var text2 = Math.round(100*d2).toString();
					var text3 = Math.round(100*d3).toString();
					if (getDistanceUnit() == "y")
					{
						var inches = Math.round(metresToYards(d1)*36); var feet = Math.floor(inches/12); inches -= 12*feet;
						text1 = feet.toString() + "'" + inches.toString() + '"';
						var inches = Math.round(metresToYards(d2)*36); var feet = Math.floor(inches/12); inches -= 12*feet;
						text2 = feet.toString() + "'" + inches.toString() + '"';
						var inches = Math.round(metresToYards(d3)*36); var feet = Math.floor(inches/12); inches -= 12*feet;
						text3 = feet.toString() + "'" + inches.toString() + '"';
					}
					var textLat = moveLat(lat0, lon0, -0.2, bearingF);
					var textLon = moveLon(lat0, lon0, -0.2, bearingF);
					var hg = getProVisualizerTerrainHeightAndGradient(textLat, textLon, 0.5, bearingF+90, bearingF);
					addText(text1, textLat, textLon, -bearingF, k, k, color1, hg.h, hg.g1, bearingF+90, hg.g2, bearingF);
					var textLat = moveLat(lat0, lon0, -0.4, bearingF);
					var textLon = moveLon(lat0, lon0, -0.4, bearingF);
					var hg = getProVisualizerTerrainHeightAndGradient(textLat, textLon, 0.5, bearingF+90, bearingF);
					addText(text2, textLat, textLon, -bearingF, k, k, color3, hg.h, hg.g1, bearingF+90, hg.g2, bearingF);
					var textLat = moveLat(lat0, lon0, -0.6, bearingF);
					var textLon = moveLon(lat0, lon0, -0.6, bearingF);
					var hg = getProVisualizerTerrainHeightAndGradient(textLat, textLon, 0.5, bearingF+90, bearingF);
					addText(text3, textLat, textLon, -bearingF, k, k, color3, hg.h, hg.g1, bearingF+90, hg.g2, bearingF);
				}
			}
			n += 1;
		}
	}
	if (!finished)
	{
		var color = new Cesium.Color(1.00, 1.00, 1.00, brightness);
		var bearing = geogBearing(lat, lon, puttTargetLat, puttTargetLon);
		var lat1 = moveLat(lat, lon, 0.15, bearing+ 45); var lon1 = moveLon(lat, lon, 0.15, bearing+ 45); var h1 = getProVisualizerTerrainHeight(lat1, lon1);
		var lat2 = moveLat(lat, lon, 0.15, bearing- 45); var lon2 = moveLon(lat, lon, 0.15, bearing- 45); var h2 = getProVisualizerTerrainHeight(lat2, lon2);
		var lat3 = moveLat(lat, lon, 0.15, bearing+135); var lon3 = moveLon(lat, lon, 0.15, bearing+135); var h3 = getProVisualizerTerrainHeight(lat3, lon3);
		var lat4 = moveLat(lat, lon, 0.15, bearing-135); var lon4 = moveLon(lat, lon, 0.15, bearing-135); var h4 = getProVisualizerTerrainHeight(lat4, lon4);
		var coords1 = [];
		coords1.push(Cesium.Cartesian3.fromDegrees(lon1, lat1, h1));
		coords1.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
		var line1 = viewer.entities.add({ polyline : { positions: coords1, width: 1.0, material: color } });
		mapLines2.push(line1);
		var coords2 = [];
		coords2.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
		coords2.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
		var line2 = viewer.entities.add({ polyline : { positions: coords2, width: 1.0, material: color } });
		mapLines2.push(line2);
	}
}

function greenContoursHandler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee position.")
		return;
	}
	if (greenContoursCount != 0)
	{
		refreshView();
		return;
	}
	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenGridCount > 3))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 2);
		lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	}
	else if (par == 6)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	}
	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
	{
		alert("Tee/Targets/Pin too close together.");
		return;
	}
	var bearingY = geogBearing(lat1, lon1, lat2, lon2);
	var dLatY = moveLat(lat2, lon2, myUnitsToMetres(1), bearingY) - lat2;
	var dLonY = moveLon(lat2, lon2, myUnitsToMetres(1), bearingY) - lon2;
	var bearingX = bearingY + 90;
	var dLatX = moveLat(lat2, lon2, myUnitsToMetres(1), bearingX) - lat2;
	var dLonX = moveLon(lat2, lon2, myUnitsToMetres(1), bearingX) - lon2;
	var gridBrightness = 0.05*document.getElementById("greencontourbrightnessselect").value;
	var gridColor = [];
	for (var j = 1; j <= 10; ++j) { for (var i = 0; i <= 255; ++i) gridColor[j*256 + i] = new Cesium.Color(i/255.0, 1.0, (255-i)/255.0, gridBrightness*(0.3+0.07*j)); }
	var h2 = getProVisualizerTerrainHeight(lat2, lon2);
	var con1 = 10*(1 + document.getElementById("greencontourselect").selectedIndex);
	var con2 = 2*con1;
	var minG = 0.01*document.getElementById("greencontourminselect").value;
	for (var x = -300; x <= 300; x += 1)
	{
		for (var y = -300; y <= 300; y += 1)
		{
			var lat3 = lat2 + 0.1*y*dLatY + 0.1*x*dLatX;
			var lon3 = lon2 + 0.1*y*dLonY + 0.1*x*dLonX;
			var h3 = getProVisualizerTerrainHeight(lat3, lon3);
			var dh = h3 - h2;
			var cm = con1 + Math.round(200*dh);
			if (cm % con2 == 0)
			{
				var hg = getProVisualizerTerrainHeightAndGradient(lat3, lon3, 0.5, bearingX, bearingY);
				var gx = hg.g1;
				var gy = hg.g2;
				var absgx = Math.abs(gx);
				var absgy = Math.abs(gy);
				var absgsum = absgx + absgy;
				if (absgsum > 0.001)
				{
					var k = 1.0;
					if (absgx > absgy) { var yx = absgy/absgx; k = Math.sqrt(1 + yx*yx); }
					else               { var xy = absgx/absgy; k = Math.sqrt(1 + xy*xy); }
					var g = (absgx + absgy)/k;
					var j = Math.floor(g*200);
					if (j > 10) j = 10;
					if (j > 0 && g > minG)
					{
						var k = 0.05/g; //0.2*(g + 0.2*(1.0-g))/g;
						var g1 = k * hg.g1;
						var g2 = k * hg.g2;
						var lat4 = lat3 - (g1*dLatX + g2*dLatY);
						var lon4 = lon3 - (g1*dLonX + g2*dLonY);
						var lat5 = lat3 + (g1*dLatX + g2*dLatY);
						var lon5 = lon3 + (g1*dLonX + g2*dLonY);
						var h4 = getProVisualizerTerrainHeight(lat4, lon4);
						var h5 = getProVisualizerTerrainHeight(lat5, lon5);
						var coords = [];
						coords.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
						coords.push(Cesium.Cartesian3.fromDegrees(lon5, lat5, h5));
						var colorIndex = 128 + Math.round(cm/2);
						if (colorIndex < 0) colorIndex = 0;
						if (colorIndex > 255) colorIndex = 255;
						colorIndex += j*256;
						var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: gridColor[colorIndex] } });
						mapLines2.push(line);
					}
				}
			}
		}
	}
	greenContoursCount += 1;
	greenSlopesBearing = bearingY;
}

var col1 = new Cesium.Color(1,1,1,0.3);
var col2 = new Cesium.Color(1,1,1,0.5);
var colW = new Cesium.Color(1.0,1.0,1.0,1.0);
var colY = new Cesium.Color(1.0,1.0,0.0,1.0);
var colG = new Cesium.Color(0.2,1.0,0.2,1.0);
var colB = new Cesium.Color(0.0,1.0,1.0,1.0);
var colR = new Cesium.Color(1.0,0.2,0.2,1.0);
function addDist(lat1, lon1, lat2, lon2)
{
	distCount += 1;
	var d = geogDist(lat1, lon1, lat2, lon2);
	var d2 = Math.round(metresToMyUnits(d));
	var t = 0.5;
	if (mapMode == 1 && d > 150)
	{
		var hole = currentHole();
		if (hole > 0)
		{
			var courseID = currentCourseID();
			var teeLat = getCourseHoleTeeLat(courseID, hole);
			var teeLon = getCourseHoleTeeLon(courseID, hole);
			if (teeLat != 0 || teeLon != 0)
			{
				var d3 = geogDist(teeLat, teeLon, lat1, lon1);
				var d4 = geogDist(teeLat, teeLon, lat2, lon2);
				if (d3 < 100 && d4 > d3 + 100) t = (d-75)/d;
			}
		}
	}
	var text = d2.toString();
	var k = 0.5 + d/1000.0;
	var coords1 = [];
	var h1 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat1, lon1));
	var h2 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat2, lon2));
	var lon3 = lon1 + ((t*d - (3*text.length+1)*k)/d)*(lon2-lon1);
	var lat3 = lat1 + ((t*d - (3*text.length+1)*k)/d)*(lat2-lat1);
	var h3 = h1 + (h2-h1)*geogDist(lat1,lon1,lat3,lon3)/d;
	coords1.push(Cesium.Cartesian3.fromDegrees(lon1, lat1, h1));
	coords1.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
	var line1 = viewer.entities.add({ polyline : { positions: coords1, width: 1.0, material: col1 } });
	mapLines2.push(line1);
	var coords2 = [];
	var lon4 = lon1 + ((t*d + (3*text.length+1)*k)/d)*(lon2-lon1);
	var lat4 = lat1 + ((t*d + (3*text.length+1)*k)/d)*(lat2-lat1);
	var h4 = h1 + (h2-h1)*geogDist(lat1,lon1,lat4,lon4)/d;
	coords2.push(Cesium.Cartesian3.fromDegrees(lon4, lat4, h4));
	coords2.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
	var line2 = viewer.entities.add({ polyline : { positions: coords2, width: 1.0, material: col1 } });
	mapLines2.push(line2);
	var lat = lat1 + t*(lat2-lat1);
	var lon = lon1 + t*(lon2-lon1);
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	var theta = 90 - geogBearing(lat1, lon1, lat2, lon2);
	var kx = k;
	var ky = k;
	if (mapMode == 2 && d2 >= 100)
	{
		theta -= 90;
		kx *= 0.5;
		ky *= 2.0;
	}
	var hh = 0.5*(h1+h2);
	var hgrad1 = (h2 - h1)/geogDist(lat1, lon1, lat2, lon2);
	var htheta1 = geogBearing(lat1, lon1, lat2, lon2);
	var hgrad2 = 0.0;
	var htheta2 = htheta1 + 90.0;
	if (hh < h + 2.0)
	{
		var lat3 = moveLat(lat, lon, -1.0, htheta2);
		var lon3 = moveLon(lat, lon, -1.0, htheta2);
		var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
		var lat4 = moveLat(lat, lon, 1.0, htheta2);
		var lon4 = moveLon(lat, lon, 1.0, htheta2);
		var h4 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat4, lon4));
		hgrad2 = (h4 - h3)/2.0;
		if (hh > h) hgrad2 *= 1.0 - (hh - h)/2.0;
	}
	addText(text, lat, lon, theta, kx, ky, col2, hh, hgrad1, htheta1, hgrad2, htheta2);
}

function addSymbol(lat, lon, symbol, theta)
{
	var h = 0;
	var a = 0;
	var b = 0;
	var c = 0;
	var d = 90.0;
	if (terrainMode == 2)
	{
		h = getProVisualizerTerrainHeight(lat, lon);
		var lat1 = moveLat(lat, lon, -1.0, b);
		var lon1 = moveLon(lat, lon, -1.0, b);
		var h1 = getProVisualizerTerrainHeight(lat1, lon1);
		var lat2 = moveLat(lat, lon, 1.0, b);
		var lon2 = moveLon(lat, lon, 1.0, b);
		var h2 = getProVisualizerTerrainHeight(lat2, lon2);
		a = (h2 - h1)/2.0;
		var lat3 = moveLat(lat, lon, -1.0, d);
		var lon3 = moveLon(lat, lon, -1.0, d);
		var h3 = getProVisualizerTerrainHeight(lat3, lon3);
		var lat4 = moveLat(lat, lon, 1.0, d);
		var lon4 = moveLon(lat, lon, 1.0, d);
		var h4 = getProVisualizerTerrainHeight(lat4, lon4);
		c = (h4 - h3)/2.0;
	}
	if (symbol == 'A') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == 'B') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == 'C') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == 'D') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == 'E') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == 'F') addText(symbol, lat, lon, theta, 1, 1, col2,h,a,b,c,d);
	if (symbol == '1') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == '2') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == '3') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == '4') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == '5') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == '6') addText(symbol, lat, lon, theta, 0.4, 0.4, col2,h,a,b,c,d);
	if (symbol == 'T') addText(symbol, lat, lon, theta, 1, 1, colG,h,a,b,c,d);
	if (symbol == 'X') addText(symbol, lat, lon, theta, 1, 1, colR,h,a,b,c,d);

	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.10, 0.10, colW,h,a,b,c,d);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.08, 0.08, colW,h,a,b,c,d);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.06, 0.06, colW,h,a,b,c,d);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.04, 0.04, colW,h,a,b,c,d);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.02, 0.02, colW,h,a,b,c,d);

	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.10, 0.10, colY,h,a,b,c,d);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.08, 0.08, colY,h,a,b,c,d);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.06, 0.06, colY,h,a,b,c,d);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.04, 0.04, colY,h,a,b,c,d);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.02, 0.02, colY,h,a,b,c,d);

	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.10, 0.10, colG,h,a,b,c,d);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.08, 0.08, colG,h,a,b,c,d);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.06, 0.06, colG,h,a,b,c,d);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.04, 0.04, colG,h,a,b,c,d);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.02, 0.02, colG,h,a,b,c,d);

	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.10, 0.10, colB,h,a,b,c,d);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.08, 0.08, colB,h,a,b,c,d);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.06, 0.06, colB,h,a,b,c,d);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.04, 0.04, colB,h,a,b,c,d);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.02, 0.02, colB,h,a,b,c,d);

}

function adjustHeight(lat, lon, h, lat2, lon2, hgrad1, htheta1, hgrad2, htheta2)
{
	var h2 = h;
	var d2 = geogDist(lat, lon, lat2, lon2);
	var theta2 = geogBearing(lat, lon, lat2, lon2);
	while (theta2 > htheta1 + 180.0) theta2 -= 360.0;
	while (theta2 < htheta1 - 180.0) theta2 += 360.0;
	h2 += d2*hgrad1*Math.cos((theta2 - htheta1)*Math.PI/180.0);
	while (theta2 > htheta2 + 180.0) theta2 -= 360.0;
	while (theta2 < htheta2 - 180.0) theta2 += 360.0;
	h2 += d2*hgrad2*Math.cos((theta2 - htheta2)*Math.PI/180.0);
	return h2;
}

function addText(text, lat, lon, theta, kx, ky, col, h = 0.0, hgrad1 = 0.0, htheta1 = 0.0, hgrad2 = 0.0, htheta2 = 0.0)
{
	theta *= Math.PI/180.0;
	var deltaLat = distToDeltaLat(1, lat, lon);
	var deltaLon = distToDeltaLon(1, lat, lon);
	var cosTheta = Math.cos(theta);
	var sinTheta = Math.sin(theta);
	var dLatX = deltaLat*sinTheta*kx;
	var dLatY = deltaLat*cosTheta*ky;
	var dLonX = deltaLon*cosTheta*kx;
	var dLonY = -deltaLon*sinTheta*ky;
	var totalWidth = 0;
	for (var i = 0; i < text.length; ++i)
	{
		var c = text.charAt(i);
		if      (c == "'") totalWidth += 2;
		else if (c == '"') totalWidth += 3;
		else totalWidth += 6;
	}
	widthSoFar = 0;
	for (var i = 0; i < text.length; ++i)
	{
		var c = text.charAt(i);
		var xyCoords1 = [];
		var xyCoords2 = [];
		if (c == '1')
		{
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(0);
			xyCoords2.push(3); xyCoords2.push(0);
			xyCoords2.push(3); xyCoords2.push(6);
			xyCoords2.push(1); xyCoords2.push(4);
		}
		else if (c == '2')
		{
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(4);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
		}
		else if (c == '3')
		{
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(2);
			xyCoords1.push(3); xyCoords1.push(3);
			xyCoords1.push(1); xyCoords1.push(3);
			xyCoords2.push(3); xyCoords2.push(3);
			xyCoords2.push(4); xyCoords2.push(4);
			xyCoords2.push(4); xyCoords2.push(5);
			xyCoords2.push(3); xyCoords2.push(6);
			xyCoords2.push(1); xyCoords2.push(6);
			xyCoords2.push(0); xyCoords2.push(5);
		}
		else if (c == '4')
		{
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(2);
			xyCoords1.push(4); xyCoords1.push(2);
		}
		else if (c == '5')
		{
			xyCoords1.push(4); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(4);
			xyCoords1.push(3); xyCoords1.push(4);
			xyCoords1.push(4); xyCoords1.push(3);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(1);
		}
		else if (c == '6')
		{
			xyCoords1.push(4); xyCoords1.push(6);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(3);
			xyCoords1.push(3); xyCoords1.push(4);
			xyCoords1.push(1); xyCoords1.push(4);
			xyCoords1.push(0); xyCoords1.push(3);
		}
		else if (c == '7')
		{
			xyCoords1.push(2); xyCoords1.push(0);
			xyCoords1.push(2); xyCoords1.push(2);
			xyCoords1.push(4); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
		}
		else if (c == '8')
		{
			xyCoords1.push(1); xyCoords1.push(3);
			xyCoords1.push(3); xyCoords1.push(3);
			xyCoords1.push(4); xyCoords1.push(4);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(4);
			xyCoords1.push(1); xyCoords1.push(3);
			xyCoords1.push(0); xyCoords1.push(2);
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(2);
			xyCoords1.push(3); xyCoords1.push(3);
		}
		else if (c == '9')
		{
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(3);
			xyCoords1.push(1); xyCoords1.push(2);
			xyCoords1.push(3); xyCoords1.push(2);
			xyCoords1.push(4); xyCoords1.push(3);
		}
		else if (c == '0')
		{
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(1); xyCoords1.push(0);
		}
		else if (c == 'A')
		{
			xyCoords1.push(-0.5); xyCoords1.push(0);
			xyCoords1.push(2); xyCoords1.push(6);
			xyCoords1.push(4.5); xyCoords1.push(0);
			xyCoords2.push(0.5); xyCoords2.push(2.5);
			xyCoords2.push(3.5); xyCoords2.push(2.5);
		}
		else if (c == 'B')
		{
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(4); xyCoords1.push(4);
			xyCoords1.push(3); xyCoords1.push(3);
			xyCoords1.push(4); xyCoords1.push(2);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords2.push(0); xyCoords2.push(3);
			xyCoords2.push(3); xyCoords2.push(3);
		}
		else if (c == 'C')
		{
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(1); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(1); xyCoords1.push(6);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(4); xyCoords1.push(5);
		}
		else if (c == 'D')
		{
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(3); xyCoords1.push(6);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords1.push(4); xyCoords1.push(1);
			xyCoords1.push(3); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(0);
		}
		else if (c == 'E')
		{
			xyCoords1.push(4); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(4); xyCoords1.push(6);
			xyCoords2.push(0); xyCoords2.push(3);
			xyCoords2.push(4); xyCoords2.push(3);
		}
		else if (c == 'F')
		{
			xyCoords1.push(0); xyCoords1.push(0);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords1.push(4); xyCoords1.push(6);
			xyCoords2.push(0); xyCoords2.push(3);
			xyCoords2.push(3.5); xyCoords2.push(3);
		}
		else if (c == 'T')
		{
			xyCoords1.push(0); xyCoords1.push(2.5);
			xyCoords1.push(1.2); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(5);
		}
		else if (c == 'X')
		{
			xyCoords1.push(0); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(5);
			xyCoords2.push(4); xyCoords2.push(1);
			xyCoords2.push(0); xyCoords2.push(5);
		}
		else if (c == '"')
		{
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(6);
			xyCoords2.push(2); xyCoords2.push(5);
			xyCoords2.push(2); xyCoords2.push(6);
		}
		else if (c == "'")
		{
			xyCoords1.push(0); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(6);
		}
		else
		{
			xyCoords1.push(1); xyCoords1.push(1);
			xyCoords1.push(3); xyCoords1.push(1);
			xyCoords1.push(4); xyCoords1.push(2);
			xyCoords1.push(4); xyCoords1.push(4);
			xyCoords1.push(3); xyCoords1.push(5);
			xyCoords1.push(1); xyCoords1.push(5);
			xyCoords1.push(0); xyCoords1.push(4);
			xyCoords1.push(0); xyCoords1.push(2);
			xyCoords1.push(1); xyCoords1.push(1);
		}
		if (xyCoords1.length > 0)
		{
			var coords = [];
			for (var j = 0; j < xyCoords1.length; j += 2)
			{
				var x = xyCoords1[j] - totalWidth/2 + widthSoFar + 1;
				var y = xyCoords1[j+1] - 3;
				var lat2 = lat + x*dLatX + y*dLatY;
				var lon2 = lon + x*dLonX + y*dLonY;
				var h2 = adjustHeight(lat, lon, h, lat2, lon2, hgrad1, htheta1, hgrad2, htheta2);
				coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
			}
			var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: col } });
			mapLines2.push(line);
		}
		if (xyCoords2.length > 0)
		{
			var coords = [];
			for (var j = 0; j < xyCoords2.length; j += 2)
			{
				var x = xyCoords2[j] - totalWidth/2 + widthSoFar + 1;
				var y = xyCoords2[j+1] - 3;
				var lat2 = lat + x*dLatX + y*dLatY;
				var lon2 = lon + x*dLonX + y*dLonY;
				var h2 = adjustHeight(lat, lon, h, lat2, lon2, hgrad1, htheta1, hgrad2, htheta2);
				coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
			}
			var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: col } });
			mapLines2.push(line);
		}
		if      (c == "'") widthSoFar += 2;
		else if (c == '"') widthSoFar += 3;
		else widthSoFar += 6;
	}
}

function distanceHandler()
{
	if (mode == 6)
	{
		setMode(0);
	}
	else
	{
		distLat1 = 0;
		distLon1 = 0;
		distLat2 = 0;
		distLon2 = 0;
		if (mapMode == 2 && distCount == 0)
		{
			var courseID = currentCourseID();
			var hole = currentHole();
			var n = getCourseHoleMeasures(courseID, hole);
			if (n > 0)
			{
				setMode(0);
				for (var i = 0; i < n; ++i)
				{
					var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
					addDist(x.lat1, x.lon1, x.lat2, x.lon2);
				}
				return;
			}
		}
		setMode(6);
		setDistDiv("Click Start");
	}
}

function distanceHandler2()
{
	if (mode == 7)
	{
		setMode(0);
	}
	else
	{
		var courseID = currentCourseID();
		var hole = currentHole();
		if (hole < 1)
		{
			alert("Please select hole.");
			setMode(0);
			return;
		}
		distLat1 = getCourseHoleTeeLat(courseID, hole);
		distLon1 = getCourseHoleTeeLon(courseID, hole);
		if (distLat1 == 0 && distLon1 == 0)
		{
			alert("Please set tee position.");
			setMode(0);
			return;
		}
		distLat2 = 0;
		distLon2 = 0;
		if (mapMode == 2 && distCount == 0)
		{
			var n = getCourseHoleMeasures(courseID, hole);
			if (n > 0)
			{
				setMode(0);
				for (var i = 0; i < n; ++i)
				{
					var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
					addDist(x.lat1, x.lon1, x.lat2, x.lon2);
				}
				return;
			}
		}
		setMode(7);
		setDistDiv("Click Map");
	}
}

function clearDistanceHandler()
{
	if (mode == 8 || distCount == 0)
	{
		setMode(0);
	}
	else
	{
		setMode(8);
		setDistDiv("Click Map");
	}
}

function clearDispersionHandler()
{
	setMode(0);
	removeDispersionFeatures();
}

function clearSpreadHandler()
{
	setMode(0);
	removeDispersionFeatures();
}

function zoomToCourseHole(courseID, hole, clear, refresh, durationSeconds)
{
	if (clear)
		removeAllFeatures();

	var x = document.getElementById('mapdiv');
	var mw = x.clientWidth;
	var mh = x.clientHeight;
	if (mw < 100) mw = 100;
	if (mh < 100) mh = 100;

	var t = mw/mh - 1;
	var height = (50 - t*10) * heightMultiplier;
	var offset = (45 + (t > 0 ? t*35 : t*10)) * offsetMultiplier;
	var angle = (-25 + t*10) + angleIncrement;

	if (height < 2.0) height = 2.0;
	if (offset < 5.0) offset = 5.0;
	if (angle > -5.0) angle = -5.0;
	if (angle < -90.0) angle = -90.0;

	var lat = 0;
	var lon = 0;
	var hlat = 0;
	var hlon = 0;
	var heading = 0;

	if (hole == 0)
	{
		var lat1 = getCourseMinLat(courseID);
		var lon1 = getCourseMinLon(courseID);
		var lat2 = getCourseMaxLat(courseID);
		var lon2 = getCourseMaxLon(courseID);
		if (lat1 != 0 || lon1 != 0)
		{
			if (lat2 <= lat1) lat2 = lat1 + 0.0001;
			while (lon2 < lon1 - 180) lon2 += 360;
			while (lon2 > lon1 + 180) lon2 -= 360;
			lat = (lat1 + lat2)/2;
			lon = (lon1 + lon2)/2;
			hlat = lat;
			hlon = lon;
			var d1 = geogDist(lat1, lon1, lat2, lon2);
			var d2 = geogDist(lat, lon, lat + 1, lon);
			if (mapMode == 2)
			{
				lat -= 3000 * (d1/4000) / d2;
				height = 1000 * (d1/4000);
				angle = -22;
			}
			else
			{
				height = 1.0*d1;
				heading = 0;
				angle = -90;
			}
		}
	}
	else if (hole > 0)
	{
		var par = getCourseHolePar(courseID, hole);
		if (par >= 3)
		{
			if (mapMode == 1)
			{
				var lat1 = getCourseHoleTeeLat(courseID, hole);
				var lon1 = getCourseHoleTeeLon(courseID, hole);
				var lat2 = getCourseHolePinLat(courseID, hole);
				var lon2 = getCourseHolePinLon(courseID, hole);
				heading = geogBearing(lat1, lon1, lat2, lon2);
				d = geogDist(lat1, lon1, lat2, lon2);
				var t = 0.5;
				if (d > 1) t = 0.5 * (d + 20) / d;
				lat = lat1 + t * (lat2 - lat1);
				lon = lon1 + t * (lon2 - lon1);
				hlat = lat;
				hlon = lon;
				height = d + 70;
				angle = -90;
			}
			else
			{
				lat = getCourseHoleShotLat(courseID, hole, 1, offset, offset + 30);
				lon = getCourseHoleShotLon(courseID, hole, 1, offset, offset + 30);
				hlat = getCourseHoleTeeLat(courseID, hole);
				hlon = getCourseHoleTeeLon(courseID, hole);
				heading = getCourseHoleShotBearing(courseID, hole, 1);
			}
		}
		else
		{
			var lat1 = getCourseHoleMinLat(courseID, hole);
			var lon1 = getCourseHoleMinLon(courseID, hole);
			var lat2 = getCourseHoleMaxLat(courseID, hole);
			var lon2 = getCourseHoleMaxLon(courseID, hole);
			if (lat1 != 0 || lon1 != 0)
			{
				if (lat2 <= lat1) lat2 = lat1 + 0.0001;
				while (lon2 < lon1 - 180) lon2 += 360;
				while (lon2 > lon1 + 180) lon2 -= 360;
				lat = (lat1 + lat2)/2;
				lon = (lon1 + lon2)/2;
				hlat = lat;
				hlon = lon;
				var d1 = geogDist(lat1, lon1, lat2, lon2);
				height = 1.0*d1;
				heading = 0;
				angle = -90;
				if (height < 200)
					height = 200;
			}
		}
	}

	if (mapMode == 1)
	{
		var x = document.getElementById('mapdiv');
		var w = window.innerWidth;
		var h = window.innerHeight;
		w = x.clientWidth;
		h = x.clientHeight;
		if (w < 100) w = 100;
		if (h < 100) h = 100;
		height *= 1.05 * Math.sqrt(w / h);
		if (getAutoRotate() != 0)
			heading = 0;
	}

	if (lat != 0 || lon != 0)
	{
		flyToHeightAboveGround(lat, lon, hlat, hlon, height, heading, angle, durationSeconds)
	}

	if (refresh)
		refreshView(); 
}

function zoomToCourseHoleShot(courseID, hole, shot, clear, refresh, durationSeconds)
{
	if (hole == 0 || shot == 0)
	{
		zoomToCourseHole(courseID, hole, clear, refresh, durationSeconds);
		return;
	}
	if (clear)
		removeAllFeatures();

	var x = document.getElementById('mapdiv');
	var mw = x.clientWidth;
	var mh = x.clientHeight;
	if (mw < 100) mw = 100;
	if (mh < 100) mh = 100;

	var t = mw/mh - 1;
	var height = (50 - t*10) * heightMultiplier;
	var offset = ((shot <= 1 ? 45 : 50) + (t > 0 ? t*35 : t*10)) * offsetMultiplier;
	var angle = (-25 + t*10) + angleIncrement;

	if (shot == 1) offset -= 5.0;
	if (height < 2.0) height = 2.0;
	if (offset < 5.0) offset = 5.0;
	if (angle > -5.0) angle = -5.0;
	if (angle < -90.0) angle = -90.0;

	height *= 0.50;
	offset *= 0.65;
	angle *= 0.90;

	var lat = 0;
	var lon = 0;
	var hlat = 0;
	var hlon = 0;
	var heading = 0;

	var par = getCourseHolePar(courseID, hole);

	if (par >= 3)
	{
		if (mapMode == 1)
		{
			var lat1 = getCourseHoleTeeLat(courseID, hole);
			var lon1 = getCourseHoleTeeLon(courseID, hole);
			var lat2 = getCourseHolePinLat(courseID, hole);
			var lon2 = getCourseHolePinLon(courseID, hole);
			heading = geogBearing(lat1, lon1, lat2, lon2);
			if (shot > 0)
			{
				if (shot == 1 && par > 3)
				{
					lat2 = getCourseHoleTargetLat(courseID, hole, shot);
					lon2 = getCourseHoleTargetLon(courseID, hole, shot);
				}
				else if (shot >= 2 && shot <= par - 2)
				{
					lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
					lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
				}
				else if (shot > par - 2)
				{
					lat1 = getCourseHolePinLat(courseID, hole);
					lon1 = getCourseHolePinLon(courseID, hole);
				}
			}
			var d = geogDist(lat1, lon1, lat2, lon2);
			var t = 0.5;
			if (shot <= 1 && d > 1) t = 0.5 * (d + 20) / d;
			lat = lat1 + t * (lat2 - lat1);
			lon = lon1 + t * (lon2 - lon1);
			hlat = lat;
			hlon = lon;
			height = d + 70;
			angle = -90;
		}
		else
		{
			lat = getCourseHoleShotLat(courseID, hole, shot, offset, offset + 30);
			lon = getCourseHoleShotLon(courseID, hole, shot, offset, offset + 30);
			heading = getCourseHoleShotBearing(courseID, hole, shot);
			if (shot <= 1)
			{
				hlat = getCourseHoleTeeLat(courseID, hole);
				hlon = getCourseHoleTeeLon(courseID, hole);
			}
			else if (shot <= par - 2)
			{
				hlat = getCourseHoleTargetLat(courseID, hole, shot - 1);
				hlon = getCourseHoleTargetLon(courseID, hole, shot - 1);
			}
			else
			{
				hlat = getCourseHolePinLat(courseID, hole);
				hlon = getCourseHolePinLon(courseID, hole);
			}
		}
	}

	if (mapMode == 1)
	{
		var x = document.getElementById('mapdiv');
		var w = window.innerWidth;
		var h = window.innerHeight;
		w = x.clientWidth;
		h = x.clientHeight;
		if (w < 100) w = 100;
		if (h < 100) h = 100;
		height *= 1.05 * Math.sqrt(w / h);
		if (getAutoRotate() != 0)
			heading = 0;
	}

	if (lat != 0 || lon != 0)
	{
		flyToHeightAboveGround(lat, lon, hlat, hlon, height, heading, angle, durationSeconds)
	}

	if (refresh)
		refreshView();
}

function addHoleMarker(lat, lon)
{
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat, h + 0.005),
		cylinder : {
			length: 0.01,
			topRadius: 0.05,
			bottomRadius: 0.05,
			material: Cesium.Color.WHITE,
			outline: true,
			outlineColor: Cesium.Color.WHITE
		}
	}); 
	mapMarkers2.push(marker);
}

function addBallMarker(lat, lon)
{
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat, h + 0.005),
		cylinder : {
			length: 0.04,
			topRadius: 0.02,
			bottomRadius: 0.02,
			material: Cesium.Color.WHITE,
			outline: true,
			outlineColor: Cesium.Color.WHITE
		}
	}); 
	mapMarkers2.push(marker);
}

function addDispersionMarker(lat, lon)
{
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat, h + 0.05),
		cylinder : {
			length: 0.1,
			topRadius: 0.05,
			bottomRadius: 0.05,
			material: Cesium.Color.WHITE,
			outline: true,
			outlineColor: Cesium.Color.WHITE
		}
	}); 
	mapMarkers2.push(marker);
}

function addMarker(lat, lon, addYellowCircles, addWhiteCircles, addTargetCircles, numTargetCircles, bearing)
{
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat, h + 0.9),
		cylinder : {
			length: 1.8,
			topRadius: 0.1,
			bottomRadius: 0.1,
			material: Cesium.Color.WHITE,
			outline: true,
			outlineColor: Cesium.Color.WHITE
		}
	}); 
	mapMarkers.push(marker);
	if (mapMode == 1)
	{
		var x = myUnitsToMetres(1);
		var c = getCircleColor();
		if (addYellowCircles)
		{
			var y = getCircleBrightness() / 10.0;
			var y0 = (y > 0 ? y*0.75+0.25 : 0.0);
			var c0 = new Cesium.Color(1, 1, 0, y0);
			var c1 = new Cesium.Color(1, 1, 0, y*0.5);
			var c2 = new Cesium.Color(1, 1, 0, y*0.2);
			var c3 = new Cesium.Color(1, 1, 0, y*0.15);
			var c4 = new Cesium.Color(1, 1, 0, y*0.12);
			if (c == 1)
			{
				c0 = new Cesium.Color(0.5, 1, 0.5, y0);
				c1 = new Cesium.Color(0.5, 1, 0.5, y*0.5);
				c2 = new Cesium.Color(0.5, 1, 0.5, y*0.2);
				c3 = new Cesium.Color(0.5, 1, 0.5, y*0.15);
				c4 = new Cesium.Color(0.5, 1, 0.5, y*0.12);
			}
			if (c == 2)
			{
				c0 = new Cesium.Color(0.5, 1, 1, y0);
				c1 = new Cesium.Color(0.5, 1, 1, y*0.5);
				c2 = new Cesium.Color(0.5, 1, 1, y*0.2);
				c3 = new Cesium.Color(0.5, 1, 1, y*0.15);
				c4 = new Cesium.Color(0.5, 1, 1, y*0.12);
			}
			if (c == 3)
			{
				c0 = new Cesium.Color(1, 1, 1, y0);
				c1 = new Cesium.Color(1, 1, 1, y*0.5);
				c2 = new Cesium.Color(1, 1, 1, y*0.2);
				c3 = new Cesium.Color(1, 1, 1, y*0.15);
				c4 = new Cesium.Color(1, 1, 1, y*0.12);
			}
			var i = getTeeCircles();
			if (i <= 6)
			{
				addCircle(lat, lon, x*200, c1);
				addCircle(lat, lon, x*(250-5*i), c2);
				addCircle(lat, lon, x*(300-10*i), c1);
			}
			else if (i <= 10)
			{
				addCircle(lat, lon, x*(260-10*i), c1);
				addCircle(lat, lon, x*(280-10*i), c2);
				addCircle(lat, lon, x*(300-10*i), c1);
			}
			else
			{
				var j = 0;
				var n = 0;
				var m = 3 + i - 11;
				while (n < m && j <= 16)
				{
					if (getClubFlag(j))
					{
						n += 1;
						var d = getClubTotal(j);
						addCircle(lat, lon, x*d, (n == 1 ? c1 : (n == 2 ? c2 : (n == 3 ? c3 : c4))));
						if (bearing > -9999)
						{
							var lat2 = moveLat(lat, lon, x*d - 3, bearing + 10);
							var lon2 = moveLon(lat, lon, x*d - 3, bearing + 10);
							var hg2 = getProVisualizerTerrainHeightAndGradient(lat2, lon2, 2.0, 0.0, 90.0);
							addText(Math.round(d).toString(), lat2, lon2, -bearing - 10, 0.4, 0.4, c0, hg2.h, hg2.g1, 0.0, hg2.g2, 90.0);
							var lat3 = moveLat(lat, lon, x*d - 3, bearing - 10);
							var lon3 = moveLon(lat, lon, x*d - 3, bearing - 10);
							var hg3 = getProVisualizerTerrainHeightAndGradient(lat3, lon3, 2.0, 0.0, 90.0);
							addText(Math.round(d).toString(), lat3, lon3, -bearing + 10, 0.4, 0.4, c0, hg3.h, hg3.g1, 0.0, hg3.g2, 90.0);
						}
					}
					j += 1;
				}
			}
		}
		if (addWhiteCircles)
		{
			var y = getCircleBrightness() / 15.0;
			var c1 = new Cesium.Color(1, 1, 1, y*0.5);
			var c2 = new Cesium.Color(1, 1, 1, y*0.2);
			var c3 = new Cesium.Color(1, 1, 1, y*0.1);
			addCircle(lat, lon, x*10, c1);
			addCircle(lat, lon, x*50, c2);
			addCircle(lat, lon, x*100, c1);
			addCircle(lat, lon, x*150, c2);
			addCircle(lat, lon, x*200, c1);
			addCircle(lat, lon, x*250, c2);

			if (currentShot() >= 0)
			{
				addCircle(lat, lon, x*20, c3);
				addCircle(lat, lon, x*30, c3);
				addCircle(lat, lon, x*40, c3);

				addCircle(lat, lon, x*60, c3);
				addCircle(lat, lon, x*70, c3);
				addCircle(lat, lon, x*80, c3);
				addCircle(lat, lon, x*90, c3);

				addCircle(lat, lon, x*110, c3);
				addCircle(lat, lon, x*120, c3);
				addCircle(lat, lon, x*130, c3);
				addCircle(lat, lon, x*140, c3);

				addCircle(lat, lon, x*160, c3);
				addCircle(lat, lon, x*170, c3);
				addCircle(lat, lon, x*180, c3);
				addCircle(lat, lon, x*190, c3);

				addCircle(lat, lon, x*210, c3);
				addCircle(lat, lon, x*220, c3);
				addCircle(lat, lon, x*230, c3);
				addCircle(lat, lon, x*240, c3);
			}
		}
		if (addTargetCircles)
		{
			var y = getCircleBrightness() / 15.0;
			var c1 = new Cesium.Color(1, 1, 1, y*0.25);
			var c2 = new Cesium.Color(1, 1, 1, y*0.15);
			var c3 = new Cesium.Color(1, 1, 1, y*0.10);
			if (numTargetCircles >= 1) addCircle(lat, lon, x*10, c1);
			if (numTargetCircles >= 2) addCircle(lat, lon, x*20, c2);
			if (numTargetCircles >= 3) addCircle(lat, lon, x*30, c3);
		}
	}
}

function addCircle(lat, lon, radius, color)
{
	var rLat = moveLat(lat, lon, radius, 0) - lat;
	var rLon = moveLon(lat, lon, radius, 90) - lon;
	var coords = [];
	var theta = 0.0;
	var n = 60 + Math.round(radius);
	var dTheta = 2*Math.PI/n;
	for (var i = 0; i <= n; ++i)
	{
		if (i == n) theta = 0.0;
		var lat2 = lat + rLat*Math.cos(theta);
		var lon2 = lon + rLon*Math.sin(theta);
		var h2 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat2, lon2));
		coords.push(Cesium.Cartesian3.fromDegrees(lon2, lat2, h2));
		theta += dTheta;
	}
	for (var i = 0; i < 2; ++i)
	{
		var circle = viewer.entities.add({ polyline : { positions: coords, width: 1, material: color } });
		mapCircles.push(circle);
	}
}

function addCenterLines()
{
	var courseID = currentCourseID();
	for (var i = 1; i <= 18; ++i)
		addCourseHoleCenterLine(courseID, i, 1, 1, 0, 1, true);
}

function addCenterLine()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var a = getLineBrightness() * 0.1;
	var c = getLineColor();
	var r = 0;
	var g = 0;
	var b = 0;
	if      (c == 1) { r = 1.0; g = 1.0; b = 1.0; }
	else if (c == 2) { r = 1.0; g = 1.0; b = 0.0; }
	else if (c == 3) { r = 0.5; g = 1.0; b = 0.5; }
	else if (c == 4) { r = 0.5; g = 1.0; b = 1.0; }
	addCourseHoleCenterLine(courseID, hole, r, g, b, a, false);
}

function addCourseHoleCenterLine(courseID, hole, r, g, b, a, isOverview)
{
	if (hole < 1)
		return;

	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
		return;

	var positions = [];
	var i = 0;

	var lat = getCourseHoleTeeLat(courseID, hole);
	var lon = getCourseHoleTeeLon(courseID, hole);
	var h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	positions[i++] = Cesium.Cartesian3.fromDegrees(lon, lat, h);

	if (par >= 4)
	{
		lat = getCourseHoleTargetLat(courseID, hole, 1);
		lon = getCourseHoleTargetLon(courseID, hole, 1);
		h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
		positions[i++] = Cesium.Cartesian3.fromDegrees(lon, lat, h);
	}
	if (par >= 5)
	{
		lat = getCourseHoleTargetLat(courseID, hole, 2);
		lon = getCourseHoleTargetLon(courseID, hole, 2);
		h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
		positions[i++] = Cesium.Cartesian3.fromDegrees(lon, lat, h);
	}
	if (par >= 6)
	{
		lat = getCourseHoleTargetLat(courseID, hole, 3);
		lon = getCourseHoleTargetLon(courseID, hole, 3);
		h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
		positions[i++] = Cesium.Cartesian3.fromDegrees(lon, lat, h);
	}

	lat = getCourseHolePinLat(courseID, hole);
	lon = getCourseHolePinLon(courseID, hole);
	h = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat, lon));
	positions[i++] = Cesium.Cartesian3.fromDegrees(lon, lat, h);

	if (isOverview)
	{
		var x = (positions[0].x + positions[1].x)/2;
		var y = (positions[0].y + positions[1].y)/2;
		var z = (positions[0].z + positions[1].z)/2;
		viewer.entities.add({
			position: new Cesium.Cartesian3(x,y,z),
			billboard : { image: '/images/' + hole.toString() + 'y.png', eyeOffset: new Cesium.Cartesian3(0,0,-50) }
		});

		var line = viewer.entities.add({
			polyline : {
				positions: positions,
				width: 7,
				material: new Cesium.PolylineArrowMaterialProperty(new Cesium.Color(r, g, b, a))
			}
		}); 

		mapLines.push(line);
	}
	else
	{
		var line = viewer.entities.add({
			polyline : {
				positions: positions,
				width: 1.0,
				material: new Cesium.Color(r, g, b, a)
			}
		}); 

		mapLines.push(line);
	}
}

function removeAllFeatures()
{
	viewer.entities.removeAll();
	mapMarkers = [];
	mapMarkers2 = [];
	mapCircles = [];
	mapLines = [];
	mapLines2 = [];
	teeGridCount = 0;
	greenGridCount = 0;
	greenSlopesCount = 0;
	greenSlopesBearing = 0;
	greenContoursCount = 0;
	distCount = 0;
	coneCount = 0;
}

function removeDispersionFeatures()
{
	refreshView();
}

function clearNotes()
{
	var x = document.getElementById('notesdiv');
	x.innerHTML = '';
}

function setNotes(courseID, hole)
{
	var s = getCourseHoleNotes(courseID, hole);
	s = s.replace(/z1z/g, "&");
	s = s.replace(/z2z/g, "'");
	s = s.replace(/z3z/g, '"');
	s = s.replace(/z4z/g, '|');
	var x = document.getElementById('notesdiv');
	x.innerHTML = s;
}

function saveNotes()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var x = document.getElementById('notesdiv');
	var s = x.innerHTML;
	s = s.replace(/&/g, "z1z");
	s = s.replace(/'/g, "z2z");
	s = s.replace(/"/g, "z3z");
	s = s.replace(/\|/g, "z4z");
	setCourseHoleNotes(courseID, hole, s);
}

function refreshView()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var shot = currentShot();
	var par = getCourseHolePar(courseID, hole);

	removeAllFeatures();
	setDistDiv('');
	clearInfo();
	clearNotes();
	setInfo();
	setNotes(courseID, hole);

	if (hole == 0)
	{
		addCenterLines();
	}
	else
	{
		var teeLat = getCourseHoleTeeLat(courseID, hole);
		var teeLon = getCourseHoleTeeLon(courseID, hole);

		var pinLat = getCourseHolePinLat(courseID, hole);
		var pinLon = getCourseHolePinLon(courseID, hole);

		var target1Lat = getCourseHoleTargetLat(courseID, hole, 1);
		var target1Lon = getCourseHoleTargetLon(courseID, hole, 1);

		var target2Lat = getCourseHoleTargetLat(courseID, hole, 2);
		var target2Lon = getCourseHoleTargetLon(courseID, hole, 2);

		var target3Lat = getCourseHoleTargetLat(courseID, hole, 3);
		var target3Lon = getCourseHoleTargetLon(courseID, hole, 3);

		if (mapMode == 1)
			addCenterLine();

		if (teeLat != 0 || teeLon != 0)
		{
			var bearing = -9999;
			if (target1Lat != 0 || target1Lon != 0) bearing = geogBearing(teeLat, teeLon, target1Lat, target1Lon);
			else if (pinLat != 0 || pinLon != 0) bearing = geogBearing(teeLat, teeLon, pinLat, pinLon);
			addMarker(teeLat, teeLon, true, false, false, 0, bearing);
		}

		if (pinLat != 0 || pinLon != 0)
			addMarker(pinLat, pinLon, false, true, false, 0, 0);

		if (target1Lat != 0 || target1Lon != 0)
			addMarker(target1Lat, target1Lon, false, false, shot >= 1, 3, 0);

		if (target2Lat != 0 || target2Lon != 0)
			addMarker(target2Lat, target2Lon, false, false, shot >= 1, 1, 0);

		if (target3Lat != 0 || target3Lon != 0)
			addMarker(target3Lat, target3Lon, false, false, shot >= 1, 1, 0);
	}
	if (mapMode == 1)
	{
		var n = getCourseHoleMeasures(courseID, hole);
		var i;
		for (i = 0; i < n; ++i)
		{
			var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
			addDist(x.lat1, x.lon1, x.lat2, x.lon2);
		}
	}
	var n = getCourseHoleSymbols(courseID, hole);
	if (n > 0)
	{
		var theta = 0 - getCourseHoleBearing(courseID, hole);
		for (i = 0; i < n; ++i)
		{
			var x = decodeSymbol(getCourseHoleSymbol(courseID, hole, i));
			addSymbol(x.lat, x.lon, x.symbol, theta);
		}
	}
	viewTimestamp = Date.now();
}

function formatElevDiff(diff)
{
	if (diff < 0)
		return "&minus; " + Math.round(-diff).toString();

	return "&plus; " + Math.round(diff).toString();
}

function playsLikeDist(distMetres, elev1Metres, elev2Metres)
{
	// dist + height gain - 3% for each 1000m above sea level
	return (distMetres + elev2Metres - elev1Metres) * (1.0 - 0.00003 * elev1Metres);
}

var elevationSource = 0;
var elevationSourceRef = "";

function elevationRef()
{
	if (elevationSource == 1)
		return "(<a href='https://apps.nationalmap.gov/epqs/'>EPQS</a>)";
	else if (elevationSource == 2)
		return "(<a href='https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm-1-arc?qt-science_center_objects=0#qt-science_center_objects'>SRTM</a>)";
	else if (elevationSource == 3)
		return "(<a href='https://asterweb.jpl.nasa.gov/gdem.asp'>GDEM</a>)";
	else if (elevationSource == 99)
		return "(Mixed)";
	else if (elevationSource == 100)
		return elevationSourceRef;
	return "";
}

function refreshElevation()
{
	if (elevationTimestamp == viewTimestamp)
	{
		window.setTimeout(refreshElevation, 1000);
		return;
	}

	var courseID = currentCourseID();
	var hole = currentHole();
	bestClubID[1] = -1;
	bestClubID[2] = -1;
	bestClubID[3] = -1;
	bestClubID[4] = -1;

	if (hole == 0)
	{
		var par = getCoursePar(courseID);
		var len = getCourseLength(courseID);
		if (par == 0 || len == 0)
		{
			setHelpInfo();
		}
		else
		{
			var frontNineDesc = "";
			var frontNinePar = 0;
			var frontNineLen = 0;
			var backNineDesc = "";
			var backNinePar = 0;
			var backNineLen = 0;
			for (var hole = 1; hole <= 18; ++hole)
			{
				var par = getCourseHolePar(courseID, hole);
				var len = getCourseHoleLength(courseID, hole);
				var desc = "";
				if (par >= 3) desc += par.toString();
				else desc += "&minus;";
				desc += "&nbsp;";
				if (hole <= 9)
				{
					frontNineDesc += desc;
					frontNinePar += par;
					frontNineLen += len;
				}
				else
				{
					backNineDesc += desc;
					backNinePar += par;
					backNineLen += len;
				}
			}
			if (frontNinePar > 0)
			{
				frontNineDesc += "= " + frontNinePar.toString() + " = " + Math.round(frontNineLen).toString();
				setInfoDiv2(frontNineDesc);
			}
			else
			{
				setInfoDiv2("&nbsp;");
			}
			if (backNinePar > 0)
			{
				backNineDesc += "= " + backNinePar.toString() + " = " + Math.round(backNineLen).toString();
				setInfoDiv3(backNineDesc);
			}
			else
			{
				setInfoDiv3("&nbsp;");
			}
			setInfoDiv4("&nbsp;");
		}
		elevationTimestamp = viewTimestamp;
		window.setTimeout(refreshElevation, 1000);
		return;
	}

	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
	{
		elevationTimestamp = viewTimestamp;
		window.setTimeout(refreshElevation, 1000);
		return;
	}

	if (par == 3)
	{
		var lat1 = getCourseHoleTeeLat(courseID, hole);
		var lon1 = getCourseHoleTeeLon(courseID, hole);
		var elev1 = lookupElevation(lat1, lon1);

		var lat2 = getCourseHolePinLat(courseID, hole);
		var lon2 = getCourseHolePinLon(courseID, hole);
		var elev2 = lookupElevation(lat2, lon2);

		if (elev1 == -1000000 || elev2 == -1000000)
		{
			var dist1 = geogDist(lat1, lon1, lat2, lon2);
			setInfoDiv2("Elevation: Not available");
			setInfoDiv3("Plays Like: Not available");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
		}
		else if (elev1 == -999999 || elev2 == -999999)
		{
			setInfoDiv2("&nbsp;");//"Elevation: Fetching...");
			setInfoDiv3("&nbsp;");//Plays Like:");
		}
		else
		{
			if (elev1 < elev2 - 6) elev1 += 3; else if (elev1 < elev2) elev1 += 0.5 * (elev2 - elev1);
			if (elev2 < elev1 - 4) elev2 += 2; else if (elev2 < elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev2 > elev1 + 4) elev2 -= 2; else if (elev2 > elev1) elev2 += 0.5 * (elev1 - elev2);
			var dist1 = playsLikeDist(geogDist(lat1, lon1, lat2, lon2), elev1, elev2);
			setInfoDiv2("Elevation: "
				+ Math.round(elev1).toString() + " "
				+ formatElevDiff(elev2-elev1) + " metres "
				+ elevationRef());
			setInfoDiv3("Plays Like: "
				+ Math.round(metresToMyUnits(dist1)).toString() + " " + myUnitName());
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
		}
	}
	else if (par == 4)
	{
		var lat1 = getCourseHoleTeeLat(courseID, hole);
		var lon1 = getCourseHoleTeeLon(courseID, hole);
		var elev1 = lookupElevation(lat1, lon1);

		var lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		var lon2 = getCourseHoleTargetLon(courseID, hole, 1);
		var elev2 = lookupElevation(lat2, lon2);

		var lat3 = getCourseHolePinLat(courseID, hole);
		var lon3 = getCourseHolePinLon(courseID, hole);
		var elev3 = lookupElevation(lat3, lon3);

		if (elev1 == -1000000 || elev2 == -1000000 || elev3 == -1000000)
		{
			var dist1 = geogDist(lat1, lon1, lat2, lon2);
			var dist2 = geogDist(lat2, lon2, lat3, lon3);
			setInfoDiv2("Elevation: Not available");
			setInfoDiv3("Plays Like: Not available");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
		}
		else if (elev1 == -999999 || elev2 == -999999 || elev3 == -999999)
		{
			setInfoDiv2("&nbsp;");//"Elevation: Fetching...");
			setInfoDiv3("&nbsp;");//Plays Like:");
		}
		else
		{
			if (elev1 < elev2 - 6) elev1 += 3; else if (elev1 < elev2) elev1 += 0.5 * (elev2 - elev1);
			if (elev2 < elev1 - 4) elev2 += 2; else if (elev2 < elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev2 > elev1 + 4) elev2 -= 2; else if (elev2 > elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev3 < elev1 - 4) elev3 += 2; else if (elev3 < elev1) elev3 += 0.5 * (elev1 - elev3);
			if (elev3 > elev1 + 4) elev3 -= 2; else if (elev3 > elev1) elev3 += 0.5 * (elev1 - elev3);
			var dist1 = playsLikeDist(geogDist(lat1, lon1, lat2, lon2), elev1, elev2);
			var dist2 = playsLikeDist(geogDist(lat2, lon2, lat3, lon3), elev2, elev3);
			setInfoDiv2("Elevation: "
				+ Math.round(elev1).toString() + " "
				+ formatElevDiff(elev2-elev1) + " "
				+ formatElevDiff(elev3-elev2) + " metres "
				+ elevationRef());
			setInfoDiv3("Plays Like: "
				+ Math.round(metresToMyUnits(dist1 + dist2)).toString() + " " + myUnitName() + " ("
				+ Math.round(metresToMyUnits(dist1)).toString() + " + "
				+ Math.round(metresToMyUnits(dist2)).toString() + ")");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
		}
	}
	else if (par == 5)
	{
		var lat1 = getCourseHoleTeeLat(courseID, hole);
		var lon1 = getCourseHoleTeeLon(courseID, hole);
		var elev1 = lookupElevation(lat1, lon1);

		var lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		var lon2 = getCourseHoleTargetLon(courseID, hole, 1);
		var elev2 = lookupElevation(lat2, lon2);

		var lat3 = getCourseHoleTargetLat(courseID, hole, 2);
		var lon3 = getCourseHoleTargetLon(courseID, hole, 2);
		var elev3 = lookupElevation(lat3, lon3);

		var lat4 = getCourseHolePinLat(courseID, hole);
		var lon4 = getCourseHolePinLon(courseID, hole);
		var elev4 = lookupElevation(lat4, lon4);

		if (elev1 == -1000000 || elev2 == -1000000 || elev3 == -1000000 || elev4 == -1000000)
		{
			var dist1 = geogDist(lat1, lon1, lat2, lon2);
			var dist2 = geogDist(lat2, lon2, lat3, lon3);
			var dist3 = geogDist(lat3, lon3, lat4, lon4);
			setInfoDiv2("Elevation: Not available");
			setInfoDiv3("Plays Like: Not available");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			var club3 = getBestClubForDist(dist3); var name3 = getClubShortName(club3); var perc3 = getClubDistPercentage(club3, dist3);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "% + "
				+ name3 + " " + perc3.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
			bestClubID[3] = club3;
		}
		else if (elev1 == -999999 || elev2 == -999999 || elev3 == -999999 || elev4 == -999999)
		{
			setInfoDiv2("&nbsp;");//"Elevation: Fetching...");
			setInfoDiv3("&nbsp;");//Plays Like:");
		}
		else
		{
			if (elev1 < elev2 - 6) elev1 += 3; else if (elev1 < elev2) elev1 += 0.5 * (elev2 - elev1);
			if (elev2 < elev1 - 4) elev2 += 2; else if (elev2 < elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev2 > elev1 + 4) elev2 -= 2; else if (elev2 > elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev3 < elev1 - 4) elev3 += 2; else if (elev3 < elev1) elev3 += 0.5 * (elev1 - elev3);
			if (elev3 > elev1 + 4) elev3 -= 2; else if (elev3 > elev1) elev3 += 0.5 * (elev1 - elev3);
			if (elev4 < elev1 - 4) elev4 += 2; else if (elev4 < elev1) elev4 += 0.5 * (elev1 - elev4);
			if (elev4 > elev1 + 4) elev4 -= 2; else if (elev4 > elev1) elev4 += 0.5 * (elev1 - elev4);
			var dist1 = playsLikeDist(geogDist(lat1, lon1, lat2, lon2), elev1, elev2);
			var dist2 = playsLikeDist(geogDist(lat2, lon2, lat3, lon3), elev2, elev3);
			var dist3 = playsLikeDist(geogDist(lat3, lon3, lat4, lon4), elev3, elev4);
			setInfoDiv2("Elevation: "
				+ Math.round(elev1).toString() + " "
				+ formatElevDiff(elev2-elev1) + " "
				+ formatElevDiff(elev3-elev2) + " "
				+ formatElevDiff(elev4-elev3) + " metres "
				+ elevationRef());
			setInfoDiv3("Plays Like: "
				+ Math.round(metresToMyUnits(dist1 + dist2 + dist3)).toString() + " " + myUnitName() + " ("
				+ Math.round(metresToMyUnits(dist1)).toString() + " + "
				+ Math.round(metresToMyUnits(dist2)).toString() + " + "
				+ Math.round(metresToMyUnits(dist3)).toString() + ")");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			var club3 = getBestClubForDist(dist3); var name3 = getClubShortName(club3); var perc3 = getClubDistPercentage(club3, dist3);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "% + "
				+ name3 + " " + perc3.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
			bestClubID[3] = club3;
		}
	}
	else if (par == 6)
	{
		var lat1 = getCourseHoleTeeLat(courseID, hole);
		var lon1 = getCourseHoleTeeLon(courseID, hole);
		var elev1 = lookupElevation(lat1, lon1);

		var lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		var lon2 = getCourseHoleTargetLon(courseID, hole, 1);
		var elev2 = lookupElevation(lat2, lon2);

		var lat3 = getCourseHoleTargetLat(courseID, hole, 2);
		var lon3 = getCourseHoleTargetLon(courseID, hole, 2);
		var elev3 = lookupElevation(lat3, lon3);

		var lat4 = getCourseHoleTargetLat(courseID, hole, 3);
		var lon4 = getCourseHoleTargetLon(courseID, hole, 3);
		var elev4 = lookupElevation(lat4, lon4);

		var lat5 = getCourseHolePinLat(courseID, hole);
		var lon5 = getCourseHolePinLon(courseID, hole);
		var elev5 = lookupElevation(lat5, lon5);

		if (elev1 == -1000000 || elev2 == -1000000 || elev3 == -1000000 || elev4 == -1000000 || elev5 == -1000000)
		{
			var dist1 = geogDist(lat1, lon1, lat2, lon2);
			var dist2 = geogDist(lat2, lon2, lat3, lon3);
			var dist3 = geogDist(lat3, lon3, lat4, lon4);
			var dist4 = geogDist(lat4, lon4, lat5, lon5);
			setInfoDiv2("Elevation: Not available");
			setInfoDiv3("Plays Like: Not available");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			var club3 = getBestClubForDist(dist3); var name3 = getClubShortName(club3); var perc3 = getClubDistPercentage(club3, dist3);
			var club4 = getBestClubForDist(dist4); var name4 = getClubShortName(club4); var perc4 = getClubDistPercentage(club4, dist4);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "% + "
				+ name3 + " " + perc3.toString() + "% + "
				+ name4 + " " + perc4.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
			bestClubID[3] = club3;
			bestClubID[4] = club4;
		}
		else if (elev1 == -999999 || elev2 == -999999 || elev3 == -999999 || elev4 == -999999 || elev5 == -999999)
		{
			setInfoDiv2("&nbsp;");//"Elevation: Fetching...");
			setInfoDiv3("&nbsp;");//Plays Like:");
		}
		else
		{
			if (elev1 < elev2 - 6) elev1 += 3; else if (elev1 < elev2) elev1 += 0.5 * (elev2 - elev1);
			if (elev2 < elev1 - 4) elev2 += 2; else if (elev2 < elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev2 > elev1 + 4) elev2 -= 2; else if (elev2 > elev1) elev2 += 0.5 * (elev1 - elev2);
			if (elev3 < elev1 - 4) elev3 += 2; else if (elev3 < elev1) elev3 += 0.5 * (elev1 - elev3);
			if (elev3 > elev1 + 4) elev3 -= 2; else if (elev3 > elev1) elev3 += 0.5 * (elev1 - elev3);
			if (elev4 < elev1 - 4) elev4 += 2; else if (elev4 < elev1) elev4 += 0.5 * (elev1 - elev4);
			if (elev4 > elev1 + 4) elev4 -= 2; else if (elev4 > elev1) elev4 += 0.5 * (elev1 - elev4);
			if (elev5 < elev1 - 4) elev5 += 2; else if (elev5 < elev1) elev5 += 0.5 * (elev1 - elev5);
			if (elev5 > elev1 + 4) elev5 -= 2; else if (elev5 > elev1) elev5 += 0.5 * (elev1 - elev5);
			var dist1 = playsLikeDist(geogDist(lat1, lon1, lat2, lon2), elev1, elev2);
			var dist2 = playsLikeDist(geogDist(lat2, lon2, lat3, lon3), elev2, elev3);
			var dist3 = playsLikeDist(geogDist(lat3, lon3, lat4, lon4), elev3, elev4);
			var dist4 = playsLikeDist(geogDist(lat4, lon4, lat5, lon5), elev4, elev5);
			setInfoDiv2("Elevation: "
				+ Math.round(elev1).toString() + " "
				+ formatElevDiff(elev2-elev1) + " "
				+ formatElevDiff(elev3-elev2) + " "
				+ formatElevDiff(elev4-elev3) + " "
				+ formatElevDiff(elev5-elev4) + " metres "
				+ elevationRef());
			setInfoDiv3("Plays Like: "
				+ Math.round(metresToMyUnits(dist1 + dist2 + dist3 + dist4)).toString() + " " + myUnitName() + " ("
				+ Math.round(metresToMyUnits(dist1)).toString() + " + "
				+ Math.round(metresToMyUnits(dist2)).toString() + " + "
				+ Math.round(metresToMyUnits(dist3)).toString() + " + "
				+ Math.round(metresToMyUnits(dist4)).toString() + ")");
			var club1 = getBestClubForDist(dist1); var name1 = getClubShortName(club1); var perc1 = getClubDistPercentage(club1, dist1);
			var club2 = getBestClubForDist(dist2); var name2 = getClubShortName(club2); var perc2 = getClubDistPercentage(club2, dist2);
			var club3 = getBestClubForDist(dist3); var name3 = getClubShortName(club3); var perc3 = getClubDistPercentage(club3, dist3);
			var club4 = getBestClubForDist(dist4); var name4 = getClubShortName(club4); var perc4 = getClubDistPercentage(club4, dist4);
			setInfoDiv4(""
				+ name1 + " " + perc1.toString() + "% + "
				+ name2 + " " + perc2.toString() + "% + "
				+ name3 + " " + perc3.toString() + "% + "
				+ name4 + " " + perc4.toString() + "%");
			elevationTimestamp = viewTimestamp;
			bestClubID[1] = club1;
			bestClubID[2] = club2;
			bestClubID[3] = club3;
			bestClubID[4] = club4;
		}
	}
	window.setTimeout(refreshElevation, 1000);
}

function lookupElevation(lat, lon)
{
	elevationSource = 0;
	var e = -9999;
	if (terrainMode == 2 && terrain1SourceID >= 2) // UK Lidar
	{
		e = getProVisualizerTerrain1Height(lat, lon);
		if (e > -9999)
		{
			elevationSource = 100;
			elevationSourceRef = "(<a href="+terrainURLs[terrain1SourceID]+">Lidar</a>)";
			return e;
		}
	}
	e = elevationOverride(lat, lon);
	if (e > -9999)
	{
		elevationSource = 99;
		return e;
	}
	var dLat = distToDeltaLat(3, lat, lon);
	var dLon = distToDeltaLon(3, lat, lon);
	var lat1 = lat - dLat;
	var lat2 = lat + dLat;
	var lon1 = lon - dLon;
	var lon2 = lon + dLon;
	var lat3 = lat - dLat*1000;
	var lat4 = lat + dLat*1000;
	var lon3 = lon - dLon*1000;
	var lon4 = lon + dLon*1000;
	var elev = null;
	var minReqTimestamp = Date.now() - 10000;
	var i = 0;
	while (elev == null && i < elevation.length)
	{
		var eLat = elevationLat[i];
		var eLon = elevationLon[i];
		var e = elevation[i];
		if (e == -1000000)
		{
			if (eLat >= lat3 && eLat <= lat4 && eLon >= lon3 && eLon <= lon4)
				elev = e;
		}
		else
		{
			if (eLat >= lat1 && eLat <= lat2 && eLon >= lon1 && eLon <= lon2)
			{
				elev = e;
				if (elev == -999999 && elevationReqTimestamp[i] < minReqTimestamp)
				{
					elevation[i] = -1000000;
					elev = -1000000;
				}
			}
		}
		i += 1;
	}
	if (elev == null)
	{
		fetchElevation(lat, lon);
		return -999999; // fetching
	}
	else if (elev == -999999)
	{
		return elev; // fetching
	}
	else if (elev < -1000 || elev > 5000)
	{
		return lookupElevation2(lat, lon);
	}
	elevationSource = 1;
	return elev;
}

function lookupElevation2(lat, lon)
{
	var dLat = distToDeltaLat(3, lat, lon);
	var dLon = distToDeltaLon(3, lat, lon);
	var lat1 = lat - dLat;
	var lat2 = lat + dLat;
	var lon1 = lon - dLon;
	var lon2 = lon + dLon;
	var lat3 = lat - dLat*1000;
	var lat4 = lat + dLat*1000;
	var lon3 = lon - dLon*1000;
	var lon4 = lon + dLon*1000;
	var elev = null;
	var i = 0;
	while (elev == null && i < elevation2.length)
	{
		var eLat = elevation2Lat[i];
		var eLon = elevation2Lon[i];
		var e = elevation2[i];
		if (e == -1000000)
		{
			if (eLat >= lat3 && eLat <= lat4 && eLon >= lon3 && eLon <= lon4)
				elev = e;
		}
		else
		{
			if (eLat >= lat1 && eLat <= lat2 && eLon >= lon1 && eLon <= lon2)
				elev = e;
		}
		i += 1;
	}
	if (elev == null)
	{
		fetchElevation2(lat, lon);
		return -999999; // fetching
	}
	else if (elev == -999999)
	{
		return elev; // fetching
	}
	else if (elev < -1000 || elev > 5000)
	{
		return -1000000; // not available
	}
	elevationSource = 2;
	if (lat > 60 || lat < -56) elevationSource = 3;
	return elev;
}

function fetchElevation(lat, lon)
{
	var i = elevation.length;
	elevationReqTimestamp[i] = Date.now();
	elevationLat[i] = lat;
	elevationLon[i] = lon;
	elevation[i] = -999999; // fetching
	if (lon > -20)
	{
		elevation[i] = -1000000;
	}
	else if (window.XMLHttpRequest)
	{
		var req = "https://epqs.nationalmap.gov/v1/json?x=" + lon.toString() + "&y=" + lat.toString() + "&units=Meters&wkid=4326&includeDate=False";
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				if (xhr.responseText == "")
				{
					elevation[i] = -1000000;
				}
				else
				{
					var obj = JSON.parse(xhr.responseText);
					elevation[i] = Math.round(parseFloat(obj.value));
				}
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function fetchElevation2(lat, lon)
{
	var i = elevation2.length;
	elevation2Lat[i] = lat;
	elevation2Lon[i] = lon;
	elevation2[i] = -999999; // fetching
	if (window.XMLHttpRequest)
	{
		var req = "/elevation.php?coords=";
		req += Math.round(lat * 111111).toString() + ",";
		req += Math.round(lon * 111111).toString();
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				if (xhr.responseText.length > 5)
				{
					eval(xhr.responseText);
					if (elevHeightsMetres.length == 1)
						elevation2[i] = elevHeightsMetres[0];
					else if (elevHeightsFeet.length == 1)
						elevation2[i] = elevHeightsFeet[0] * (1609.344 / (3*1760));
					else
						elevation2[i] = -1000000;
				}
				else
				{
					elevation2[i] = -1000000;
				}
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function spreadHandler()
{
	dispersionHandler(true);
}

function dispersionHandler(showBox = false)
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	var dispersionProfileID = getDispersionProfileID();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	if (teeLat == 0 && teeLon == 0)
	{
		alert("Please set tee position.");
		return;
	}
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);
	if (pinLat == 0 && pinLon == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var par = getCourseHolePar(courseID, hole);
	if (par < 3)
	{
		alert("Please set tee and pin position.");
		return;
	}

	var target1Lat = getCourseHoleTargetLat(courseID, hole, 1);
	var target1Lon = getCourseHoleTargetLon(courseID, hole, 1);

	var target2Lat = getCourseHoleTargetLat(courseID, hole, 2);
	var target2Lon = getCourseHoleTargetLon(courseID, hole, 2);

	var target3Lat = getCourseHoleTargetLat(courseID, hole, 3);
	var target3Lon = getCourseHoleTargetLon(courseID, hole, 3);

	if (dispersionProfileID <= 10)
	{
	// Pro+X%
	var nrl = getNRL();
	var dispersionMultiplier = 1.0 + 0.1 * dispersionProfileID;
	var dispersionMultiplier2 = 1.0 + 0.05 * dispersionProfileID;
	for (var i = 0; i < 100; ++i)
	{
		var lat1 = teeLat;
		var lon1 = teeLon;

		for (var shot = 1; shot <= par - 2; ++shot)
		{
			var lat0 = teeLat;
			var lon0 = teeLon;
			if (shot == 2)
			{
				lat0 = target1Lat;
				lon0 = target1Lon;
			}
			else if (shot == 3)
			{
				lat0 = target2Lat;
				lon0 = target2Lon;
			}
			else if (shot == 4)
			{
				lat0 = target3Lat;
				lon0 = target3Lon;
			}
			var lat2 = 0;
			var lon2 = 0;
			if (shot == par - 2)
			{
				lat2 = pinLat;
				lon2 = pinLon;
			}
			else if (shot == 1)
			{
				lat2 = target1Lat;
				lon2 = target1Lon;
			}
			else if (shot == 2)
			{
				lat2 = target2Lat;
				lon2 = target2Lon;
			}
			else if (shot == 3)
			{
				lat2 = target3Lat;
				lon2 = target3Lon;
			}
			var nominalDist = geogDist(lat0, lon0, lat2, lon2);
			var dist = geogDist(lat1, lon1, lat2, lon2);
			var bearing = geogBearing(lat1, lon1, lat2, lon2);

			// Distance Error
			// -8% to +6%
			var x = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
			x = 14*x - 7; // Normal distribution -7 .. +7
			if (dist < 90) x *= 1 + (90 - dist)/45; // Distance error gradually increases below 90 metres
			x = x - 1; // Normal distribution -8 .. +6
			x = x*dist/100; // Normal distribution -8% .. +6%
			if (x < 0) x *= dispersionMultiplier;
			else x *= dispersionMultiplier2;

			// Direction Error
			// +/- 3/5/7 degrees at 100/200/300 yards
			var max = 1 + 2*dist/90; // 3/5/7 at 100/200/300 yards
			var y = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
			y = 2*max*y - max; // Normal distribution -max .. +max
			y *= dispersionMultiplier;
			if (nrl == 1)
			{
				if (y > 0) x -= 0.3*dist*y*Math.PI/180;
				else       x -= 0.1*dist*y*Math.PI/180;
			}
			if (nrl == 2)
			{
				if (y > 0) x += 0.1*dist*y*Math.PI/180;
				else       x += 0.3*dist*y*Math.PI/180;
			}

			var dist2 = dist + x;
			var bearing2 = bearing + y;
			var lat3 = moveLat(lat1, lon1, dist2, bearing2);
			var lon3 = moveLon(lat1, lon1, dist2, bearing2);

			// Wind and bounce
			// Up to 5% in random direction
			var z = (Math.random() + Math.random() + Math.random() + Math.random()) / 4; // Normal distribution 0 .. 1
			z = 10*z - 5; // Normal distribution -5 .. +5
			var dist3 = z*dist/100; // Normal distribution -5% .. +5%
			var bearing3 = 360 * Math.random();
			var lat4 = moveLat(lat3, lon3, dist3, bearing3);
			var lon4 = moveLon(lat3, lon3, dist3, bearing3);

			if (!showBox && nominalDist > 10.0)
				addDispersionMarker(lat4, lon4);

			lat1 = lat4;
			lon1 = lon4;
		}
	}
	}
	else
	{
	// Custom
	var lat1 = teeLat;
	var lon1 = teeLon;

	for (var shot = 1; shot <= par - 2; ++shot)
	{
		var lat0 = teeLat;
		var lon0 = teeLon;
		if (shot == 2)
		{
			lat0 = target1Lat;
			lon0 = target1Lon;
		}
		else if (shot == 3)
		{
			lat0 = target2Lat;
			lon0 = target2Lon;
		}
		else if (shot == 4)
		{
			lat0 = target3Lat;
			lon0 = target3Lon;
		}
		var lat2 = 0;
		var lon2 = 0;
		if (shot == par - 2)
		{
			lat2 = pinLat;
			lon2 = pinLon;
		}
		else if (shot == 1)
		{
			lat2 = target1Lat;
			lon2 = target1Lon;
		}
		else if (shot == 2)
		{
			lat2 = target2Lat;
			lon2 = target2Lon;
		}
		else if (shot == 3)
		{
			lat2 = target3Lat;
			lon2 = target3Lon;
		}
		var nominalDist = geogDist(lat0, lon0, lat2, lon2);
		var dist = geogDist(lat1, lon1, lat2, lon2);
		var bearing = geogBearing(lat1, lon1, lat2, lon2);
		var clubID = getBestClubForDist(dist);
		var clubPercent = getClubDistPercentage(clubID, dist, false);
		var clubSpreadL = myUnitsToMetres(getClubSpreadL(clubID)) * (clubPercent/100.0);
		var clubSpreadR = myUnitsToMetres(getClubSpreadR(clubID)) * (clubPercent/100.0);
		var clubSpreadO = myUnitsToMetres(getClubSpreadO(clubID)) * (clubPercent/100.0);
		var clubSpreadS = myUnitsToMetres(getClubSpreadS(clubID)) * (clubPercent/100.0);
		var clubSpreadOL = clubSpreadO;
		var clubSpreadOR = clubSpreadO;
		var clubSpreadSL = clubSpreadS;
		var clubSpreadSR = clubSpreadS;
		var clubShape = getClubShape(clubID);
		if (clubShape ==   2) { clubSpreadOL += 0.20*clubSpreadL; clubSpreadOR -= 0.20*clubSpreadR;
					clubSpreadSL -= 0.20*clubSpreadL; clubSpreadSR += 0.20*clubSpreadR; }
		if (clubShape ==   1) { clubSpreadOL += 0.10*clubSpreadL; clubSpreadOR -= 0.10*clubSpreadR;
					clubSpreadSL -= 0.10*clubSpreadL; clubSpreadSR += 0.10*clubSpreadR; }
		if (clubShape ==  -1) { clubSpreadOL -= 0.10*clubSpreadL; clubSpreadOR += 0.10*clubSpreadR;
					clubSpreadSL += 0.10*clubSpreadL; clubSpreadSR -= 0.10*clubSpreadR; }
		if (clubShape ==  -2) { clubSpreadOL -= 0.20*clubSpreadL; clubSpreadOR += 0.20*clubSpreadR;
					clubSpreadSL += 0.20*clubSpreadL; clubSpreadSR -= 0.20*clubSpreadR; }
		if (dist < 90)
		{
			// Distance error gradually increases below 90 metres
			clubSpreadO *= 1 + (90 - dist)/45;
			clubSpreadS *= 1 + (90 - dist)/45;
		}
		for (var i = 0; i < 100; ++i)
		{
			// Distance Error
			var x = (Math.random() + Math.random() + Math.random()) / 3; // Normal distribution 0 .. 1
			x = 2*x - 1; // Normal distribution -1 .. +1
			if (x < 0) x *= clubSpreadS;
			if (x > 0) x *= clubSpreadO;
			x *= 1.3;

			// Direction Error
			var y = (Math.random() + Math.random() + Math.random()) / 3; // Normal distribution 0 .. 1
			y = 2*y - 1; // Normal distribution -1 .. +1
			if (y < 0) y *= clubSpreadL;
			if (y > 0) y *= clubSpreadR;
			y *= 1.3;
			if (clubShape ==  2) { if (y > 0) x -= 0.30*y; else x -= 0.10*y; }
			if (clubShape ==  1) { if (y > 0) x -= 0.15*y; else x -= 0.05*y; }
			if (clubShape == -1) { if (y < 0) x += 0.15*y; else x += 0.05*y; }
			if (clubShape == -2) { if (y < 0) x += 0.30*y; else x += 0.10*y; }

			var dist2 = dist + x;
			var bearing2 = bearing + (y/dist)*(180.0/Math.PI);
			var lat3 = moveLat(lat1, lon1, dist2, bearing2);
			var lon3 = moveLon(lat1, lon1, dist2, bearing2);

			// Wind and bounce
			// Up to 2m in a random direction
			var z = (Math.random() + Math.random() + Math.random()) / 3; // Normal distribution 0 .. 1
			var dist3 = 4*z - 2; // Normal distribution -2 .. +2
			var bearing3 = 360 * Math.random();
			var lat4 = moveLat(lat3, lon3, dist3, bearing3);
			var lon4 = moveLon(lat3, lon3, dist3, bearing3);

			if (!showBox && nominalDist > 10.0)
				addDispersionMarker(lat4, lon4);
		}
		lat1 = lat2;
		lon1 = lon2;
	}
	}
	if (showBox)
	{
		// Draw dispersion boxes...
		for (var shot = 1; shot <= par - 2; ++shot)
		{
			var lat1 = teeLat;
			var lon1 = teeLon;
			if (shot == 2)
			{
				lat1 = target1Lat;
				lon1 = target1Lon;
			}
			else if (shot == 3)
			{
				lat1 = target2Lat;
				lon1 = target2Lon;
			}
			else if (shot == 4)
			{
				lat1 = target3Lat;
				lon1 = target3Lon;
			}
			var lat2 = 0;
			var lon2 = 0;
			if (shot == par - 2)
			{
				lat2 = pinLat;
				lon2 = pinLon;
			}
			else if (shot == 1)
			{
				lat2 = target1Lat;
				lon2 = target1Lon;
			}
			else if (shot == 2)
			{
				lat2 = target2Lat;
				lon2 = target2Lon;
			}
			else if (shot == 3)
			{
				lat2 = target3Lat;
				lon2 = target3Lon;
			}
			var dist = geogDist(lat1, lon1, lat2, lon2);
			if (dist > 10.0)
			{
				var bearing = geogBearing(lat1, lon1, lat2, lon2);
				var clubSpreadL = 0.10*dist;
				var clubSpreadR = 0.10*dist;
				var clubSpreadO = 0.06*dist;
				var clubSpreadS = 0.08*dist;
				var clubShape = 0;
				if (dispersionProfileID <= 10)
				{
					// Pro+X%
					var k  = 0.8;
					var tO = (dist > 275.0 ? 0.0 : (1.0 - dist/275.0));
					var kL = 1.0 + 0.08 * dispersionProfileID;
					var kR = 1.0 + 0.08 * dispersionProfileID;
					var kO = 1.0 + 0.08 * dispersionProfileID * tO;
					var kS = 1.0 + 0.08 * dispersionProfileID;
					clubSpreadLRDegrees = 1 + 2*dist/90;
					if (clubSpreadLRDegrees < 3) clubSpreadLRDegrees = 3;
					clubSpreadLRRadians = clubSpreadLRDegrees*(Math.PI/180.0);
					clubSpreadL = k*kL*clubSpreadLRRadians*dist;
					clubSpreadR = k*kR*clubSpreadLRRadians*dist;
					clubSpreadO = k*kO*0.06*dist;
					clubSpreadS = k*kS*0.09*dist;
					if (dist < 90)
					{
						// Error gradually increases below 90 metres
						clubSpreadL *= 1 + (90 - dist)/90;
						clubSpreadR *= 1 + (90 - dist)/90;
						clubSpreadO *= 1 + (90 - dist)/90;
						clubSpreadS *= 1 + (90 - dist)/90;
					}
					var nrl = getNRL();
					if (nrl == 1) clubShape = +2;
					if (nrl == 2) clubShape = -2;
				}
				else
				{
					// Custom
					var clubID = getBestClubForDist(dist);
					var clubPercent = getClubDistPercentage(clubID, dist, false);
					clubSpreadL = myUnitsToMetres(getClubSpreadL(clubID)) * (clubPercent/100.0);
					clubSpreadR = myUnitsToMetres(getClubSpreadR(clubID)) * (clubPercent/100.0);
					clubSpreadO = myUnitsToMetres(getClubSpreadO(clubID)) * (clubPercent/100.0);
					clubSpreadS = myUnitsToMetres(getClubSpreadS(clubID)) * (clubPercent/100.0);
					if (dist < 90)
					{
						// Distance error gradually increases below 90 metres
						clubSpreadO *= 1 + (90 - dist)/90;
						clubSpreadS *= 1 + (90 - dist)/90;
					}
					clubShape = getClubShape(clubID);
				}
				var clubSpreadOL = clubSpreadO;
				var clubSpreadOR = clubSpreadO;
				var clubSpreadSL = clubSpreadS;
				var clubSpreadSR = clubSpreadS;
				if (clubShape ==   2) { clubSpreadOL += 0.20*clubSpreadL; clubSpreadOR -= 0.20*clubSpreadR;
							clubSpreadSL -= 0.20*clubSpreadL; clubSpreadSR += 0.20*clubSpreadR; }
				if (clubShape ==   1) { clubSpreadOL += 0.10*clubSpreadL; clubSpreadOR -= 0.10*clubSpreadR;
							clubSpreadSL -= 0.10*clubSpreadL; clubSpreadSR += 0.10*clubSpreadR; }
				if (clubShape ==  -1) { clubSpreadOL -= 0.10*clubSpreadL; clubSpreadOR += 0.10*clubSpreadR;
							clubSpreadSL += 0.10*clubSpreadL; clubSpreadSR -= 0.10*clubSpreadR; }
				if (clubShape ==  -2) { clubSpreadOL -= 0.20*clubSpreadL; clubSpreadOR += 0.20*clubSpreadR;
							clubSpreadSL += 0.20*clubSpreadL; clubSpreadSR -= 0.20*clubSpreadR; }
				// Draw box around dispersion...
				var brightness = 0.03 * getCircleBrightness();
				var c = getCircleColor();
				var color = new Cesium.Color(1,1,0,brightness);
				if (c == 1) color = new Cesium.Color(0.5,1.0,0.5,brightness);
				if (c == 2) color = new Cesium.Color(0.5,1.0,1.0,brightness);
				if (c == 3) color = new Cesium.Color(1.0,1.0,1.0,brightness);
				var bearingLO = bearing - (clubSpreadL/dist)*(180.0/Math.PI);
				var bearingRO = bearing + (clubSpreadR/dist)*(180.0/Math.PI);
				var bearingLS = bearing - (clubSpreadL/dist)*(180.0/Math.PI);
				var bearingRS = bearing + (clubSpreadR/dist)*(180.0/Math.PI);
				var coords = [];
				var bb = 5000;
				var n = 1 + Math.round(clubSpreadL);
				for (var i = 0; i <= n; ++i)
				{
					var d = dist+clubSpreadO+(i/n)*(clubSpreadOL-clubSpreadO);
					var b = bearing+(i/n)*(bearingLO-bearing);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var n = 1 + Math.round(clubSpreadO+clubSpreadS);
				for (var i = 1; i <= n; ++i)
				{
					var d = dist+clubSpreadOL-(i/n)*(clubSpreadSL+clubSpreadOL);
					var b = bearingLO+(i/n)*(bearingLS-bearingLO);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var n = 1 + Math.round(clubSpreadL);
				for (var i = 1; i <= n; ++i)
				{
					var d = dist-clubSpreadSL-(i/n)*(clubSpreadS-clubSpreadSL);
					var b = bearingLS+(i/n)*(bearing-bearingLS);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var n = 1 + Math.round(clubSpreadR);
				for (var i = 1; i <= n; ++i)
				{
					var d = dist-clubSpreadS-(i/n)*(clubSpreadSR-clubSpreadS);
					var b = bearing+(i/n)*(bearingRS-bearing);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var n = 1 + Math.round(clubSpreadO+clubSpreadS);
				for (var i = 1; i <= n; ++i)
				{
					var d = dist-clubSpreadSR+(i/n)*(clubSpreadSR+clubSpreadOR);
					var b = bearingRS+(i/n)*(bearingRO-bearingRS);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var n = 1 + Math.round(clubSpreadR);
				for (var i = 1; i <= n; ++i)
				{
					var d = dist+clubSpreadOR+(i/n)*(clubSpreadO-clubSpreadOR);
					var b = bearingRO+(i/n)*(bearing-bearingRO);
					d -= d*(b-bearing)*(b-bearing)/bb;
					var lat3 = moveLat(lat1, lon1, d, b);
					var lon3 = moveLon(lat1, lon1, d, b);
					var h3 = (terrainMode == 1 ? 0 : getProVisualizerTerrainHeight(lat3, lon3));
					coords.push(Cesium.Cartesian3.fromDegrees(lon3, lat3, h3));
				}
				var line = viewer.entities.add({ polyline : { positions: coords, width: 1.0, material: color } }); 
				mapLines2.push(line);
			}
		}
	}
}

function shotHelp()
{
	setMode(0);
	alert("Use the Next Hole/Shot and Prev Hole/Shot buttons to navigate around the course, and use the 2D/3D button to switch between 2D and 3D mode. Distances are based on the tee, pin and target positions shown, and may not agree exactly with the official scorecard. Elevation is based on USGS National Map Elevation Point Query Service in the United States and the SRTM 1 Arc-Second Global Dataset and ASTER GDEM V3 Dataset elsewhere, as indicated. Click on the link for more information regarding coverage and accuracy. Plays like is based on horizontal distance plus/minus 1 yard for each yard of elevation gain/loss, minus 3% for each 1000 metres above sea level. This is only approximate as it depends on the exact trajectory and spin of each shot, but hopefully it gives a reasonably accurate estimate in most cases. Clubbing is based on My Profile."); 
}

function dispersionHelp()
{
	setMode(0);
	alert("Dispersion is based on PGA Tour statistics and may not accurately reflect your individual dispersion profile. Specifically, it is based on a distance error of -8% to +6% and a direction error of 3 degrees left/right at 100 yards, rising to 5 degrees at 200 yards and 7 degrees at 300 yards. A random error of up to 5% is also added to simulate unpredictable wind and bounce. Distance, direction, wind and bounce are all modelled using a fourth order approximation to a normal distribution, i.e. by taking the average of 4 random numbers in the given range. This is only approximate, and every player is different, but we believe it gives a fairly good representation of pro-level dispersion patterns in good weather conditions. Select Pro+X% to increase the dispersion by the specified factor, and N/R/L to switch between neutral, right-handed and left-handed patterns. Use the Custom option if you want to specify the exact width, depth and shape of each individual club.");
}

function spreadHelp()
{
	setMode(0);
	alert("Spread puts a box around your chosen dispersion pattern (Pro+X% or Custom). If you have selected Pro+X%, the box will be based on our Pro+X% dispersion model. If you have selected Custom, the box will be exactly as specified by the Left/Right/Long/Short dispersion settings in My Profile. Note that in reality dispersion doesn't have a precise boundary, so there will be a small percentage of shots that stray outside the box. If you use the Custom option, you should set Left/Right/Long/Short to be your estimated spread at your preferred confidence level, e.g. 90%, 95%, etc.");
}

function slopesHelp()
{
	setMode(0);
	alert("Slopes and contours are based on lidar survey data. We believe the data is fairly accurate in most cases. However, please note that the data can often be several years old, and might not accurately represent the current state of the course. Therefore, it is essential that you verify the accuracy of the data before using it. When the slopes are visible, you can right click anywhere on the green to set the hole location, and then left click anywhere on the green to simulate a putt to the specified hole location. Double right click anywhere to simulate 10-foot putts from all directions. Left click a hole location to remove it. Right click a putt start point to remove it. Note that putting simulations are not saved, so please capture a screen shot if you wish to save the image.");
}

function moveLat(lat, lon, dist, bearing)
{
	var radians = Math.PI * (90 - bearing) / 180;
	var dLat = Math.sin(radians) * dist * 360 / 40000000;
	return lat + dLat;
}

function moveLon(lat, lon, dist, bearing)
{
	var radians = Math.PI * (90 - bearing) / 180;
	var k = 1 / Math.cos(Math.PI * lat / 180);
	var dLon = Math.cos(radians) * dist * k * 360 / 40000000;
	return lon + dLon;
}

function GETeeHandler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);
	if (lat1 == 0 && lon1 == 0)
	{
		alert("Please set tee position.");
		return;
	}
	var lat2 = getCourseHoleTargetLat(courseID, hole, 1);
	var lon2 = getCourseHoleTargetLon(courseID, hole, 1);
	if (lat2 == 0 && lon2 == 0)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var i = document.getElementById("geheightselect").selectedIndex;
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var height = 24;
	var angle = 70;
	var range = 90;
	var desc = "Tee High";
	if (i == 1)
	{
		height = 18;
		angle = 75;
		range = 70;
		desc = "Tee Mid"
	}
	else if (i == 2)
	{
		height = 12;
		angle = 80;
		range = 50;
		desc = "Tee Low"
	}
	else if (i == 3)
	{
		height = 0;
		angle = 0;
		range = 200;
		desc = "Tee 2D"
	}
	GEViewLink(lat1, lon1, height, bearing, angle, range, GEViewName(courseID, hole, desc));
}

function GET1Handler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat1 = getCourseHoleTargetLat(courseID, hole, 1);
	var lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	if (lat1 == 0 && lon1 == 0)
	{
		alert("Please set target 1.");
		return;
	}
	var lat2 = getCourseHoleTargetLat(courseID, hole, 2);
	var lon2 = getCourseHoleTargetLon(courseID, hole, 2);
	if (lat2 == 0 && lon2 == 0)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var i = document.getElementById("geheightselect").selectedIndex;
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var height = 15;
	var angle = 75;
	var range = 70;
	var desc = "Target 1 High";
	if (i == 1)
	{
		height = 10;
		angle = 80;
		range = 50;
		desc = "Target 1 Mid";
	}
	else if (i == 2)
	{
		height = 5;
		angle = 85;
		range = 30;
		desc = "Target 1 Low";
	}
	else if (i == 3)
	{
		height = 0;
		angle = 0;
		range = 400;
		desc = "Target 1 2D"
	}
	GEViewLink(lat1, lon1, height, bearing, angle, range, GEViewName(courseID, hole, desc));
}

function GET2Handler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat1 = getCourseHoleTargetLat(courseID, hole, 2);
	var lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	if (lat1 == 0 && lon1 == 0)
	{
		alert("Please set target 2.");
		return;
	}
	var lat2 = getCourseHoleTargetLat(courseID, hole, 3);
	var lon2 = getCourseHoleTargetLon(courseID, hole, 3);
	if (lat2 == 0 && lon2 == 0)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var i = document.getElementById("geheightselect").selectedIndex;
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var height = 15;
	var angle = 75;
	var range = 70;
	var desc = "Target 2 High";
	if (i == 1)
	{
		height = 10;
		angle = 80;
		range = 50;
		desc = "Target 2 Mid";
	}
	else if (i == 2)
	{
		height = 5;
		angle = 85;
		range = 30;
		desc = "Target 2 Low";
	}
	else if (i == 3)
	{
		height = 0;
		angle = 0;
		range = 300;
		desc = "Target 2 2D"
	}
	GEViewLink(lat1, lon1, height, bearing, angle, range, GEViewName(courseID, hole, desc));
}

function GET3Handler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat1 = getCourseHoleTargetLat(courseID, hole, 3);
	var lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	if (lat1 == 0 && lon1 == 0)
	{
		alert("Please set target 3.");
		return;
	}
	lat2 = getCourseHolePinLat(courseID, hole);
	lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var i = document.getElementById("geheightselect").selectedIndex;
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var height = 15;
	var angle = 75;
	var range = 70;
	var desc = "Target 3 High";
	if (i == 1)
	{
		height = 10;
		angle = 80;
		range = 50;
		desc = "Target 3 Mid";
	}
	else if (i == 2)
	{
		height = 5;
		angle = 85;
		range = 30;
		desc = "Target 3 Low";
	}
	else if (i == 3)
	{
		height = 0;
		angle = 0;
		range = 300;
		desc = "Target 3 2D"
	}
	GEViewLink(lat1, lon1, height, bearing, angle, range, GEViewName(courseID, hole, desc));
}

function GEGreenHandler()
{
	setMode(0);
	var courseID = currentCourseID();
	var hole = currentHole();
	if (hole < 1)
	{
		alert("Please select hole.");
		return;
	}
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0)
	{
		alert("Please set pin position.");
		return;
	}
	var lat1 = getCourseHoleTargetLat(courseID, hole, 3);
	var lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	if (lat1 == 0 && lon1 == 0)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 2);
		lon1 = getCourseHoleTargetLon(courseID, hole, 2);
	}
	if (lat1 == 0 && lon1 == 0)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	if (lat1 == 0 && lon1 == 0)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	if (lat1 == 0 && lon1 == 0)
	{
		alert("Please set tee position.");
		return;
	}
	var i = document.getElementById("geheightselect").selectedIndex;
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var height = 0;
	var angle = 75;
	var range = 70;
	var desc = "Green High";
	if (i == 1)
	{
		height = 0;
		angle = 80;
		range = 50;
		desc = "Green Mid";
	}
	else if (i == 2)
	{
		height = 0;
		angle = 85;
		range = 30;
		desc = "Green Low";
	}
	else if (i == 3)
	{
		height = 0;
		angle = 0;
		range = 200;
		desc = "Green 2D"
	}
	GEViewLink(lat2, lon2, height, bearing, angle, range, GEViewName(courseID, hole, desc));
}

function GEViewName(courseID, hole, view)
{
	var courseName = getCourseNameFromID(courseID);
	if (courseName == null || courseName == "")
		courseName = cleanString(document.getElementById("saveasinput").value);
	if (courseName == null || courseName == "")
		courseName = "NewCourse";
	var h = hole.toString();
	if (h.length < 2) h = "0" + h;
	return courseName + " " + h + " " + view;
}

function GEViewLink(lat, lon, height, bearing, angle, range, name)
{
	window.location.href = "flyto.php?"
				+"lat="+lat.toString()
				+"&lon="+lon.toString()
				+"&h="+height.toString()
				+"&b="+bearing.toString()
				+"&a="+angle.toString()
				+"&r="+range.toString()
				+"&n="+encodeURIComponent(name);
}

function GEHelp()
{
	alert("Use these buttons to quickly navigate to the required location in Google Earth. To get the most accurate available elevation and terrain, make sure you have 3D Buildings and Terrain selected in the Google Earth Layers, and adjust Tools > Options > Navigation > Fly-To Speed so that Google Earth moves at the required speed. These buttons work by generating small KML files with the required view parameters. If you associate KML files with Google Earth, then Google Earth will automatically open the KML file and fly to the required location when you click the button. The KML files also work with Esri ArcGIS Earth, which can be a good option in some regions where the Google Earth imagery/terrain isn't very good.");
}

var weather = []; // Array of forecasts
var weatherIndex = -1; // Which forecast to show
var weatherIndex2 = -1; // Which time offset to show
var weatherRequests = 0;
var weatherWindSpeed = 0;
var weatherWindBearing = 0;

function toggleWeather()
{
	setMode(0);
	if (weatherIndex < 0) showWeather(true);
	else hideWeather();
}

function startWeatherHandler()
{
	weatherIndex2 = 0;
	setWeatherData();
}

function nextWeatherHandler()
{
	weatherIndex2 += 1;
	setWeatherData();
}

function prevWeatherHandler()
{
	weatherIndex2 -= 1;
	setWeatherData();
}

function setWeatherData()
{
	if (weatherIndex < 0) return;
	var w = weather[weatherIndex];
	while (weatherIndex2 < 0) weatherIndex2 += 1;
	while (weatherIndex2 >= w.list.length) weatherIndex2 -= 1;
	var w2 = w.list[weatherIndex2];
	weatherTempC = Math.round(w2.main.temp);
	weatherWindSpeed = Math.round(w2.wind.speed*3600/(getDistanceUnit() == "m" ? 1000.0 : 1609.344));
	weatherWindBearing = w2.wind.deg + 180;
	while (weatherWindBearing < 0) weatherWindBearing += 360;
	while (weatherWindBearing > 360) weatherWindBearing -= 360;
	var div1 = document.getElementById('weatherdiv1');
	var div3 = document.getElementById('weatherdiv3');
	var div4 = document.getElementById('weatherdiv4');
	var div5 = document.getElementById('weatherdiv5');
	var div6 = document.getElementById('weatherdiv6');
	div1.innerHTML = "<img src='https://openweathermap.org/img/w/"+w2.weather[0].icon+".png'/>";
	div3.innerHTML = weatherWindSpeed.toString() + (getDistanceUnit() == "m" ? " KPH" : " MPH");
	div4.innerHTML = weatherTempC.toString()+"&deg;C";;
	div5.innerHTML = w2.localDayTimeStr;
	div6.innerHTML = w.timezoneStr;
}

function hideWeather()
{
	weatherIndex = -1;
	document.getElementById('weatherdiv1').style.display = 'none';
	document.getElementById('weatherdiv2').style.display = 'none';
	document.getElementById('weatherdiv3').style.display = 'none';
	document.getElementById('weatherdiv4').style.display = 'none';
	document.getElementById('weatherdiv5').style.display = 'none';
	document.getElementById('weatherdiv6').style.display = 'none';
	document.getElementById('weatherdiv7').style.display = 'none';
	document.getElementById('weatherdiv8').style.display = 'none';
}

function showWeather(allowGet)
{
	weatherIndex = -1;
	var courseID = currentCourseID();
	var hole = 0;
	do
	{
		hole += 1;
		lat = getCourseHoleTeeLat(courseID, 1);
		lon = getCourseHoleTeeLon(courseID, 1);
	}
	while (lat == 0 && lon == 0 && hole < 18);
	if (lat == 0 && lon == 0)
	{
		alert("Please set 1st tee position.");
		return;
	}
	var minTime = Date.now() - 3600*1000;
	var minLat = moveLat(lat, lon, 5000, 180);
	var minLon = moveLon(lat, lon, 5000, 270);
	var maxLat = moveLat(lat, lon, 5000,   0);
	var maxLon = moveLon(lat, lon, 5000,  90);
	var i = 0;
	var found = false;
	while (!found && i < weather.length)
	{
		if (weather[i].reqTime > minTime && weather[i].reqLat > minLat && weather[i].reqLat < maxLat && weather[i].reqLon > minLon && weather[i].reqLon < maxLon) found = true;
		else ++i;
	}
	if (found)
	{
		weatherIndex = i;
		document.getElementById('weatherdiv1').innerHTML = '';
		document.getElementById('weatherdiv3').innerHTML = '';
		document.getElementById('weatherdiv4').innerHTML = '';
		document.getElementById('weatherdiv5').innerHTML = '';
		document.getElementById('weatherdiv6').innerHTML = '';
		document.getElementById('weatherdiv1').style.display = '';
		document.getElementById('weatherdiv2').style.display = '';
		document.getElementById('weatherdiv3').style.display = '';
		document.getElementById('weatherdiv4').style.display = '';
		document.getElementById('weatherdiv5').style.display = '';
		document.getElementById('weatherdiv6').style.display = '';
		document.getElementById('weatherdiv7').style.display = '';
		document.getElementById('weatherdiv8').style.display = '';
		startWeatherHandler();
		return;
	}
	if (!allowGet)
	{
		alert("Weather not available.");
		return;
	}
	getWeather(lat, lon);
}

function getWeather(lat, lon)
{
	if (weatherRequests >= 10)
	{
		alert('Request limit exceeded.');
		return;
	}
	if (lat < -75 || lat > 75)
	{
		alert('Weather not available for this location.');
		return;
	}
	while (lon < -180.0) lon += 360.0;
	while (lon >  180.0) lon -= 360.0;
	weatherRequests += 1;
	var req = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat.toString() + "&lon=" + lon.toString() + "&appid=58e7b34079d0f22aa5fd07d1cab41d19&units=metric";
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				var w = JSON.parse(xhr.responseText);
				if (w == null || w.cod == null || w.cod != "200" || w.list == null || w.list.length < 10
					|| w.list[0].wind == null || w.list[0].wind.speed == null || w.list[0].wind.deg == null
					|| w.list[0].main == null || w.list[0].main.temp == null)
				{
					alert("Weather not available for this location.");
					hideWeather();
					return;
				}
				w.reqLat = lat;
				w.reqLon = lon;
				w.reqTime = Date.now();
				w.utcOffsetHours = Math.round((12 * lon) / 180);
				w.timezoneStr = (w.utcOffsetHours >= 0 ? "UTC+" + w.utcOffsetHours.toString() : "UTC-" + (-(w.utcOffsetHours)).toString())+"h";
				for (var i = 0; i < w.list.length; ++i)
				{
					var localTime = w.list[i].dt + w.utcOffsetHours * 3600;
					var hour = Math.floor(localTime / 3600) % 24;
					var day = Math.floor(localTime / 86400) % 7;
					var s1 = (hour < 10 ? "0" : "") + hour.toString() + "00";
					var s2 = "";
					if      (day == 0) s2 = "Thu";
					else if (day == 1) s2 = "Fri";
					else if (day == 2) s2 = "Sat";
					else if (day == 3) s2 = "Sun";
					else if (day == 4) s2 = "Mon";
					else if (day == 5) s2 = "Tue";
					else if (day == 6) s2 = "Wed";
					w.list[i].localDayTimeStr = s2 + " " + s1;
				}
				weather.push(w);
				showWeather(false);
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function showSymbolsPanel()
{
	setMode(0);
	var x = document.getElementById('symbolsdiv');
	var y = x.style.display;
	if (y == '') x.style.display = 'none';
	else x.style.display = '';
}

var activeSymbol = '';

function symbolClickHandler(symbol)
{
	if (mode == 9 && symbol == activeSymbol)
	{
		activeSymbol = '';
		setMode(0);
		return;
	}
	if (symbol == 'Z' || symbol == 'ZZ')
	{
		var courseID = currentCourseID();
		var hole = currentHole();
		var n = getCourseHoleSymbols(courseID, hole);
		if (n < 1)
		{
			activeSymbol = '';
			setMode(0);
			return;
		}
		if (symbol == 'ZZ')
		{
			activeSymbol = '';
			setMode(0);
			if (!confirm("Clear all symbols?"))
				return;
			for (var i = n - 1; i >= 0; --i)
				deleteCourseHoleSymbol(courseID, hole, i);
			refreshView();
			return;
		}
	}
	else if (symbol != 'T' && symbol != 'X')
	{
		var courseID = currentCourseID();
		var hole = currentHole();
		var n = getCourseHoleSymbols(courseID, hole);
		var i = 0;
		while (i < n && decodeSymbol(getCourseHoleSymbol(courseID, hole, i)).symbol != symbol)
			i += 1;
		while (i < n - 1)
		{
			setCourseHoleSymbol(courseID, hole, i, getCourseHoleSymbol(courseID, hole, i+1));
			i += 1;
		}
		if (i < n)
		{
			deleteCourseHoleSymbol(courseID, hole, i);
			refreshView();
		}
	}
	activeSymbol = symbol;
	setMode(9);
}


