var viewer;
var handler;
var shot = 0;
var mapMarkers = [];
var mapLines = [];
var mapLines2 = [];
var mapCircles = [];
var mapPolygon;
var clipPolygon;
var clipOuter;
var clipInner;
var initName = "";
var initHole = 1;
var paperWidth = 210;
var paperHeight = 297;
var marginTop = 10;
var marginBottom = 10;
var marginLeft = 10;
var marginRight = 10;
var orientation = 0;
var info = 0;
var rotate = 0;
var prevMapWidth = 0;
var prevMapHeight = 0;
var yellowTop = 0;
var yellowMin = 200;
var yellowMax = 300;
var yellowStep = 50;
var yellowHoles = 3;
var teeGridCount = 0;
var greenGridCount = 0;
var greenCrossCount = 0;
var coneCount = 0;
var mode = 0;
var distLat1 = 0;
var distLon1 = 0;
var distLat2 = 0;
var distLon2 = 0;
	
async function bodyOnLoadHandler()
{
	try
	{
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
			navigationHelpButton : false,
			infoBox : true,
			sceneModePicker : false,
			selectionIndicator : false,
			timeline : false,
			contextOptions : {webgl:{preserveDrawingBuffer:true}}
		});
		viewer.scene.globe.maximumScreenSpaceError = 1.0;
		viewer.scene.globe.showGroundAtmosphere = false;
		viewer.scene.screenSpaceCameraController._zoomFactor = 100/minWheel;
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
		handler.setInputAction(mapLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		handler.setInputAction(mapWheelHandler, Cesium.ScreenSpaceEventType.WHEEL);
		initProfile();
		initCourseData(0);
		initSelectedUnits();
		initCircleOptions();
		initCones();
		initPaper();
		initMargins();
		initIntensity();
		initClipping();
		initInfo();
		initCompass();
		refreshPaper();
		processLinkParameters();
		setSelectedHole(1);
		zoomToCourseHole(0, 1, true, true);
		window.setTimeout(viewerRenderLoop, 5000);
		window.setTimeout(compassRenderLoop, 5000);
		window.setTimeout(satelliteProviderLoop1, 5000);
		startHeartbeat("yardagechart", 60);
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
		viewer.scene.screenSpaceCameraController._zoomFactor = 100/minWheel;
	}
}

function viewerRenderLoop()
{
	viewer.useDefaultRenderLoop = false;
	viewer.resize();
	viewer.render();
	window.setTimeout(viewerRenderLoop, 50);
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

function initSelectedUnits()
{
	document.getElementById('unitselect').selectedIndex = (getDistanceUnit() == "m" ? 1 : 0);
}

function selectUnitHandler()
{
	setDistanceUnit(document.getElementById('unitselect').selectedIndex == 1 ? "m" : "y");
	refreshView();
}

function selectYellowHandler()
{
	var i = document.getElementById('yellowselect').selectedIndex;

	if      (i == 0) { yellowTop = 0; yellowMin = 100; yellowMax = 200; }
	else if (i == 1) { yellowTop = 0; yellowMin = 100; yellowMax = 250; }
	else if (i == 2) { yellowTop = 0; yellowMin = 150; yellowMax = 250; }
	else if (i == 3) { yellowTop = 0; yellowMin = 150; yellowMax = 300; }
	else if (i == 4) { yellowTop = 0; yellowMin = 200; yellowMax = 300; }
	else if (i == 5) { yellowTop = 0; yellowMin = 200; yellowMax = 350; }
	else if (i == 6) { yellowTop = 3; yellowMin = 0; yellowMax = 0; }
	else if (i == 7) { yellowTop = 4; yellowMin = 0; yellowMax = 0; }
	else if (i == 8) { yellowTop = 5; yellowMin = 0; yellowMax = 0; }

	refreshView();
}

function initCircleOptions()
{
	document.getElementById('linebrightnessselect').selectedIndex = 5;
	document.getElementById('circlebrightnessselect').selectedIndex = 5;
	document.getElementById('textbrightnessselect').selectedIndex = 5;
	document.getElementById('yellowselect').selectedIndex = 4; // 200 - 300
}

function initCones()
{
	document.getElementById('conesselect').selectedIndex = 2;
}

function selectIntensityHandler()
{
	refreshView();
}

function selectBrightnessHandler()
{
	refreshView();
}

function selectClippingHandler()
{
	refreshView();
}

function initPaper()
{
	document.getElementById('paperselect').selectedIndex = 0;
	document.getElementById('orientationselect').selectedIndex = 0;
}

function initMargins()
{
	document.getElementById('marginselect1').selectedIndex = 2;
	document.getElementById('marginselect2').selectedIndex = 2;
	document.getElementById('marginselect3').selectedIndex = 2;
	document.getElementById('marginselect4').selectedIndex = 2;
}

function initIntensity()
{
	document.getElementById('intensityselect').selectedIndex = 0;
}

function initClipping()
{
	document.getElementById('clippingselect').selectedIndex = 1;
}

function initInfo()
{
	document.getElementById('infoselect').selectedIndex = 3;
	info = 3;
}

function printHandler()
{
	window.print();
}

function selectPaperHandler()
{
	var i = document.getElementById('paperselect').selectedIndex;

	if (i == 5)
	{
		document.getElementById('custompapertable').style.display = '';
		return;
	}

	document.getElementById('custompapertable').style.display = 'none';

	paperWidth = 210;
	paperHeight = 297;

	if      (i == 0)  { paperWidth  = 210; paperHeight = 297; }
	else if (i == 1)  { paperWidth  = 148; paperHeight = 210; }
	else if (i == 2)  { paperWidth  = 216; paperHeight = 280; }
	else if (i == 3)  { paperWidth  = 127; paperHeight = 203; }
	else if (i == 4)  { paperWidth  = 101; paperHeight = 171; }

	if (i == 4)
	{
		marginTop = 10;
		marginBottom = 10;
		marginLeft = 0;
		marginRight = 0;
		document.getElementById('marginselect1').selectedIndex = 2;
		document.getElementById('marginselect2').selectedIndex = 2;
		document.getElementById('marginselect3').selectedIndex = 0;
		document.getElementById('marginselect4').selectedIndex = 0;
	}
	else
	{
		marginTop = 10;
		marginBottom = 10;
		marginLeft = 10;
		marginRight = 10;
		document.getElementById('marginselect1').selectedIndex = 2;
		document.getElementById('marginselect2').selectedIndex = 2;
		document.getElementById('marginselect3').selectedIndex = 2;
		document.getElementById('marginselect4').selectedIndex = 2;
	}

	refreshPaper();

	if (i == 4)
	{
		var j = document.getElementById('clippingselect').selectedIndex;
		if (j != 0)
		{
			document.getElementById('clippingselect').selectedIndex = 0;
			selectClippingHandler();
		}
	}
}

function selectOrientationHandler()
{
	orientation = document.getElementById('orientationselect').selectedIndex;
	if (orientation == 0)
	{
		document.getElementById('infoselect').selectedIndex = 3;
		info = 3;
		rotate = 0;
	}
	else
	{
		document.getElementById('infoselect').selectedIndex = 1;
		info = 1;
		rotate = 0;
	}
	refreshPaper();
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function selectMarginHandler1() { marginTop    = 5 * document.getElementById('marginselect1').selectedIndex; refreshPaper(); }
function selectMarginHandler2() { marginBottom = 5 * document.getElementById('marginselect2').selectedIndex; refreshPaper(); }
function selectMarginHandler3() { marginLeft   = 5 * document.getElementById('marginselect3').selectedIndex; refreshPaper(); }
function selectMarginHandler4() { marginRight  = 5 * document.getElementById('marginselect4').selectedIndex; refreshPaper(); }

function customPaperHandler()
{
	document.getElementById('custompapertable').style.display = '';

	var s1 = document.getElementById('paperwidth').value;
	var s2 = document.getElementById('paperheight').value;

	if (isNaN(s1))
		document.getElementById('paperwidth').value = '200';
	if (isNaN(s2))
		document.getElementById('paperheight').value = '200';

	paperWidth  = Number(document.getElementById('paperwidth').value);
	paperHeight = Number(document.getElementById('paperheight').value);

	refreshPaper();
}

function selectInfoHandler()
{
	info = document.getElementById('infoselect').selectedIndex;
	refreshPaper();
}

function rotateHandler()
{
	if (rotate == 0) rotate = 1;
	else             rotate = 0;
	refreshPaper();
}

function refreshPaper()
{
	var pw = paperWidth  - marginLeft - marginRight;
	var ph = paperHeight - marginTop  - marginBottom;
	var xx = 0;

	if (orientation == 1)
	{
		xx = pw;
		pw = ph;
		ph = xx;
	}

	var tw = pw;
	var th = ph;
	var tl = 0;
	var tr = 0;

	if (info == 2 || info == 3)
	{
		xx = tw;
		tw = th;
		th = xx;
		tr = -90;
	}

	if (rotate != 0)
		tr += 180;

	var tt = (ph - th) / 2;
	var tl = (pw - tw) / 2;

	var hw = tw;
	var hh = Math.round(0.1*th);
	var fw = hw;
	var fh = hh;
	var cw = tw;
	var ch = th - hh - fh;

	var mw = pw;
	var mh = ph - hh - fh;
	var mt = hh - 1;
	var ml = 0;

	if (info == 2 || info == 3)
	{
		mw = pw - hh - fh;
		mh = ph;
		mt = 0;
		ml = hh;
	}

	var pd = document.getElementById('pagediv');
	var td = document.getElementById('textdiv');
	var hd = document.getElementById('headerdiv');
	var cd = document.getElementById('centerdiv');
	var fd = document.getElementById('footerdiv');
	var md = document.getElementById('mapdiv');

	pd.style.width  = pw.toString() + "mm";
	pd.style.height = ph.toString() + "mm";
	td.style.width  = tw.toString() + "mm";
	td.style.height = th.toString() + "mm";
	td.style.top    = tt.toString() + "mm";
	td.style.left   = tl.toString() + "mm";
	td.style.transform       = "rotate(" + tr.toString() + "deg)";
	td.style.msTransform     = "rotate(" + tr.toString() + "deg)";
	td.style.WebkitTransform = "rotate(" + tr.toString() + "deg)";
	hd.style.width  = hw.toString() + "mm";
	hd.style.height = hh.toString() + "mm";
	cd.style.width  = cw.toString() + "mm";
	cd.style.height = ch.toString() + "mm";
	fd.style.width  = fw.toString() + "mm";
	fd.style.height = fh.toString() + "mm";
	md.style.width  = mw.toString() + "mm";
	md.style.height = mh.toString() + "mm";
	md.style.top    = mt.toString() + "mm";
	md.style.left   = ml.toString() + "mm";

	prevMapWidth = mw;
	prevMapHeight = mh;

	setHeader(currentCourseID(), currentHole());
}

function currentCourseID()
{
	return 0;
}

function currentHole()
{
	return Number(document.getElementById("holeselect").value);
}

function currentShot()
{
	return 0;
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
	shot = 0;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function selectNextHoleHandler()
{
	var hole = currentHole() + 1;
	while (hole <= 18 && getCourseHolePar(currentCourseID(), hole) == 0)
		hole = hole + 1;
	if (hole > 18)
		hole = 0;
	setSelectedHole(hole);
	shot = 0;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function selectPrevHoleHandler()
{
	var hole = currentHole() - 1;
	if (hole < 0)
		hole = 18;
	while (hole >= 1 && getCourseHolePar(currentCourseID(), hole) == 0)
		hole = hole - 1;
	setSelectedHole(hole);
	shot = 0;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function overviewHandler()
{
	shot = 0;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function teeShotHandler()
{
	shot = 1;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

function approachHandler()
{
	shot = 2;
	zoomToCourseHole(currentCourseID(), currentHole(), true, true);
}

var heightMultiplier = 1.0;
var offsetMultiplier = 1.0;
var angleIncrement   = 0.0;

function zoomToCourseHole(courseID, hole, clear, refresh)
{
	if (clear)
		removeAllFeatures();

	var x = document.getElementById('mapdiv');
	var mw = x.clientWidth;
	var mh = x.clientHeight;
	if (orientation == 1)
	{
		mw = x.clientHeight;
		mh = x.clientWidth;
	}
	if (mw < 100) mw = 100;
	if (mh < 100) mh = 100;

	var t = mw/mh - 1;
	var height = (50 - t*10) * heightMultiplier; // 50 .. 40
	var offset = (45 + t*10) * offsetMultiplier; // 45 .. 80
	var angle = (-25 + t*10) + angleIncrement; // -25 .. -15
	if (t > 0)
	{
		height = (50 - t*10) * heightMultiplier; // 50 .. 40
		offset = (45 + t*35) * offsetMultiplier; // 45 .. 80
		angle = (-25 + t*10) + angleIncrement; // -25 .. -15
	}

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
			height = 1.0*d1;
			heading = 0;
			angle = -90;
		}
	}
	else if (hole > 0)
	{
		var par = getCourseHolePar(courseID, hole);
		if (par >= 3)
		{
			var lat1 = getCourseHoleTeeLat(courseID, hole);
			var lon1 = getCourseHoleTeeLon(courseID, hole);
			var lat2 = getCourseHolePinLat(courseID, hole);
			var lon2 = getCourseHolePinLon(courseID, hole);
			heading = geogBearing(lat1, lon1, lat2, lon2);
			if (shot == 1 && par > 3)
			{
				var lat3 = getCourseHoleTargetLat(courseID, hole, 1);
				var lon3 = getCourseHoleTargetLon(courseID, hole, 1);
				var d = geogDist(lat1, lon1, lat3, lon3);
				var heading2 = geogBearing(lat1, lon1, lat3, lon3);
				while (heading2 < heading - 180) heading2 += 360;
				while (heading2 > heading + 180) heading2 -= 360;
				lat2 = moveLat(lat1, lon1, d+25, (heading+heading2)/2);
				lon2 = moveLon(lat1, lon1, d+25, (heading+heading2)/2);
				
			}
			if (shot == 2 && par > 3)
			{
				var lat3 = getCourseHoleTargetLat(courseID, hole, 1);
				var lon3 = getCourseHoleTargetLon(courseID, hole, 1);
				var d = geogDist(lat3, lon3, lat2, lon2);
				var heading2 = geogBearing(lat3, lon3, lat2, lon2);
				while (heading2 < heading - 180) heading2 += 360;
				while (heading2 > heading + 180) heading2 -= 360;
				lat1 = moveLat(lat2, lon2, d+50, 180+(heading+heading2)/2);
				lon1 = moveLon(lat2, lon2, d+50, 180+(heading+heading2)/2);
			}
			heading = geogBearing(lat1, lon1, lat2, lon2);
			d = geogDist(lat1, lon1, lat2, lon2);
			var t = 0.5;
			if (d > 50) t = (d/2 + 5)/d;
			lat = (1-t)*lat1 + t*lat2;
			lon = (1-t)*lon1 + t*lon2;
			height = d + 65;
			angle = -90;
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

	if (mw >= mh) height *= 1.00 * mw/mh;
	else height *= Math.sqrt(Math.sqrt(mw/mh));

	if (lat != 0 || lon != 0)
	{
		var deltaHeading = 0;
		if (orientation == 1) deltaHeading = -90;
		viewer.camera.setView({
			destination : Cesium.Cartesian3.fromDegrees(lon, lat, height),
			orientation : {
				heading : (heading + deltaHeading) * Math.PI / 180,
				pitch : angle * Math.PI / 180,
				roll : 0
			}
		});
	}

	if (refresh)
		refreshView(); 
}

function setHeader(courseID, hole)
{
	var x = 1;
	if (info == 1 || info == 3) x *= -1;
	if (rotate == 1) x *= -1;
	var a = document.getElementById('headertext');
	var b = document.getElementById('footertext');
	if (x < 0)
	{
		a = document.getElementById('footertext');
		b = document.getElementById('headertext');
	}
	if (hole == 0)
	{
		a.innerHTML = initName;
	}
	else
	{
		var par = getCourseHolePar(courseID, hole);
		var len = getCourseHoleLength(courseID, hole);
		a.innerHTML = "Hole " + hole.toString();
		a.innerHTML += " - Par " + par.toString();
		if (par == 3)
		{
			a.innerHTML += " - "
					+ len.toString() + " " + myUnitName();
		}
		else if (par == 4)
		{
			a.innerHTML += " - " 
					+ len.toString() + " " + myUnitName() + " ("
					+ getCourseHoleShotLength(courseID, hole, 1) + " + "
					+ getCourseHoleShotLength(courseID, hole, 2) + ")";
		}
		else if (par == 5)
		{
			a.innerHTML += " - " 
					+ len.toString() + " " + myUnitName() + " ("
					+ getCourseHoleShotLength(courseID, hole, 1) + " + "
					+ getCourseHoleShotLength(courseID, hole, 2) + " + "
					+ getCourseHoleShotLength(courseID, hole, 3) + ")";
		}
		else if (par == 6)
		{
			a.innerHTML += " - " 
					+ len.toString() + " " + myUnitName() + " ("
					+ getCourseHoleShotLength(courseID, hole, 1) + " + "
					+ getCourseHoleShotLength(courseID, hole, 2) + " + "
					+ getCourseHoleShotLength(courseID, hole, 3) + " + "
					+ getCourseHoleShotLength(courseID, hole, 4) + ")";
		}

	}
	b.innerHTML = "ProVisualizer.com";
}

function clearNotes()
{
	var x0 = document.getElementById('notesdiv0'); x0.innerHTML = '';
	var x1 = document.getElementById('notesdiv1'); x1.innerHTML = '';
}

function setNotes(courseID, hole)
{
	var s = getCourseHoleNotes(courseID, hole);
	s = s.replace(/z1z/g, "&");
	s = s.replace(/z2z/g, "'");
	s = s.replace(/z3z/g, '"');
	s = s.replace(/z4z/g, '|');
	var x;
	if (orientation == 0) x = document.getElementById('notesdiv0');
	else                  x = document.getElementById('notesdiv1');
	x.innerHTML = s;
}

function refreshView()
{
	var courseID = currentCourseID();
	var hole = currentHole();
	var teeLat = 0;
	var teeLon = 0;

	setHeader(courseID, hole);
	clearNotes();
	setNotes(courseID, hole);
	setMode(0);
	removeAllFeatures();

	if (hole == 0)
	{
		addCenterLines();
	}
	else
	{
		teeLat = getCourseHoleTeeLat(courseID, hole);
		teeLon = getCourseHoleTeeLon(courseID, hole);

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

		addCenterLine();

		if (teeLat != 0 || teeLon != 0)
		{
			var bearing = -9999;
			if (target1Lat != 0 || target1Lon != 0) bearing = geogBearing(teeLat, teeLon, target1Lat, target1Lon);
			else if (pinLat != 0 || pinLon != 0) bearing = geogBearing(teeLat, teeLon, pinLat, pinLon);
			var addYellowCircles = yellowHoles < 4 || target1Lat != 0 || target1Lon != 0;
			addMarker(teeLat, teeLon, addYellowCircles, false, bearing);
		}

		if (pinLat != 0 || pinLon != 0)
			addMarker(pinLat, pinLon, false, true, 0);

		if (target1Lat != 0 || target1Lon != 0)
			addMarker(target1Lat, target1Lon, false, false, 0);

		if (target2Lat != 0 || target2Lon != 0)
			addMarker(target2Lat, target2Lon, false, false, 0);

		if (target3Lat != 0 || target3Lon != 0)
			addMarker(target3Lat, target3Lon, false, false, 0);
	}
	addClipPolygon();
	addMapPolygon();
	var n = getCourseHoleMeasures(courseID, hole);
	for (var i = 0; i < n; ++i)
	{
		var x = decodeMeasure(getCourseHoleMeasure(courseID, hole, i));
		addDist(teeLat, teeLon, x.lat1, x.lon1, x.lat2, x.lon2);
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
}

function removeAllFeatures()
{
	viewer.entities.removeAll();
	mapMarkers = [];
	mapCircles = [];
	mapLines = [];
	mapLines2 = [];
	teeGridCount = 0;
	greenGridCount = 0;
	greenCrossCount = 0;
	coneCount = 0;
	mapPolygon = null;
	clipPolygon = null;
}

function addMarker(lat, lon, addYellowCircles, addWhiteCircles, bearing)
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

	var x = myUnitsToMetres(1);
	var y = document.getElementById('circlebrightnessselect').selectedIndex / 10.0;
	if (addYellowCircles)
	{
		var c0 = new Cesium.Color(1, 1, 0, (y > 0 ? y*0.75 + 0.25 : 0.0));
		var c1 = new Cesium.Color(1, 1, 0, y*0.75);
		var c2 = new Cesium.Color(1, 1, 0, y*0.3);
		var c3 = new Cesium.Color(1, 1, 0, y*0.15);
		var c4 = new Cesium.Color(1, 1, 0, y*0.12);
		var c5 = new Cesium.Color(1, 1, 0, y*0.10);
		if (yellowTop > 0)
		{
			var tk = 0.2 * document.getElementById('textbrightnessselect').selectedIndex;
			var j = 0;
			var n = 0;
			while (n < yellowTop && j <= 16)
			{
				if (getClubFlag(j))
				{
					n += 1;
					var d = getClubTotal(j);
					addCircle(lat, lon, x*d, (n == 1 ? c1 : (n == 2 ? c2 : (n == 3 ? c3 : (n == 4 ? c4 : c5)))));
					if (bearing > -9999)
					{
						var lat2 = moveLat(lat, lon, x*d - 2 - 2*tk, bearing + 10);
						var lon2 = moveLon(lat, lon, x*d - 2 - 2*tk, bearing + 10);
						addText(Math.round(d).toString(), lat2, lon2, -bearing - 10, 0.75*tk, 0.75*tk, c0);
						var lat3 = moveLat(lat, lon, x*d - 2 - 2*tk, bearing - 10);
						var lon3 = moveLon(lat, lon, x*d - 2 - 2*tk, bearing - 10);
						addText(Math.round(d).toString(), lat3, lon3, -bearing + 10, 0.75*tk, 0.75*tk, c0);
					}
				}
				j += 1;
			}
		}
		else
		{
			if (yellowMin <= 100 && yellowMax >= 100) addCircle(lat, lon, x*100, c1);
			if (yellowMin <= 150 && yellowMax >= 150) addCircle(lat, lon, x*150, c2);
			if (yellowMin <= 200 && yellowMax >= 200) addCircle(lat, lon, x*200, c1);
			if (yellowMin <= 250 && yellowMax >= 250) addCircle(lat, lon, x*250, c2);
			if (yellowMin <= 300 && yellowMax >= 300) addCircle(lat, lon, x*300, c1);
			if (yellowMin <= 350 && yellowMax >= 350) addCircle(lat, lon, x*350, c2);

			if (shot == 1)
			{
				if (yellowMin <= 110 && yellowMax >= 110) addCircle(lat, lon, x*110, c3);
				if (yellowMin <= 120 && yellowMax >= 120) addCircle(lat, lon, x*120, c3);
				if (yellowMin <= 130 && yellowMax >= 130) addCircle(lat, lon, x*130, c3);
				if (yellowMin <= 140 && yellowMax >= 140) addCircle(lat, lon, x*140, c3);
				if (yellowMin <= 160 && yellowMax >= 160) addCircle(lat, lon, x*160, c3);
				if (yellowMin <= 170 && yellowMax >= 170) addCircle(lat, lon, x*170, c3);
				if (yellowMin <= 180 && yellowMax >= 180) addCircle(lat, lon, x*180, c3);
				if (yellowMin <= 190 && yellowMax >= 190) addCircle(lat, lon, x*190, c3);
				if (yellowMin <= 210 && yellowMax >= 210) addCircle(lat, lon, x*210, c3);
				if (yellowMin <= 220 && yellowMax >= 220) addCircle(lat, lon, x*220, c3);
				if (yellowMin <= 230 && yellowMax >= 230) addCircle(lat, lon, x*230, c3);
				if (yellowMin <= 240 && yellowMax >= 240) addCircle(lat, lon, x*240, c3);
				if (yellowMin <= 260 && yellowMax >= 260) addCircle(lat, lon, x*260, c3);
				if (yellowMin <= 270 && yellowMax >= 270) addCircle(lat, lon, x*270, c3);
				if (yellowMin <= 280 && yellowMax >= 280) addCircle(lat, lon, x*280, c3);
				if (yellowMin <= 290 && yellowMax >= 290) addCircle(lat, lon, x*290, c3);
				if (yellowMin <= 310 && yellowMax >= 310) addCircle(lat, lon, x*310, c3);
				if (yellowMin <= 320 && yellowMax >= 320) addCircle(lat, lon, x*320, c3);
				if (yellowMin <= 330 && yellowMax >= 330) addCircle(lat, lon, x*330, c3);
				if (yellowMin <= 340 && yellowMax >= 340) addCircle(lat, lon, x*340, c3);
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

		if (shot != 1)
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

		var courseID = currentCourseID();
		var hole = currentHole();
		var par = getCourseHolePar(courseID, hole);
		if (par >= 5)
		{
			addCircle(lat, lon, x*300, c1);
			addCircle(lat, lon, x*350, c2);
			if (shot != 1)
			{
				addCircle(lat, lon, x*260, c3);
				addCircle(lat, lon, x*270, c3);
				addCircle(lat, lon, x*280, c3);
				addCircle(lat, lon, x*290, c3);
				addCircle(lat, lon, x*310, c3);
				addCircle(lat, lon, x*320, c3);
				addCircle(lat, lon, x*330, c3);
				addCircle(lat, lon, x*340, c3);
			}
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
	var opacity = document.getElementById('linebrightnessselect').selectedIndex / 10.0;
	addCourseHoleCenterLine(courseID, hole, 0, 0, 0, opacity, false);
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
				width: 1,
				material: new Cesium.Color(r, g, b, a)
			}
		}); 

		mapLines.push(line);
	}
}

function addMapPolygon()
{
	if (mapPolygon != null)
	{
		viewer.entities.remove(mapPolygon);
		mapPolygon = null;
	}

	var intensityIndex = document.getElementById('intensityselect').selectedIndex;

	if (intensityIndex < 1)
		return;

	var minLat = getCourseMinLat(0) - 0.1;
	var maxLat = getCourseMaxLat(0) + 0.1;
	var minLon = getCourseMinLon(0) - 0.1;
	var maxLon = getCourseMaxLon(0) + 0.1;

	var opacity = 0.1*intensityIndex;

	mapPolygon = viewer.entities.add({
		polygon: {
			hierarchy : Cesium.Cartesian3.fromDegreesArray([minLon,minLat,
									minLon,maxLat,
									maxLon,maxLat,
									maxLon,minLat]),
			material : new Cesium.Color(1,1,1,opacity)
		}
	});
}

function addClipPolygon()
{
	if (clipPolygon != null)
	{
		viewer.entities.remove(clipPolygon);
		clipPolygon = null;
	}

	var clipIndex = document.getElementById('clippingselect').selectedIndex;

	if (clipIndex < 1)
		return;

	var minLat = getCourseMinLat(0);
	var maxLat = getCourseMaxLat(0);
	var minLon = getCourseMinLon(0);
	var maxLon = getCourseMaxLon(0);

	var minLat1 = minLat - 0.1;
	var maxLat1 = maxLat + 0.1;
	var minLon1 = minLon - 0.1;
	var maxLon1 = maxLon + 0.1;

	var minLat2 = minLat;
	var maxLat2 = maxLat;
	var minLon2 = minLon;
	var maxLon2 = maxLon;

	var buffer = 40 + 10*clipIndex;

	var bufferLat = buffer * (360 / 40000000);
	var bufferLon = buffer * (360 / 40000000) / Math.cos(minLat * Math.PI / 180);

	minLat2 -= bufferLat;
	maxLat2 += bufferLat;
	minLon2 -= bufferLon;
	maxLon2 += bufferLon;

	clipOuter = [	minLon1, minLat1,
			minLon1, maxLat1,
			maxLon1, maxLat1,
			maxLon1, minLat1,
			minLon1, minLat1];

	clipInner = [	minLon2, minLat2,
			maxLon2, minLat2,
			maxLon2, maxLat2,
			minLon2, maxLat2,
			minLon2, minLat2];

	var hole = currentHole();

	if (hole > 0)
	{
		var teeLat = getCourseHoleTeeLat(0, hole);
		var teeLon = getCourseHoleTeeLon(0, hole);
		var pinLat = getCourseHolePinLat(0, hole);
		var pinLon = getCourseHolePinLon(0, hole);
		var cenLat = 0.5*(teeLat + pinLat);
		var cenLon = 0.5*(teeLon + pinLon);

		if ((teeLat != 0 || teeLon != 0) && (pinLat != 0 || pinLon != 0))
		{
			// Set inner circle to be ellipse around tee and pin.
			var bearing = geogBearing(teeLat, teeLon, pinLat, pinLon);
			var deg = 90 - bearing;
			var rad = deg * Math.PI / 180;
			var c = Math.cos(rad);
			var s = Math.sin(rad);
			var d1 = geogDist(teeLat, teeLon, pinLat, pinLon);
			var d2 = d1;
			var i;
			for (i = 1; i <= 3; ++i)
			{
				var lat = getCourseHoleTargetLat(0, hole, i);
				var lon = getCourseHoleTargetLon(0, hole, i);
				if (lat != 0 || lon != 0)
				{
					var d = geogDist(teeLat, teeLon, lat, lon) + geogDist(lat, lon, pinLat, pinLon);
					if (d > d2) d2 = d;
				}
			}
			var a = buffer + d1/2;
			var b = buffer + Math.sqrt(d2*d2 - d1*d1)/2;
			var kx = (360 / 40000000) / Math.cos(cenLat * Math.PI / 180);
			var ky = (360 / 40000000);
			var t = 1 - 0.5 * b / buffer;
			if (t < 0) t = 0;
			t /= a*a;
			clipInner = [];
			for (i = 0; i <= 144; ++i)
			{
				var theta = Math.PI*(i/72);
				var x1 = -a * Math.cos(theta);
				var y1 = b * Math.sin(theta) * (1 + t*x1*x1);
				var x2 = x1*c - y1*s;
				var y2 = x1*s + y1*c;
				var x3 = x2 * kx;
				var y3 = y2 * ky;
				clipInner.push(cenLon+x3);
				clipInner.push(cenLat+y3);
			}
		}
	}

	clipPolygon = viewer.entities.add({
		polygon: {
			hierarchy : {
				positions: Cesium.Cartesian3.fromDegreesArray(clipOuter),
				holes: [{ positions: Cesium.Cartesian3.fromDegreesArray(clipInner) }]
			},
			material : new Cesium.Color(1,1,1,0.9)
		}
	});
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
	var gridBrightness1 = 0.06 * circleBrightness;
	var gridBrightness2 = 0.02 * circleBrightness;
	var gridColor1 = new Cesium.Color(1,1,1,gridBrightness1);
	var gridColor2 = new Cesium.Color(1,1,1,gridBrightness2);
	for (var y = -50; y <= 100; y += 10)
	{
		var coords = [];
		coords.push(lon1 + y*dLonY - 50*dLonX);
		coords.push(lat1 + y*dLatY - 50*dLatX);
		coords.push(lon1 + y*dLonY + 50*dLonX);
		coords.push(lat1 + y*dLatY + 50*dLatX);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: (y % 50 == 0 ? gridColor1 : gridColor2)
			}
		});
		mapLines2.push(line);
	}
	teeGridCount += 1;
}

function greenGridHandler()
{
	if (greenCrossCount > 0)
		refreshView();

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
	if (greenGridCount == 4)
	{
		refreshView();
		return;
	}
	else if (greenGridCount == 2)
	{
		refreshView();
		if (par < 5)
			return;
		greenGridCount = 2;
	}

	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenGridCount >= 2))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenGridCount >= 2))
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
	var circleBrightness = document.getElementById('circlebrightnessselect').selectedIndex;
	var gridBrightness1 = (greenGridCount % 2 == 0 ? 0.02 : 0.01) * circleBrightness;
	var gridBrightness2 = 0.01 * circleBrightness;
	var gridColor1 = new Cesium.Color(1,1,1,gridBrightness1);
	var gridColor2 = new Cesium.Color(1,1,1,gridBrightness2);
	var step = (greenGridCount % 2 == 0 ? 10 : 5);
	for (var y = -30; y <= 30; y += step)
	{
		var coords = [];
		coords.push(lon2 + y*dLonY - 30*dLonX);
		coords.push(lat2 + y*dLatY - 30*dLatX);
		coords.push(lon2 + y*dLonY + 30*dLonX);
		coords.push(lat2 + y*dLatY + 30*dLatX);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: (y % 10 == 0 ? gridColor1 : gridColor2)
			}
		});
		mapLines2.push(line);
	}
	for (var x = -30; x <= 30; x += step)
	{
		var coords = [];
		coords.push(lon2 + x*dLonX - 30*dLonY);
		coords.push(lat2 + x*dLatX - 30*dLatY);
		coords.push(lon2 + x*dLonX + 30*dLonY);
		coords.push(lat2 + x*dLatX + 30*dLatY);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: (x % 10 == 0 ? gridColor1 : gridColor2)
			}
		});
		mapLines2.push(line);
	}
	if (greenGridCount >= 2)
	{
		var coords = [];
		coords.push(lon1);
		coords.push(lat1);
		coords.push(lon2 - 30*dLonY);
		coords.push(lat2 - 30*dLatY);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: (greenGridCount == 2 ? gridColor1 : gridColor2)
			}
		});
		mapLines2.push(line);
	}
	greenGridCount += 1;
}

function greenCrossHandler()
{
	if (greenGridCount > 0)
		refreshView();

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
	if (greenCrossCount == 2)
	{
		refreshView();
		return;
	}
	else if (greenCrossCount == 1)
	{
		refreshView();
		if (par < 5)
			return;
		greenCrossCount = 1;
	}

	var lat1 = 0;
	var lon1 = 0;
	if (par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (par == 4 || (par == 5 && greenCrossCount >= 1))
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else if (par == 5 || (par == 6 && greenCrossCount >= 1))
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
	var circleBrightness = document.getElementById('circlebrightnessselect').selectedIndex;
	var crossBrightness = 0.03 * circleBrightness;
	var crossColor = new Cesium.Color(1,1,1,crossBrightness);
	for (var y = 0; y <= 0; y += 1)
	{
		var coords = [];
		coords.push(lon2 + y*dLonY - 50*dLonX);
		coords.push(lat2 + y*dLatY - 50*dLatX);
		coords.push(lon2 + y*dLonY + 50*dLonX);
		coords.push(lat2 + y*dLatY + 50*dLatX);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: crossColor
			}
		});
		mapLines2.push(line);
	}
	for (var x = 0; x <= 0; x += 1)
	{
		var coords = [];
		coords.push(lon2 + x*dLonX - 0*dLonY);
		coords.push(lat2 + x*dLatX - 0*dLatY);
		coords.push(lon2 + x*dLonX + 50*dLonY);
		coords.push(lat2 + x*dLatX + 50*dLatY);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: crossColor
			}
		});
		mapLines2.push(line);
	}
	if (greenCrossCount > 0)
	{
		var coords = [];
		coords.push(lon1);
		coords.push(lat1);
		coords.push(lon2);
		coords.push(lat2);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: crossColor
			}
		});
		mapLines2.push(line);
	}
	greenCrossCount += 1;
}

function zoomInHandler()
{
	var p = viewer.camera.positionCartographic;
	var k = 0.1;
	if (currentHole() > 0) k = 0.02;
	viewer.camera.moveForward(p.height * k);
}

function zoomOutHandler()
{
	var p = viewer.camera.positionCartographic;
	var k = 0.1;
	if (currentHole() > 0) k = 0.02;
	viewer.camera.moveBackward(p.height * k);
}

function rotateLeftHandler()
{
	var theta = Math.PI/180;
	if (currentHole() < 1) theta *= 2;
	viewer.camera.twistRight(theta);
}

function rotateRightHandler()
{
	var theta = Math.PI/180;
	if (currentHole() < 1) theta *= 2;
	viewer.camera.twistLeft(theta);
}

function conesSelectHandler()
{
	if (coneCount >= 1)
		refreshView();

	conesHandler();
}

function conesHandler()
{
	if (coneCount >= 1)
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
		var circleBrightness = document.getElementById('circlebrightnessselect').selectedIndex;
		var brightness = 0.03 * circleBrightness;
		var color = new Cesium.Color(1,1,0,brightness);
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
			var h2 = 0;
			var h3 = 0;
			var h4 = 0;
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

function conesHandler_old()
{
	if (coneCount >= 1)
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
	var bearing = geogBearing(lat1, lon1, lat2, lon2);
	var circleBrightness = document.getElementById('circlebrightnessselect').selectedIndex;
	var brightness = 0.03 * circleBrightness;
	var color = new Cesium.Color(1,1,0,brightness);
	var conesIndex = document.getElementById('conesselect').selectedIndex;
	var a = 10;
	var b = 5;
	if (conesIndex == 0) { a = 6; b = 3; }
	if (conesIndex == 1) { a = 8; b = 4; }
	for (var i = -a; i <= a; i += b)
	{
		var lat3 = lat1;
		var lon3 = lon1;
		var lat4 = moveLat(lat1, lon1, d+1000, bearing+i);
		var lon4 = moveLon(lat1, lon1, d+1000, bearing+i);
		if (i == 0)
		{
			lat3 = moveLat(lat1, lon1, d, bearing);
			lon3 = moveLon(lat1, lon1, d, bearing);
		}
		var coords = [];
		coords.push(lon3);
		coords.push(lat3);
		coords.push(lon4);
		coords.push(lat4);

		var line = viewer.entities.add({
			polyline : {
				positions: Cesium.Cartesian3.fromDegreesArray(coords),
				width: 1.0,
				material: color
			}
		}); 
		mapLines2.push(line);
	}
	coneCount += 1;
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

var col1 = new Cesium.Color(1,1,1,0.3);
var col2 = new Cesium.Color(1,1,1,0.5);
var colW = new Cesium.Color(1.0,1.0,1.0,1.0);
var colY = new Cesium.Color(1.0,1.0,0.0,1.0);
var colG = new Cesium.Color(0.2,1.0,0.2,1.0);
var colB = new Cesium.Color(0.0,1.0,1.0,1.0);
var colR = new Cesium.Color(1.0,0.2,0.2,1.0);
function addDist(teeLat, teeLon, lat1, lon1, lat2, lon2)
{
	var d = geogDist(lat1, lon1, lat2, lon2);
	var d2 = Math.round(metresToMyUnits(d));
	var text = d2.toString();
	var k = (0.5 + d/1000.0) * 0.2 * document.getElementById('textbrightnessselect').selectedIndex;
	var t = 0.5;
	if (shot == 2 && (teeLat != 0 || teeLon != 0))
	{
		var d3 = geogDist(teeLat, teeLon, lat1, lon1);
		var d4 = geogDist(teeLat, teeLon, lat2, lon2);
		if (d3 < 100 && d4 > d3 + 100) t = 0.8;
	}
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
	var lat = lat1+t*(lat2-lat1);
	var lon = lon1+t*(lon2-lon1);
	var theta = 90 - geogBearing(lat1, lon1, lat2, lon2);
	var kx = k;
	var ky = k;
	addText(text, lat, lon, theta, kx, ky, col2);
}

function addSymbol(lat, lon, symbol, theta)
{
	var k1 = 0.2 * document.getElementById('textbrightnessselect').selectedIndex;
	var k2 = 0.4 * k1;

	if (symbol == 'A') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == 'B') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == 'C') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == 'D') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == 'E') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == 'F') addText(symbol, lat, lon, theta, k1, k1, col2);
	if (symbol == '1') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == '2') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == '3') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == '4') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == '5') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == '6') addText(symbol, lat, lon, theta, k2, k2, col2);
	if (symbol == 'T') addText(symbol, lat, lon, theta, k1, k1, colG);
	if (symbol == 'X') addText(symbol, lat, lon, theta, k1, k1, colR);

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
		setMode(6);
	}
}

function clearDistanceHandler()
{
	refreshView();
}

function setMode(newMode)
{
	mode = newMode;
}

function mapLeftClickHandler(click)
{
	mapClickHandler(click, 1);
}

function mapRightClickHandler(click)
{
	mapClickHandler(click, 2);
}

function mapClickHandler(click, button)
{
	if (mode == 0)
		return;

	var mousePos = new Cesium.Cartesian2(click.position.x, click.position.y);
	var cartesian = viewer.camera.pickEllipsoid(mousePos, viewer.scene.globe.ellipsoid);
	if (!cartesian)
		return;

	var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
	var lat = Cesium.Math.toDegrees(cartographic.latitude);
	var lon = Cesium.Math.toDegrees(cartographic.longitude);

	if (mode == 6)
	{
		if (distLat1 == 0 && distLon1 == 0)
		{
			distLat1 = lat;
			distLon1 = lon;
		}
		else
		{
			distLat2 = lat;
			distLon2 = lon;
			var d = geogDist(distLat1, distLon1, distLat2, distLon2);
			if (d < 5) return;
			addDist(distLat1, distLon1, distLat2, distLon2);
			setMode(0);
		}
		return;
	}
}


