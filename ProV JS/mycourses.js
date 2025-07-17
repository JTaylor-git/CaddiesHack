

var scorecardIndex = -1;
var notesIndex = -1;
var deleteIndex = -1;
var linkIndex = -1;
var linkText = "";

function myCoursesOnLoadHandler()
{
	refreshCourses();
}

function refreshCourses()
{
	var t = document.getElementById("coursetable");
	var t2 = document.getElementById("tipstable");
	var t3 = document.getElementById("exporttable");

	while (t.rows.length > 0)
		t.deleteRow(0);

	var n = getNumCourses();

	if (n < 1)
	{
		var row = t.insertRow(0);
		row.align="center";
		row.valign="center";
		var c = row.insertCell(0);
		var s = "";
		s += "<div style='height: 30px;'></div>";
		s += "<p></p>";
		s += "You do not have any courses stored on this device.";
		s += "<p></p>";
		s += 'Please use <a href="2dplanner.php">2D Planner</a> or <a href="3dplanner.php">3D Planner</a> to map your courses.';
		s += "<p></p>";
		s += 'Or search for pre-mapped courses on our <a href="globalmap.php">Global Map</a> and <a href="features/atoz.php">A to Z Directory</a>.';
		c.innerHTML = s;
		t2.innerHTML = "";
		t3.innerHTML = "";
		return;
	}

	t.style.height = "";

	var j = 0;
	for (var i = -1; i < n; ++i) // First row is header.
	{
		var courseID = getCourseID(i);
		var row = t.insertRow(j++);
		var c0 = row.insertCell(0);
		var c1 = row.insertCell(1);
		var c2 = row.insertCell(2);
		var c3 = row.insertCell(3);
		var c4 = row.insertCell(4);
		var c5 = row.insertCell(5);
		var c6 = row.insertCell(6);
		var c7 = row.insertCell(7);
		var c8 = row.insertCell(8);
		var c9 = row.insertCell(9);
		var c10 = row.insertCell(10);
		if (i < 0)
		{
			c0.innerHTML = "&nbsp;Name";
			c1.innerHTML = "Holes";
			c2.innerHTML = myUnitName2();
			c3.innerHTML = "Par";
		}
		else
		{
			c0.innerHTML = '<input type="text" style="width: 250px;" value="' + getCourseName(i).toString() + '" id="nameinput' + i.toString() + '">';
			c1.innerHTML = '<input type="text" style="width: 50px;" value="' + getCourseHoles(courseID).toString() + '">';
			c2.innerHTML = '<input type="text" style="width: 50px;" value="' + getCourseLength(courseID).toString() + '">';
			c3.innerHTML = '<input type="text" style="width: 50px;" value="' + getCoursePar  (courseID).toString() + '">';
			c4.innerHTML = '<button onclick="scorecardHandler(' + i.toString() + ')">Scorecard</button>';
			c5.innerHTML = '<button onclick="notesHandler(' + i.toString() + ')">Notes</button>';
			c6.innerHTML = '<button onclick="yardageChartHandler(' + i.toString() + ')">Yardage&nbsp;Charts</button>';
			c7.innerHTML = '<button onclick="flyOverHandler(' + i.toString() + ')">KML</button>';
			c8.innerHTML = '<button onclick="linkHandler(' + i.toString() + ')">Link</button>';
			c9.innerHTML = '<button onclick="renameHandler(' + i.toString() + ')">Rename</button>';
			c10.innerHTML = '<button onclick="deleteHandler(' + i.toString() + ')">Delete</button>';
		}
		if (i >= 0 && i == linkIndex)
		{
			row = t.insertRow(j++);
			c0 = row.insertCell(0);
			c0.colSpan = '11';
			linkText = "https://www.provisualizer.com/course.php?" + courseLinkParameters(i,true,true,true);
			var s = '<table align="center"><tr><td align="center" style="padding-top: 30px; padding-bottom: 30px;">';
			s += '<input type="text" style="width: 350px;" value="' + linkText + '">';
			s += '<button onclick="linkCopyHandler(' + i.toString() + ')">Copy&nbsp;to&nbsp;Clipboard</button>';
			s += '<button onclick="linkViewHandler(' + i.toString() + ')">View&nbsp;Course</button>';
			s += '<button onclick="linkCancelHandler(' + i.toString() + ')">Cancel</button>';
			s += '</td></tr></table>';
			c0.innerHTML = s;
		}
		if (i >= 0 && i == deleteIndex)
		{
			row = t.insertRow(j++);
			c0 = row.insertCell(0);
			c0.colSpan = '11';
			var s = '<table align="center"><tr><td align="center" style="padding-top: 30px; padding-bottom: 30px;">';
			s += "Delete " + getCourseName(i) + "? ";
			s += '<button style="width: 80px;" onclick="deleteConfirmHandler(' + i.toString() + ')">Yes</button>';
			s += '<button style="width: 80px;" onclick="deleteCancelHandler(' + i.toString() + ')">No</button>';
			s += '</td></tr></table>';
			c0.innerHTML = s;
		}
		if (i >= 0 && i == scorecardIndex)
		{
			row = t.insertRow(j++);
			c0 = row.insertCell(0);
			c0.colSpan = '11';
			var w = ' align="center" style="width: 50px;" ';
			var s = '<table align="center">';
			s += '<tr><td'+w+'>Hole</td><td'+w+'>'+myUnitName2()+'</td><td'+w+'>Par</td>';
			s += '<td'+w+'>Hole</td><td'+w+'>'+myUnitName2()+'</td><td'+w+'>Par</td></tr>';
			var frontNineLength = 0;
			var frontNinePar = 0;
			var backNineLength = 0;
			var backNinePar = 0;
			for (var k = 1; k <= 9; ++k)
			{
				var length1 = getCourseHoleLength(courseID, k);
				var par1 = getCourseHolePar(courseID, k);
				var length2 = getCourseHoleLength(courseID, k + 9);
				var par2 = getCourseHolePar(courseID, k + 9);
				s += '<tr><td'+w+'>'+ k.toString()+'</td><td'+w+'>'+length1.toString()+'</td><td'+w+'>'+par1.toString()+'</td>';
				s += '<td'+w+'>'+(k+9).toString()+'</td><td'+w+'>'+length2.toString()+'</td><td'+w+'>'+par2.toString()+'</td></tr>';
				frontNineLength += length1;
				frontNinePar += par1;
				backNineLength += length2;
				backNinePar += par2;
			}
			s += '<tr><td'+w+'></td><td'+w+'>'+frontNineLength.toString()+'</td><td'+w+'>'+frontNinePar.toString()+'</td>';
			s += '<td'+w+'></td><td'+w+'>'+backNineLength.toString()+'</td><td'+w+'>'+backNinePar.toString()+'</td></tr>';
			s += '</table>';
			c0.innerHTML = s;
		}
		if (i >= 0 && i == notesIndex)
		{
			row = t.insertRow(j++);
			c0 = row.insertCell(0);
			c0.colSpan = '11';
			var s = '<table align="center">';
			for (var hole = 1; hole <= 18; ++hole)
			{
				var par = getCourseHolePar(courseID, hole);
				if (par >= 3)
				{
					var len = getCourseHoleLength(courseID, hole);
					var info = "Hole " + hole.toString() + ", Par " + par.toString() + ", " + len.toString() + " " + myUnitName();
					if (par >= 4)
					{
						info += " (";
						for (var shot = 1; shot <= par - 2; ++shot)
						{
							if (shot > 1) info += " + ";
							info += getCourseHoleShotLength(courseID, hole, shot).toString();
						}
						info += ")";
					}
					var notes = getCourseHoleNotes(courseID, hole);
					notes = notes.replace(/z1z/g, "&");
					notes = notes.replace(/z2z/g, "'");
					notes = notes.replace(/z3z/g, '"');
					notes = notes.replace(/z4z/g, '|');
					s += '<tr><td align="left" valign="top">'+info.toString()+'</td>';
					s += '<td align="left" valign="top">'+notes.toString()+'</td></tr>';
				}
			}
			s += '</table>';
			c0.innerHTML = s;
		}
	}
}

function courseLinkParameters(i, includeMeasures, includeSymbols, includeNotes)
{
	var id = getCourseID(i);
	var s = "n=" + encodeURIComponent(getCourseName(i));
	s += "&c=";
	var prevLat = 0;
	var prevLon = 0;
	for (var hole = 1; hole <= 18; ++hole)
	{
		var teeLat = getCourseHoleTeeLat(id, hole);
		var teeLon = getCourseHoleTeeLon(id, hole);
		var pinLat = getCourseHolePinLat(id, hole);
		var pinLon = getCourseHolePinLon(id, hole);

		if (teeLat != 0 || teeLon != 0)
		{
			var x = Math.round((teeLat - prevLat) * 1111111 + 5000);
			var y = Math.round((teeLon - prevLon) * 1111111 + 5000);
			s += x.toString() + ",";
			s += y.toString() + ",";
			prevLat = (x - 5000) / 1111111 + prevLat;
			prevLon = (y - 5000) / 1111111 + prevLon;
		}
		else
		{
			s += ",,";
		}

		if (pinLat != 0 || pinLon != 0)
		{
			var x = Math.round((pinLat - prevLat) * 1111111 + 5000);
			var y = Math.round((pinLon - prevLon) * 1111111 + 5000);
			s += x.toString() + ",";
			s += y.toString() + ",";
			prevLat = (x - 5000) / 1111111 + prevLat;
			prevLon = (y - 5000) / 1111111 + prevLon;
		}
		else
		{
			s += ",,";
		}

		for (var target = 1; target <= 3; ++target)
		{
			var targetLat = getCourseHoleTargetLat(id, hole, target);
			var targetLon = getCourseHoleTargetLon(id, hole, target);

			if (targetLat != 0 || targetLon != 0)
			{
				var x = Math.round((targetLat - prevLat) * 1111111 + 5000);
				var y = Math.round((targetLon - prevLon) * 1111111 + 5000);
				s += x.toString() + ",";
				s += y.toString() + ",";
				prevLat = (x - 5000) / 1111111 + prevLat;
				prevLon = (y - 5000) / 1111111 + prevLon;
			}
			else
			{
				s += ",,";
			}
		}
	}
	if (includeMeasures) s += courseMeasureParameters(i);
	if (includeSymbols) s += courseSymbolParameters(i);
	if (includeNotes) s += courseNoteParameters(i);
	s += "&v=2";
	return s;
}

function courseMeasureParameters(i)
{
	var id = getCourseID(i);
	var s = "";
	for (var hole = 1; hole <= 18; ++hole)
	{
		var n = getCourseHoleMeasures(id, hole);
		var teeLat = getCourseHoleTeeLat(id, hole);
		var teeLon = getCourseHoleTeeLon(id, hole);
		for (var i = 0; i < n; ++i)
		{
			var m = getCourseHoleMeasure(id, hole, i);
			var x = decodeMeasure(m);
			x.lat1 -= teeLat; x.lon1 -= teeLon;
			x.lat2 -= teeLat; x.lon2 -= teeLon;
			var m2 = encodeMeasure(x.lat1,x.lon1,x.lat2,x.lon2);
			s += hole.toString() + "," + m2 + ",";
		}
	}
	if (s != "") s = "&m=" + s;
	return s;
}

function courseSymbolParameters(i)
{
	var id = getCourseID(i);
	var s = "";
	for (var hole = 1; hole <= 18; ++hole)
	{
		var n = getCourseHoleSymbols(id, hole);
		var pinLat = getCourseHolePinLat(id, hole);
		var pinLon = getCourseHolePinLon(id, hole);
		for (var i = 0; i < n; ++i)
		{
			var m = getCourseHoleSymbol(id, hole, i);
			var x = decodeSymbol(m);
			x.lat -= pinLat;
			x.lon -= pinLon;
			var m2 = encodeSymbol(x.lat,x.lon,x.symbol);
			s += hole.toString() + "," + m2 + ",";
		}
	}
	if (s != "") s = "&s=" + s;
	return s;
}

function courseNoteParameters(i)
{
	var id = getCourseID(i);
	var s = "";
	var n = 0;
	for (var hole = 0; hole <= 18; ++hole)
	{
		var notes = getCourseHoleNotes(id, hole);
		if (notes != null && notes != "") { s += encodeURIComponent(notes); n += 1; }
		s += '|';
	}
	if (n > 0) s = "&t=" + s;
	else s = "";
	return s;
}

function scorecardHandler(i)
{
	notesIndex = -1;
	linkIndex = -1;
	deleteIndex = -1;
	if (i == scorecardIndex) scorecardIndex = -1;
	else scorecardIndex = i;
	refreshCourses();
}

function notesHandler(i)
{
	scorecardIndex = -1;
	linkIndex = -1;
	deleteIndex = -1;
	if (i == notesIndex) notesIndex = -1;
	else notesIndex = i;
	refreshCourses();
}

function yardageChartHandler(i)
{
	window.location.href = "yardagechart.php?" + courseLinkParameters(i, true, true, true);
}

function flyOverHandler(i)
{
	window.location.href = "flyover.php?" + courseLinkParameters(i, false, false, false);
}

function linkHandler(i)
{
	deleteIndex = -1;
	scorecardIndex = -1;
	notesIndex = -1;
	if (i == linkIndex) linkIndex = -1;
	else linkIndex = i;
	refreshCourses();
}

function linkCopyHandler(i)
{
	navigator.clipboard.writeText(linkText);
}

function linkViewHandler(i)
{
	window.location.href = "course.php?" + courseLinkParameters(i, true, true, true);
}

function linkCancelHandler(i)
{
	linkIndex = -1;
	deleteIndex = -1;
	scorecardIndex = -1;
	notesIndex = -1;
	refreshCourses();
}

function renameHandler(i)
{
	var newName = document.getElementById("nameinput" + i.toString()).value;
	if (newName == getCourseName(i))
	{
		alert('Name has not changed.');
		return;
	}
	var id1 = getCourseID(i);
	var id2 = getCourseIDFromName(newName);
	if (id2 > 0 && id2 != id1)
	{
		alert('Name already exists.\nPlease enter unique name.');
		return;
	}
	renameCourse(i, newName);
	linkIndex = -1;
	deleteIndex = -1;
	scorecardIndex = -1;
	notesIndex = -1;
	refreshCourses();
}

function deleteHandler(i)
{
	linkIndex = -1;
	deleteIndex = i;
	scorecardIndex = -1;
	notesIndex = -1;
	refreshCourses();
}

function deleteConfirmHandler(i)
{
	var courseID = getCourseID(i);
	deleteCourse(courseID);
	linkIndex = -1;
	deleteIndex = -1;
	scorecardIndex = -1;
	notesIndex = -1;
	refreshCourses();
}

function deleteCancelHandler(i)
{
	linkIndex = -1;
	deleteIndex = -1;
	scorecardIndex = -1;
	notesIndex = -1;
	refreshCourses();
}

function exportHandler(i)
{
	window.location.href = "export.php";
}


