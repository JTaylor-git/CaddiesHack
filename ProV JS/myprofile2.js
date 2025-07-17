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
	s += "<td align='left'>Left</td>";
	s += "<td align='left'>Right</td>";
	s += "<td align='left'>Long</td>";
	s += "<td align='left'>Short</td>";
	s += "<td align='center'>Shape</td>";
	s += "</tr>";
	s += "<tr>";
	s += "<td></td>";
	s += "<td>In The Bag</td>";
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
	var n = 0;
	document.getElementById('elevinput').value = Math.round(metresToMyElevUnits(getRefElevMetres())).toString();
	var k = elevDistFactor(getRefElevMetres());
	for (var i = 0; i <= 17; ++i)
	{
		if (showUnusedClubs || getClubFlag(i))
		{
			var id = i.toString();
			var name = getClubName(i);
			var flag = (getClubFlag(i) != 0 ? true : false);
			var spreadL = Math.round(k*getClubSpreadL(i));
			var spreadR = Math.round(k*getClubSpreadR(i));
			var spreadO = Math.round(k*getClubSpreadO(i));
			var spreadS = Math.round(k*getClubSpreadS(i));
			var shape = getClubShape(i);
			if (flag) ++n;

			s += "<tr>";
			s += "<td align='center'><input onclick='toggleClubFlag("+id+")' type='checkbox'"+(flag ? " checked='true'" : "")+"></td>";
			s += "<td><input type='textbox' style='width: 100px;' id='clubName"+id+"' value='"+name+"' onchange='setName("+id+")'></td>";
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
	s += "<td><input type='textbox' style='width: 100px;' value='"+n.toString()+"'></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadL()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadR()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadO()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetSpreadS()'>Reset</button></td>";
	s += "<td align='center'><button style='width: 100%;' onclick='resetShape()'>Reset</button></td>";
	s += "</tr>";
	document.getElementById('dispersiondiv').innerHTML = s;
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

function setShape(club, shape)
{
	if (club < 0) { for (var i = 0; i <= 17; ++i) setClubShape(i, shape); }
	else setClubShape(club, shape);
	refreshProfile();
}

function increaseSpreadL(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadL(i, getClubSpreadL(i)+1); }
	else setClubSpreadL(club, getClubSpreadL(club)+1);
	refreshProfile();
}

function decreaseSpreadL(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadL(i, getClubSpreadL(i)-1); }
	else setClubSpreadL(club, getClubSpreadL(club)-1);
	refreshProfile();
}

function increaseSpreadR(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadR(i, getClubSpreadR(i)+1); }
	else setClubSpreadR(club, getClubSpreadR(club)+1);
	refreshProfile();
}

function decreaseSpreadR(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadR(i, getClubSpreadR(i)-1); }
	else setClubSpreadR(club, getClubSpreadR(club)-1);
	refreshProfile();
}

function increaseSpreadO(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadO(i, getClubSpreadO(i)+1); }
	else setClubSpreadO(club, getClubSpreadO(club)+1);
	refreshProfile();
}

function decreaseSpreadO(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadO(i, getClubSpreadO(i)-1); }
	else setClubSpreadO(club, getClubSpreadO(club)-1);
	refreshProfile();
}

function increaseSpreadS(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadS(i, getClubSpreadS(i)+1); }
	else setClubSpreadS(club, getClubSpreadS(club)+1);
	refreshProfile();
}

function decreaseSpreadS(club)
{
	if (club < 0) { for (var i = 0; i <= 16; ++i) setClubSpreadS(i, getClubSpreadS(i)-1); }
	else setClubSpreadS(club, getClubSpreadS(club)-1);
	refreshProfile();
}

function resetSpreadL()
{
	if (!confirm("Reset Left Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadL(i, getClubSpreadLDefault(i));
	refreshProfile();
}

function resetSpreadR()
{
	if (!confirm("Reset Right Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadR(i, getClubSpreadRDefault(i));
	refreshProfile();
}

function resetSpreadO()
{
	if (!confirm("Reset Long Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadO(i, getClubSpreadODefault(i));
	refreshProfile();
}

function resetSpreadS()
{
	if (!confirm("Reset Short Spread?")) return;
	for (i = 0; i <= 16; ++i)
		setClubSpreadS(i, getClubSpreadSDefault(i));
	refreshProfile();
}

function resetShape()
{
	setShape(-1, 0);
}


