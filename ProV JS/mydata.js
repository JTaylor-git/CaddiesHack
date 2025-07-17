var teeBuffer = 5;
var pinBuffer = 20;
var targetBuffer = 50;
var tempHoleTeeLat = new Array();
var tempHoleTeeLon = new Array();
var tempHolePinLat = new Array();
var tempHolePinLon = new Array();
var tempHoleTargetLat = new Array();
var tempHoleTargetLon = new Array();
var tempHoleMeasure = new Array();
var tempHoleSymbol = new Array();
var tempHoleNotes = new Array();

var localStorageCache = new Map();

function deleteMyData()
{
	if (confirm('Permanently delete all data from this site?'))
	{
		localStorage.clear();
		localStorageCache.clear();
		alert('Your data has been permanently deleted.');
	}
	else
	{
		alert('Your data has NOT been deleted.');
	}
}

function initProfile()
{
	if (localStorage.gotProfile != "1")
	{
		setDefaultProfile();
		localStorage.gotProfile = "1";
	}
	if (localStorage.gotProfile2 != "1")
	{
		setDefaultProfile2();
		localStorage.gotProfile2 = "1";
	}
}

function setDefaultProfile()
{
	setDefaultFlags();
	setDefaultCarry();
	setDefaultRun();
}

function setDefaultProfile2()
{
	setDefaultSpread();
	setDefaultShape();
}

function setDefaultFlags()
{
	for (var i = 0; i < 18; ++i)
		setClubFlag(i, getClubFlagDefault(i));
}

function setDefaultCarry()
{
	for (var i = 0; i < 18; ++i)
		setClubCarry(i, getClubCarryDefault(i));
}

function setDefaultRun()
{
	for (var i = 0; i < 18; ++i)
		setClubRun(i, getClubRunDefault(i));
}

function setDefaultSpread()
{
	for (var i = 0; i < 18; ++i)
	{
		setClubSpreadL(i, getClubSpreadLDefault(i));
		setClubSpreadR(i, getClubSpreadRDefault(i));
		setClubSpreadO(i, getClubSpreadODefault(i));
		setClubSpreadS(i, getClubSpreadSDefault(i));
	}
}

function setDefaultShape()
{
	for (var i = 0; i < 18; ++i)
		setClubShape(i, 0);
}

function cleanString(s)
{
	return s.replace("'", " ").replace('"', ' ').trim();
}

function getData(key)
{
	if (localStorageCache.has(key.toString()))
		return localStorageCache.get(key.toString());

	return localStorage.getItem(key.toString());
}

function setData(key, val)
{
	localStorage.setItem(key.toString(), cleanString(val));
	localStorageCache.set(key.toString(), cleanString(val));
}

function deleteData(key)
{
	localStorage.removeItem(key.toString());
	localStorageCache.delete(key.toString());
}

function getArrayData(key, i)
{
	return getData(key + '_' + i.toString());
}

function setArrayData(key, i, val)
{
	setData(key + '_' + i.toString(), val);
}

function deleteArrayData(key, i)
{
	deleteData(key + '_' + i.toString());
}

function getArrayData2(key, i, j)
{
	return getArrayData(key + '_' + i.toString(), j);
}

function setArrayData2(key, i, j, val)
{
	setArrayData(key + '_' + i.toString(), j, val);
}

function deleteArrayData2(key, i, j)
{
	deleteArrayData(key + '_' + i.toString(), j);
}

function getArrayData3(key, i, j, k)
{
	return getArrayData2(key + '_' + i.toString(), j, k);
}

function setArrayData3(key, i, j, k, val)
{
	setArrayData2(key + '_' + i.toString(), j, k, val);
}

function deleteArrayData3(key, i, j, k)
{
	deleteArrayData2(key + '_' + i.toString(), j, k);
}

function getDispersionProfileID()
{
	var x = getData('dispersionProfileID');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	else if (x == '4') return 4;
	else if (x == '5') return 5;
	else if (x == '6') return 6;
	else if (x == '7') return 7;
	else if (x == '8') return 8;
	else if (x == '9') return 9;
	else if (x == '10') return 10;
	else if (x == '11') return 11;
	return 0;
}

function setDispersionProfileID(x)
{
	setData('dispersionProfileID', x);
}

function getNRL()
{
	var x = getData('nrl');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	return 0;
}

function setNRL(x)
{
	setData('nrl', x);
}

function getTeeCircles()
{
	var x = getData('teeCircles');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	else if (x == '4') return 4;
	else if (x == '5') return 5;
	else if (x == '6') return 6;
	else if (x == '7') return 7;
	else if (x == '8') return 8;
	else if (x == '9') return 9;
	else if (x == '10') return 10;
	else if (x == '11') return 11;
	else if (x == '12') return 12;
	else if (x == '13') return 13;
	return 0;
}

function setTeeCircles(x)
{
	setData('teeCircles', x);
}

function getLineColor()
{
	var x = getData('lineColor');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	else if (x == '4') return 4;
	return 0;
}

function getLineColorHex()
{
	var x = getLineColor();
	if      (x == 0) return '#000000';
	else if (x == 1) return '#FFFFFF';
	else if (x == 2) return '#FFFF00';
	else if (x == 3) return '#88FF88';
	else if (x == 4) return '#88FFFF';
	return '#000000';
}

function setLineColor(x)
{
	setData('lineColor', x);
}

function getCircleColor()
{
	var x = getData('circleColor');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	return 0;
}

function getCircleColorHex()
{
	var x = getCircleColor();
	if      (x == 0) return '#FFFF88';
	else if (x == 1) return '#88FF88';
	else if (x == 2) return '#88FFFF';
	else if (x == 3) return '#FFFFFF';
	return '#FFFF88';
}

function setCircleColor(x)
{
	setData('circleColor', x);
}

function getLineBrightness()
{
	var x = getData('lineBrightness');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	else if (x == '4') return 4;
	else if (x == '5') return 5;
	else if (x == '6') return 6;
	else if (x == '7') return 7;
	else if (x == '8') return 8;
	else if (x == '9') return 9;
	else if (x == '10') return 10;
	return 7;
}

function setLineBrightness(x)
{
	setData('lineBrightness', x);
}

function getCircleBrightness()
{
	var x = getData('circleBrightness');
	if      (x == '0') return 0;
	else if (x == '1') return 1;
	else if (x == '2') return 2;
	else if (x == '3') return 3;
	else if (x == '4') return 4;
	else if (x == '5') return 5;
	else if (x == '6') return 6;
	else if (x == '7') return 7;
	else if (x == '8') return 8;
	else if (x == '9') return 9;
	else if (x == '10') return 10;
	return 5;
}

function setCircleBrightness(x)
{
	setData('circleBrightness', x);
}

function getAutoRotate()
{
	var x = getData('autoRotate');
	if      (x == '0') return 0; // yes
	else if (x == '1') return 1; // no
	return 0; // yes
}

function setAutoRotate(x)
{
	setData('autoRotate', x);
}

function get3DHeightMultiplier()
{
	var x = getData('d3HeightMultiplier');
	if (x == null || isNaN(x)) x = 1;
	return Number(x);
}

function set3DHeightMultiplier(x)
{
	setData('d3HeightMultiplier', x.toString());
}

function get3DOffsetMultiplier()
{
	var x = getData('d3OffsetMultiplier');
	if (x == null || isNaN(x)) x = 1;
	return Number(x);
}

function set3DOffsetMultiplier(x)
{
	setData('d3OffsetMultiplier', x.toString());
}

function get3DAngleIncrement()
{
	var x = getData('d3AngleIncrement');
	if (x == null || isNaN(x)) x = 0;
	return Number(x);
}

function set3DAngleIncrement(x)
{
	setData('d3AngleIncrement', x.toString());
}

function metresToYards(x) { return x * (1760 / 1609.344); }

function metresToFeet(x) { return x * (1760 / 1609.344) * 3; }

function yardsToMetres(x) { return x * (1609.344 / 1760); }

function feetToMetres(x) { return x * (1609.344 / 1760) / 3; }

function metresToMyUnits(x) { if (getDistanceUnit() == "m") return x; return metresToYards(x); }

function yardsToMyUnits(x) { if (getDistanceUnit() == "m") return yardsToMetres(x); return x; }

function myUnitsToMetres(x) { if (getDistanceUnit() == "m") return x; return yardsToMetres(x); }

function myUnitsToYards(x) { if (getDistanceUnit() == "m") return metresToYards(x); return x; }

function metresToMyElevUnits(x) { if (getElevationUnit() == "m") return x; return metresToFeet(x); }

function myElevUnitsToMetres(x) { if (getElevationUnit() == "m") return x; return feetToMetres(x); }

function setDistanceUnit(unit) { setData('distanceUnit', unit); }

function getDistanceUnit() { if (getData('distanceUnit') != "m") return "y"; return "m"; }

function setElevationUnit(unit) { setData('elevationUnit', unit); }

function getElevationUnit() { if (getData('elevationUnit') != "m") return "f"; return "m"; }

function myUnitName() { if (getDistanceUnit() != "m") return 'yards'; return 'metres'; }

function myUnitName2() { if (getDistanceUnit() != "m") return 'Yards'; return 'Metres'; }

function myElevUnitName() { if (getElevationUnit() != "m") return 'feet'; return 'metres'; }

function myElevUnitName2() { if (getElevationUnit() != "m") return 'Feet'; return 'Metres'; }

function formatDist(dist) { return Math.round(metresToMyUnits(dist)).toString() + " " + myUnitName(); }

function formatElev(elev) { return Math.round(metresToMyElevUnits(elev)).toString() + " " + myElevUnitName(); }

function setClubName(clubID, name)
{
	setArrayData('clubName'+APK(), clubID, name);
}

function getClubName(clubID)
{
	var name = getArrayData("clubName"+APK(), clubID);
	if (name != null && name != "")
		return name;
	
	switch (clubID)
	{
	case 0: name = "Driver"; break;
	case 1: name = "3-wood"; break;
	case 2: name = "5-wood"; break;
	case 3: name = "Rescue"; break;
	case 4: name = "1-iron"; break;
	case 5: name = "2-iron"; break;
	case 6: name = "3-iron"; break;
	case 7: name = "4-iron"; break;
	case 8: name = "5-iron"; break;
	case 9: name = "6-iron"; break;
	case 10: name = "7-iron"; break;
	case 11: name = "8-iron"; break;
	case 12: name = "9-iron"; break;
	case 13: name = "PW"; break;
	case 14: name = "AW"; break;
	case 15: name = "SW"; break;
	case 16: name = "LW"; break;
	case 17: name = "Putter"; break;
	}
	return name;
}

function getClubShortName(clubID)
{
	var name = getArrayData("clubName"+APK(), clubID);
	if (name != null && name != "")
	{
		if (clubID == 0) name = name.substr(0,6);
		else name = name.substr(0,3).replace("-","").toLowerCase();
		return name;
	}
	
	var name = "";
	switch (clubID)
	{
	case 0: name = "Driver"; break;
	case 1: name = "3w"; break;
	case 2: name = "5w"; break;
	case 3: name = "res"; break;
	case 4: name = "1i"; break;
	case 5: name = "2i"; break;
	case 6: name = "3i"; break;
	case 7: name = "4i"; break;
	case 8: name = "5i"; break;
	case 9: name = "6i"; break;
	case 10: name = "7i"; break;
	case 11: name = "8i"; break;
	case 12: name = "9i"; break;
	case 13: name = "pw"; break;
	case 14: name = "aw"; break;
	case 15: name = "sw"; break;
	case 16: name = "lw"; break;
	case 17: name = "putter"; break;
	}
	return name;
}

function getNumProfiles()
{
	var n = getData("numProfiles");
	if (n === null) return 1;
	return Number(n);
}

function setNumProfiles(n)
{
	setData("numProfiles", n.toString());
}

function getProfileID(i)
{
	var id = getArrayData("profileID", i);
	if (id === null) return 0;
	return Number(id);
}

function getProfileIDFromName(name)
{
	var n = getNumProfiles();
	var i = 0;
	var id = -1;
	while (id < 0 && i < n)
	{
		var id2 = getProfileID(i);
		var name2 = getProfileName(id2);
		if (name2 == name) id = id2;
		else i += 1;
	}
	return id;
}

function setProfileID(i, id)
{
	setArrayData("profileID", i, id.toString());
}

function getProfileName(id)
{
	var name = getArrayData('profileName', id);
	if (name === null || name == '') return "Profile 1";
	return name;
}

function setProfileName(id, name)
{
	setArrayData('profileName', id, name);
}

function getFirstFreeProfileID()
{
	var n = getNumProfiles();
	var id = -1;
	var idIsFree = false;
	while (!idIsFree)
	{
		id += 1;
		idIsFree = true;
		var i = -1;
		while (idIsFree && i < n)
		{
			i += 1;
			if (getProfileID(i) == id) idIsFree = false;
		}
	}
	return id;
}

function getActiveProfileID()
{
	var id = getData("activeProfileID");
	if (id === null) return 0;
	return Number(id);
}

function setActiveProfileID(id)
{
	setData("activeProfileID", id.toString()); 
}

function APK()
{
	var id = getActiveProfileID();
	if (id == 0) return "";
	return "_" + id.toString();
}

function elevDistFactor(elevMetres)
{
	return 1.0 + 0.00003*elevMetres; // 3% for each 1000 metres
}

function getRefElevMetres()
{
	var x = getData('refElevMetres'+APK());
	if (x == null || isNaN(x)) return 0;
	return Number(x);
}

function setRefElevMetres(x)
{
	setData('refElevMetres'+APK(), x.toString());
}

function setClubCarry(clubID, x)
{
	if (x < 0) x = 0;
	setArrayData('clubCarry'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubFlag(clubID)
{
	return getArrayData('clubFlag'+APK(), clubID) == '0' ? false : true;
}

function setClubFlag(clubID, flag)
{
	setArrayData('clubFlag'+APK(), clubID, flag ? '1' : '0');
}

function getClubCarry(clubID)
{
	return Math.round(yardsToMyUnits(Number(getArrayData('clubCarry'+APK(), clubID))));
}

function setClubCarry(clubID, x)
{
	if (x < 0) x = 0;
	setArrayData('clubCarry'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubRun(clubID)
{
	return Math.round(yardsToMyUnits(Number(getArrayData('clubRun'+APK(), clubID))));
}

function setClubRun(clubID, x)
{
	if (x < 0) x = 0;
	setArrayData('clubRun'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubTotal(clubID)
{
	return getClubCarry(clubID) + getClubRun(clubID);
}

function getClubSpreadL(clubID)
{
	var x = Math.round(yardsToMyUnits(Number(getArrayData('clubSpreadL'+APK(), clubID))));
	if (x > 0) return x;
	return getClubSpreadLDefault(clubID);
}

function setClubSpreadL(clubID, x)
{
	if (x < 1) x = 1;
	setArrayData('clubSpreadL'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubSpreadR(clubID)
{
	var x = Math.round(yardsToMyUnits(Number(getArrayData('clubSpreadR'+APK(), clubID))));
	if (x > 0) return x;
	return getClubSpreadRDefault(clubID);
}

function setClubSpreadR(clubID, x)
{
	if (x < 1) x = 1;
	setArrayData('clubSpreadR'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubSpreadO(clubID)
{
	if (clubID == 17) return 3;
	var x = Math.round(yardsToMyUnits(Number(getArrayData('clubSpreadO'+APK(), clubID))));
	if (x > 0) return x;
	return getClubSpreadODefault(clubID);
}

function setClubSpreadO(clubID, x)
{
	if (x < 1) x = 1;
	setArrayData('clubSpreadO'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubSpreadS(clubID)
{
	if (clubID == 17) return 2;
	var x = Math.round(yardsToMyUnits(Number(getArrayData('clubSpreadS'+APK(), clubID))));
	if (x > 0) return x;
	return getClubSpreadSDefault(clubID);
}

function setClubSpreadS(clubID, x)
{
	if (x < 1) x = 1;
	setArrayData('clubSpreadS'+APK(), clubID, myUnitsToYards(x).toString());
}

function getClubShape(clubID)
{
	return Number(getArrayData('clubShape'+APK(), clubID));
}

function setClubShape(clubID, x)
{
	if (x < -2) x = 0;
	if (x >  2) x = 0;
	setArrayData('clubShape'+APK(), clubID, Math.round(x).toString());
}

function initProfileByID(id)
{
	var key = "";
	if (id > 0) key = "_" + id.toString();
	setData('refElevMetres'+key, '0');
	for (var i = 0; i < 18; ++i)
	{
		setArrayData('clubFlag'+key, i, (getClubFlagDefault(i) ? '1' : '0'));
		setArrayData('clubName'+key, i, "");
		setArrayData('clubCarry'+key, i, getClubCarryDefault(i).toString());
		setArrayData('clubRun'+key, i, getClubRunDefault(i).toString());
		setArrayData('clubSpreadL'+key, i, getClubSpreadLDefault(i).toString());
		setArrayData('clubSpreadR'+key, i, getClubSpreadRDefault(i).toString());
		setArrayData('clubSpreadO'+key, i, getClubSpreadODefault(i).toString());
		setArrayData('clubSpreadS'+key, i, getClubSpreadSDefault(i).toString());
		setArrayData('clubShape'+key, i, '0');
	}
}

function copyProfileByID(id1, id2)
{
	var key1 = "";
	var key2 = "";
	if (id1 > 0) key1 = "_" + id1.toString();
	if (id2 > 0) key2 = "_" + id2.toString();
	setData('refElevMetres'+key2, getData('refElevMetres'+key1));
	for (var i = 0; i < 18; ++i)
	{
		setArrayData('clubFlag'+key2, i, getArrayData('clubFlag'+key1, i));
		var name = getArrayData('clubName'+key1, i);
		if (name != null) setArrayData('clubName'+key2, i, name);
		setArrayData('clubCarry'+key2, i, getArrayData('clubCarry'+key1, i));
		setArrayData('clubRun'+key2, i, getArrayData('clubRun'+key1, i));
		setArrayData('clubSpreadL'+key2, i, getArrayData('clubSpreadL'+key1, i));
		setArrayData('clubSpreadR'+key2, i, getArrayData('clubSpreadR'+key1, i));
		setArrayData('clubSpreadO'+key2, i, getArrayData('clubSpreadO'+key1, i));
		setArrayData('clubSpreadS'+key2, i, getArrayData('clubSpreadS'+key1, i));
		setArrayData('clubShape'+key2, i, getArrayData('clubShape'+key1, i));
	}
}

function deleteProfileByID(id)
{
	var n = getNumProfiles();
	if (n < 2) return;
	if (id > 0)
	{
		var key = "_" + id.toString();
		deleteData('refElevMetres'+key);
		for (var i = 0; i < 18; ++i)
		{
			deleteArrayData('clubFlag'+key, i);
			deleteArrayData('clubName'+key, i);
			deleteArrayData('clubCarry'+key, i);
			deleteArrayData('clubRun'+key, i);
			deleteArrayData('clubSpreadL'+key, i);
			deleteArrayData('clubSpreadR'+key, i);
			deleteArrayData('clubSpreadO'+key, i);
			deleteArrayData('clubSpreadS'+key, i);
			deleteArrayData('clubShape'+key, i);
		}
	}
	var i = 0;
	var j = 0;
	while (i < n - 1)
	{
		if (getProfileID(i) == id) j += 1;
		if (i < j) setProfileID(i, getProfileID(j));
		i += 1;
		j += 1;
	}
	setNumProfiles(n - 1);
	setActiveProfileID(getProfileID(0));
}

function getClubFlagDefault(clubID)
{
	var flag = false;
	switch (clubID)
	{
	case 0: flag = true; break;
	case 1: flag = true; break;
	case 2: flag = true; break;
	case 3: flag = false; break;
	case 4: flag = false; break;
	case 5: flag = false; break;
	case 6: flag = true; break;
	case 7: flag = true; break;
	case 8: flag = true; break;
	case 9: flag = true; break;
	case 10: flag = true; break;
	case 11: flag = true; break;
	case 12: flag = true; break;
	case 13: flag = true; break;
	case 14: flag = true; break;
	case 15: flag = true; break;
	case 16: flag = false; break;
	case 17: flag = true; break;
	}
	return flag;
}

function getClubCarryDefault(clubID)
{
	var carry = 0;
	switch (clubID)
	{
	case 0: carry = 260; break;
	case 1: carry = 240; break;
	case 2: carry = 220; break;
	case 3: carry = 210; break;
	case 4: carry = 220; break;
	case 5: carry = 210; break;
	case 6: carry = 200; break;
	case 7: carry = 190; break;
	case 8: carry = 180; break;
	case 9: carry = 170; break;
	case 10: carry = 160; break;
	case 11: carry = 150; break;
	case 12: carry = 140; break;
	case 13: carry = 130; break;
	case 14: carry = 110; break;
	case 15: carry = 90; break;
	case 16: carry = 70; break;
	case 17: carry = 0; break;
	}
	return Math.round(yardsToMyUnits(carry));
}

function getClubRunDefault(clubID)
{
	var run = 0;
	switch (clubID)
	{
	case 0: run = 30; break;
	case 1: run = 25; break;
	case 2: run = 20; break;
	case 3: run = 20; break;
	case 4: run = 30; break;
	case 5: run = 25; break;
	case 6: run = 20; break;
	case 7: run = 15; break;
	case 8: run = 12; break;
	case 9: run = 10; break;
	case 10: run = 8; break;
	case 11: run = 6; break;
	case 12: run = 5; break;
	case 13: run = 4; break;
	case 14: run = 3; break;
	case 15: run = 2; break;
	case 16: run = 2; break;
	case 17: run = 20; break;
	}
	return Math.round(yardsToMyUnits(run));
}

function getClubSpreadLDefault(clubID) { return getClubSpreadDefault(clubID); }
function getClubSpreadRDefault(clubID) { return getClubSpreadDefault(clubID); }
function getClubSpreadODefault(clubID) { if (clubID == 17) return 3; return Math.round(4 + 0.3*getClubSpreadDefault(clubID)); }
function getClubSpreadSDefault(clubID) { if (clubID == 17) return 2; return Math.round(4 + 0.6*getClubSpreadDefault(clubID)); }

function getClubSpreadDefault(clubID)
{
	var x = 0;
	if (getDistanceUnit() == "m")
	{
		switch (clubID)
		{
		case 0: x = 32; break;
		case 1: x = 27; break;
		case 2: x = 23; break;
		case 3: x = 20; break;
		case 4: x = 23; break;
		case 5: x = 20; break;
		case 6: x = 18; break;
		case 7: x = 16; break;
		case 8: x = 14; break;
		case 9: x = 12; break;
		case 10: x = 11; break;
		case 11: x = 10; break;
		case 12: x = 9; break;
		case 13: x = 8; break;
		case 14: x = 7; break;
		case 15: x = 6; break;
		case 16: x = 5; break;
		case 17: x = 1; break;
		}
	}
	else
	{
		switch (clubID)
		{
		case 0: x = 35; break;
		case 1: x = 30; break;
		case 2: x = 25; break;
		case 3: x = 22; break;
		case 4: x = 25; break;
		case 5: x = 22; break;
		case 6: x = 20; break;
		case 7: x = 18; break;
		case 8: x = 16; break;
		case 9: x = 14; break;
		case 10: x = 12; break;
		case 11: x = 10; break;
		case 12: x = 9; break;
		case 13: x = 8; break;
		case 14: x = 7; break;
		case 15: x = 6; break;
		case 16: x = 5; break;
		case 17: x = 1; break;
		}
	}
	return x;
}

function getClubDist(i)
{
	return myUnitsToMetres(getClubTotal(i));
}

function getMaxClubDist(firstClub)
{
	var max = 0;
	for (var i = firstClub; i <= 16; ++i)
	{
		if (getClubFlag(i))
		{
			var d = getClubDist(i);
			if (d > max)
				max = d;
		}
	}
	return max;
}

function getClubDistPercentage(i, dist, round = true)
{
	if (round) return Math.round(100.0*(dist/getClubDist(i)));
	return 100.0*(dist/getClubDist(i));
}

function getBestClubForDist(dist)
{
	var bestClub = 0;
	var bestError = 999999;
	for (var i = 0; i <= 16; ++i)
	{
		if (getClubFlag(i))
		{
			var error = getClubDist(i) - dist;
			if (error < 0)
				error = -5 * error;
			if (error < bestError)
			{
				bestClub = i;
				bestError = error;
			}
		}
	}
	return bestClub;
}

function getNumCourses()
{
	var key = 'numCourses';

	if (!getData(key))
		setData(key, '0');

	return Number(getData(key));
}

function setNumCourses(n)
{
	setData('numCourses', n.toString());
}

function getNextCourseID()
{
	var key = 'nextCourseID';

	if (!getData(key))
		setData(key, '1');

	return Number(getData(key));
}

function setNextCourseID(n)
{
	setData('nextCourseID', n.toString());
}

function getCourseName(i)
{
	return getArrayData('courseName', i);
}

function setCourseName(i, name)
{
	setArrayData('courseName', i, cleanString(name));
}

function getCourseID(i)
{
	return Number(getArrayData('courseID', i));
}

function setCourseID(i, courseID)
{
	setArrayData('courseID', i, courseID.toString());
}

function getCourseIDFromName(name)
{
	var n = getNumCourses();
	for (var i = 0; i < n; ++i)
	{
		if (getCourseName(i).toLowerCase() == cleanString(name).toLowerCase())
			return getCourseID(i);
	}
	return 0;
}

function getCourseNameFromID(id)
{
	var n = getNumCourses();
	for (var i = 0; i < n; ++i)
	{
		if (getCourseID(i) == id)
			return getCourseName(i);
	}
	return '';
}

function createCourse(courseName)
{
	var n = getNumCourses();
	var id = getNextCourseID();

	initCourseData(id);
	setNextCourseID(id + 1);
	setNumCourses(n + 1);

	var i = n;
	while (i > 0 && courseName < getCourseName(i - 1))
	{
		setCourseName(i, getCourseName(i - 1));
		setCourseID  (i, getCourseID  (i - 1));
		--i;
	}

	setCourseName(i, courseName);
	setCourseID  (i, id);

	return id;
}

function renameCourse(i, newName)
{
	var n = getNumCourses();
	var id = getCourseID(i);
	while (i > 0 && newName < getCourseName(i - 1))
	{
		setCourseName(i, getCourseName(i - 1));
		setCourseID  (i, getCourseID  (i - 1));
		--i;
	}
	while (i < n - 1 && newName > getCourseName(i + 1))
	{
		setCourseName(i, getCourseName(i + 1));
		setCourseID  (i, getCourseID  (i + 1));
		++i;
	}
	setCourseName(i, newName);
	setCourseID  (i, id);
}

function deleteCourse(id)
{
	var found = false;
	var n = getNumCourses();
	for (var i = 0; i < n; ++i)
	{
		if (found)
		{
			setCourseID  (i - 1, getCourseID  (i));
			setCourseName(i - 1, getCourseName(i));
		}
		else if (getCourseID(i) == id)
		{
			found = true;
		}
	}
	if (found)
	{
		setNumCourses(n - 1);
		deleteCourseData(id);
	}
}

function getCourseHoleTeeLat(courseID, hole) { if (courseID == 0) return tempHoleTeeLat[hole]; return Number(getArrayData2('chtlat', courseID, hole)); }
function getCourseHoleTeeLon(courseID, hole) { if (courseID == 0) return tempHoleTeeLon[hole]; return Number(getArrayData2('chtlon', courseID, hole)); }

function getCourseHolePinLat(courseID, hole) { if (courseID == 0) return tempHolePinLat[hole]; return Number(getArrayData2('chplat', courseID, hole)); }
function getCourseHolePinLon(courseID, hole) { if (courseID == 0) return tempHolePinLon[hole]; return Number(getArrayData2('chplon', courseID, hole)); }

function getCourseHoleTargetLat(courseID, hole, target) { if (courseID == 0) return tempHoleTargetLat[hole*10 + target]; return Number(getArrayData3('chrlat', courseID, hole, target)); }
function getCourseHoleTargetLon(courseID, hole, target) { if (courseID == 0) return tempHoleTargetLon[hole*10 + target]; return Number(getArrayData3('chrlon', courseID, hole, target)); }
function getCourseHoleMeasure(courseID, hole, i) { if (i >= 20) return ""; if (courseID == 0) return tempHoleMeasure[hole*20 + i]; return getArrayData3('chm', courseID, hole, i); }
function getCourseHoleMeasures(courseID, hole) { var n = 0; while (n < 20) { var m = getCourseHoleMeasure(courseID, hole, n); if (m == null || m == "") return n; ++n; } return n; }
function getCourseHoleSymbol(courseID, hole, i) { if (i >= 50) return ""; if (courseID == 0) return tempHoleSymbol[hole*50 + i]; return getArrayData3('chs', courseID, hole, i); }
function getCourseHoleSymbols(courseID, hole) { var n = 0; while (n < 50) { var s = getCourseHoleSymbol(courseID, hole, n); if (s == null || s == "") return n; ++n; } return n; }
function getCourseHoleNotes(courseID, hole) { var s = ''; if (courseID == 0) s = tempHoleNotes[hole]; else s = getArrayData2('chn', courseID, hole); if (s == null) s = ''; return s; }

function encodeMeasure(lat1, lon1, lat2, lon2)
{
	var a = Math.round(lat1*999999);
	var b = Math.round(lon1*999999);
	var c = Math.round((lat2-a/999999)*999999);
	var d = Math.round((lon2-b/999999)*999999);
	var s = a.toString()+','+b.toString()+','+c.toString()+','+d.toString();
	return s;
}

function decodeMeasure(m)
{
	var x = {lat1:0, lon1:0, lat2:0, lon2:0};
	if (m == null || m == "") return x;
	var vals = m.split(',');
	if (vals.length < 4) return x;
	x.lat1 = Number(vals[0])/999999;
	x.lon1 = Number(vals[1])/999999;
	x.lat2 = x.lat1 + Number(vals[2])/999999;
	x.lon2 = x.lon1 + Number(vals[3])/999999;
	return x;
}

function encodeSymbol(lat, lon, symbol)
{
	var a = Math.round(lat*999999);
	var b = Math.round(lon*999999);
	var s = a.toString()+','+b.toString()+','+symbol;
	return s;
}

function decodeSymbol(s)
{
	var x = {lat:0, lon:0, symbol:''};
	if (s == null || s == "") return x;
	var vals = s.split(',');
	if (vals.length < 3) return x;
	x.lat = Number(vals[0])/999999;
	x.lon = Number(vals[1])/999999;
	x.symbol = vals[2];
	return x;
}

function setCourseHoleTeeLat(courseID, hole, lat) { if (courseID == 0) tempHoleTeeLat[hole] = lat; else setArrayData2('chtlat', courseID, hole, lat.toString()); initCourseSummaryData(courseID); }
function setCourseHoleTeeLon(courseID, hole, lon) { if (courseID == 0) tempHoleTeeLon[hole] = lon; else setArrayData2('chtlon', courseID, hole, lon.toString()); initCourseSummaryData(courseID); }
function setCourseHolePinLat(courseID, hole, lat) { if (courseID == 0) tempHolePinLat[hole] = lat; else setArrayData2('chplat', courseID, hole, lat.toString()); initCourseSummaryData(courseID); }
function setCourseHolePinLon(courseID, hole, lon) { if (courseID == 0) tempHolePinLon[hole] = lon; else setArrayData2('chplon', courseID, hole, lon.toString()); initCourseSummaryData(courseID); }
function setCourseHoleTargetLat(courseID, hole, target, lat) { if (courseID == 0) tempHoleTargetLat[hole*10 + target] = lat; else setArrayData3('chrlat', courseID, hole, target, lat.toString()); initCourseSummaryData(courseID); }
function setCourseHoleTargetLon(courseID, hole, target, lon) { if (courseID == 0) tempHoleTargetLon[hole*10 + target] = lon; else setArrayData3('chrlon', courseID, hole, target, lon.toString()); initCourseSummaryData(courseID); }
function setCourseHoleMeasure(courseID, hole, i, measure) { if (i >= 20) return; if (courseID == 0) tempHoleMeasure[hole*20 + i] = measure; else setArrayData3('chm', courseID, hole, i, measure); }
function setCourseHoleSymbol(courseID, hole, i, symbol) { if (i >= 50) return; if (courseID == 0) tempHoleSymbol[hole*50 + i] = symbol; else setArrayData3('chs', courseID, hole, i, symbol); }
function setCourseHoleNotes(courseID, hole, notes) { if (courseID == 0) tempHoleNotes[hole] = notes; else setArrayData2('chn', courseID, hole, notes); }

function setCourseHoleMeasure2(courseID, hole, i, measure)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole, i);
	var teeLon = getCourseHoleTeeLon(courseID, hole, i);
	var x = decodeMeasure(measure);
	x.lat1 += teeLat; x.lon1 += teeLon;
	x.lat2 += teeLat; x.lon2 += teeLon;
	var measure2 = encodeMeasure(x.lat1, x.lon1, x.lat2, x.lon2);
	setCourseHoleMeasure(courseID, hole, i, measure2);
}

function setCourseHoleSymbol2(courseID, hole, i, symbol)
{
	var pinLat = getCourseHolePinLat(courseID, hole, i);
	var pinLon = getCourseHolePinLon(courseID, hole, i);
	var x = decodeSymbol(symbol);
	x.lat += pinLat;
	x.lon += pinLon;
	var symbol2 = encodeSymbol(x.lat, x.lon, x.symbol);
	setCourseHoleSymbol(courseID, hole, i, symbol2);
}

function deleteCourseHoleTeeLat(courseID, hole) { deleteArrayData2('chtlat', courseID, hole); }
function deleteCourseHoleTeeLon(courseID, hole) { deleteArrayData2('chtlon', courseID, hole); }
function deleteCourseHolePinLat(courseID, hole) { deleteArrayData2('chplat', courseID, hole); }
function deleteCourseHolePinLon(courseID, hole) { deleteArrayData2('chplon', courseID, hole); }
function deleteCourseHoleTargetLat(courseID, hole, target) { deleteArrayData3('chrlat', courseID, hole, target); }
function deleteCourseHoleTargetLon(courseID, hole, target) { deleteArrayData3('chrlon', courseID, hole, target); }
function deleteCourseHoleMeasure(courseID, hole, i) { if (courseID == 0) tempHoleMeasure[hole*20 + i] = ''; else deleteArrayData3('chm', courseID, hole, i); }
function deleteCourseHoleSymbol(courseID, hole, i) { if (courseID == 0) tempHoleSymbol[hole*50 + i] = ''; else deleteArrayData3('chs', courseID, hole, i); }
function deleteCourseHoleNotes(courseID, hole) { if (courseID == 0) tempHoleNotes[hole] = ''; else deleteArrayData2('chn', courseID, hole); }

function getCourseHoles(courseID)
{
	var n = 0;
	if (courseID > 0)
	{
		var s = getArrayData('courseholes', courseID);
		if (!isNaN(s))
			n = Number(s);
	}
	if (n < 1)
	{
		for (var hole = 1; hole <= 18; ++hole)
		{
			if (   (getCourseHoleTeeLat(courseID, hole) != 0 || getCourseHoleTeeLon(courseID, hole) != 0)
			    && (getCourseHolePinLat(courseID, hole) != 0 || getCourseHolePinLon(courseID, hole) != 0))
				++n;
		}
		if (courseID > 0)
			setArrayData('courseholes', courseID, n.toString());
	}
	return n;
}

function getCourseLength(courseID)
{
	var length = 0;
	if (courseID > 0)
	{
		var s = getArrayData('courselength', courseID);
		if (!isNaN(s))
			length = Number(s);
	}
	if (length < 1)
	{
		for (var hole = 1; hole <= 18; ++hole)
		{
			length += getCourseHoleLength(courseID, hole);
		}
		length = myUnitsToMetres(length);
		if (courseID > 0)
			setArrayData('courselength', courseID, length.toString());
	}
	return Math.round(metresToMyUnits(length));
}

function getCoursePar(courseID)
{
	var par = 0;
	if (courseID > 0)
	{
		var s = getArrayData('coursepar', courseID);
		if (!isNaN(s))
			par = Number(s);
	}
	if (par < 1)
	{
		for (var hole = 1; hole <= 18; ++hole)
		{
			par += getCourseHolePar(courseID, hole);
		}
		if (courseID > 0)
			setArrayData('coursepar', courseID, par.toString());
	}
	return par;
}

function getCourseHoleLength(courseID, hole)
{
	var dist = 0;

	var prevLat = getCourseHoleTeeLat(courseID, hole);
	var prevLon = getCourseHoleTeeLon(courseID, hole);

	for (var i = 1; i <= 4; ++i)
	{
		var lat = 0;
		var lon = 0;
		if (i <= 3)
		{
			lat = getCourseHoleTargetLat(courseID, hole, i);
			lon = getCourseHoleTargetLon(courseID, hole, i);
		}
		else
		{
			lat = getCourseHolePinLat(courseID, hole);
			lon = getCourseHolePinLon(courseID, hole);
		}
		if (lat != 0 || lon != 0)
		{
			if (prevLat != 0 || prevLon != 0)
				dist += geogDist(prevLat, prevLon, lat, lon);
			prevLat = lat;
			prevLon = lon;
		}
	}

	return Math.round(metresToMyUnits(dist));
}

function getCourseHoleShotLength(courseID, hole, shot)
{
	var dist = 0;

	var prevLat = getCourseHoleTeeLat(courseID, hole);
	var prevLon = getCourseHoleTeeLon(courseID, hole);

	var n = 1;

	for (var i = 1; i <= 4; ++i)
	{
		var lat = 0;
		var lon = 0;
		if (i <= 3)
		{
			lat = getCourseHoleTargetLat(courseID, hole, i);
			lon = getCourseHoleTargetLon(courseID, hole, i);
		}
		else
		{
			lat = getCourseHolePinLat(courseID, hole);
			lon = getCourseHolePinLon(courseID, hole);
		}
		if (lat != 0 || lon != 0)
		{
			if (prevLat != 0 || prevLon != 0)
			{
				if (n == shot)
					dist += geogDist(prevLat, prevLon, lat, lon);
				++n;
			}
			prevLat = lat;
			prevLon = lon;
		}
	}

	return Math.round(metresToMyUnits(dist));
}

function getCourseHolePar(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return 0;

	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (pinLat == 0 && pinLon == 0)
		return 0;

	var par = 0;

	var prevLat = teeLat;
	var prevLon = teeLon;

	for (var i = 1; i <= 4; ++i)
	{
		var lat = 0;
		var lon = 0;
		if (i <= 3)
		{
			lat = getCourseHoleTargetLat(courseID, hole, i);
			lon = getCourseHoleTargetLon(courseID, hole, i);
		}
		else
		{
			lat = pinLat;
			lon = pinLon;
		}
		if (lat != 0 || lon != 0)
		{
			par += 1;
			prevLat = lat;
			prevLon = lon;
		}
	}

	if (par > 0)
		par += 2;

	return par;
}

function getCourseLat(courseID)
{
	var minLat = 0;
	var maxLat = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lat = getCourseHoleLat(courseID, hole);
		if (lat != 0)
		{
			if (n == 0)
			{
				minLat = lat;
				maxLat = lat;
			}
			else
			{
				if (lat < minLat)
					minLat = lat;
				if (lat > maxLat)
					maxLat = lat;
			}
			++n;
		}
	}
	return minLat + 0.2 * (maxLat - minLat);
}

function getCourseMinLat(courseID)
{
	var minLat = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lat = getCourseHoleMinLat(courseID, hole);
		if (lat != 0)
		{
			if (n == 0)
			{
				minLat = lat;
			}
			else
			{
				if (lat < minLat)
					minLat = lat;
			}
			++n;
		}
	}
	return minLat;
}

function getCourseMaxLat(courseID)
{
	var maxLat = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lat = getCourseHoleMaxLat(courseID, hole);
		if (lat != 0)
		{
			if (n == 0)
			{
				maxLat = lat;
			}
			else
			{
				if (lat > maxLat)
					maxLat = lat;
			}
			++n;
		}
	}
	return maxLat;
}

function getCourseLon(courseID)
{
	var minLon = 0;
	var maxLon = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lon = getCourseHoleLon(courseID, hole);
		if (lon != 0)
		{
			if (n == 0)
			{
				minLon = lon;
				maxLon = lon;
			}
			else
			{
				if (lon < minLon && lon > minLon - 90)
					minLon = lon;
				if (lon > maxLon && lon < maxLon + 90)
					maxLon = lon;
			}
			++n;
		}
	}
	return (minLon + maxLon) / 2;
}

function getCourseMinLon(courseID)
{
	var minLon = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lon = getCourseHoleMinLon(courseID, hole);
		if (lon != 0)
		{
			if (n == 0)
			{
				minLon = lon;
			}
			else
			{
				if (lon < minLon && lon > minLon - 90)
					minLon = lon;
			}
			++n;
		}
	}
	return minLon;
}

function getCourseMaxLon(courseID)
{
	var maxLon = 0;
	var n = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var lon = getCourseHoleMaxLon(courseID, hole);
		if (lon != 0)
		{
			if (n == 0)
			{
				maxLon = lon;
			}
			else
			{
				if (lon > maxLon && lon < maxLon + 90)
					maxLon = lon;
			}
			++n;
		}
	}
	return maxLon;
}

function distToFraction(d, lat1, lon1, lat2, lon2)
{
	var d2 = geogDist(lat1, lon1, lat2, lon2);
	if (d > 0.5 * d2)
		return 0.5;
	if (d2 > 0)
		return d / d2;
	return 0;
}

function getCourseHoleLat(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLat;

	if (pinLat == 0 && pinLon == 0)
		return teeLat;
	
	while (pinLon < teeLon - 180)
		pinLon = pinLon + 360;

	while (pinLon > teeLon + 180)
		pinLon = pinLon - 360;

	return teeLat + distToFraction(80, teeLat, teeLon, pinLat, pinLon) * (pinLat - teeLat);
}

function getCourseHoleMinLat(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLat;

	if (pinLat == 0 && pinLon == 0)
		return teeLat;

	teeLat -= distToDeltaLat(teeBuffer, teeLat, teeLon);
	pinLat -= distToDeltaLat(pinBuffer, pinLat, pinLon);
	
	if (teeLat < pinLat)
		return teeLat;

	return pinLat;
}

function getCourseHoleMaxLat(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLat;

	if (pinLat == 0 && pinLon == 0)
		return teeLat;
	
	teeLat += distToDeltaLat(teeBuffer, teeLat, teeLon);
	pinLat += distToDeltaLat(pinBuffer, pinLat, pinLon);
	
	if (teeLat > pinLat)
		return teeLat;

	return pinLat;
}

function getCourseHoleLon(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLon;

	if (pinLat == 0 && pinLon == 0)
		return teeLon;
	
	while (pinLon < teeLon - 180)
		pinLon = pinLon + 360;

	while (pinLon > teeLon + 180)
		pinLon = pinLon - 360;

	return teeLon + distToFraction(80, teeLat, teeLon, pinLat, pinLon) * (pinLon - teeLon);
}

function getCourseHoleMinLon(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLon;

	if (pinLat == 0 && pinLon == 0)
		return teeLon;
	
	while (pinLon < teeLon - 180)
		pinLon = pinLon + 360;

	while (pinLon > teeLon + 180)
		pinLon = pinLon - 360;

	teeLon -= distToDeltaLon(teeBuffer, teeLat, teeLon);
	pinLon -= distToDeltaLon(pinBuffer, pinLat, pinLon);
	
	if (teeLon < pinLon)
		return teeLon;

	return pinLon;
}

function getCourseHoleMaxLon(courseID, hole)
{
	var teeLat = getCourseHoleTeeLat(courseID, hole);
	var teeLon = getCourseHoleTeeLon(courseID, hole);
	var pinLat = getCourseHolePinLat(courseID, hole);
	var pinLon = getCourseHolePinLon(courseID, hole);

	if (teeLat == 0 && teeLon == 0)
		return pinLon;

	if (pinLat == 0 && pinLon == 0)
		return teeLon;
	
	while (pinLon < teeLon - 180)
		pinLon = pinLon + 360;

	while (pinLon > teeLon + 180)
		pinLon = pinLon - 360;

	teeLon += distToDeltaLon(teeBuffer, teeLat, teeLon);
	pinLon += distToDeltaLon(pinBuffer, pinLat, pinLon);
	
	if (teeLon > pinLon)
		return teeLon;

	return pinLon;
}

function getCourseHoleBearing(courseID, hole)
{
	if (hole == 0) return 0;
	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);
	var lat2 = getCourseHolePinLat(courseID, hole);
	var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat1 == 0 && lon1 == 0) return 0;
	if (lat2 == 0 && lon2 == 0) return 0;
	return geogBearing(lat1, lon1, lat2, lon2);
}

function getCourseHoleApproachBearing(courseID, hole)
{
	if (hole == 0) return 0;
	var lat2 = getCourseHolePinLat(courseID, hole); var lon2 = getCourseHolePinLon(courseID, hole);
	if (lat2 == 0 && lon2 == 0) return 0;
	var lat1 = getCourseHoleTargetLat(courseID, hole, 3); var lon1 = getCourseHoleTargetLon(courseID, hole, 3);
	if (lat1 == 0 && lon1 == 0) { lat1 = getCourseHoleTargetLat(courseID, hole, 2); lon1 = getCourseHoleTargetLon(courseID, hole, 2); }
	if (lat1 == 0 && lon1 == 0) { lat1 = getCourseHoleTargetLat(courseID, hole, 1); lon1 = getCourseHoleTargetLon(courseID, hole, 1); }
	if (lat1 == 0 && lon1 == 0) { lat1 = getCourseHoleTeeLat(courseID, hole, 1); lon1 = getCourseHoleTeeLon(courseID, hole, 1); }
	if (lat1 == 0 && lon1 == 0) return 0;
	return geogBearing(lat1, lon1, lat2, lon2);
}

function getCourseHoleShotLat(courseID, hole, shot, dist1, dist2)
{
	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
		return 0;

	if (shot < 1)
		shot = 1;

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;

	if (shot <= 1 || par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (shot >= par - 2)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, par - 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, par - 3);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
	}

	if (shot >= par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else if (shot <= 1)
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		lon2 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
	}

	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	var d = geogDist(lat1, lon1, lat2, lon2);

	if (d <= 0)
		return 0; // should never happen, but avoid division by zero just in case

	if (shot > par - 2 || d + dist1 < dist2)
		return lat2 + (lat1 - lat2) * (dist2 / d); // dist2 back from end

	return lat1 + (lat1 - lat2) * (dist1 / d); // dist1 back from start
}

function getCourseHoleShotLon(courseID, hole, shot, dist1, dist2)
{
	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
		return 0;

	if (shot < 1)
		shot = 1;

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;

	if (shot <= 1 || par == 3)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else if (shot >= par - 2)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, par - 3);
		lon1 = getCourseHoleTargetLon(courseID, hole, par - 3);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
	}

	if (shot >= par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else if (shot <= 1)
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, 1);
		lon2 = getCourseHoleTargetLon(courseID, hole, 1);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
	}

	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	var d = geogDist(lat1, lon1, lat2, lon2);

	if (d <= 0)
		return 0; // should never happen, but avoid division by zero just in case

	if (shot > par - 2 || d + dist1 < dist2)
		return lon2 + (lon1 - lon2) * (dist2 / d); // dist2 back from end

	return lon1 + (lon1 - lon2) * (dist1 / d); // dist1 back from start
}

function getCourseHoleShotMinLat(courseID, hole, shot)
{
	if (shot <= 0)
		return getCourseHoleMinLat(courseID, hole);

	var par = getCourseHolePar(courseID, hole);

	if (shot > par - 2)
		return getCourseHolePinLat(courseID, hole);

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;
	var buffer1 = teeBuffer;
	var buffer2 = pinBuffer;

	if (shot == 1)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
		buffer1 = targetBuffer;
	}

	if (shot == par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
		buffer2 = targetBuffer;
	}

	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lat1 -= distToDeltaLat(buffer1, lat1, lon1);
	lat2 -= distToDeltaLat(buffer2, lat2, lon2);

	if (lat2 < lat1)
		return lat2;

	return lat1;
}

function getCourseHoleShotMaxLat(courseID, hole, shot)
{
	if (shot <= 0)
		return getCourseHoleMaxLat(courseID, hole);

	var par = getCourseHolePar(courseID, hole);

	if (shot > par - 2)
		return getCourseHolePinLat(courseID, hole);

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;
	var buffer1 = teeBuffer;
	var buffer2 = pinBuffer;

	if (shot == 1)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
		buffer1 = targetBuffer;
	}

	if (shot == par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
		buffer2 = targetBuffer;
	}

	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lat1 += distToDeltaLat(buffer1, lat1, lon1);
	lat2 += distToDeltaLat(buffer2, lat2, lon2);

	if (lat2 > lat1)
		return lat2;

	return lat1;
}

function getCourseHoleShotMinLon(courseID, hole, shot)
{
	if (shot <= 0)
		return getCourseHoleMinLon(courseID, hole);

	var par = getCourseHolePar(courseID, hole);

	if (shot > par - 2)
		return getCourseHolePinLon(courseID, hole);

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;
	var buffer1 = teeBuffer;
	var buffer2 = pinBuffer;

	if (shot == 1)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
		buffer1 = targetBuffer;
	}

	if (shot == par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
		buffer2 = targetBuffer;
	}

	while (lon2 < lon1 - 180)
		l2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lon1 -= distToDeltaLon(buffer1, lat1, lon1);
	lon2 -= distToDeltaLon(buffer2, lat2, lon2);

	if (lon2 < lon1)
		return lon2;

	return lon1;
}

function getCourseHoleShotMaxLon(courseID, hole, shot)
{
	if (shot <= 0)
		return getCourseHoleMaxLon(courseID, hole);

	var par = getCourseHolePar(courseID, hole);

	if (shot > par - 2)
		return getCourseHolePinLon(courseID, hole);

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;
	var buffer1 = teeBuffer;
	var buffer2 = pinBuffer;

	if (shot == 1)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, shot - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, shot - 1);
		buffer1 = targetBuffer;
	}

	if (shot == par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, shot);
		lon2 = getCourseHoleTargetLon(courseID, hole, shot);
		buffer2 = targetBuffer;
	}

	while (lon2 < lon1 - 180)
		l2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lon1 += distToDeltaLon(buffer1, lat1, lon1);
	lon2 += distToDeltaLon(buffer2, lat2, lon2);

	if (lon2 > lon1)
		return lon2;

	return lon1;
}

function getCourseHoleShotBearing(courseID, hole, shot)
{
	if (shot <= 0)
		return getCourseHoleBearing(courseID, hole);

	var par = getCourseHolePar(courseID, hole);

	if (par < 3)
		return 0;

	var i = shot;

	if (i > par - 2)
		i = par - 2;

	var lat1 = 0;
	var lon1 = 0;
	var lat2 = 0;
	var lon2 = 0;

	if (i == 1)
	{
		lat1 = getCourseHoleTeeLat(courseID, hole);
		lon1 = getCourseHoleTeeLon(courseID, hole);
	}
	else
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, i - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, i - 1);
	}

	if (i == par - 2)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	else
	{
		lat2 = getCourseHoleTargetLat(courseID, hole, i);
		lon2 = getCourseHoleTargetLon(courseID, hole, i);
	}

	var result = geogBearing(lat1, lon1, lat2, lon2);

	if (shot >= par)
	{
		result -= 90 * (shot - par + 1);
		if (result < 0)
			result += 360;
	}

	return result;
}

function geogBearing(lat1, lon1, lat2, lon2)
{
	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lat1 = lat1 * Math.PI / 180;
	lon1 = lon1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	lon2 = lon2 * Math.PI / 180;

	var r = 6371000;
	var dx = r * Math.cos(lat1) * (lon2 - lon1);
	var dy = r * (lat2 - lat1);

	return Math.atan2(dx, dy) * 180 / Math.PI;
}

function geogDist(lat1, lon1, lat2, lon2)
{
	while (lon2 < lon1 - 180)
		lon2 = lon2 + 360;

	while (lon2 > lon1 + 180)
		lon2 = lon2 - 360;

	lat1 = lat1 * Math.PI / 180;
	lon1 = lon1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	lon2 = lon2 * Math.PI / 180;

	var r = 6371000;
	var dx = r * Math.cos(lat1) * (lon2 - lon1);
	var dy = r * (lat2 - lat1);

	return Math.sqrt(dx*dx + dy*dy);
}

function distToDeltaLat(d, lat, lon)
{
	var deltaLat = d / 100000.0;
	var d2 = geogDist(lat, lon, lat + deltaLat, lon);
	if (d2 != 0)
		return deltaLat * (d / d2);
	return 0;
}

function distToDeltaLon(d, lat, lon)
{
	var deltaLon = d / 100000.0;
	var d2 = geogDist(lat, lon, lat, lon + deltaLon);
	if (d2 != 0)
		return deltaLon * (d / d2);
	return 0;
}

function initCourseSummaryData(courseID)
{
	setArrayData('courseholes',  courseID, '0');
	setArrayData('courselength', courseID, '0');
	setArrayData('coursepar',    courseID, '0');
}

function deleteCourseSummaryData(courseID)
{
	deleteArrayData('courseholes',  courseID);
	deleteArrayData('courselength', courseID);
	deleteArrayData('coursepar',    courseID);
}

function initCourseData(courseID)
{
	initCourseSummaryData(courseID);
	for (var hole = 1; hole <= 18; ++hole)
	{
		setCourseHoleTeeLat(courseID, hole, 0);
		setCourseHoleTeeLon(courseID, hole, 0);

		setCourseHolePinLat(courseID, hole, 0);
		setCourseHolePinLon(courseID, hole, 0);

		for (var target = 1; target <= 3; ++target)
		{
			setCourseHoleTargetLat(courseID, hole, target, 0);
			setCourseHoleTargetLon(courseID, hole, target, 0);
		}

		var finished = false;
		var i = 0;
		while (!finished)
		{
			var m = getCourseHoleMeasure(courseID, hole, i);
			if (m == null || m == '') { finished = true; }
			else { deleteCourseHoleMeasure(courseID, hole, i); ++i; }
		}

		finished = false;
		i = 0;
		while (!finished)
		{
			var s = getCourseHoleSymbol(courseID, hole, i);
			if (s == null || s == '') { finished = true; }
			else { deleteCourseHoleSymbol(courseID, hole, i); ++i; }
		}
	}
	for (var hole = 0; hole <= 18; ++hole)
	{
		var n = getCourseHoleNotes(courseID, hole);
		if (n != null)
			deleteCourseHoleNotes(courseID, hole);
	}
}

function deleteCourseData(courseID)
{
	deleteCourseSummaryData(courseID);
	for (var hole = 1; hole <= 18; ++hole)
	{
		deleteCourseHoleTeeLat(courseID, hole);
		deleteCourseHoleTeeLon(courseID, hole);

		deleteCourseHolePinLat(courseID, hole);
		deleteCourseHolePinLon(courseID, hole);

		for (var target = 1; target <= 3; ++target)
		{
			deleteCourseHoleTargetLat(courseID, hole, target);
			deleteCourseHoleTargetLon(courseID, hole, target);
		}

		var finished = false;
		var i = 0;
		while (!finished)
		{
			var m = getCourseHoleMeasure(courseID, hole, i);
			if (m == null || m == '') { finished = true; }
			else { deleteCourseHoleMeasure(courseID, hole, i); ++i; }
		}

		finished = false;
		i = 0;
		while (!finished)
		{
			var s = getCourseHoleSymbol(courseID, hole, i);
			if (s == null || s == '') { finished = true; }
			else { deleteCourseHoleSymbol(courseID, hole, i); ++i; }
		}
	}
	for (var hole = 0; hole <= 18; ++hole)
	{
		var n = getCourseHoleNotes(courseID, hole);
		if (n != null)
			deleteCourseHoleNotes(courseID, hole);
	}
}

function copyCourseData(fromCourseID, toCourseID)
{
	initCourseSummaryData(toCourseID);
	for (var hole = 1; hole <= 18; ++hole)
	{
		setCourseHoleTeeLat(toCourseID, hole, getCourseHoleTeeLat(fromCourseID, hole));
		setCourseHoleTeeLon(toCourseID, hole, getCourseHoleTeeLon(fromCourseID, hole));

		setCourseHolePinLat(toCourseID, hole, getCourseHolePinLat(fromCourseID, hole));
		setCourseHolePinLon(toCourseID, hole, getCourseHolePinLon(fromCourseID, hole));

		for (var target = 1; target <= 3; ++target)
		{
			setCourseHoleTargetLat(toCourseID, hole, target, getCourseHoleTargetLat(fromCourseID, hole, target));
			setCourseHoleTargetLon(toCourseID, hole, target, getCourseHoleTargetLon(fromCourseID, hole, target));
		}

		var finished = false;
		var i = 0;
		while (!finished)
		{
			var m = getCourseHoleMeasure(fromCourseID, hole, i);
			if (m == null || m == '') { finished = true; }
			else { setCourseHoleMeasure(toCourseID, hole, i, m); ++i; }
		}

		finished = false;
		i = 0;
		while (!finished)
		{
			var s = getCourseHoleSymbol(fromCourseID, hole, i);
			if (s == null || s == '') { finished = true; }
			else { setCourseHoleSymbol(toCourseID, hole, i, s); ++i; }
		}
	}
	for (var hole = 0; hole <= 18; ++hole)
	{
		var n = getCourseHoleNotes(fromCourseID, hole);
		if (n != null && n != '')
			setCourseHoleNotes(toCourseID, hole, n);
	}
}

function normalizeCourseHoleTargets(courseID, hole)
{
	var n = 0;
	for (var i = 1; i <= 3; ++i)
	{
		var lat = getCourseHoleTargetLat(courseID, hole, i);
		var lon = getCourseHoleTargetLon(courseID, hole, i);

		if (lat != 0 || lon != 0)
		{
			++n;
			if (n < i)
			{
				setCourseHoleTargetLat(courseID, hole, n, lat);
				setCourseHoleTargetLon(courseID, hole, n, lon);
				setCourseHoleTargetLat(courseID, hole, i, 0);
				setCourseHoleTargetLon(courseID, hole, i, 0);
			}
		}
	}
}

function setCourseHoleTargetMax(courseID, hole, target)
{
	if (hole < 1 || hole > 18 || target < 1 || target > 3)
		return;

	normalizeCourseHoleTargets(courseID, hole);

	var maxDist = getMaxClubDist(0);
	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);

	if (target > 1)
	{
		maxDist = getMaxClubDist(1);
		lat1 = getCourseHoleTargetLat(courseID, hole, target - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, target - 1);
	}
	if (lat1 == 0 && lon1 == 0)
		return;

	var lat2 = getCourseHoleTargetLat(courseID, hole, target);
	var lon2 = getCourseHoleTargetLon(courseID, hole, target);
	if (lat2 == 0 && lon2 == 0)
	{
		lat2 = getCourseHolePinLat(courseID, hole);
		lon2 = getCourseHolePinLon(courseID, hole);
	}
	if (lat2 == 0 && lon2 == 0)
		return;

	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
		d = 1;
	var x = maxDist / d;
	setCourseHoleTargetLat(courseID, hole, target, lat1 + x*(lat2 - lat1));
	setCourseHoleTargetLon(courseID, hole, target, lon1 + x*(lon2 - lon1));
}

function setCourseHoleTargetDelta(courseID, hole, target, delta)
{
	if (hole < 1 || hole > 18 || target < 1 || target > 3)
		return;

	normalizeCourseHoleTargets(courseID, hole);

	var lat1 = getCourseHoleTeeLat(courseID, hole);
	var lon1 = getCourseHoleTeeLon(courseID, hole);

	if (target > 1)
	{
		lat1 = getCourseHoleTargetLat(courseID, hole, target - 1);
		lon1 = getCourseHoleTargetLon(courseID, hole, target - 1);
	}
	if (lat1 == 0 && lon1 == 0)
		return;

	var lat2 = getCourseHoleTargetLat(courseID, hole, target);
	var lon2 = getCourseHoleTargetLon(courseID, hole, target);
	if (lat2 == 0 && lon2 == 0)
		return;

	var d = geogDist(lat1, lon1, lat2, lon2);
	if (d < 1)
		d = 1;
	var x = (d + myUnitsToMetres(delta)) / d;
	setCourseHoleTargetLat(courseID, hole, target, lat1 + x*(lat2 - lat1));
	setCourseHoleTargetLon(courseID, hole, target, lon1 + x*(lon2 - lon1));
}

var heartbeatID = "";
var heartbeatSeconds = 0;
var heartbeatTotalSeconds = 0;

function startHeartbeat(id, seconds)
{
	heartbeatID = id.toString();
	heartbeatSeconds = seconds;
	heartbeatTotalSeconds = 0;
	window.setTimeout(doHeartbeat, heartbeatSeconds*1000);
}

function doHeartbeat()
{
	heartbeatTotalSeconds += heartbeatSeconds;
	if (heartbeatTotalSeconds > 3600) return;
	window.setTimeout(doHeartbeat, heartbeatSeconds*1000);
	var s = heartbeatTotalSeconds.toString();
	while (s.length < 4) s = "0" + s;
	var req = "hb";
	var params = heartbeatID + "=" + s;
	doXHR(req, params);
}

function doXHR(req, params)
{
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
				eval(xhr.responseText);
		}
		var url = "/xhr.php?req=" + req + "&" + params;
		xhr.open("GET", url, true);
		xhr.send();
	}
}

function evalLinkParams(id)
{
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
				eval(xhr.responseText);
		}
		var url = "/linkparameterslink.php?id=" + id;
		xhr.open("GET", url, false);
		xhr.send();
	}
}

async function newBingMapsImageryProviderSatelliteAsync()
{
	const provider = await Cesium.BingMapsImageryProvider.fromUrl('https://dev.virtualearth.net', { key: 'AtWs9L-vPKrFtFK7HdI0k99MVRO5ZHlEd9IOpL1JV_6Qt0CwFOaDK_0uUBeCX-j6', mapStyle: Cesium.BingMapsStyle.AERIAL});
	return provider;
}

async function newBingMapsImageryProviderMapAsync()
{
	const provider = await Cesium.BingMapsImageryProvider.fromUrl('https://dev.virtualearth.net', { key: 'AtWs9L-vPKrFtFK7HdI0k99MVRO5ZHlEd9IOpL1JV_6Qt0CwFOaDK_0uUBeCX-j6', mapStyle: Cesium.BingMapsStyle.ROAD_ON_DEMAND});
	return provider;
}

function newBingMapsImageryProviderSatellite()
{
	return new Cesium.BingMapsImageryProvider({ url: 'https://dev.virtualearth.net', key: 'AtWs9L-vPKrFtFK7HdI0k99MVRO5ZHlEd9IOpL1JV_6Qt0CwFOaDK_0uUBeCX-j6', mapStyle: Cesium.BingMapsStyle.AERIAL});
}

function newBingMapsImageryProviderMap()
{
	return new Cesium.BingMapsImageryProvider({ url: 'https://dev.virtualearth.net', key: 'AtWs9L-vPKrFtFK7HdI0k99MVRO5ZHlEd9IOpL1JV_6Qt0CwFOaDK_0uUBeCX-j6', mapStyle: Cesium.BingMapsStyle.ROAD_ON_DEMAND});
}

function newEsriImageryProviderSatellite(maxLevel = 18)
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{TileMatrix}/{TileRow}/{TileCol}?token=AAPKc57abd5563bd458ab178a78926b300afDEUodVJ7uLY9XkI85NpfYhxA48eyB4ojHaTEYz9C5EPyCfN_ec8xVBx7se46lGMp',
	layer : 'World_Imagery',
	style : 'default',
	tileMatrixSetID : '',
	maximumLevel : maxLevel,
	format : 'image/jpg',
	credit : new Cesium.Credit('Esri World Imagery')
	});
}

function newEsriImageryProviderSatelliteRect(rect, maxLevel = 18)
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{TileMatrix}/{TileRow}/{TileCol}?token=AAPKc57abd5563bd458ab178a78926b300afDEUodVJ7uLY9XkI85NpfYhxA48eyB4ojHaTEYz9C5EPyCfN_ec8xVBx7se46lGMp',
	layer : 'World_Imagery',
	style : 'default',
	tileMatrixSetID : '',
	rectangle : rect,
	maximumLevel : maxLevel,
	format : 'image/jpg',
	credit : new Cesium.Credit('Esri World Imagery')
	});
}

function newOSMImageryProviderMap(maxLevel = 18)
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://tile.openstreetmap.org/{TileMatrix}/{TileCol}/{TileRow}.png',
	layer : 'OSM',
	style : 'default',
	tileMatrixSetID : '',
	maximumLevel : maxLevel,
	format : 'image/png',
	credit : new Cesium.Credit('OpenStreetMap')
	});
}

function newEsriImageryProviderTerrain()
{
	return newNasaImageryProviderTerrain2();
	/*return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{TileMatrix}/{TileRow}/{TileCol}?token=AAPKc57abd5563bd458ab178a78926b300afDEUodVJ7uLY9XkI85NpfYhxA48eyB4ojHaTEYz9C5EPyCfN_ec8xVBx7se46lGMp',
	layer : 'World_Hillshade',
	style : 'default',
	tileMatrixSetID : '',
	maximumLevel : 16,
	format : 'image/jpg',
	credit : new Cesium.Credit('Esri World Imagery')
	});*/
}

function newNasaImageryProviderSatellite()
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer : '',
	style : 'default',
	tileMatrixSetID : 'GoogleMapsCompatible_Level9',
	maximumLevel : 9,
	format : 'image/jpg',
	credit : new Cesium.Credit('gibs.earthdata.nasa.gov')
	});
}

function newNasaImageryProviderTerrain()
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/ASTER_GDEM_Color_Shaded_Relief/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
	layer : '',
	style : 'default',
	tileMatrixSetID : 'GoogleMapsCompatible_Level12',
	maximumLevel : 12,
	format : 'image/jpg',
	credit : new Cesium.Credit('gibs.earthdata.nasa.gov')
	});
}

function newNasaImageryProviderTerrain2()
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/ASTER_GDEM_Color_Index/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
	layer : '',
	style : 'default',
	tileMatrixSetID : 'GoogleMapsCompatible_Level12',
	maximumLevel : 12,
	format : 'image/png',
	credit : new Cesium.Credit('gibs.earthdata.nasa.gov')
	});
}

function newNasaImageryProviderTerrain3()
{
	return new Cesium.WebMapTileServiceImageryProvider({
	url : 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SRTM_Color_Index/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
	layer : '',
	style : 'default',
	tileMatrixSetID : 'GoogleMapsCompatible_Level12',
	maximumLevel : 12,
	format : 'image/png',
	credit : new Cesium.Credit('gibs.earthdata.nasa.gov')
	});
}

function newSingleTileImageryProvider(url, credit, minLat, maxLat, minLon, maxLon)
{
	return new Cesium.SingleTileImageryProvider({
	url : url,
	rectangle : new Cesium.Rectangle(minLon, minLat, maxLon, maxLat),
	credit : new Cesium.Credit(credit)
	});
}


