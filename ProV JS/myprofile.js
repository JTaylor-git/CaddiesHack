var showUnusedClubs = true;

function myProfileOnloadHandler()
{
	loadProfile();
}

function loadProfile()
{
	initProfile();
	populateProfileSelect();
	setSelectedUnits();
	refreshProfile();
}

function populateProfileSelect()
{
	var x = document.getElementById('profileselect');
	
	while (x.length > 0)
		x.remove(x.length - 1);

	var n = getNumProfiles();
	var aid = getActiveProfileID();
	for (var i = 0; i < n; ++i)
	{
		var id = getProfileID(i);
		var name = getProfileName(id);
		var j = 0;
		while (j < x.length && name > x.options[j].text)
			++j;
		if (j < x.length)
			x.add(new Option(name, id), j);
		else
			x.add(new Option(name, id));
	}
	var ai = 0;
	for (var i = 0; i < x.length; ++i)
	{
		if (x.options[i].value == aid)
			ai = i;
	}
	x.selectedIndex = ai;
}

function selectProfileHandler()
{
	document.getElementById('renameprofilediv').style.display = 'none';
	document.getElementById('copyprofilediv').style.display = 'none';
	document.getElementById('newprofilediv').style.display = 'none';
	document.getElementById('deleteprofilediv').style.display = 'none';
	setActiveProfileID(document.getElementById('profileselect').value);
	loadProfile();
}

function setSelectedUnits()
{
	document.getElementById('unitselect').selectedIndex = (getDistanceUnit() == "m" ? 1 : 0);
	document.getElementById('elevunitselect').selectedIndex = (getElevationUnit() == "m" ? 1 : 0);
}

function selectUnitHandler()
{
	setDistanceUnit(document.getElementById('unitselect').selectedIndex == 1 ? "m" : "y");
	refreshProfile();
}

function elevChangeHandler()
{
	var s = document.getElementById('elevinput').value;
	var e = 0;
	if (s != null || !isNaN(s))
	{
		e = myElevUnitsToMetres(Number(s));
		if (e < 0) e = 0;
		if (e > 5000) e = 5000;
	}
	setRefElevMetres(e);
	refreshProfile();
}

function selectElevUnitHandler()
{
	setElevationUnit(document.getElementById('elevunitselect').selectedIndex == 1 ? "m" : "f");
	refreshProfile();
}

function renameProfileHandler()
{
	document.getElementById('renameprofileinput').value = '';
	document.getElementById('copyprofilediv').style.display = 'none';
	document.getElementById('newprofilediv').style.display = 'none';
	document.getElementById('deleteprofilediv').style.display = 'none';
	document.getElementById('renameprofilediv').style.display = '';
}

function confirmRenameProfile()
{
	var name = cleanString(document.getElementById("renameprofileinput").value);
	if (name == "")
	{
		alert("Please enter profile name.");
		return;
	}
	if (getProfileIDFromName(name) >= 0)
	{
		alert(name + " already exists.\nPlease enter unique name.");
		return;
	}
	var id = document.getElementById('profileselect').value;
	setProfileName(id, name);
	setActiveProfileID(id);
	document.getElementById('renameprofilediv').style.display = 'none';
	loadProfile();
}

function cancelRenameProfile()
{
	document.getElementById('renameprofilediv').style.display = 'none';
	loadProfile();
}

function copyProfileHandler()
{
	document.getElementById('copyprofileinput').value = '';
	document.getElementById('renameprofilediv').style.display = 'none';
	document.getElementById('newprofilediv').style.display = 'none';
	document.getElementById('deleteprofilediv').style.display = 'none';
	document.getElementById('copyprofilediv').style.display = '';
}

function confirmCopyProfile()
{
	var name = cleanString(document.getElementById("copyprofileinput").value);
	if (name == "")
	{
		alert("Please enter profile name.");
		return;
	}
	if (getProfileIDFromName(name) >= 0)
	{
		alert(name + " already exists.\nPlease enter unique name.");
		return;
	}
	var n = getNumProfiles();
	var id1 = document.getElementById('profileselect').value;
	var id2 = getFirstFreeProfileID();
	copyProfileByID(id1, id2);
	setProfileName(id2, name);
	setProfileID(n, id2);
	setNumProfiles(n + 1);
	setActiveProfileID(id2);
	document.getElementById('copyprofilediv').style.display = 'none';
	loadProfile();
}

function cancelCopyProfile()
{
	document.getElementById('copyprofilediv').style.display = 'none';
	loadProfile();
}

function newProfileHandler()
{
	document.getElementById('newprofileinput').value = '';
	document.getElementById('renameprofilediv').style.display = 'none';
	document.getElementById('deleteprofilediv').style.display = 'none';
	document.getElementById('copyprofilediv').style.display = 'none';
	document.getElementById('newprofilediv').style.display = '';
}

function confirmNewProfile()
{
	var name = cleanString(document.getElementById("newprofileinput").value);
	if (name == "")
	{
		alert("Please enter profile name.");
		return;
	}
	if (getProfileIDFromName(name) >= 0)
	{
		alert(name + " already exists.\nPlease enter unique name.");
		return;
	}
	var n = getNumProfiles();
	var id = getFirstFreeProfileID();
	initProfileByID(id);
	setProfileName(id, name);
	setProfileID(n, id);
	setNumProfiles(n + 1);
	setActiveProfileID(id);
	document.getElementById('newprofilediv').style.display = 'none';
	loadProfile();
}

function cancelNewProfile()
{
	document.getElementById('newprofilediv').style.display = 'none';
}

function deleteProfileHandler()
{
	var n = getNumProfiles();
	if (n < 2)
	{
		alert("You must always have at least one profile.\nPlease create a new profile before deleting this profile.");
		return;
	}
	var id = document.getElementById('profileselect').value;
	var name = getProfileName(id);
	document.getElementById('deleteprofiletextdiv').innerHTML = "Delete " + name + "?";
	document.getElementById('renameprofilediv').style.display = 'none';
	document.getElementById('copyprofilediv').style.display = 'none';
	document.getElementById('newprofilediv').style.display = 'none';
	document.getElementById('deleteprofilediv').style.display = '';
}

function confirmDeleteProfile()
{
	var id = document.getElementById('profileselect').value;
	deleteProfileByID(id);
	setActiveProfileID(0);
	document.getElementById('deleteprofilediv').style.display = 'none';
	loadProfile();
}

function cancelDeleteProfile()
{
	document.getElementById('deleteprofilediv').style.display = 'none';
}

function showHideUnusedClubs()
{
	showUnusedClubs = !showUnusedClubs;
	refreshProfile();
	var y = document.getElementById("showhidebutton");
	if (showUnusedClubs)
		y.innerHTML = "Hide Unused Clubs";
	else
		y.innerHTML = "Show Unused Clubs";
}

function refreshProfile()
{
	var s = "";
	s += "<tr>";
	s += "<td></td>";
	s += "<td></td>";
	s += "<td align='left'>Carry</td>";
	s += "<td align='left'>Run</td>";
	s += "<td align='left'>Total</td>";
	s += "</tr>";
	s += "<tr>";
	s += "<td></td>";
	s += "<td>In The Bag</td>";
	s += "<td><button style='width: 50%;' onclick='increaseCarry(-1)'>+</button>";
	s +=     "<button style='width: 50%;' onclick='decreaseCarry(-1)'>-</button>";
	s += "</td>";
	s += "<td><button style='width: 50%;' onclick='increaseRun(-1)'>+</button>";
	s+=      "<button style='width: 50%;' onclick='decreaseRun(-1)'>-</button>";
	s += "</td>";
	s += "<td><button style='width: 50%;' onclick='increaseCarry(-1)'>+</button>";
	s +=     "<button style='width: 50%;' onclick='decreaseCarry(-1)'>-</button>";
	s += "</td>";
	s += "</tr>";
	var n = 0;
	document.getElementById('elevinput').value = Math.round(metresToMyElevUnits(getRefElevMetres())).toString();
	var k = elevDistFactor(getRefElevMetres());
	for (var i = 0; i <= 17; ++i)
	{
		if (showUnusedClubs || getClubFlag(i))
		{
			var id    = i.toString();
			var flag  = (getClubFlag(i) != 0 ? true : false);
			var name  = getClubName(i);
			var carry = Math.round(k*getClubCarry(i)).toString();
			var run   = Math.round(k*getClubRun(i)).toString();
			var total = Math.round(k*getClubTotal(i)).toString();
			if (flag) ++n;

			s += '<tr id="clubRow'+i+'">';
			s += "<td align='center'><input onclick='toggleClubFlag("+id+")' type='checkbox'"+(flag ? " checked='true'" : "")+"></td>";
			s += '<td><input type="textbox" style="width: 100px;" id= "clubName'+id+'" value="'+name+'" onchange="setName('+id+')"></td>';
			s += '<td><input type="textbox" style="width: 100px;" id="clubCarry'+id+'" value="'+carry+'" onchange="setCarry('+id+')"><button onclick="increaseCarry('+id+')">+</button><button onclick="decreaseCarry('+id+')">-</button></td>';
			s += '<td><input type="textbox" style="width: 100px;" id=  "clubRun'+id+'" value="'+run+'" onchange="setRun('+id+')"><button onclick="increaseRun('+id+')">+</button><button onclick="decreaseRun('+id+')">-</button></td>';
			s += '<td><input type="textbox" style="width: 100px;" id="clubTotal'+id+'" value="'+total+'" onchange="setTotal('+id+')"><button onclick="increaseCarry('+id+')">+</button><button onclick="decreaseCarry('+id+')">-</button></td>';
			s += '</tr>';
			s += "</td></tr>";
		}
	}
	s += "<tr>";
	s += "<td></td>";
	s += '<td><input type="textbox" style="width: 100px;" value="'+n.toString()+'"></td>';
	s += "<td><button style='width: 100%;' onclick='resetCarry(-1)'>Reset</button></td>";
	s += "<td><button style='width: 100%;' onclick='resetRun(-1)'>Reset</button></td>";
	s += "<td><button style='width: 100%;' onclick='resetTotal(-1)'>Reset</button></td>";
	s += "</tr>";
	document.getElementById('distancediv').innerHTML = s;
}

function toggleClubFlag(club)
{
	setClubFlag(club, !getClubFlag(club));
	refreshProfile();
}

function setName(clubID)
{
	var name = document.getElementById('clubName' + clubID.toString()).value;
	setClubName(clubID, name);
	loadProfile();
}

function resetCarry()
{
	if (!confirm("Reset Carry?")) return;
	setDefaultCarry();
	loadProfile();
}

function resetRun()
{
	if (!confirm("Reset Run?")) return;
	setDefaultRun();
	loadProfile();
}

function resetTotal()
{
	if (!confirm("Reset Carry and Run?")) return;
	setDefaultCarry();
	setDefaultRun();
	loadProfile();
}

function setCarry(clubID)
{
	var x = Number(document.getElementById('clubCarry' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000)
		setClubCarry(clubID, x/k);
	loadProfile();
}

function setRun(clubID)
{
	var x = Number(document.getElementById('clubRun' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000)
		setClubRun(clubID, x/k);
	loadProfile();
}

function setTotal(clubID)
{
	var x = Number(document.getElementById('clubTotal' + clubID.toString()).value);
	var y = Number(document.getElementById('clubRun' + clubID.toString()).value);
	var k = elevDistFactor(getRefElevMetres());
	if (x != NaN && x >= 0 && x < 1000 && y != NaN && y >= 0 && y < 1000 && x >= y)
		setClubCarry(clubID, (x - y)/k);
	loadProfile();
}

function increaseCarry(clubID)
{
	if (clubID >= 0)
	{
		setClubCarry(clubID, getClubCarry(clubID) + 1);
	}
	else
	{
		for (var i = 0; i <= 16; ++i)
			setClubCarry(i, getClubCarry(i) + 1);
	}
	loadProfile();
}

function decreaseCarry(clubID)
{
	if (clubID >= 0)
	{
		setClubCarry(clubID, getClubCarry(clubID) - 1);
	}
	else
	{
		for (var i = 0; i <= 16; ++i)
			setClubCarry(i, getClubCarry(i) - 1);
	}
	loadProfile();
}

function increaseRun(clubID)
{
	if (clubID >= 0)
	{
		setClubRun(clubID, getClubRun(clubID) + 1);
	}
	else
	{
		for (var i = 0; i <= 16; ++i)
			setClubRun(i, getClubRun(i) + 1);
	}
	loadProfile();
}

function decreaseRun(clubID)
{
	if (clubID >= 0)
	{
		if (getClubRun(clubID) > 0)
			setClubRun(clubID, getClubRun(clubID) - 1);
	}
	else
	{
		for (var i = 0; i <= 16; ++i)
		{
			if (getClubRun(i) > 0)
				setClubRun(i, getClubRun(i) - 1);
		}
	}
	loadProfile();
}



