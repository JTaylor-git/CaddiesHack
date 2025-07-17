var mode = 1; // 1 = Map, 2 = GPS, 3 = Settings 
var mapMode = 1; // 1 = 2D, 2 = 3D, 3 = 3D+
var initName = "";
var initHole = 1;
var shot = 0;

var gpsOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
var watchID = null;

var viewer; // Cesium Viewer
var handler; // Cesium Handler
var mapMarkers = [];
var mapCircles = [];
var mapLines = [];
var mapLines2 = [];
var gpsMarker = null;

async function bodyOnLoadHandler()
{
	try
	{
		initProfile();
		initCourseData(0);
		initSelectedUnits();
		initTeeCircles();
		initCompass();
		processLinkParameters();
		setSelectedHole(initHole);
		bodyOnResizeHandler();
		var imageryProvider = await newBingMapsImageryProviderSatelliteAsync();
		var baseLayer = new Cesium.ImageryLayer(imageryProvider);
		viewer = new Cesium.Viewer(
		'mapdiv',
		{ 
			baseLayer : baseLayer,
			terrainProvider : new Cesium.EllipsoidTerrainProvider(),
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
		viewer.scene.globe.maximumScreenSpaceError = 1.0;
		viewer.scene.globe.showGroundAtmosphere = false;
		viewer.scene.screenSpaceCameraController._zoomFactor = 50/minWheel;
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
		handler.setInputAction(mapWheelHandler, Cesium.ScreenSpaceEventType.WHEEL);
		zoomToCourseHole(0, initHole, true, true, 0);
		window.setTimeout(compassRenderLoop, 1000);
		window.setTimeout(satelliteProviderLoop1, 5000);
		if (initName && initName != "") document.title = initName;
		startHeartbeat("mobileplanner", 60);
	}
	catch(err)
	{
		var x = document.getElementById('mapdiv');
		x.innerHTML = "Error:<br/>" + err.message;
	}
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

var compassCanvas = null;
var compassCtx = null;

function initCompass()
{
	compassCanvas = document.getElementById("compasscanvas");
	compassCtx = compassCanvas.getContext("2d");
}

function compassRenderLoop()
{
	var theta = -viewer.camera.heading;
	var c = Math.cos(theta);
	var s = Math.sin(theta);
	var x = []; var y = [];
	// Cross
	x[0] = -6; y[0] = 0;
	x[1] = 6; y[1] = 0;
	x[2] = 0; y[2] = -6;
	x[3] = 0; y[3] = 6;
	// North
	x[4] = -3; y[4] = 8.5;
	x[5] = -3; y[5] = 17;
	x[6] = 3; y[6] = 9;
	x[7] = 3; y[7] = 17.5;
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
		x2[i] = 19.5 + 0.9*(c*x[i] + s*y[i]);
		y2[i] = 19.5 + 0.9*(s*x[i] - c*y[i]);
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
	window.setTimeout(compassRenderLoop, 1000);
}

function bodyOnResizeHandler()
{
	var x = document.getElementById("mapdiv");
        x.style.height = Math.round(0.85 * window.innerHeight - 10).toString() + 'px';
}

var fullScreenMode = 0;
var fullScreenText = "Full screen mode is not supported in this browser. If you are using Safari on iPhone or iPad, click the 'Go To' icon then click 'Add to Home Screen'. You can then view this page in full screen mode by clicking the icon on your home screen.";

function toggleFullScreenHandler()
{
	var elem = document.documentElement;
	if (fullScreenMode == 0)
	{
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			elem.msRequestFullscreen();
		} else {
			alert(fullScreenText);
			return;
		}
		fullScreenMode = 1;
	}
	else
	{
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) { /* Firefox */
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE/Edge */
			document.msExitFullscreen();
		} else {
			alert(fullScreenText);
		}
		fullScreenMode = 0;
	}
}

function zoomInClickHandler()
{
	var p = viewer.camera.positionCartographic;
	var k = 0.2;
	viewer.camera.moveForward(p.height * k);
}

function zoomOutClickHandler()
{
	var p = viewer.camera.positionCartographic;
	var k = 0.25;
	viewer.camera.moveBackward(p.height * k);
}

function initSelectedUnits()
{
	document.getElementById('unitselect').selectedIndex = (getDistanceUnit() == "m" ? 1 : 0);
}

function selectUnitHandler()
{
	setDistanceUnit(document.getElementById('unitselect').selectedIndex == 1 ? "m" : "y");
	refreshView();
}

function initTeeCircles()
{
	document.getElementById('teecircleselect').selectedIndex = getTeeCircles();
}

function selectTeeCirclesHandler()
{
	setTeeCircles(document.getElementById('teecircleselect').selectedIndex.toString());
	refreshView();
}

function toggle3D()
{
	mode = 1;
	if (mapMode == 1)
	{
		mapMode = 2;
		document.getElementById('toggle3Dbutton').innerHTML = '2D';
		viewer.scene.globe.maximumScreenSpaceError = 2.0;
	}
	else
	{
		mapMode = 1;
		document.getElementById('toggle3Dbutton').innerHTML = '3D';
		viewer.scene.globe.maximumScreenSpaceError = 1.0;
	}
	document.getElementById('gpsbutton').innerHTML = 'GPS';
	showMap();
}

function toggleGPS()
{
	if (mode != 1)
	{
		mode = 1;
		document.getElementById('gpsbutton').innerHTML = 'GPS';
		showMap();
	}
	else
	{
		mode = 2;
		document.getElementById('gpsbutton').innerHTML = 'Map';
		showGPS();
	}
}

function toggleSettings()
{
	if (mode != 1)
	{
		mode = 1;
		document.getElementById('gpsbutton').innerHTML = 'GPS';
		showMap();
	}
	else
	{
		mode = 3;
		document.getElementById('gpsbutton').innerHTML = 'Map';
		showSettings();
	}
}

function showMap()
{
	mode = 1;
	var x1 = document.getElementById('maptable');
	var x2 = document.getElementById('gpstable');
	var x3 = document.getElementById('settingstable');
	x1.style.display = '';
	x1.style.width = '100%';
	x1.style.height = '85%';
	x2.style.display = 'none';
	x3.style.display = 'none';
	zoomToCourseHoleShot(currentCourseID(), currentHole(), shot, true, true);
}

function showGPS()
{
	mode = 2;
	document.getElementById('gpsbutton').innerHTML = 'Map';
	var x1 = document.getElementById('maptable');
	var x2 = document.getElementById('gpstable');
	var x3 = document.getElementById('settingstable');
	x1.style.display = 'none';
	x2.style.display = '';
	x2.style.width = '100%';
	x2.style.height = '85%';
	x3.style.display = 'none';
	if (navigator.geolocation)
	{
		if (watchID != null)
			navigator.geolocation.clearWatch(watchID);
		document.getElementById('gpsdiv').innerHTML = "Requesting GPS...";
		watchID = navigator.geolocation.watchPosition(updateGPS, gpsErrorHandler, gpsOptions);
	}
	else
	{
		document.getElementById('gpsdiv').innerHTML = "GPS Not Available";
	}
}

function showSettings()
{
	mode = 3;
	var x1 = document.getElementById('maptable');
	var x2 = document.getElementById('gpstable');
	var x3 = document.getElementById('settingstable');
	x1.style.display = 'none';
	x2.style.display = 'none';
	x3.style.display = '';
	x3.style.width = '100%';
	x3.style.height = '85%';
	refreshSettings();
}

function refreshSettings()
{
	var s = "<table>";
	s += "<tr>";
	s += "<td></td>";
	s += "<td>In The Bag</td>";
	s += "<td>Carry</td>";
	s += "<td>Run</td>";
	s += "<td>Total</td>";
	s += "</tr>";
	var k = elevDistFactor(getRefElevMetres());
	var showUnusedClubs = true;
	for (var i = 0; i <= 16; ++i)
	{
		if (showUnusedClubs || getClubFlag(i))
		{
			var id    = i.toString();
			var flag  = (getClubFlag(i) != 0 ? true : false);
			var name  = getClubName(i);
			var carry = Math.round(k*getClubCarry(i)).toString();
			var run   = Math.round(k*getClubRun(i)).toString();
			var total = Math.round(k*getClubTotal(i)).toString();
			s += '<tr id="clubRow'+i+'">';
			s += "<td align='center'><input onclick='toggleClubFlag("+id+")' type='checkbox'"+(flag ? " checked='true'" : "")+"></td>";
			s += '<td><input type="textbox" style="width: 90px;" id= "clubName'+id+'" value="'+name+'" onchange="setName('+id+')"></td>';
			s += '<td><input type="textbox" style="width: 50px;" id="clubCarry'+id+'" value="'+carry+'" onchange="setCarry('+id+')"></td>';
			s += '<td><input type="textbox" style="width: 40px;" id=  "clubRun'+id+'" value="'+run+'" onchange="setRun('+id+')"></td>';
			s += '<td><input type="textbox" style="width: 50px;" id="clubTotal'+id+'" value="'+total+'" onchange="setTotal('+id+')"></td>';
			s += '</tr>';
		}
	}
	s += "</table>";
	document.getElementById('settingsdiv').innerHTML = s;
}

function toggleClubFlag(club)
{
	setClubFlag(club, !getClubFlag(club));
	refreshSettings();
}

function setName(clubID)
{
	var name = document.getElementById('clubName' + clubID.toString()).value;
	setClubName(clubID, name);
	refreshSettings();
}

function setCarry(clubID)
{
	var x = Number(document.getElementById('clubCarry' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000)
		setClubCarry(clubID, x/k);
	refreshSettings();
}

function setRun(clubID)
{
	var x = Number(document.getElementById('clubRun' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000)
		setClubRun(clubID, x/k);
	refreshSettings();
}

function setTotal(clubID)
{
	var x = Number(document.getElementById('clubTotal' + clubID.toString()).value);
	var y = Number(document.getElementById('clubRun' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000 && y != NaN && y >= 0 && y < 1000 && x >= y)
		setClubCarry(clubID, (x - y)/k);
	refreshSettings();
}

function gpsErrorHandler(err)
{
	if (watchID != null)
		navigator.geolocation.clearWatch(watchID);
	document.getElementById('gpsdiv').innerHTML = "GPS Not Available<br/>Error = " + err.code + "<br/>Message = " + err.message;
}

function showGPSMarker(lat, lon)
{
	removeGPSMarker();
	addGPSMarker(lat, lon);
}

function hideGPSMarker()
{
	navigator.geolocation.clearWatch(watchID);
	watchID = null;
	removeGPSMarker();
}

function updateGPS(pos)
{
	var html = "";

	var courseID = currentCourseID();
	var hole = currentHole();
	var holeLen = getCourseHoleLength(courseID, hole);
	var holePar = getCourseHolePar(courseID, hole);

	if (hole == 0)
	{
		html = "<h1>" + initName + "</h1>";
	}
	else
	{
		//html += "<h1>&nbsp;</h1>";
		html += "<h1>H" + hole.toString() + " - Par " + holePar.toString() + " - " + holeLen.toString() + "</h1>";
		var lat1 = pos.coords.latitude;
		var lon1 = pos.coords.longitude;
		var teeLat = getCourseHoleTeeLat(courseID, hole);
		var teeLon = getCourseHoleTeeLon(courseID, hole);
		//lat1 = teeLat;
		//lon1 = teeLon;
		var pinLat = getCourseHolePinLat(courseID, hole);
		var pinLon = getCourseHolePinLon(courseID, hole);
		var teeDist = Math.round(metresToMyUnits(geogDist(lat1, lon1, teeLat, teeLon)));
		var pinDist = Math.round(metresToMyUnits(geogDist(lat1, lon1, pinLat, pinLon)));

		if (teeDist + pinDist > holeLen + 99999999)
		{
			lat1 = teeLat;
			lon1 = teeLon;
			teeDist = Math.round(metresToMyUnits(geogDist(lat1, lon1, teeLat, teeLon)));
			pinDist = Math.round(metresToMyUnits(geogDist(lat1, lon1, pinLat, pinLon)));
			html += "<small>You are currently off course.<br/>All distances are from tee.</small><p></p>";
		}

		showGPSMarker(lat1, lon1);

		html += "<h1>Pin: " + pinDist.toString() + "</h1>";

		for (var target = 3; target >= 1; --target)
		{
			var lat2 = getCourseHoleTargetLat(courseID, hole, target);
			var lon2 = getCourseHoleTargetLon(courseID, hole, target);
			if (lat2 != 0 || lon2 != 0)
			{
				var x = Math.round(metresToMyUnits(geogDist(lat1, lon1, lat2, lon2)));
				html += "<h1>#" + target.toString() + ": " + x.toString() + "</h1>";
			}
		}

		//html += "<h1>&nbsp;</h1>";
		html += "<small>WARNING: GPS can be inaccurate.<br/>Always verify distance before playing.</small>";
	}

	document.getElementById('gpsdiv').innerHTML = html;
}

function currentCourseID()
{
	return 0;
}

function currentHole()
{
	return Number(document.getElementById("holeselect").value);
}

function setSelectedHole(hole)
{
	if (hole < 0)
		hole = 18;
	if (hole > 18)
		hole = 0;
	document.getElementById("holeselect").selectedIndex = hole;
}

function selectHoleHandler()
{
	var hole = currentHole();
	if (hole > 0 && getCourseHolePar(currentCourseID(), hole) == 0)
		setSelectedHole(0);
	hideGPSMarker();
	shot = 0;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectNextHoleHandler()
{
	var hole = currentHole() + 1;
	while (hole <= 18 && getCourseHolePar(currentCourseID(), hole) == 0)
		hole = hole + 1;
	if (hole > 18)
		hole = 0;
	hideGPSMarker();
	shot = 0;
	setSelectedHole(hole);
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectPrevHoleHandler()
{
	var hole = currentHole() - 1;
	if (hole < 0)
		hole = 18;
	while (hole >= 1 && getCourseHolePar(currentCourseID(), hole) == 0)
		hole = hole - 1;
	hideGPSMarker();
	shot = 0;
	setSelectedHole(hole);
	zoomToCourseHole(currentCourseID(), currentHole(), true, true, 3);
}

function selectNextShotHandler()
{
	if (currentHole() == 0)
	{
		selectNextHoleHandler();
	}
	else
	{
		var par = getCourseHolePar(currentCourseID(), currentHole());
		shot += 1;
		if (shot > par - 1)
			shot = 0;
		zoomToCourseHoleShot(currentCourseID(), currentHole(), shot, shot < 2, shot < 2);
	}
}

function setHoleDescription(courseID, hole)
{
	var desc = "";

	if (hole == 0)
	{
		desc = getCourseLength(courseID).toString();
	}
	else
	{
		var par = getCourseHolePar(courseID, hole);
		var len = getCourseHoleLength(courseID, hole);
		if (par <= 3)
		{
			desc = len.toString();
		}
		else
		{
			for (var i = 1; i <= par - 2; ++i)
			{
				if (i > 1) desc += " + ";
				desc += getCourseHoleShotLength(courseID, hole, i).toString();
			}
			desc += " = " + len.toString();
		}
	}

	document.getElementById("holedesc").innerHTML = desc;
}

var heightMultiplier = 1.0;
var offsetMultiplier = 1.0;
var angleIncrement   = 0.0;

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
	if (angle < -30.0) angle = -30.0;

	var lat = 0;
	var lon = 0;
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
			var d1 = geogDist(lat1, lon1, lat2, lon2);
			var d2 = geogDist(lat, lon, lat + 1, lon);
			if (mapMode == 1)
			{
				height = 1.0*d1;
				heading = 0;
				angle = -90;
			}
			else
			{
				lat -= 3000 * (d1/4000) / d2;
				height = 1000 * (d1/4000);
				angle = -22;
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
				lat = (lat1 + lat2)/2;
				lon = (lon1 + lon2)/2;
				height = d + 70;
				angle = -90;
			}
			else
			{
				lat = getCourseHoleShotLat(courseID, hole, 1, offset, offset + 30);
				lon = getCourseHoleShotLon(courseID, hole, 1, offset, offset + 30);
				heading = getCourseHoleShotBearing(courseID, hole, 1);
			}
		}
		else
		{
			if (lat1 != 0 || lon1 != 0)
			{
				if (lat2 <= lat1) lat2 = lat1 + 0.0001;
				while (lon2 < lon1 - 180) lon2 += 360;
				while (lon2 > lon1 + 180) lon2 -= 360;
				lon = (lon1 + lon2)/2;
				var d = geogDist(lat1, lon, lat2, lon);
				lat = lat1 + (lat1 - lat2) * (80 / d) * offsetMultiplier;
				heading = 0;
			}
		}
	}

	if (mapMode == 1)
	{
		if (mw >= mh) height *= 1.00 * mw/mh;
		else height *= Math.sqrt(Math.sqrt(mw/mh));
	}

	if (lat != 0 || lon != 0)
	{
		fastRender(durationSeconds);
		viewer.camera.flyTo({
			destination : Cesium.Cartesian3.fromDegrees(lon, lat, height),
			orientation : {
				heading : heading * Math.PI / 180,
				pitch : angle * Math.PI / 180,
				roll : 0
			},
			duration : durationSeconds
		});
	}

	if (refresh)
		refreshView(); 
}

function zoomToCourseHoleShot(courseID, hole, shot, clear, refresh)
{
	if (hole == 0 || shot == 0)
	{
		zoomToCourseHole(courseID, hole, clear, refresh, 3);
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
	if (angle < -30.0) angle = -30.0;

	height *= 0.50;
	offset *= 0.65;
	angle *= 0.90;

	var lat = 0;
	var lon = 0;
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
			lat = (lat1 + lat2)/2;
			lon = (lon1 + lon2)/2;
			var d = geogDist(lat1, lon1, lat2, lon2);
			height = d + 70;
			angle = -90;
		}
		else
		{
			lat = getCourseHoleShotLat(courseID, hole, shot, offset, offset + 30);
			lon = getCourseHoleShotLon(courseID, hole, shot, offset, offset + 30);
			heading = getCourseHoleShotBearing(courseID, hole, shot);
		}
	}

	if (mapMode == 1)
	{
		if (mw >= mh) height *= 1.00 * mw/mh;
		else height *= Math.sqrt(Math.sqrt(mw/mh));
	}

	if (lat != 0 || lon != 0)
	{
		var dt = 3;
		if (shot == 1)
			dt = 2;

		fastRender(dt);
		viewer.camera.flyTo({
			destination : Cesium.Cartesian3.fromDegrees(lon, lat, height),
			orientation : {
				heading : heading * Math.PI / 180,
				pitch : angle * Math.PI / 180,
				roll : 0
			},
			duration : dt 
		});
	}

	if (refresh)
		refreshView();
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

function addMarker(lat, lon, addYellowCircles, addWhiteCircles, addTargetCircles, bearing)
{
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat),
		ellipse : {
			semiMajorAxis: 0.1,
			semiMinorAxis: 0.1,
			extrudedHeight: 1.8,
			outline: true,
			fill: true,
			outlineColor: "#FFFFFF"
		}
	}); 
	mapMarkers.push(marker);

	if (mapMode == 1)
	{
		var x = myUnitsToMetres(1);
		var y = 5 / 15.0;
		if (addYellowCircles)
		{
			var c0 = new Cesium.Color(1, 1, 0, y*2.00);
			var c1 = new Cesium.Color(1, 1, 0, y*0.75);
			var c2 = new Cesium.Color(1, 1, 0, y*0.3);
			var c3 = new Cesium.Color(1, 1, 0, y*0.2);
			var c4 = new Cesium.Color(1, 1, 0, y*0.15);
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
				var k = elevDistFactor(getRefElevMetres());
				while (n < m && j <= 16)
				{
					if (getClubFlag(j))
					{
						n += 1;
						var d = Math.round(k*getClubTotal(j));
						addCircle(lat, lon, x*d, (n == 1 ? c1 : (n == 2 ? c2 : (n == 3 ? c3 : c4))));
						if (bearing > -9999)
						{
							var lat2 = moveLat(lat, lon, x*d - 3, bearing + 10);
							var lon2 = moveLon(lat, lon, x*d - 3, bearing + 10);
							addText(Math.round(d).toString(), lat2, lon2, -bearing - 10, 0.5, 0.5, c0);
							var lat3 = moveLat(lat, lon, x*d - 3, bearing - 10);
							var lon3 = moveLon(lat, lon, x*d - 3, bearing - 10);
							addText(Math.round(d).toString(), lat3, lon3, -bearing + 10, 0.5, 0.5, c0);
						}
					}
					j += 1;
				}
			}
		}
		if (addWhiteCircles)
		{
			var c1 = new Cesium.Color(1, 1, 1, y*0.5);
			var c2 = new Cesium.Color(1, 1, 1, y*0.2);
			var c3 = new Cesium.Color(1, 1, 1, y*0.1);
			addCircle(lat, lon, x*10, c1);
			addCircle(lat, lon, x*50, c2);
			addCircle(lat, lon, x*100, c1);
			addCircle(lat, lon, x*150, c2);
			addCircle(lat, lon, x*200, c1);
			addCircle(lat, lon, x*250, c2);

			if (shot > 0)
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
			var c1 = new Cesium.Color(1, 1, 1, y*0.25);
			addCircle(lat, lon, x*10, c1);
		}
	}
}

function addCircle(lat, lon, radius, color)
{
	var circle = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat),
		ellipse : {
			semiMajorAxis: radius,
			semiMinorAxis: radius,
			extrudedHeight: 0.1,
			outline: true,
			fill: false,
			outlineColor: color
		}
	}); 
	mapCircles.push(circle);
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
	addCourseHoleCenterLine(courseID, hole, 0, 0, 0, 1, false);
}

function addCourseHoleCenterLine(courseID, hole, r, g, b, a, isOverview)
{
	if (hole < 1)
		return;

	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
		return;

	var coords = [];
	var i = 0;

	coords[i++] = getCourseHoleTeeLon(courseID, hole);
	coords[i++] = getCourseHoleTeeLat(courseID, hole);

	if (par >= 4)
	{
		coords[i++] = getCourseHoleTargetLon(courseID, hole, 1);
		coords[i++] = getCourseHoleTargetLat(courseID, hole, 1);
	}
	if (par >= 5)
	{
		coords[i++] = getCourseHoleTargetLon(courseID, hole, 2);
		coords[i++] = getCourseHoleTargetLat(courseID, hole, 2);
	}
	if (par >= 6)
	{
		coords[i++] = getCourseHoleTargetLon(courseID, hole, 3);
		coords[i++] = getCourseHoleTargetLat(courseID, hole, 3);
	}

	coords[i++] = getCourseHolePinLon(courseID, hole);
	coords[i++] = getCourseHolePinLat(courseID, hole);

	if (isOverview)
	{
		viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees((coords[0]+coords[2])/2, (coords[1]+coords[3])/2),
			billboard : { image: '/images/' + hole.toString() + 'y.png', eyeOffset: new Cesium.Cartesian3(0,0,-50) }
		});

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 7,
				followSurface: true,
				material: new Cesium.PolylineArrowMaterialProperty(new Cesium.Color(r, g, b, a))
			}
		}); 

		mapLines.push(line);
	}
	else
	{
		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: new Cesium.Color(r, g, b, a)
			}
		}); 

		mapLines.push(line);
	}
}

function addGPSMarker(lat, lon)
{
	var marker = viewer.entities.add({
		position : Cesium.Cartesian3.fromDegrees(lon, lat),
		ellipse : {
			semiMajorAxis: 0.1,
			semiMinorAxis: 0.1,
			extrudedHeight: 1.8,
			outline: true,
			fill: true,
			outlineColor: "#00FFFF"
		}
	}); 
	gpsMarker = marker;
}

function removeGPSMarker()
{
	viewer.entities.remove(gpsMarker);
	gpsMarker = null;
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
	coords1.push(lon1);
	coords1.push(lat1);
	coords1.push(lon1 + ((t*d - (3*text.length+1)*k)/d)*(lon2-lon1));
	coords1.push(lat1 + ((t*d - (3*text.length+1)*k)/d)*(lat2-lat1));
	var line1 = viewer.entities.add({
		polyline : {
		positions: Cesium.Cartesian3.fromDegreesArray(coords1),
		width: 1.0,
		material: col1
		}
		});
	mapLines2.push(line1);
	var coords2 = [];
	coords2.push(lon1 + ((t*d + (3*text.length+1)*k)/d)*(lon2-lon1));
	coords2.push(lat1 + ((t*d + (3*text.length+1)*k)/d)*(lat2-lat1));
	coords2.push(lon2);
	coords2.push(lat2);
	var line2 = viewer.entities.add({
		polyline : {
		positions: Cesium.Cartesian3.fromDegreesArray(coords2),
		width: 1.0,
		material: col1
		}
		});
	mapLines2.push(line2);
	var lat = lat1 + t*(lat2-lat1);
	var lon = lon1 + t*(lon2-lon1);
	var theta = 90 - geogBearing(lat1, lon1, lat2, lon2);
	var kx = k;
	var ky = k;
	if (mapMode == 2 && d2 >= 100)
	{
		theta -= 90;
		kx *= 0.5;
		ky *= 2.0;
	}
	addText(text, lat, lon, theta, kx, ky, col2);
}

function addSymbol(lat, lon, symbol, theta)
{
	if (symbol == 'A') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == 'B') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == 'C') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == 'D') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == 'E') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == 'F') addText(symbol, lat, lon, theta, 1, 1, col2);
	if (symbol == '1') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == '2') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == '3') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == '4') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == '5') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == '6') addText(symbol, lat, lon, theta, 0.4, 0.4, col2);
	if (symbol == 'T') addText(symbol, lat, lon, theta, 1, 1, colG);
	if (symbol == 'X') addText(symbol, lat, lon, theta, 1, 1, colR);

	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.10, 0.10, colW);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.08, 0.08, colW);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.06, 0.06, colW);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.04, 0.04, colW);
	if (symbol == 'L') addText(symbol, lat, lon, theta, 0.02, 0.02, colW);

	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.10, 0.10, colY);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.08, 0.08, colY);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.06, 0.06, colY);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.04, 0.04, colY);
	if (symbol == 'M') addText(symbol, lat, lon, theta, 0.02, 0.02, colY);

	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.10, 0.10, colG);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.08, 0.08, colG);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.06, 0.06, colG);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.04, 0.04, colG);
	if (symbol == 'N') addText(symbol, lat, lon, theta, 0.02, 0.02, colG);

	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.10, 0.10, colB);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.08, 0.08, colB);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.06, 0.06, colB);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.04, 0.04, colB);
	if (symbol == 'O') addText(symbol, lat, lon, theta, 0.02, 0.02, colB);

}

function addText(text, lat, lon, theta, kx, ky, col)
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
				var x = xyCoords1[j] - 3*text.length + 6*i + 1;
				var y = xyCoords1[j+1] - 3;
				var lat2 = lat + x*dLatX + y*dLatY;
				var lon2 = lon + x*dLonX + y*dLonY;
				coords.push(lon2);
				coords.push(lat2);
			}
			var line = viewer.entities.add({
				polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: col
				}
				}); 
			mapLines2.push(line);
		}
		if (xyCoords2.length > 0)
		{
			var coords = [];
			for (var j = 0; j < xyCoords2.length; j += 2)
			{
				var x = xyCoords2[j] - 3*text.length + 6*i + 1;
				var y = xyCoords2[j+1] - 3;
				var lat2 = lat + x*dLatX + y*dLatY;
				var lon2 = lon + x*dLonX + y*dLonY;
				coords.push(lon2);
				coords.push(lat2);
			}
			var line = viewer.entities.add({
				polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: col
				}
				}); 
			mapLines2.push(line);
		}
	}
}

function removeAllFeatures()
{
	viewer.entities.removeAll();
	mapMarkers = [];
	mapCircles = [];
	mapLines = [];
	mapLines2 = [];
	gpsMarker = null;
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

function refreshView()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var par = getCourseHolePar(courseID, hole);

	setHoleDescription(courseID, hole);
	clearNotes();
	setNotes(courseID, hole);

	if (mode == 2) // GPS
	{
		if (navigator.geolocation)
		{
			if (watchID != null)
				navigator.geolocation.clearWatch(watchID);
			document.getElementById('gpsdiv').innerHTML = "Requesting GPS...";
			watchID = navigator.geolocation.watchPosition(updateGPS, gpsErrorHandler, gpsOptions);
		}
		else
		{
			document.getElementById('gpsdiv').innerHTML = "GPS Not Available";
		}
		return;
	}
	else if (mode == 3) // Settings
	{
		refreshSettings();
		return;
	}

	removeAllFeatures();

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

		var totalDist = 0.0;
		var shot1Desc = "";
		var shot2Desc = "";
		var shot3Desc = "";
		var shot4Desc = "";
		var pinDesc = "";
		for (var i = 1; i <= 4; ++i)
		{
			var shotDist = 0;
			if (i == 1)
			{
				if (teeLat != 0 || teeLon != 0)
				{
					if (target1Lat != 0 || target1Lon != 0)
						shotDist = geogDist(teeLat, teeLon, target1Lat, target1Lon);
					else if (pinLat != 0 || pinLon != 0)
						shotDist = geogDist(teeLat, teeLon, pinLat, pinLon);
					if (shotDist > 0)
					{
						var bestClub = getBestClubForDist(shotDist);
						shot1Desc = formatDist(shotDist);
						shot1Desc += " = " + getClubName(bestClub);
						shot1Desc += " (" + getClubDistPercentage(bestClub, shotDist).toString() + "%)";
						pinDesc = shot1Desc;
					}
				}
			}
			else if (i == 2)
			{
				if (target1Lat != 0 || target1Lon != 0)
				{
					if (target2Lat != 0 || target2Lon != 0)
						shotDist = geogDist(target1Lat, target1Lon, target2Lat, target2Lon);
					else if (pinLat != 0 || pinLon != 0)
						shotDist = geogDist(target1Lat, target1Lon, pinLat, pinLon);
					if (shotDist > 0)
					{
						var bestClub = getBestClubForDist(shotDist);
						shot2Desc = formatDist(shotDist);
						shot2Desc += " = " + getClubName(bestClub);
						shot2Desc += " (" + getClubDistPercentage(bestClub, shotDist).toString() + "%)";
						pinDesc = shot2Desc;
					}
				}
			}
			else if (i == 3)
			{
				if (target2Lat != 0 || target2Lon != 0)
				{
					if (target3Lat != 0 || target3Lon != 0)
						shotDist = geogDist(target2Lat, target2Lon, target3Lat, target3Lon);
					else if (pinLat != 0 || pinLon != 0)
						shotDist = geogDist(target2Lat, target2Lon, pinLat, pinLon);
					if (shotDist > 0)
					{
						var bestClub = getBestClubForDist(shotDist);
						shot3Desc = formatDist(shotDist);
						shot3Desc += " = " + getClubName(bestClub);
						shot3Desc += " (" + getClubDistPercentage(bestClub, shotDist).toString() + "%)";
						pinDesc = shot3Desc;
					}
			
				}
			}
			else if (i == 4)
			{
				if (target3Lat != 0 || target3Lon != 0)
				{
					if (pinLat != 0 || pinLon != 0)
						shotDist = geogDist(target3Lat, target3Lon, pinLat, pinLon);
					if (shotDist > 0)
					{
						var bestClub = getBestClubForDist(shotDist);
						shot4Desc = formatDist(shotDist);
						shot4Desc += " = " + getClubName(bestClub);
						shot4Desc += " (" + getClubDistPercentage(bestClub, shotDist).toString() + "%)";
						pinDesc = shot4Desc;
					}
			
				}
			}
			totalDist += shotDist;
		}

		if (mapMode == 1)
			addCenterLine();

		if (teeLat != 0 || teeLon != 0)
		{
			var bearing = -9999;
			if (target1Lat != 0 || target1Lon != 0) bearing = geogBearing(teeLat, teeLon, target1Lat, target1Lon);
			else if (pinLat != 0 || pinLon != 0) bearing = geogBearing(teeLat, teeLon, pinLat, pinLon);
			addMarker(teeLat, teeLon, true, false, false, bearing);
		}

		if (pinLat != 0 || pinLon != 0)
			addMarker(pinLat, pinLon, false, true, false, 0);

		if (target1Lat != 0 || target1Lon != 0)
			addMarker(target1Lat, target1Lon, false, false, shot >= 1, 0);

		if (target2Lat != 0 || target2Lon != 0)
			addMarker(target2Lat, target2Lon, false, false, shot >= 1, 0);

		if (target3Lat != 0 || target3Lon != 0)
			addMarker(target3Lat, target3Lon, false, false, shot >= 1, 0);
	}
	if (mapMode > 0)
	{
		var n = getCourseHoleMeasures(courseID, hole);
		var i;
		for (i = 0; i < n; ++i)
		{
			var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
			addDist(x.lat1, x.lon1, x.lat2, x.lon2);
		}
		n = getCourseHoleSymbols(courseID, hole);
		if (n > 0)
		{
			var theta = 0 - getCourseHoleBearing(courseID, hole);
			for (i = 0; i < n; ++i)
			{
				var x = decodeSymbol(getCourseHoleSymbol(courseID, hole, i));
				addSymbol(x.lat, x.lon, x.symbol, theta);
			}
		}
	}
}


