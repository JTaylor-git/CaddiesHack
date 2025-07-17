var terrainSources = [];
var terrainURLs = [];

terrainSources[0] = "SRTM 1 Arc-Second Global Dataset";
terrainURLs[0] = "https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm-1";

terrainSources[1] = "USGS 3D Elevation Program";
terrainURLs[1] = "https://www.usgs.gov/3d-elevation-program";

terrainSources[2] = "UK National LIDAR Programme";
terrainURLs[2] = "https://environment.data.gov.uk/dataset/2e8d0733-4f43-48b4-9e51-631c25d1b0a9";

terrainSources[3] = "UK National LIDAR Programme";
terrainURLs[3] = "https://remotesensingdata.gov.scot";

var terrainList = [];

function shiftTerrain(dx,dy)
{
	var i = terrainList.length - 1;
	var minLat2 = moveLat(terrainList[i].minLat, terrainList[i].minLon, dy, 0);
	var maxLat2 = moveLat(terrainList[i].maxLat, terrainList[i].maxLon, dy, 0);
	var minLon2 = moveLon(terrainList[i].minLat, terrainList[i].minLon, dx, 90);
	var maxLon2 = moveLon(terrainList[i].maxLat, terrainList[i].maxLon, dx, 90);
	terrainList[i].minLat = minLat2;
	terrainList[i].minLon = minLon2;
	terrainList[i].maxLat = maxLat2;
	terrainList[i].maxLon = maxLon2;
}

function smoothTerrain(k) // 1.0 = normal, 2.0 = twice normal, etc. 
{
	var i = terrainList.length - 1;
	terrainList[i].smoothingFactor = k;
}

// These have high-def terrain with green slopes/contours and putting simulation:

// England
terrainList.push({name:'AddingtonPalace.mm',source:2,minLat:51.353769,minLon:-0.057724,maxLat:51.367902,maxLon:-0.029469,numLat:1574,numLon:1964}); shiftTerrain(2.5,1);
terrainList.push({name:'Aldeburgh.mm',source:2,minLat:52.162098,minLon:1.565486,maxLat:52.173161,maxLon:1.59412,numLat:1232,numLon:1955}); shiftTerrain(3,3);
terrainList.push({name:'Alwoodley.mm',source:2,minLat:53.858487,minLon:-1.528418,maxLat:53.869096,maxLon:-1.494976,numLat:1182,numLon:2195}); shiftTerrain(-1,2.5);
terrainList.push({name:'Arscott.mm',source:2,minLat:52.664785,minLon:-2.852592,maxLat:52.677438,maxLon:-2.832938,numLat:1409,numLon:1327}); shiftTerrain(1,2);
terrainList.push({name:'AxeCliff.mm',source:2,minLat:50.701061,minLon:-3.058011,maxLat:50.711866,maxLon:-3.04116,numLat:1203,numLon:1189});
terrainList.push({name:'BartonOnSea.mm',source:2,minLat:50.730116,minLon:-1.655853,maxLat:50.74128,maxLon:-1.626373,numLat:1243,numLon:2077}); shiftTerrain(1,0);
terrainList.push({name:'Bedale.mm',source:2,minLat:54.282603,minLon:-1.615752,maxLat:54.294841,maxLon:-1.593999,numLat:1363,numLon:1414}); shiftTerrain(0,1.5);
terrainList.push({name:'BelfryBrabazon.mm',source:2,minLat:52.552477,minLon:-1.745416,maxLat:52.564862,maxLon:-1.726874,numLat:1379,numLon:1255}); shiftTerrain(1,2);
terrainList.push({name:'BelfryDerby.mm',source:2,minLat:52.559544,minLon:-1.748104,maxLat:52.569398,maxLon:-1.726071,numLat:1098,numLon:1491}); shiftTerrain(1,2);
terrainList.push({name:'BelfryPGANational.mm',source:2,minLat:52.553797,minLon:-1.744316,maxLat:52.574546,maxLon:-1.723491,numLat:2309,numLon:1410}); shiftTerrain(1,2);
terrainList.push({name:'Berkhamsted.mm',source:2,minLat:51.766775,minLon:-0.555023,maxLat:51.781808,maxLon:-0.53102,numLat:1674,numLon:1653}); shiftTerrain(1,1);
terrainList.push({name:'BewdleyPines.mm',source:2,minLat:52.384652,minLon:-2.301958,maxLat:52.396865,maxLon:-2.285124,numLat:1360,numLon:1144}); shiftTerrain(1,2);
terrainList.push({name:'BishopAuckland.mm',source:2,minLat:54.662714,minLon:-1.667315,maxLat:54.672074,maxLon:-1.645861,numLat:1043,numLon:1382}); shiftTerrain(0,1.5);
terrainList.push({name:'Boldon.mm',source:2,minLat:54.931722,minLon:-1.453988,maxLat:54.944357,maxLon:-1.438944,numLat:1407,numLon:963}); shiftTerrain(0,1.5);
terrainList.push({name:'Bondhay.mm',source:2,minLat:53.292031,minLon:-1.238533,maxLat:53.308264,maxLon:-1.220266,numLat:1807,numLon:1216}); shiftTerrain(0,3);
terrainList.push({name:'BrackenGhyll.mm',source:2,minLat:53.945119,minLon:-1.908588,maxLat:53.958502,maxLon:-1.887506,numLat:1490,numLon:1381});
terrainList.push({name:'BramptonPark.mm',source:2,minLat:52.308799,minLon:-0.226676,maxLat:52.324881,maxLon:-0.203842,numLat:1790,numLon:1554}); shiftTerrain(1,1);
terrainList.push({name:'BrickhamptonCourt.mm',source:2,minLat:51.889759,minLon:-2.205485,maxLat:51.901969,maxLon:-2.174399,numLat:1360,numLon:2135});
terrainList.push({name:'BrookmansPark.mm',source:2,minLat:51.720759,minLon:-0.203304,maxLat:51.731249,maxLon:-0.184153,numLat:1168,numLon:1321}); shiftTerrain(0.5,0);
terrainList.push({name:'Bungay.mm',source:2,minLat:52.455889,minLon:1.412271,maxLat:52.467934,maxLon:1.431878,numLat:1341,numLon:1330}); shiftTerrain(2,3);
terrainList.push({name:'BurghamPark.mm',source:2,minLat:55.258802,minLon:-1.748848,maxLat:55.271636,maxLon:-1.717769,numLat:1429,numLon:1971}); shiftTerrain(0,1);
terrainList.push({name:'BurnhamAndBerrow.mm',source:2,minLat:51.25043,minLon:-3.021172,maxLat:51.277194,maxLon:-2.999736,numLat:2978,numLon:1493}); shiftTerrain(-1,1);
terrainList.push({name:'CameDown.mm',source:2,minLat:50.668187,minLon:-2.454022,maxLat:50.684968,maxLon:-2.435543,numLat:1868,numLon:1304}); shiftTerrain(1,0);
terrainList.push({name:'CastleHawk.mm',source:2,minLat:53.584479,minLon:-2.200823,maxLat:53.593197,maxLon:-2.180245,numLat:971,numLon:1360}); shiftTerrain(1,1);
terrainList.push({name:'Centurion.mm',source:2,minLat:51.727916,minLon:-0.410258,maxLat:51.742924,maxLon:-0.390895,numLat:1671,numLon:1335}); shiftTerrain(1,1);
terrainList.push({name:'Chevin.mm',source:2,minLat:52.992651,minLon:-1.502514,maxLat:53.012155,maxLon:-1.482897,numLat:2171,numLon:1315}); shiftTerrain(0.5,2.5);
terrainList.push({name:'CleeveHill.mm',source:2,minLat:51.926505,minLon:-2.02716,maxLat:51.945076,maxLon:-2.006642,numLat:2067,numLon:1409});
terrainList.push({name:'CloseHouseColt.mm',source:2,minLat:54.981009,minLon:-1.822554,maxLat:54.994936,maxLon:-1.801267,numLat:1551,numLon:1360}); shiftTerrain(1,0);
terrainList.push({name:'CloseHouseFilly.mm',source:2,minLat:54.978172,minLon:-1.80871,maxLat:54.990263,maxLon:-1.788611,numLat:1346,numLon:1284}); shiftTerrain(1,0);
terrainList.push({name:'Cockermouth.mm',source:2,minLat:54.660658,minLon:-3.318576,maxLat:54.668355,maxLon:-3.288205,numLat:858,numLon:1955}); shiftTerrain(1,1);
terrainList.push({name:'CowdrayPark.mm',source:2,minLat:50.989797,minLon:-0.723856,maxLat:51.000964,maxLon:-0.699067,numLat:1244,numLon:1737}); shiftTerrain(2,-0.5);
terrainList.push({name:'CrewsHill.mm',source:2,minLat:51.674392,minLon:-0.117245,maxLat:51.687057,maxLon:-0.102031,numLat:1410,numLon:1051}); shiftTerrain(2.5,1);
terrainList.push({name:'CrondonPark.mm',source:2,minLat:51.668837,minLon:0.42918,maxLat:51.681431,maxLon:0.447836,numLat:1402,numLon:1288}); shiftTerrain(2,1);
terrainList.push({name:'CrookhillPark.mm',source:2,minLat:53.465787,minLon:-1.22235,maxLat:53.474357,maxLon:-1.202415,numLat:955,numLon:1321}); shiftTerrain(0,2);
terrainList.push({name:'Cuddington.mm',source:2,minLat:51.328956,minLon:-0.231641,maxLat:51.344471,maxLon:-0.210094,numLat:1727,numLon:1499}); shiftTerrain(1,0);
terrainList.push({name:'Denton.mm',source:2,minLat:53.45553,minLon:-2.151854,maxLat:53.466968,maxLon:-2.134591,numLat:1274,numLon:1145}); shiftTerrain(1,2);
terrainList.push({name:'DurhamCity.mm',source:2,minLat:54.740205,minLon:-1.608391,maxLat:54.753775,maxLon:-1.588731,numLat:1511,numLon:1264}); shiftTerrain(0,2);
terrainList.push({name:'Eaglescliffe.mm',source:2,minLat:54.518466,minLon:-1.352788,maxLat:54.528802,maxLon:-1.333564,numLat:1151,numLon:1243}); shiftTerrain(0,2);
terrainList.push({name:'EastBrighton.mm',source:2,minLat:50.814498,minLon:-0.101834,maxLat:50.83391,maxLon:-0.080504,numLat:2161,numLon:1500}); shiftTerrain(2,0);
terrainList.push({name:'ElyCity.mm',source:2,minLat:52.383756,minLon:0.24589,maxLat:52.396462,maxLon:0.26425,numLat:1415,numLon:1248}); shiftTerrain(0,0);
terrainList.push({name:'Farnham.mm',source:2,minLat:51.206695,minLon:-0.745748,maxLat:51.220139,maxLon:-0.722567,numLat:1497,numLon:1617}); shiftTerrain(1,1);
terrainList.push({name:'FelixstoweFerryMartello.mm',source:2,minLat:51.974934,minLon:1.378492,maxLat:51.991167,maxLon:1.391643,numLat:1807,numLon:903}); shiftTerrain(2.5,2.5);
terrainList.push({name:'ForestOfArden.mm',source:2,minLat:52.455144,minLon:-1.679232,maxLat:52.473171,maxLon:-1.64745,numLat:2007,numLon:2155}); shiftTerrain(1.5,2);
terrainList.push({name:'ForestPines.mm',source:2,minLat:53.547812,minLon:-0.582355,maxLat:53.558647,maxLon:-0.554884,numLat:1207,numLon:1817}); shiftTerrain(0,2);
terrainList.push({name:'FoxhillsBernardHunt.mm',source:2,minLat:51.371753,minLon:-0.556068,maxLat:51.381253,maxLon:-0.532825,numLat:1058,numLon:1615});
terrainList.push({name:'FoxhillsLongcross.mm',source:2,minLat:51.370923,minLon:-0.568132,maxLat:51.382347,maxLon:-0.544411,numLat:1272,numLon:1648});
terrainList.push({name:'Ganton.mm',source:2,minLat:54.18038,minLon:-0.504202,maxLat:54.191883,maxLon:-0.486007,numLat:1281,numLon:1186}); shiftTerrain(0,3);
terrainList.push({name:'GerrardsCross.mm',source:2,minLat:51.592051,minLon:-0.553332,maxLat:51.607005,maxLon:-0.532865,numLat:1665,numLon:1416}); shiftTerrain(1,0);
terrainList.push({name:'Gorlestone.mm',source:2,minLat:52.542663,minLon:1.723104,maxLat:52.557753,maxLon:1.737734,numLat:1680,numLon:991}); shiftTerrain(2,3);
terrainList.push({name:'Gosforth.mm',source:2,minLat:55.009622,minLon:-1.618409,maxLat:55.019928,maxLon:-1.596564,numLat:1148,numLon:1395}); shiftTerrain(0,1);
terrainList.push({name:'GoswickLinks.mm',source:2,minLat:55.699756,minLon:-1.936489,maxLat:55.715536,maxLon:-1.904772,numLat:1757,numLon:1989});
terrainList.push({name:'GreatYarmouthAndCaister.mm',source:2,minLat:52.628675,minLon:1.725875,maxLat:52.647482,maxLon:1.739667,numLat:2093,numLon:933});
terrainList.push({name:'HanburyManor.mm',source:2,minLat:51.822991,minLon:-0.057591,maxLat:51.836293,maxLon:-0.03018,numLat:1481,numLon:1886});
terrainList.push({name:'HankleyCommon.mm',source:2,minLat:51.162652,minLon:-0.750592,maxLat:51.180734,maxLon:-0.731239,numLat:2013,numLon:1351}); shiftTerrain(1.5,0.5);
terrainList.push({name:'HarewoodDowns.mm',source:2,minLat:51.643665,minLon:-0.585344,maxLat:51.658654,maxLon:-0.568572,numLat:1669,numLon:1159}); shiftTerrain(1,0);
terrainList.push({name:'HawkstoneParkChamp.mm',source:2,minLat:52.856693,minLon:-2.656738,maxLat:52.868589,maxLon:-2.639726,numLat:1325,numLon:1144}); shiftTerrain(1,2);
terrainList.push({name:'HawkstoneParkHawk.mm',source:2,minLat:52.853346,minLon:-2.64846,maxLat:52.868659,maxLon:-2.631643,numLat:1705,numLon:1131}); shiftTerrain(1,2);
terrainList.push({name:'HellidonLakes.mm',source:2,minLat:52.214031,minLon:-1.273994,maxLat:52.225817,maxLon:-1.253321,numLat:1313,numLon:1410}); shiftTerrain(0,1);
terrainList.push({name:'Heysham.mm',source:2,minLat:54.023608,minLon:-2.908181,maxLat:54.035584,maxLon:-2.893629,numLat:1334,numLon:952}); shiftTerrain(0,2);
terrainList.push({name:'HeythropPark.mm',source:2,minLat:51.928483,minLon:-1.486447,maxLat:51.943675,maxLon:-1.457203,numLat:1691,numLon:2007}); shiftTerrain(1,1);
terrainList.push({name:'Hickleton.mm',source:2,minLat:53.541876,minLon:-1.289417,maxLat:53.55223,maxLon:-1.267034,numLat:1153,numLon:1481}); shiftTerrain(1,2);
terrainList.push({name:'Hillside.mm',source:2,minLat:53.607758,minLon:-3.048012,maxLat:53.621751,maxLon:-3.024404,numLat:1558,numLon:1559}); shiftTerrain(0,2.5);
terrainList.push({name:'HindleyHall.mm',source:2,minLat:53.54263,minLon:-2.59005,maxLat:53.55588,maxLon:-2.573306,numLat:1475,numLon:1108}); shiftTerrain(0,2);
terrainList.push({name:'Hoebridge.mm',source:2,minLat:51.30673,minLon:-0.541311,maxLat:51.318775,maxLon:-0.515887,numLat:1341,numLon:1769}); shiftTerrain(1.5,0);
terrainList.push({name:'HollinsHall.mm',source:2,minLat:53.856055,minLon:-1.757235,maxLat:53.868952,maxLon:-1.732732,numLat:1436,numLon:1609}); shiftTerrain(0,1);
terrainList.push({name:'Houldsworth.mm',source:2,minLat:53.435864,minLon:-2.177148,maxLat:53.447195,maxLon:-2.162026,numLat:1262,numLon:1004}); shiftTerrain(1,3);
terrainList.push({name:'Hunstanton.mm',source:2,minLat:52.953991,minLon:0.504489,maxLat:52.968699,maxLon:0.530772,numLat:1637,numLon:1762}); shiftTerrain(1,3);
terrainList.push({name:'JCB.mm',source:2,minLat:52.938687,minLon:-1.874792,maxLat:52.950748,maxLon:-1.846707,numLat:1343,numLon:1884}); shiftTerrain(0,3);
terrainList.push({name:'Keswick.mm',source:2,minLat:54.612996,minLon:-3.044328,maxLat:54.624744,maxLon:-3.019053,numLat:1308,numLon:1629}); shiftTerrain(0,1);
terrainList.push({name:'KilnwickPercy.mm',source:2,minLat:53.933056,minLon:-0.768018,maxLat:53.944903,maxLon:-0.747506,numLat:1319,numLon:1345}); shiftTerrain(0,2);
terrainList.push({name:'Kingswood.mm',source:2,minLat:51.280698,minLon:-0.213256,maxLat:51.291937,maxLon:-0.189527,numLat:1252,numLon:1652}); shiftTerrain(1,1);
terrainList.push({name:'KirbyMuxloe.mm',source:2,minLat:52.622121,minLon:-1.248682,maxLat:52.634046,maxLon:-1.230631,numLat:1328,numLon:1220}); shiftTerrain(0.5,2);
terrainList.push({name:'Knebworth.mm',source:2,minLat:51.870475,minLon:-0.204046,maxLat:51.884166,maxLon:-0.187972,numLat:1524,numLon:1105});
terrainList.push({name:'Knutsford.mm',source:2,minLat:53.309527,minLon:-2.383687,maxLat:53.321058,maxLon:-2.37092,numLat:1284,numLon:850}); shiftTerrain(0.5,1);
terrainList.push({name:'Lansdown.mm',source:2,minLat:51.415365,minLon:-2.419643,maxLat:51.429599,maxLon:-2.394493,numLat:1585,numLon:1746});
terrainList.push({name:'Lichfield.mm',source:2,minLat:52.711737,minLon:-1.871537,maxLat:52.722571,maxLon:-1.841988,numLat:1207,numLon:1992}); shiftTerrain(1,2);
terrainList.push({name:'LindenHall.mm',source:2,minLat:55.255285,minLon:-1.775665,maxLat:55.268374,maxLon:-1.745444,numLat:1457,numLon:1917}); shiftTerrain(0,1);
terrainList.push({name:'LingfieldPark.mm',source:2,minLat:51.15507,minLon:-0.016738,maxLat:51.171179,maxLon:0.00228,numLat:1793,numLon:1328}); shiftTerrain(2.5,0.5);
terrainList.push({name:'LonghirstHall.mm',source:2,minLat:55.184704,minLon:-1.688642,maxLat:55.198076,maxLon:-1.654158,numLat:1489,numLon:2191}); shiftTerrain(-0.5,1.5);
terrainList.push({name:'Lymm.mm',source:2,minLat:53.38315,minLon:-2.498147,maxLat:53.394409,maxLon:-2.476408,numLat:1254,numLon:1444}); shiftTerrain(1,3);
terrainList.push({name:'ManorKingstone.mm',source:2,minLat:52.860005,minLon:-1.942859,maxLat:52.872584,maxLon:-1.92492,numLat:1401,numLon:1206}); shiftTerrain(1,2);
terrainList.push({name:'Mapledurham.mm',source:2,minLat:51.482749,minLon:-1.00673,maxLat:51.499337,maxLon:-0.991333,numLat:1847,numLon:1068}); shiftTerrain(1,1);
terrainList.push({name:'Marland.mm',source:2,minLat:53.599967,minLon:-2.206534,maxLat:53.610364,maxLon:-2.182833,numLat:1158,numLon:1566}); shiftTerrain(1,1);
terrainList.push({name:'Marlborough.mm',source:2,minLat:51.426307,minLon:-1.746808,maxLat:51.43828,maxLon:-1.728125,numLat:1333,numLon:1297}); shiftTerrain(1,0);
terrainList.push({name:'MillGreen.mm',source:2,minLat:51.771421,minLon:-0.205577,maxLat:51.781192,maxLon:-0.171462,numLat:1088,numLon:2349}); shiftTerrain(2,1); smoothTerrain(5);
terrainList.push({name:'Minehead.mm',source:2,minLat:51.197781,minLon:-3.458271,maxLat:51.210287,maxLon:-3.433853,numLat:1393,numLon:1703}); shiftTerrain(1,2);
terrainList.push({name:'MorleyHayesManor.mm',source:2,minLat:52.969127,minLon:-1.408981,maxLat:52.982131,maxLon:-1.391522,numLat:1448,numLon:1171}); shiftTerrain(1,3);
terrainList.push({name:'Nazeing.mm',source:2,minLat:51.726452,minLon:0.028169,maxLat:51.740188,maxLon:0.048305,numLat:1529,numLon:1389}); shiftTerrain(1.5,1.5);
terrainList.push({name:'Nelson.mm',source:2,minLat:53.812911,minLon:-2.217087,maxLat:53.823891,maxLon:-2.198674,numLat:1223,numLon:1211}); shiftTerrain(1,2);
terrainList.push({name:'NewmarketLinks.mm',source:2,minLat:52.220282,minLon:0.37028,maxLat:52.233293,maxLon:0.38752,numLat:1449,numLon:1176}); shiftTerrain(2,2);
terrainList.push({name:'NottsHollinwell.mm',source:2,minLat:53.08158,minLon:-1.23221,maxLat:53.092069,maxLon:-1.197406,numLat:1168,numLon:2326}); shiftTerrain(0,3);
terrainList.push({name:'Oundle.mm',source:2,minLat:52.47419,minLon:-0.512535,maxLat:52.484385,maxLon:-0.49125,numLat:1136,numLon:1443}); shiftTerrain(2,2);
terrainList.push({name:'Orsett.mm',source:2,minLat:51.493976,minLon:0.378565,maxLat:51.503828,maxLon:0.402713,numLat:1097,numLon:1674}); shiftTerrain(2.5,0.5);
terrainList.push({name:'Oxford.mm',source:2,minLat:51.737849,minLon:-1.224825,maxLat:51.74904,maxLon:-1.200388,numLat:1246,numLon:1684}); shiftTerrain(1,1.5);
terrainList.push({name:'Perranporth.mm',source:2,minLat:50.344838,minLon:-5.153784,maxLat:50.357303,maxLon:-5.1345,numLat:1388,numLon:1370});
terrainList.push({name:'PineRidge.mm',source:2,minLat:51.313777,minLon:-0.719531,maxLat:51.32612,maxLon:-0.696416,numLat:1374,numLon:1608}); shiftTerrain(0.5,1);
terrainList.push({name:'Princes.mm',source:2,minLat:51.2813,minLon:1.363944,maxLat:51.305693,maxLon:1.37955,numLat:2714,numLon:1087});
terrainList.push({name:'Pyrford.mm',source:2,minLat:51.308321,minLon:-0.502408,maxLat:51.324236,maxLon:-0.486422,numLat:1772,numLon:1113}); shiftTerrain(1,0);
terrainList.push({name:'Richmond.mm',source:2,minLat:51.433092,minLon:-0.30702,maxLat:51.444205,maxLon:-0.290248,numLat:1238,numLon:1165}); shiftTerrain(1.5,0);
terrainList.push({name:'RockliffeHall.mm',source:2,minLat:54.468025,minLon:-1.55218,maxLat:54.479641,maxLon:-1.522126,numLat:1294,numLon:1944}); shiftTerrain(0,2);
terrainList.push({name:'RoyalBirkdale.mm',source:2,minLat:53.615571,minLon:-3.047975,maxLat:53.631786,maxLon:-3.028997,numLat:1805,numLon:1254}); shiftTerrain(0,2.5);
terrainList.push({name:'RoyalCinquePorts.mm',source:2,minLat:51.235749,minLon:1.383042,maxLat:51.261304,maxLon:1.403075,numLat:2844,numLon:1396});
terrainList.push({name:'RoyalCromer.mm',source:2,minLat:52.916811,minLon:1.313357,maxLat:52.926108,maxLon:1.339448,numLat:1036,numLon:1751}); shiftTerrain(2,3);
terrainList.push({name:'RoyalLiverpool.mm',source:2,minLat:53.373208,minLon:-3.199175,maxLat:53.390799,maxLon:-3.181408,numLat:1958,numLon:1180});
terrainList.push({name:'RoyalLythamAndStAnnes.mm',source:2,minLat:53.740534,minLon:-3.02263,maxLat:53.752335,maxLon:-2.989673,numLat:1314,numLon:2169});
terrainList.push({name:'RoyalNorthDevon.mm',source:2,minLat:51.043819,minLon:-4.233137,maxLat:51.066444,maxLon:-4.212499,numLat:2518,numLon:1444}); shiftTerrain(-1,0);
terrainList.push({name:'RoyalNorwich.mm',source:2,minLat:52.704079,minLon:1.113304,maxLat:52.72214,maxLon:1.135402,numLat:2010,numLon:1491}); shiftTerrain(1,3);
terrainList.push({name:'RoyalStGeorges.mm',source:2,minLat:51.267174,minLon:1.363594,maxLat:51.285448,maxLon:1.387291,numLat:2034,numLon:1650}); shiftTerrain(2,1);
terrainList.push({name:'RoyalWestNorfolk.mm',source:2,minLat:52.971533,minLon:0.634138,maxLat:52.978326,maxLon:0.676274,numLat:757,numLon:2823}); shiftTerrain(1,3);
terrainList.push({name:'Royston.mm',source:2,minLat:52.037505,minLon:-0.067222,maxLat:52.047259,maxLon:-0.033137,numLat:1087,numLon:2333}); shiftTerrain(3,1.5);
terrainList.push({name:'SaffronWalden.mm',source:2,minLat:52.022314,minLon:0.214529,maxLat:52.033423,maxLon:0.236951,numLat:1237,numLon:1536}); shiftTerrain(2,1);
terrainList.push({name:'SauntonEast.mm',source:2,minLat:51.102532,minLon:-4.211394,maxLat:51.117761,maxLon:-4.190967,numLat:1695,numLon:1428}); shiftTerrain(-1,0);
terrainList.push({name:'SauntonWest.mm',source:2,minLat:51.099038,minLon:-4.215875,maxLat:51.118023,maxLon:-4.19391,numLat:2113,numLon:1535}); shiftTerrain(-1,0);
terrainList.push({name:'ScalmPark.mm',source:2,minLat:53.777636,minLon:-1.166113,maxLat:53.7915,maxLon:-1.142647,numLat:1544,numLon:1544}); shiftTerrain(0,3);
terrainList.push({name:'Scarcroft.mm',source:2,minLat:53.866567,minLon:-1.467731,maxLat:53.877453,maxLon:-1.446279,numLat:1212,numLon:1408}); shiftTerrain(0,1.5);
terrainList.push({name:'Seahouses.mm',source:2,minLat:55.570195,minLon:-1.65813,maxLat:55.580869,maxLon:-1.636279,numLat:1189,numLon:1376}); shiftTerrain(-1,1);
terrainList.push({name:'SeatonCarew.mm',source:2,minLat:54.638432,minLon:-1.189336,maxLat:54.658497,maxLon:-1.164533,numLat:2233,numLon:1598}); shiftTerrain(-1,2);
terrainList.push({name:'Sheringham.mm',source:2,minLat:52.94091,minLon:1.17513,maxLat:52.947706,maxLon:1.207229,numLat:758,numLon:2153}); shiftTerrain(2,3);
terrainList.push({name:'Sidmouth.mm',source:2,minLat:50.674521,minLon:-3.270305,maxLat:50.693736,maxLon:-3.251932,numLat:2139,numLon:1296});
terrainList.push({name:'SlaleyHallHunting.mm',source:2,minLat:54.890792,minLon:-2.028572,maxLat:54.905394,maxLon:-2.002199,numLat:1626,numLon:1688}); shiftTerrain(0,1);
terrainList.push({name:'SlaleyHallPriestman.mm',source:2,minLat:54.890967,minLon:-2.042862,maxLat:54.905254,maxLon:-2.017254,numLat:1591,numLon:1639}); shiftTerrain(0,1);
terrainList.push({name:'Sleaford.mm',source:2,minLat:52.973681,minLon:-0.484119,maxLat:52.984848,maxLon:-0.453609,numLat:1244,numLon:2045}); shiftTerrain(0,2);
terrainList.push({name:'Southwold.mm',source:2,minLat:52.321523,minLon:1.661906,maxLat:52.331524,maxLon:1.679483,numLat:1114,numLon:1196}); shiftTerrain(3,3);
terrainList.push({name:'StEnodocChurch.mm',source:2,minLat:50.545286,minLon:-4.929003,maxLat:50.562549,maxLon:-4.915067,numLat:1922,numLon:987});
terrainList.push({name:'StIvesHunts.mm',source:2,minLat:52.336382,minLon:-0.053063,maxLat:52.349944,maxLon:-0.033561,numLat:1510,numLon:1327}); shiftTerrain(2,2);
terrainList.push({name:'StMellionNicklaus.mm',source:2,minLat:50.460182,minLon:-4.295287,maxLat:50.476194,maxLon:-4.273646,numLat:1782,numLon:1534});
terrainList.push({name:'StNeots.mm',source:2,minLat:52.23325,minLon:-0.28381,maxLat:52.244065,maxLon:-0.266057,numLat:1205,numLon:1211}); shiftTerrain(0,0);
terrainList.push({name:'Stowe.mm',source:2,minLat:52.025919,minLon:-1.010703,maxLat:52.038464,maxLon:-0.99523,numLat:1397,numLon:1060}); shiftTerrain(2,1);
terrainList.push({name:'Stowmarket.mm',source:2,minLat:52.18077,minLon:0.935766,maxLat:52.192513,maxLon:0.957445,numLat:1308,numLon:1480}); shiftTerrain(2,2);
terrainList.push({name:'StratfordOnAvon.mm',source:2,minLat:52.188884,minLon:-1.69461,maxLat:52.200014,maxLon:-1.673275,numLat:1240,numLon:1456}); shiftTerrain(0,1);
terrainList.push({name:'SunningdaleNew.mm',source:2,minLat:51.37257,minLon:-0.642982,maxLat:51.389909,maxLon:-0.618953,numLat:1930,numLon:1670});
terrainList.push({name:'SunningdaleOld.mm',source:2,minLat:51.373273,minLon:-0.649469,maxLat:51.390076,maxLon:-0.621579,numLat:1870,numLon:1938});
terrainList.push({name:'Surbiton.mm',source:2,minLat:51.360995,minLon:-0.335409,maxLat:51.375923,maxLon:-0.31821,numLat:1662,numLon:1196}); shiftTerrain(0.5,0);
terrainList.push({name:'SurreyDowns.mm',source:2,minLat:51.283991,minLon:-0.199099,maxLat:51.298226,maxLon:-0.17914,numLat:1585,numLon:1390}); shiftTerrain(1.5,0.5);
terrainList.push({name:'SurreyNational.mm',source:2,minLat:51.279801,minLon:-0.11866,maxLat:51.292382,maxLon:-0.098728,numLat:1401,numLon:1388}); shiftTerrain(0.5,0.5);
terrainList.push({name:'TheAddington.mm',source:2,minLat:51.358241,minLon:-0.049228,maxLat:51.369769,maxLon:-0.028479,numLat:1284,numLon:1443}); shiftTerrain(2.5,1);
terrainList.push({name:'TheBristol.mm',source:2,minLat:51.52935,minLon:-2.611075,maxLat:51.54199,maxLon:-2.588172,numLat:1408,numLon:1586}); shiftTerrain(0,1);
terrainList.push({name:'TheBurstead.mm',source:2,minLat:51.603008,minLon:0.395254,maxLat:51.614656,maxLon:0.413975,numLat:1297,numLon:1295}); shiftTerrain(2,1);
terrainList.push({name:'TheMendip.mm',source:2,minLat:51.216564,minLon:-2.562133,maxLat:51.227807,maxLon:-2.541381,numLat:1252,numLon:1447});
terrainList.push({name:'TheMount.mm',source:2,minLat:52.588095,minLon:-2.232826,maxLat:52.597169,maxLon:-2.214276,numLat:1011,numLon:1255}); shiftTerrain(1,1);
terrainList.push({name:'TheOxfordshire.mm',source:2,minLat:51.725899,minLon:-1.023216,maxLat:51.741347,maxLon:-1.001817,numLat:1720,numLon:1476}); shiftTerrain(1.5,2);
terrainList.push({name:'TheWarwickshireEarls.mm',source:2,minLat:52.308726,minLon:-1.598945,maxLat:52.32399,maxLon:-1.58066,numLat:1699,numLon:1245}); shiftTerrain(2,2);
terrainList.push({name:'TheWarwickshireKings.mm',source:2,minLat:52.304059,minLon:-1.598516,maxLat:52.31771,maxLon:-1.574794,numLat:1520,numLon:1615}); shiftTerrain(2,2);
terrainList.push({name:'TheWisley.mm',source:2,minLat:51.311277,minLon:-0.49211,maxLat:51.326387,maxLon:-0.472129,numLat:1682,numLon:1391}); shiftTerrain(2,0);
terrainList.push({name:'Thorpeness.mm',source:2,minLat:52.179949,minLon:1.592288,maxLat:52.198008,maxLon:1.611689,numLat:2010,numLon:1325}); shiftTerrain(3,4);
terrainList.push({name:'Tidworth.mm',source:2,minLat:51.221715,minLon:-1.703757,maxLat:51.238157,maxLon:-1.679694,numLat:1830,numLon:1678}); shiftTerrain(1,0);
terrainList.push({name:'Torquay.mm',source:2,minLat:50.483835,minLon:-3.529997,maxLat:50.494801,maxLon:-3.51461,numLat:1221,numLon:1091}); shiftTerrain(-1,0);
terrainList.push({name:'Trevose.mm',source:2,minLat:50.529908,minLon:-5.026904,maxLat:50.542479,maxLon:-5.006848,numLat:1400,numLon:1419});
terrainList.push({name:'WalmerKingsdown.mm',source:2,minLat:51.164539,minLon:1.38494,maxLat:51.180169,maxLon:1.406084,numLat:1740,numLon:1476}); shiftTerrain(2,1);
terrainList.push({name:'WaltonHeath.mm',source:2,minLat:51.25814,minLon:-0.247024,maxLat:51.280195,maxLon:-0.225417,numLat:2454,numLon:1505});
terrainList.push({name:'Waterlooville.mm',source:2,minLat:50.887813,minLon:-1.010309,maxLat:50.902201,maxLon:-0.996437,numLat:1602,numLon:975}); shiftTerrain(1,-1);
terrainList.push({name:'Waterstock.mm',source:2,minLat:51.736921,minLon:-1.091038,maxLat:51.746406,maxLon:-1.068732,numLat:1057,numLon:1538}); shiftTerrain(1.5,1.5);
terrainList.push({name:'WentworthWest.mm',source:2,minLat:51.385706,minLon:-0.620206,maxLat:51.406096,maxLon:-0.587164,numLat:2269,numLon:2294});
terrainList.push({name:'Westerhope.mm',source:2,minLat:55.000355,minLon:-1.710756,maxLat:55.013654,maxLon:-1.693429,numLat:1481,numLon:1107}); shiftTerrain(0,1);
terrainList.push({name:'WestMidlands.mm',source:2,minLat:52.404925,minLon:-1.699686,maxLat:52.419692,maxLon:-1.683137,numLat:1644,numLon:1124}); shiftTerrain(1,2);
terrainList.push({name:'WhipsnadePark.mm',source:2,minLat:51.831232,minLon:-0.55089,maxLat:51.844131,maxLon:-0.532411,numLat:1436,numLon:1272}); shiftTerrain(1.5,1);
terrainList.push({name:'WhittleburyPark.mm',source:2,minLat:52.07141,minLon:-1.008248,maxLat:52.08563,maxLon:-0.982712,numLat:1583,numLon:1747}); shiftTerrain(1.5,1.5);
terrainList.push({name:'Willingdon.mm',source:2,minLat:50.781795,minLon:0.23814,maxLat:50.79184,maxLon:0.255749,numLat:1119,numLon:1240}); shiftTerrain(2,0);
terrainList.push({name:'WoburnDukes.mm',source:2,minLat:51.98544,minLon:-0.681314,maxLat:52.001812,maxLon:-0.661941,numLat:1822,numLon:1328}); shiftTerrain(1,1);
terrainList.push({name:'WoburnMarquess.mm',source:2,minLat:51.982716,minLon:-0.666812,maxLat:51.99243,maxLon:-0.635812,numLat:1082,numLon:2125}); shiftTerrain(1.5,1.5);
terrainList.push({name:'WoodhallSpaBracken.mm',source:2,minLat:53.153528,minLon:-0.218333,maxLat:53.168853,maxLon:-0.201601,numLat:1706,numLon:1118}); shiftTerrain(1,4);
terrainList.push({name:'WoodhallSpaHotchkin.mm',source:2,minLat:53.153577,minLon:-0.208084,maxLat:53.168004,maxLon:-0.178829,numLat:1606,numLon:1952}); shiftTerrain(1,4);
terrainList.push({name:'Woolton.mm',source:2,minLat:53.360165,minLon:-2.868365,maxLat:53.369381,maxLon:-2.850126,numLat:1027,numLon:1212}); shiftTerrain(0,2);
terrainList.push({name:'WycombeHeights.mm',source:2,minLat:51.611554,minLon:-0.701196,maxLat:51.626353,maxLon:-0.68639,numLat:1648,numLon:1024}); shiftTerrain(2,1);

// Scotland
terrainList.push({name:'CastleStuart.mm',source:3,minLat:57.517504,minLon:-4.121811,maxLat:57.537986,maxLon:-4.094327,numLat:2279,numLon:1643});
terrainList.push({name:'Cawder.mm',source:3,minLat:55.919788,minLon:-4.24383,maxLat:55.934752,maxLon:-4.214202,numLat:1666,numLon:1848});
terrainList.push({name:'DuffHouseRoyal.mm',source:3,minLat:57.650362,minLon:-2.533924,maxLat:57.664119,maxLon:-2.511004,numLat:1532,numLon:1365});
terrainList.push({name:'Dunfermline.mm',source:3,minLat:56.055559,minLon:-3.525019,maxLat:56.064515,maxLon:-3.499323,numLat:998,numLon:1597});
terrainList.push({name:'EastKilbride.mm',source:3,minLat:55.778155,minLon:-4.167641,maxLat:55.788079,maxLon:-4.143913,numLat:1105,numLon:1486});
terrainList.push({name:'EastRenfrewshire.mm',source:3,minLat:55.749044,minLon:-4.379282,maxLat:55.762093,maxLon:-4.356483,numLat:1453,numLon:1429});
terrainList.push({name:'Forfar.mm',source:3,minLat:56.638753,minLon:-2.855357,maxLat:56.648533,maxLon:-2.836358,numLat:1089,numLon:1164}); shiftTerrain(0,-1);
terrainList.push({name:'GleneaglesKings.mm',source:3,minLat:56.273046,minLon:-3.775701,maxLat:56.282429,maxLon:-3.739463,numLat:1045,numLon:2239});
terrainList.push({name:'GleneaglesPGACentenary.mm',source:3,minLat:56.270455,minLon:-3.760888,maxLat:56.289202,maxLon:-3.727274,numLat:2087,numLon:2077});
terrainList.push({name:'HaggsCastle.mm',source:3,minLat:55.827969,minLon:-4.332286,maxLat:55.841085,maxLon:-4.306475,numLat:1460,numLon:1614});
terrainList.push({name:'Hamilton.mm',source:3,minLat:55.750139,minLon:-4.017581,maxLat:55.763207,maxLon:-3.997882,numLat:1455,numLon:1235});
terrainList.push({name:'KilsythLennox.mm',source:3,minLat:55.980562,minLon:-4.058757,maxLat:55.9922,maxLon:-4.037853,numLat:1296,numLon:1302});
terrainList.push({name:'Kingsbarns.mm',source:3,minLat:56.289967,minLon:-2.657363,maxLat:56.308941,maxLon:-2.624884,numLat:2112,numLon:2006});
terrainList.push({name:'Kirkhill.mm',source:3,minLat:55.794995,minLon:-4.176731,maxLat:55.806991,maxLon:-4.14945,numLat:1336,numLon:1707}); shiftTerrain(1,0);
terrainList.push({name:'Muirfield.mm',source:3,minLat:56.039373,minLon:-2.835075,maxLat:56.052156,maxLon:-2.808545,numLat:1423,numLon:1650});
terrainList.push({name:'Prestonfield.mm',source:3,minLat:55.931974,minLon:-3.171801,maxLat:55.941785,maxLon:-3.141967,numLat:1093,numLon:1860});
terrainList.push({name:'Roxburghe.mm',source:3,minLat:55.545637,minLon:-2.484028,maxLat:55.567781,maxLon:-2.462983,numLat:2464,numLon:1326});
terrainList.push({name:'RoyalDornochChamp.mm',source:3,minLat:57.876836,minLon:-4.026759,maxLat:57.900509,maxLon:-4.001345,numLat:2634,numLon:1504});
terrainList.push({name:'RoyalTroonOld.mm',source:3,minLat:55.515935,minLon:-4.656168,maxLat:55.534889,maxLon:-4.619658,numLat:2110,numLon:2300}); shiftTerrain(1,1);
terrainList.push({name:'StAndrewsOld.mm',source:3,minLat:56.34113,minLon:-2.828947,maxLat:56.362579,maxLon:-2.799423,numLat:2387,numLon:1821});
terrainList.push({name:'StAndrews.mm',source:3,minLat:56.34113,minLon:-2.844177,maxLat:56.368103,maxLon:-2.799423,numLat:3001,numLon:2759});
terrainList.push({name:'StAndrewsCastle.mm',source:3,minLat:56.322256,minLon:-2.770807,maxLat:56.333431,maxLon:-2.737485,numLat:1245,numLon:2056});
terrainList.push({name:'StAndrewsKittocks.mm',source:3,minLat:56.314744,minLon:-2.738552,maxLat:56.328831,maxLon:-2.706457,numLat:1568,numLon:1981});
terrainList.push({name:'StAndrewsTorrance.mm',source:3,minLat:56.314583,minLon:-2.745899,maxLat:56.328811,maxLon:-2.716036,numLat:1584,numLon:1843});
terrainList.push({name:'WestLinton.mm',source:3,minLat:55.747464,minLon:-3.394929,maxLat:55.758752,maxLon:-3.366981,numLat:1257,numLon:1751});

// United States
terrainList.push({name:'Alhambra.mm',source:1,minLat:34.082799,minLon:-118.118941,maxLat:34.095274,maxLon:-118.106798,numLat:1389,numLon:1120});
terrainList.push({name:'AlondraPark.mm',source:1,minLat:33.87732,minLon:-118.345763,maxLat:33.889004,maxLon:-118.333751,numLat:1301,numLon:1111});
terrainList.push({name:'AltaMesa.mm',source:1,minLat:33.429358,minLon:-111.720835,maxLat:33.452083,maxLon:-111.707234,numLat:2529,numLon:1264});
terrainList.push({name:'AngelParkMountain.mm',source:1,minLat:36.168295,minLon:-115.308595,maxLat:36.175426,maxLon:-115.285124,numLat:795,numLon:2109});
terrainList.push({name:'AngelParkPalm.mm',source:1,minLat:36.168713,minLon:-115.289431,maxLat:36.186147,maxLon:-115.27754,numLat:1941,numLon:1069});
terrainList.push({name:'Applewood.mm',source:1,minLat:39.7601,minLon:-105.163571,maxLat:39.770745,maxLon:-105.149722,numLat:1186,numLon:1186});
terrainList.push({name:'ArrowCreekChallenge.mm',source:1,minLat:39.399649,minLon:-119.836861,maxLat:39.42413,maxLon:-119.809928,numLat:2724,numLon:2316});
terrainList.push({name:'ArrowCreekLegend.mm',source:1,minLat:39.396683,minLon:-119.82049,maxLat:39.420479,maxLon:-119.796951,numLat:2648,numLon:2024});
terrainList.push({name:'Arrowood.mm',source:1,minLat:33.26163,minLon:-117.293994,maxLat:33.280392,maxLon:-117.281583,numLat:2088,numLon:1156});
terrainList.push({name:'AtlantaACHighlands.mm',source:1,minLat:33.993269,minLon:-84.194095,maxLat:34.013544,maxLon:-84.17859,numLat:2256,numLon:1431});
terrainList.push({name:'AtlanticDunes.mm',source:1,minLat:32.115689,minLon:-80.803036,maxLat:32.136063,maxLon:-80.777503,numLat:2267,numLon:2406});
terrainList.push({name:'AuburnWA.mm',source:1,minLat:47.328151,minLon:-122.213785,maxLat:47.342578,maxLon:-122.200183,numLat:1606,numLon:1027});
terrainList.push({name:'AugustaNational.mm',source:1,minLat:33.491873,minLon:-82.030731,maxLat:33.50665,maxLon:-82.016759,numLat:1645,numLon:1298}); shiftTerrain(0.5,-1.25);
terrainList.push({name:'AugustaNationalPar3.mm',source:1,minLat:33.498949,minLon:-82.020524,maxLat:33.506063,maxLon:-82.013325,numLat:793,numLon:669}); shiftTerrain(0.5,-1.25);
terrainList.push({name:'AustinCC.mm',source:1,minLat:30.331225,minLon:-97.80517,maxLat:30.350132,maxLon:-97.789222,numLat:2104,numLon:1532});
terrainList.push({name:'Aviara.mm',source:1,minLat:33.090114,minLon:-117.295058,maxLat:33.109185,maxLon:-117.278029,numLat:2123,numLon:1588});
terrainList.push({name:'Ballyowen.mm',source:1,minLat:41.129924,minLon:-74.592665,maxLat:41.144323,maxLon:-74.576436,numLat:1603,numLon:1361});
terrainList.push({name:'BayHill.mm',source:1,minLat:28.450662,minLon:-81.51414,maxLat:28.473917,maxLon:-81.500385,numLat:2588,numLon:1347});
terrainList.push({name:'Baylands.mm',source:1,minLat:37.45119,minLon:-122.124942,maxLat:37.465023,maxLon:-122.113189,numLat:1540,numLon:1039});
terrainList.push({name:'BearCreekEast.mm',source:1,minLat:32.851687,minLon:-97.061438,maxLat:32.864592,maxLon:-97.050426,numLat:1437,numLon:1031});
terrainList.push({name:'BearCreekWest.mm',source:1,minLat:32.852336,minLon:-97.065502,maxLat:32.8687,maxLon:-97.054466,numLat:1822,numLon:1033});
terrainList.push({name:'Beloit.mm',source:1,minLat:42.53223,minLon:-89.036158,maxLat:42.541731,maxLon:-89.024124,numLat:1058,numLon:988});
terrainList.push({name:'BergenPoint.mm',source:1,minLat:40.672467,minLon:-73.351349,maxLat:40.683626,maxLon:-73.336102,numLat:1243,numLon:1288});
terrainList.push({name:'BingMaloney.mm',source:1,minLat:38.496975,minLon:-121.507834,maxLat:38.506076,maxLon:-121.490266,numLat:1014,numLon:1531});
terrainList.push({name:'BirminghamCC.mm',source:1,minLat:42.529281,minLon:-83.24749,maxLat:42.537896,maxLon:-83.22648,numLat:960,numLon:1724});
terrainList.push({name:'BishopsGate.mm',source:1,minLat:28.73001,minLon:-81.798147,maxLat:28.739775,maxLon:-81.785843,numLat:1088,numLon:1202});
terrainList.push({name:'BlackberryOaks.mm',source:1,minLat:41.678937,minLon:-88.423156,maxLat:41.692874,maxLon:-88.403764,numLat:1552,numLon:1612});
terrainList.push({name:'BlackDiamondHighlands.mm',source:1,minLat:28.897297,minLon:-82.492493,maxLat:28.907267,maxLon:-82.479085,numLat:1111,numLon:1307});
terrainList.push({name:'BlackDiamondQuarry.mm',source:1,minLat:28.906154,minLon:-82.496998,maxLat:28.923233,maxLon:-82.475191,numLat:1901,numLon:2125});
terrainList.push({name:'BlackDiamondRanch.mm',source:1,minLat:28.895708,minLon:-82.501435,maxLat:28.922466,maxLon:-82.486494,numLat:2977,numLon:1456});
terrainList.push({name:'BlackGold.mm',source:1,minLat:33.900198,minLon:-117.835765,maxLat:33.912627,maxLon:-117.79871,numLat:1384,numLon:3422});
terrainList.push({name:'BlackMountain.mm',source:1,minLat:35.619465,minLon:-82.342547,maxLat:35.635619,maxLon:-82.327196,numLat:1798,numLon:1389});
terrainList.push({name:'BlackRockMD.mm',source:1,minLat:39.605477,minLon:-77.671835,maxLat:39.617805,maxLon:-77.652709,numLat:1373,numLon:1640});
terrainList.push({name:'Blackwater.mm',source:1,minLat:30.725542,minLon:-86.623306,maxLat:30.737438,maxLon:-86.608041,numLat:1325,numLon:1461});
terrainList.push({name:'BlueHills.mm',source:1,minLat:38.890084,minLon:-94.60555,maxLat:38.9058,maxLon:-94.592786,numLat:1750,numLon:1107});
terrainList.push({name:'Blythefield.mm',source:1,minLat:43.063702,minLon:-85.599051,maxLat:43.074055,maxLon:-85.577771,numLat:1153,numLon:1731});
terrainList.push({name:'BowesCreek.mm',source:1,minLat:41.990251,minLon:-88.397658,maxLat:42.002863,maxLon:-88.373684,numLat:1404,numLon:1983});
terrainList.push({name:'Bradenton.mm',source:1,minLat:27.483047,minLon:-82.613497,maxLat:27.49383,maxLon:-82.60208,numLat:1201,numLon:1128});
terrainList.push({name:'Braintree.mm',source:1,minLat:42.184336,minLon:-71.021611,maxLat:42.200809,maxLon:-71.007417,numLat:1834,numLon:1171});
terrainList.push({name:'BreezyPointDeaconsLodge.mm',source:1,minLat:46.601042,minLon:-94.220087,maxLat:46.61815,maxLon:-94.189763,numLat:1904,numLon:2318});
terrainList.push({name:'Brookville.mm',source:1,minLat:40.836968,minLon:-73.599125,maxLat:40.850026,maxLon:-73.584393,numLat:1454,numLon:1241});
terrainList.push({name:'BuffaloRun.mm',source:1,minLat:39.891832,minLon:-104.81101,maxLat:39.915298,maxLon:-104.788586,numLat:2611,numLon:1915});
terrainList.push({name:'Callahan.mm',source:1,minLat:34.288048,minLon:-84.538428,maxLat:34.303463,maxLon:-84.519504,numLat:1716,numLon:1740});
terrainList.push({name:'CanyonCrest.mm',source:1,minLat:33.945783,minLon:-117.347999,maxLat:33.955953,maxLon:-117.323383,numLat:1133,numLon:2273});
terrainList.push({name:'CanyonSprings.mm',source:1,minLat:29.664704,minLon:-98.489291,maxLat:29.681385,maxLon:-98.467756,numLat:1857,numLon:2083});
terrainList.push({name:'CapeClubPalmCity.mm',source:1,minLat:27.173531,minLon:-80.40181,maxLat:27.20585,maxLon:-80.38995,numLat:3596,numLon:1175});
terrainList.push({name:'CapRockRanch.mm',source:1,minLat:42.727436,minLon:-100.827637,maxLat:42.741667,maxLon:-100.802199,numLat:1584,numLon:2080});
terrainList.push({name:'CarltonWoodsNicklaus.mm',source:1,minLat:30.186945,minLon:-95.55971,maxLat:30.203212,maxLon:-95.535781,numLat:1811,numLon:2302});
terrainList.push({name:'CastlePines.mm',source:1,minLat:39.427378,minLon:-104.913893,maxLat:39.443585,maxLon:-104.883691,numLat:1804,numLon:2596}); smoothTerrain(5);
terrainList.push({name:'CCofDecatur.mm',source:1,minLat:39.835851,minLon:-88.890293,maxLat:39.847048,maxLon:-88.876424,numLat:1247,numLon:1186});
terrainList.push({name:'CCofJackson.mm',source:1,minLat:32.390487,minLon:-90.110772,maxLat:32.401002,maxLon:-90.083363,numLat:1171,numLon:2575});
terrainList.push({name:'CCofVirginiaJamesRiver.mm',source:1,minLat:37.564381,minLon:-77.62165,maxLat:37.577871,maxLon:-77.602883,numLat:1502,numLon:1656});
terrainList.push({name:'CCofVirginiaTuckahoeCreek.mm',source:1,minLat:37.567977,minLon:-77.636956,maxLat:37.578249,maxLon:-77.613631,numLat:1144,numLon:2058});
terrainList.push({name:'CedarCreek.mm',source:1,minLat:29.598526,minLon:-98.662404,maxLat:29.619202,maxLon:-98.640941,numLat:2301,numLon:2077});
terrainList.push({name:'Celebration.mm',source:1,minLat:28.3127,minLon:-81.555313,maxLat:28.327147,maxLon:-81.521728,numLat:1608,numLon:3290});
terrainList.push({name:'ChambersBay.mm',source:1,minLat:47.199265,minLon:-122.584024,maxLat:47.213977,maxLon:-122.567056,numLat:1638,numLon:1284});
terrainList.push({name:'ChampionsGateInternational.mm',source:1,minLat:28.257591,minLon:-81.642143,maxLat:28.27464,maxLon:-81.621605,numLat:1898,numLon:2013});
terrainList.push({name:'ChampionsGateNational.mm',source:1,minLat:28.267815,minLon:-81.644123,maxLat:28.293633,maxLon:-81.626671,numLat:2873,numLon:1711});
terrainList.push({name:'Charwood.mm',source:1,minLat:33.894798,minLon:-81.110125,maxLat:33.908029,maxLon:-81.088244,numLat:1473,numLon:2021});
terrainList.push({name:'CherokeeRun.mm',source:1,minLat:33.668494,minLon:-83.94746,maxLat:33.681783,maxLon:-83.930633,numLat:1480,numLon:1559});
terrainList.push({name:'CherokeeTCCNorth.mm',source:1,minLat:33.988496,minLon:-84.375124,maxLat:34.000107,maxLon:-84.354878,numLat:1293,numLon:1868});
terrainList.push({name:'CherokeeTCCSouth.mm',source:1,minLat:33.978643,minLon:-84.375005,maxLat:33.992689,maxLon:-84.35915,numLat:1564,numLon:1464});
terrainList.push({name:'CherokeeValley.mm',source:1,minLat:35.067259,minLon:-82.39353,maxLat:35.083277,maxLon:-82.372824,numLat:1783,numLon:1886});
terrainList.push({name:'CheyenneShadows.mm',source:1,minLat:38.715609,minLon:-104.816798,maxLat:38.72727,maxLon:-104.797964,numLat:1299,numLon:1636});
terrainList.push({name:'Chimera.mm',source:1,minLat:36.073195,minLon:-114.977296,maxLat:36.087637,maxLon:-114.959117,numLat:1608,numLon:1636});
terrainList.push({name:'CimarronBoulder.mm',source:1,minLat:33.814433,minLon:-116.488514,maxLat:33.831345,maxLon:-116.474519,numLat:1883,numLon:1295}); shiftTerrain(-6,6.5);
terrainList.push({name:'CliffsAtMountainPark.mm',source:1,minLat:35.082788,minLon:-82.470276,maxLat:35.105406,maxLon:-82.456578,numLat:2517,numLon:1248});
terrainList.push({name:'ColbertHills.mm',source:1,minLat:39.202107,minLon:-96.656003,maxLat:39.222711,maxLon:-96.625175,numLat:2293,numLon:2658});
terrainList.push({name:'CommonGround.mm',source:1,minLat:39.708227,minLon:-104.883616,maxLat:39.719176,maxLon:-104.86564,numLat:1219,numLon:1540});
terrainList.push({name:'Concession.mm',source:1,minLat:27.390941,minLon:-82.352638,maxLat:27.414886,maxLon:-82.339234,numLat:2665,numLon:1325});
terrainList.push({name:'Cottonwood.mm',source:1,minLat:32.741633,minLon:-116.918483,maxLat:32.755622,maxLon:-116.897711,numLat:1558,numLon:1945});
terrainList.push({name:'CountryOaks.mm',source:1,minLat:38.653612,minLon:-87.080008,maxLat:38.665413,maxLon:-87.064833,numLat:1314,numLon:1320});
terrainList.push({name:'Cowboys.mm',source:1,minLat:32.955631,minLon:-97.056443,maxLat:32.980637,maxLon:-97.040978,numLat:2783,numLon:1445});
terrainList.push({name:'CrestaVerde.mm',source:1,minLat:33.8818,minLon:-117.550489,maxLat:33.894059,maxLon:-117.534808,numLat:1365,numLon:1449});
terrainList.push({name:'Crosswinds.mm',source:1,minLat:41.889465,minLon:-70.6321,maxLat:41.905569,maxLon:-70.614284,numLat:1793,numLon:1477});
terrainList.push({name:'CrowCanyon.mm',source:1,minLat:37.781203,minLon:-121.969136,maxLat:37.795074,maxLon:-121.951017,numLat:1544,numLon:1594});
terrainList.push({name:'CypressPoint.mm',source:1,minLat:36.572935,minLon:-121.979927,maxLat:36.584845,maxLon:-121.955511,numLat:1326,numLon:2182});
terrainList.push({name:'CypressRidge.mm',source:1,minLat:35.056837,minLon:-120.586881,maxLat:35.074685,maxLon:-120.569391,numLat:1987,numLon:1594});
terrainList.push({name:'DeBell.mm',source:1,minLat:34.199824,minLon:-118.306967,maxLat:34.214745,maxLon:-118.296262,numLat:1661,numLon:986});
terrainList.push({name:'DeerwoodCC.mm',source:1,minLat:40.007018,minLon:-74.804695,maxLat:40.026928,maxLon:-74.781627,numLat:2216,numLon:1966});
terrainList.push({name:'DesertFalls.mm',source:1,minLat:33.756812,minLon:-116.357636,maxLat:33.77365,maxLon:-116.343553,numLat:1874,numLon:1304});
terrainList.push({name:'DesertWillowFirecliff.mm',source:1,minLat:33.763521,minLon:-116.372654,maxLat:33.774188,maxLon:-116.354097,numLat:1188,numLon:1717}); shiftTerrain(-5,5.5);
terrainList.push({name:'DesertWillowMountainView.mm',source:1,minLat:33.756456,minLon:-116.375241,maxLat:33.767635,maxLon:-116.354265,numLat:1245,numLon:1941}); shiftTerrain(-5,5.5);
terrainList.push({name:'DykerBeach.mm',source:1,minLat:40.605725,minLon:-74.026328,maxLat:40.618711,maxLon:-74.012768,numLat:1446,numLon:1147});
terrainList.push({name:'ElCamino.mm',source:1,minLat:33.180997,minLon:-117.329005,maxLat:33.195717,maxLon:-117.310124,numLat:1639,numLon:1759}); shiftTerrain(-1,0.5);
terrainList.push({name:'ElPradoButterfieldStage.mm',source:1,minLat:33.944386,minLon:-117.67249,maxLat:33.961013,maxLon:-117.655087,numLat:1851,numLon:1607});
terrainList.push({name:'ElPradoChinoCreek.mm',source:1,minLat:33.939278,minLon:-117.674209,maxLat:33.951445,maxLon:-117.649863,numLat:1355,numLon:2248});
terrainList.push({name:'EmeraldDunes.mm',source:1,minLat:26.706426,minLon:-80.151334,maxLat:26.722203,maxLon:-80.137596,numLat:1756,numLon:1367});
terrainList.push({name:'EmeraldIsle.mm',source:1,minLat:33.210151,minLon:-117.335217,maxLat:33.216418,maxLon:-117.320429,numLat:699,numLon:1378});
terrainList.push({name:'ErinHills.mm',source:1,minLat:43.238116,minLon:-88.416817,maxLat:43.252652,maxLon:-88.393705,numLat:1618,numLon:1874});
terrainList.push({name:'FairOaksRanchBlackjack.mm',source:1,minLat:29.733461,minLon:-98.661093,maxLat:29.755276,maxLon:-98.641367,numLat:2428,numLon:1906});
terrainList.push({name:'FairOaksRanchLiveOak.mm',source:1,minLat:29.729564,minLon:-98.644163,maxLat:29.742822,maxLon:-98.624014,numLat:1476,numLon:1947});
terrainList.push({name:'FerryPoint.mm',source:1,minLat:40.807959,minLon:-73.837553,maxLat:40.82279,maxLon:-73.821512,numLat:1651,numLon:1352});
terrainList.push({name:'FishersIsland.mm',source:1,minLat:41.278195,minLon:-71.952098,maxLat:41.292882,maxLon:-71.929034,numLat:1635,numLon:1929}); smoothTerrain(2);
terrainList.push({name:'FossilTrace.mm',source:1,minLat:39.73453,minLon:-105.223528,maxLat:39.748086,maxLon:-105.199731,numLat:1509,numLon:2037});
terrainList.push({name:'ForestHillsIN.mm',source:1,minLat:39.798441,minLon:-84.873225,maxLat:39.808467,maxLon:-84.859293,numLat:1117,numLon:1192});
terrainList.push({name:'FoxCreek.mm',source:1,minLat:42.424801,minLon:-83.409534,maxLat:42.434575,maxLon:-83.394686,numLat:1089,numLon:1221});
terrainList.push({name:'FrankfortCC.mm',source:1,minLat:38.194847,minLon:-84.82067,maxLat:38.212143,maxLon:-84.796584,numLat:1925,numLon:2107});
terrainList.push({name:'FrenchLickDye.mm',source:1,minLat:38.565078,minLon:-86.648413,maxLat:38.579358,maxLon:-86.62164,numLat:1590,numLon:2330});
terrainList.push({name:'FrenchLickRoss.mm',source:1,minLat:38.525422,minLon:-86.656298,maxLat:38.539612,maxLon:-86.642805,numLat:1580,numLon:1176});
terrainList.push({name:'FriendlyHills.mm',source:1,minLat:33.954928,minLon:-118.002002,maxLat:33.967881,maxLon:-117.982796,numLat:1442,numLon:1773}); smoothTerrain(5);
terrainList.push({name:'Fullerton.mm',source:1,minLat:33.89462,minLon:-117.930647,maxLat:33.910859,maxLon:-117.913118,numLat:1808,numLon:1620});
terrainList.push({name:'FyreLake.mm',source:1,minLat:41.298169,minLon:-90.504649,maxLat:41.315787,maxLon:-90.490069,numLat:1961,numLon:1220});
terrainList.push({name:'Gasparilla.mm',source:1,minLat:26.747543,minLon:-82.263935,maxLat:26.760453,maxLon:-82.251668,numLat:1438,numLon:1220});
terrainList.push({name:'Gaston.mm',source:1,minLat:35.203261,minLon:-81.159474,maxLat:35.21437,maxLon:-81.132226,numLat:1237,numLon:2478});
terrainList.push({name:'GCofHoustonMember.mm',source:1,minLat:29.914237,minLon:-95.273976,maxLat:29.93255,maxLon:-95.256891,numLat:2038,numLon:1649}); smoothTerrain(2);
terrainList.push({name:'GCofHoustonTour.mm',source:1,minLat:29.904773,minLon:-95.272287,maxLat:29.92621,maxLon:-95.251768,numLat:2386,numLon:1980}); smoothTerrain(2);
terrainList.push({name:'GCofNewEngland.mm',source:1,minLat:43.00711,minLon:-70.873475,maxLat:43.020385,maxLon:-70.849618,numLat:1478,numLon:1942});
terrainList.push({name:'GeorgiaSouthernUniversity.mm',source:1,minLat:32.35986,minLon:-81.791977,maxLat:32.374,maxLon:-81.77228,numLat:1574,numLon:1852});
terrainList.push({name:'Glendora.mm',source:1,minLat:34.124357,minLon:-117.831182,maxLat:34.133773,maxLon:-117.810255,numLat:1049,numLon:1928});
terrainList.push({name:'GozzerRanch.mm',source:1,minLat:47.603868,minLon:-116.768227,maxLat:47.627624,maxLon:-116.746429,numLat:2644,numLon:1636});
terrainList.push({name:'GrandGenevaBrute.mm',source:1,minLat:42.599896,minLon:-88.409942,maxLat:42.611832,maxLon:-88.387029,numLat:1329,numLon:1877});
terrainList.push({name:'GrandGenevaHighlands.mm',source:1,minLat:42.607658,minLon:-88.410321,maxLat:42.618843,maxLon:-88.377184,numLat:1246,numLon:2714});
terrainList.push({name:'GrandReservePuertoRicoChamp.mm',source:1,minLat:18.392799,minLon:-65.807367,maxLat:18.418179,maxLon:-65.789979,numLat:2824,numLon:1837});
terrainList.push({name:'GrandViewLodgePines.mm',source:1,minLat:46.497208,minLon:-94.331273,maxLat:46.512516,maxLon:-94.301654,numLat:1704,numLon:2269});
terrainList.push({name:'GrandViewLodgePreserve.mm',source:1,minLat:46.560633,minLon:-94.290159,maxLat:46.574196,maxLon:-94.274507,numLat:1510,numLon:1199});
terrainList.push({name:'Grapevine.mm',source:1,minLat:32.962455,minLon:-97.056615,maxLat:32.98632,maxLon:-97.038632,numLat:2656,numLon:1680});
terrainList.push({name:'GrayhawkRaptor.mm',source:1,minLat:33.673774,minLon:-111.913794,maxLat:33.685358,maxLon:-111.889679,numLat:1290,numLon:2233});
terrainList.push({name:'GrayhawkTalon.mm',source:1,minLat:33.658355,minLon:-111.903309,maxLat:33.677749,maxLon:-111.889419,numLat:2159,numLon:1287});
terrainList.push({name:'GreatRiver.mm',source:1,minLat:41.264101,minLon:-73.089026,maxLat:41.285578,maxLon:-73.074344,numLat:2390,numLon:1229});
terrainList.push({name:'GreenRiverCA.mm',source:1,minLat:33.868817,minLon:-117.683509,maxLat:33.889497,maxLon:-117.661401,numLat:2302,numLon:2043});
terrainList.push({name:'GreenValleyCC.mm',source:1,minLat:38.251203,minLon:-122.174794,maxLat:38.262782,maxLon:-122.160199,numLat:1290,numLon:1276});
terrainList.push({name:'GreenValleyRanch.mm',source:1,minLat:39.782328,minLon:-104.7629,maxLat:39.796558,maxLon:-104.737328,numLat:1584,numLon:2187});
terrainList.push({name:'HarborLinksChamp.mm',source:1,minLat:40.816449,minLon:-73.676369,maxLat:40.836497,maxLon:-73.66444,numLat:2231,numLon:1006}); smoothTerrain(2);
terrainList.push({name:'HarborLinksLower.mm',source:1,minLat:40.817995,minLon:-73.663256,maxLat:40.826658,maxLon:-73.653862,numLat:965,numLon:792}); smoothTerrain(2);
terrainList.push({name:'HarbourTown.mm',source:1,minLat:32.122279,minLon:-80.817508,maxLat:32.138963,maxLon:-80.800024,numLat:1857,numLon:1648});
terrainList.push({name:'Haverhill.mm',source:1,minLat:42.805015,minLon:-71.083168,maxLat:42.818565,maxLon:-71.068439,numLat:1509,numLon:1203});
terrainList.push({name:'HeathrowCC.mm',source:1,minLat:28.756546,minLon:-81.374738,maxLat:28.775849,maxLon:-81.360606,numLat:2148,numLon:1379});
terrainList.push({name:'HeronCreekFL.mm',source:1,minLat:27.04967,minLon:-82.231633,maxLat:27.077689,maxLon:-82.207668,numLat:3118,numLon:2375});
terrainList.push({name:'HersheyEast.mm',source:1,minLat:40.291487,minLon:-76.635306,maxLat:40.306086,maxLon:-76.618054,numLat:1625,numLon:1465});
terrainList.push({name:'HersheyWest.mm',source:1,minLat:40.287571,minLon:-76.649243,maxLat:40.299575,maxLon:-76.628258,numLat:1337,numLon:1782});
terrainList.push({name:'HickoryCreek.mm',source:1,minLat:42.31881,minLon:-83.560199,maxLat:42.32925,maxLon:-83.544587,numLat:1163,numLon:1285});
terrainList.push({name:'HiddenValley.mm',source:1,minLat:36.407411,minLon:-85.341096,maxLat:36.416679,maxLon:-85.32733,numLat:1033,numLon:1234});
terrainList.push({name:'HiddenValleyCA.mm',source:1,minLat:33.907215,minLon:-117.527021,maxLat:33.923805,maxLon:-117.51253,numLat:1847,numLon:1339});
terrainList.push({name:'HighlandsRidgeNorth.mm',source:1,minLat:27.551202,minLon:-81.438237,maxLat:27.568209,maxLon:-81.422635,numLat:1893,numLon:1540});
terrainList.push({name:'HighlandsRidgeSouth.mm',source:1,minLat:27.531333,minLon:-81.43455,maxLat:27.545546,maxLon:-81.418586,numLat:1582,numLon:1576});
terrainList.push({name:'HolstonHills.mm',source:1,minLat:35.987914,minLon:-83.852864,maxLat:35.997579,maxLon:-83.831844,numLat:1077,numLon:1893});
terrainList.push({name:'HorseshoeBayAppleRock.mm',source:1,minLat:30.537916,minLon:-98.414571,maxLat:30.55616,maxLon:-98.388453,numLat:2031,numLon:2503});
terrainList.push({name:'HorseshoeBayRamRock.mm',source:1,minLat:30.528755,minLon:-98.414038,maxLat:30.548821,maxLon:-98.392919,numLat:2233,numLon:2025});
terrainList.push({name:'HorseshoeBaySlickRock.mm',source:1,minLat:30.531906,minLon:-98.380208,maxLat:30.547899,maxLon:-98.358304,numLat:1780,numLon:2100});
terrainList.push({name:'HualalaiNicklaus.mm',source:1,minLat:19.815483,minLon:-155.999295,maxLat:19.831074,maxLon:-155.979289,numLat:1736,numLon:2095});
terrainList.push({name:'Hurricane.mm',source:1,minLat:34.594041,minLon:-92.531734,maxLat:34.611254,maxLon:-92.510585,numLat:1916,numLon:1938});
terrainList.push({name:'Hurstbourne.mm',source:1,minLat:38.231428,minLon:-85.603487,maxLat:38.247727,maxLon:-85.580635,numLat:1814,numLon:1998});
terrainList.push({name:'IndianCreekTXCreek.mm',source:1,minLat:32.993724,minLon:-96.94466,maxLat:33.012995,maxLon:-96.929101,numLat:2145,numLon:1453});
terrainList.push({name:'IndianCreekTXLakes.mm',source:1,minLat:32.998211,minLon:-96.938219,maxLat:33.012459,maxLon:-96.925883,numLat:1586,numLon:1152});
terrainList.push({name:'IndianTree.mm',source:1,minLat:39.82653,minLon:-105.093344,maxLat:39.838963,maxLon:-105.079489,numLat:1384,numLon:1185});
terrainList.push({name:'InnisbrookCopperhead.mm',source:1,minLat:28.10568,minLon:-82.757892,maxLat:28.124486,maxLon:-82.746618,numLat:2093,numLon:1108});
terrainList.push({name:'JimmieAustin.mm',source:1,minLat:35.180057,minLon:-97.437409,maxLat:35.198397,maxLon:-97.423284,numLat:2041,numLon:1286});
terrainList.push({name:'JurupaHills.mm',source:1,minLat:33.968236,minLon:-117.447159,maxLat:33.981924,maxLon:-117.430161,numLat:1524,numLon:1569});
terrainList.push({name:'KeeneTraceChampionTrace.mm',source:1,minLat:37.964114,minLon:-84.646926,maxLat:37.979078,maxLon:-84.625152,numLat:1666,numLon:1911});
terrainList.push({name:'KearneyHill.mm',source:1,minLat:38.116886,minLon:-84.544895,maxLat:38.131051,maxLon:-84.527448,numLat:1577,numLon:1528});
terrainList.push({name:'KiawahIslandOcean.mm',source:1,minLat:32.607769,minLon:-80.04514,maxLat:32.617232,maxLon:-79.996659,numLat:1054,numLon:4543});
terrainList.push({name:'KingsmillRiver.mm',source:1,minLat:37.221214,minLon:-76.677568,maxLat:37.238011,maxLon:-76.655123,numLat:1870,numLon:1989});
terrainList.push({name:'Kinsale.mm',source:1,minLat:40.173116,minLon:-83.111527,maxLat:40.196678,maxLon:-83.087517,numLat:2622,numLon:2042});
terrainList.push({name:'KnollEast.mm',source:1,minLat:40.892228,minLon:-74.385324,maxLat:40.90367,maxLon:-74.372225,numLat:1274,numLon:1103});
terrainList.push({name:'KnollWest.mm',source:1,minLat:40.886722,minLon:-74.39285,maxLat:40.898734,maxLon:-74.379091,numLat:1338,numLon:1159});
terrainList.push({name:'KoasatiPines.mm',source:1,minLat:30.550878,minLon:-92.821238,maxLat:30.568816,maxLon:-92.804229,numLat:1997,numLon:1631});
terrainList.push({name:'LaCantera.mm',source:1,minLat:29.596983,minLon:-98.629772,maxLat:29.615555,maxLon:-98.610262,numLat:2067,numLon:1888});
terrainList.push({name:'LACCNorth.mm',source:1,minLat:34.066111,minLon:-118.431081,maxLat:34.081347,maxLon:-118.414611,numLat:1696,numLon:1519});
terrainList.push({name:'LaJolla.mm',source:1,minLat:32.831739,minLon:-117.27358,maxLat:32.845059,maxLon:-117.260363,numLat:1483,numLon:1237}); smoothTerrain(20);
terrainList.push({name:'LakeArrowheadHighlands.mm',source:1,minLat:34.28936,minLon:-84.630249,maxLat:34.315681,maxLon:-84.602634,numLat:2929,numLon:2539});
terrainList.push({name:'LakeMorey.mm',source:1,minLat:43.90183,minLon:-72.167241,maxLat:43.911795,maxLon:-72.150223,numLat:1110,numLon:1365});
terrainList.push({name:'LakeNona.mm',source:1,minLat:28.406286,minLon:-81.265969,maxLat:28.422247,maxLon:-81.244724,numLat:1777,numLon:2080});
terrainList.push({name:'LakePark.mm',source:1,minLat:33.064096,minLon:-97.010854,maxLat:33.074021,maxLon:-96.993692,numLat:1106,numLon:1601});
terrainList.push({name:'LakeRidge.mm',source:1,minLat:33.503499,minLon:-101.924178,maxLat:33.519893,maxLon:-101.903143,numLat:1825,numLon:1952});
terrainList.push({name:'LakesAtCastleHills.mm',source:1,minLat:33.025742,minLon:-96.912823,maxLat:33.047027,maxLon:-96.886994,numLat:2369,numLon:2410});
terrainList.push({name:'LakeWisconsin.mm',source:1,minLat:43.305674,minLon:-89.724982,maxLat:43.318161,maxLon:-89.712369,numLat:1390,numLon:1023});
terrainList.push({name:'LakewoodCA.mm',source:1,minLat:33.826149,minLon:-118.161983,maxLat:33.841353,maxLon:-118.142237,numLat:1693,numLon:1826});
terrainList.push({name:'LakewoodNationalCommander.mm',source:1,minLat:27.424066,minLon:-82.376428,maxLat:27.446525,maxLon:-82.36016,numLat:2499,numLon:1607});
terrainList.push({name:'LancasterCCPA.mm',source:1,minLat:40.055122,minLon:-76.276604,maxLat:40.069373,maxLon:-76.253595,numLat:1587,numLon:1960});
terrainList.push({name:'LandingsClubDeerCreek.mm',source:1,minLat:31.944115,minLon:-81.050911,maxLat:31.96811,maxLon:-81.033559,numLat:2670,numLon:1639});
terrainList.push({name:'LasSendas.mm',source:1,minLat:33.473342,minLon:-111.680541,maxLat:33.490936,maxLon:-111.659805,numLat:1958,numLon:1925});
terrainList.push({name:'LasVegasCC.mm',source:1,minLat:36.129682,minLon:-115.153742,maxLat:36.142195,maxLon:-115.136184,numLat:1393,numLon:1579});
terrainList.push({name:'LasVegasGC.mm',source:1,minLat:36.17933,minLon:-115.208087,maxLat:36.190119,maxLon:-115.190262,numLat:1202,numLon:1602});
terrainList.push({name:'LaTourette.mm',source:1,minLat:40.571326,minLon:-74.157192,maxLat:40.586379,maxLon:-74.135462,numLat:1676,numLon:1837});
terrainList.push({name:'LaughlinRanch.mm',source:1,minLat:35.132954,minLon:-114.546977,maxLat:35.142938,maxLon:-114.508918,numLat:1112,numLon:3463});
terrainList.push({name:'LesliePark.mm',source:1,minLat:42.300176,minLon:-83.730169,maxLat:42.31482,maxLon:-83.71471,numLat:1630,numLon:1273});
terrainList.push({name:'Lexington.mm',source:1,minLat:35.788428,minLon:-80.254513,maxLat:35.802057,maxLon:-80.242573,numLat:1517,numLon:1079});
terrainList.push({name:'LibertyNational.mm',source:1,minLat:40.686777,minLon:-74.084893,maxLat:40.699989,maxLon:-74.065816,numLat:1471,numLon:1610});
terrainList.push({name:'LincolnPark.mm',source:1,minLat:37.779712,minLon:-122.506782,maxLat:37.788674,maxLon:-122.491652,numLat:999,numLon:1332});
terrainList.push({name:'LinksOnTheBayou.mm',source:1,minLat:31.29705,minLon:-92.545194,maxLat:31.315212,maxLon:-92.532575,numLat:2022,numLon:1201});
terrainList.push({name:'LoneTree.mm',source:1,minLat:33.204397,minLon:-111.787386,maxLat:33.220806,maxLon:-111.771567,numLat:1827,numLon:1474});
terrainList.push({name:'LoneTreeCO.mm',source:1,minLat:39.527694,minLon:-104.902044,maxLat:39.549361,maxLon:-104.883619,numLat:2411,numLon:1582});
terrainList.push({name:'LostLake.mm',source:1,minLat:27.098393,minLon:-80.207802,maxLat:27.112625,maxLon:-80.187258,numLat:1585,numLon:2035});
terrainList.push({name:'LPGAInternationalHills.mm',source:1,minLat:29.17136,minLon:-81.119645,maxLat:29.191848,maxLon:-81.098197,numLat:2280,numLon:2084});
terrainList.push({name:'LPGAInternationalJones.mm',source:1,minLat:29.191312,minLon:-81.119116,maxLat:29.211353,maxLon:-81.100562,numLat:2230,numLon:1803});
terrainList.push({name:'MammothDunes.mm',source:1,minLat:44.167606,minLon:-89.857602,maxLat:44.184048,maxLon:-89.832587,numLat:1830,numLon:1997});
terrainList.push({name:'Maridoe.mm',source:1,minLat:32.958296,minLon:-96.87989,maxLat:32.969863,maxLon:-96.86212,numLat:1288,numLon:1660});
terrainList.push({name:'MarineMemorial.mm',source:1,minLat:33.257255,minLon:-117.337107,maxLat:33.284085,maxLon:-117.32304,numLat:2985,numLon:1310});
terrainList.push({name:'MarylandNational.mm',source:1,minLat:39.471954,minLon:-77.535788,maxLat:39.484165,maxLon:-77.518997,numLat:1360,numLon:1443});
terrainList.push({name:'MattaponiSprings.mm',source:1,minLat:37.939587,minLon:-77.377944,maxLat:37.954083,maxLon:-77.363033,numLat:1614,numLon:1309});
terrainList.push({name:'MaunaLaniNorth.mm',source:1,minLat:19.935259,minLon:-155.869231,maxLat:19.956195,maxLon:-155.846648,numLat:2330,numLon:2362});
terrainList.push({name:'MaunaLaniSouth.mm',source:1,minLat:19.925913,minLon:-155.886007,maxLat:19.94387,maxLon:-155.866,numLat:1999,numLon:2093});
terrainList.push({name:'McLemoreHighlands.mm',source:1,minLat:34.735452,minLon:-85.464699,maxLat:34.750237,maxLon:-85.438526,numLat:1646,numLon:2393});
terrainList.push({name:'MeadiaHeights.mm',source:1,minLat:40.006769,minLon:-76.302671,maxLat:40.01722,maxLon:-76.287305,numLat:1164,numLon:1311});
terrainList.push({name:'Meadowbrook.mm',source:1,minLat:42.430054,minLon:-83.455724,maxLat:42.439967,maxLon:-83.438643,numLat:1104,numLon:1404});
terrainList.push({name:'Meadowcreek.mm',source:1,minLat:38.044036,minLon:-78.460778,maxLat:38.059863,maxLon:-78.44619,numLat:1762,numLon:1279});
terrainList.push({name:'MeadowPark.mm',source:1,minLat:47.191365,minLon:-122.524018,maxLat:47.201031,maxLon:-122.506226,numLat:1077,numLon:1346});
terrainList.push({name:'Medalist.mm',source:1,minLat:27.077224,minLon:-80.163328,maxLat:27.090494,maxLon:-80.147724,numLat:1478,numLon:1547});
terrainList.push({name:'Miacomet.mm',source:1,minLat:41.252656,minLon:-70.13335,maxLat:41.265901,maxLon:-70.110351,numLat:1475,numLon:1924});
terrainList.push({name:'MidlandCC.mm',source:1,minLat:43.623571,minLon:-84.249215,maxLat:43.635807,maxLon:-84.23194,numLat:1363,numLon:1392});
terrainList.push({name:'MissionHillsGaryPlayer.mm',source:1,minLat:33.804671,minLon:-116.442513,maxLat:33.817698,maxLon:-116.421377,numLat:1451,numLon:1955}); shiftTerrain(-5.5,6);
terrainList.push({name:'MoffettField.mm',source:1,minLat:37.417046,minLon:-122.049613,maxLat:37.428702,maxLon:-122.033002,numLat:1298,numLon:1469});
terrainList.push({name:'MoheganSun.mm',source:1,minLat:41.631205,minLon:-72.121291,maxLat:41.644735,maxLon:-72.105627,numLat:1506,numLon:1304});
terrainList.push({name:'MonarchDunesChallenge.mm',source:1,minLat:35.026186,minLon:-120.552119,maxLat:35.035355,maxLon:-120.538519,numLat:1022,numLon:1240});
terrainList.push({name:'MonarchDunesOld.mm',source:1,minLat:35.02569,minLon:-120.56627,maxLat:35.041683,maxLon:-120.548884,numLat:1780,numLon:1585});
terrainList.push({name:'Montreux.mm',source:1,minLat:39.353755,minLon:-119.845636,maxLat:39.372616,maxLon:-119.818368,numLat:2099,numLon:2346});
terrainList.push({name:'MountainMeadows.mm',source:1,minLat:34.077669,minLon:-117.788902,maxLat:34.090119,maxLon:-117.772241,numLat:1386,numLon:1536});
terrainList.push({name:'MountainView.mm',source:1,minLat:40.777816,minLon:-77.765837,maxLat:40.790209,maxLon:-77.752552,numLat:1380,numLon:1121});
terrainList.push({name:'MountainVistaSanGorgonio.mm',source:1,minLat:33.778835,minLon:-116.302851,maxLat:33.799999,maxLon:-116.281994,numLat:2355,numLon:1929});
terrainList.push({name:'MountainVistaSantaRosa.mm',source:1,minLat:33.761098,minLon:-116.304448,maxLat:33.782081,maxLon:-116.285854,numLat:2335,numLon:1721});
terrainList.push({name:'MountVintage.mm',source:1,minLat:33.662782,minLon:-81.982664,maxLat:33.684523,maxLon:-81.949458,numLat:2419,numLon:3075});
terrainList.push({name:'MurphyCreek.mm',source:1,minLat:39.669241,minLon:-104.71836,maxLat:39.697975,maxLon:-104.698508,numLat:3197,numLon:1701});
terrainList.push({name:'MusketRidge.mm',source:1,minLat:39.487623,minLon:-77.559646,maxLat:39.501785,maxLon:-77.542802,numLat:1577,numLon:1447});
terrainList.push({name:'MysticRock.mm',source:1,minLat:39.789431,minLon:-79.542668,maxLat:39.80584,maxLon:-79.522422,numLat:1827,numLon:1732});
terrainList.push({name:'Nakoma.mm',source:1,minLat:43.037071,minLon:-89.443219,maxLat:43.048044,maxLon:-89.430553,numLat:1222,numLon:1031});
terrainList.push({name:'NationalGolfLinksOfAmerica.mm',source:1,minLat:40.894257,minLon:-72.458078,maxLat:40.917189,maxLon:-72.439621,numLat:2552,numLon:1553}); smoothTerrain(10);
terrainList.push({name:'NationalLouisiana.mm',source:1,minLat:30.267427,minLon:-93.276873,maxLat:30.280423,maxLon:-93.256392,numLat:1447,numLon:1969});
terrainList.push({name:'NativeOaks.mm',source:1,minLat:33.202842,minLon:-117.035445,maxLat:33.216157,maxLon:-117.006378,numLat:1483,numLon:2706});
terrainList.push({name:'NewportCC.mm',source:1,minLat:41.449775,minLon:-71.355043,maxLat:41.469487,maxLon:-71.340021,numLat:2194,numLon:1254});
terrainList.push({name:'NorthShoreTX.mm',source:1,minLat:27.873797,minLon:-97.307302,maxLat:27.893823,maxLon:-97.290212,numLat:2229,numLon:1682});
terrainList.push({name:'NorthStar.mm',source:1,minLat:40.269935,minLon:-82.906528,maxLat:40.29603,maxLon:-82.889242,numLat:2904,numLon:1468});
terrainList.push({name:'OakHillsPark.mm',source:1,minLat:41.107243,minLon:-73.451678,maxLat:41.121749,maxLon:-73.436887,numLat:1615,numLon:1241});
terrainList.push({name:'OaklandHillsNorth.mm',source:1,minLat:42.544098,minLon:-83.278867,maxLat:42.554518,maxLon:-83.262889,numLat:1161,numLon:1311});
terrainList.push({name:'Oakmont.mm',source:1,minLat:40.523653,minLon:-79.832433,maxLat:40.53482,maxLon:-79.813912,numLat:1244,numLon:1567}); shiftTerrain(-1,1);
terrainList.push({name:'OakQuarry.mm',source:1,minLat:34.017639,minLon:-117.441016,maxLat:34.035684,maxLon:-117.42321,numLat:2009,numLon:1643});
terrainList.push({name:'OakValleyBeaumont.mm',source:1,minLat:33.946521,minLon:-117.014038,maxLat:33.96301,maxLon:-116.986488,numLat:1835,numLon:2543});
terrainList.push({name:'OakWing.mm',source:1,minLat:31.312261,minLon:-92.541358,maxLat:31.327579,maxLon:-92.515413,numLat:1705,numLon:2467});
terrainList.push({name:'OceanPointFrippIsland.mm',source:1,minLat:32.31819,minLon:-80.472926,maxLat:32.333092,maxLon:-80.451988,numLat:1659,numLon:1969});
terrainList.push({name:'OCNCrookedCat.mm',source:1,minLat:28.440257,minLon:-81.63704,maxLat:28.457816,maxLon:-81.611028,numLat:1954,numLon:2545});
terrainList.push({name:'OCNPantherLake.mm',source:1,minLat:28.425473,minLon:-81.636126,maxLat:28.443076,maxLon:-81.621901,numLat:1959,numLon:1393});
terrainList.push({name:'Ogden.mm',source:1,minLat:41.180787,minLon:-111.984674,maxLat:41.192219,maxLon:-111.966085,numLat:1273,numLon:1558});
terrainList.push({name:'OhioStateUniversity.mm',source:1,minLat:40.027097,minLon:-83.065194,maxLat:40.042128,maxLon:-83.048405,numLat:1673,numLon:1431});
terrainList.push({name:'OhoopeeMatchClub.mm',source:1,minLat:32.24206,minLon:-82.213607,maxLat:32.259501,maxLon:-82.197243,numLat:1941,numLon:1541});
terrainList.push({name:'OhoopeeMatchClub2.mm',source:1,minLat:32.242048,minLon:-82.214502,maxLat:32.262533,maxLon:-82.197229,numLat:2280,numLon:1626});
terrainList.push({name:'OldGreenwood.mm',source:1,minLat:39.33562,minLon:-120.161765,maxLat:39.35567,maxLon:-120.140043,numLat:2231,numLon:1870});
terrainList.push({name:'OldTownClub.mm',source:1,minLat:36.118846,minLon:-80.277637,maxLat:36.134509,maxLon:-80.260824,numLat:1744,numLon:1512});
terrainList.push({name:'OlivasLinks.mm',source:1,minLat:34.235162,minLon:-119.256622,maxLat:34.245503,maxLon:-119.239307,numLat:1152,numLon:1594});
terrainList.push({name:'PalmerAlaska.mm',source:1,minLat:61.579665,minLon:-149.09099,maxLat:61.603977,maxLon:-149.070791,numLat:2705,numLon:1071}); shiftTerrain(-4,2); smoothTerrain(2);
terrainList.push({name:'Papago.mm',source:1,minLat:33.450156,minLon:-111.96712,maxLat:33.462875,maxLon:-111.953764,numLat:1416,numLon:1241});
terrainList.push({name:'Pasatiempo.mm',source:1,minLat:36.991526,minLon:-122.035371,maxLat:37.013463,maxLon:-122.020278,numLat:2441,numLon:1342});
terrainList.push({name:'PBDye.mm',source:1,minLat:39.28566,minLon:-77.350367,maxLat:39.297585,maxLon:-77.33522,numLat:1328,numLon:1306});
terrainList.push({name:'PebbleBeach.mm',source:1,minLat:36.555975,minLon:-121.952115,maxLat:36.572577,maxLon:-121.926692,numLat:1848,numLon:2273}); shiftTerrain(-1,0);
terrainList.push({name:'Pelican.mm',source:1,minLat:27.922923,minLon:-82.811783,maxLat:27.935588,maxLon:-82.799223,numLat:1410,numLon:1236});
terrainList.push({name:'PennState.mm',source:1,minLat:40.779983,minLon:-77.892535,maxLat:40.797895,maxLon:-77.868144,numLat:1994,numLon:2055});
terrainList.push({name:'PGANationalChampion.mm',source:1,minLat:26.816382,minLon:-80.153774,maxLat:26.831187,maxLon:-80.138929,numLat:1648,numLon:1475});
terrainList.push({name:'PhilaCricketMilitiaHill.mm',source:1,minLat:40.10688,minLon:-75.245952,maxLat:40.11793,maxLon:-75.220856,numLat:1231,numLon:2136});
terrainList.push({name:'PhilaCricketWissahickon.mm',source:1,minLat:40.103596,minLon:-75.239247,maxLat:40.114122,maxLon:-75.219384,numLat:1172,numLon:1691});
terrainList.push({name:'PhiladelphiaCC.mm',source:1,minLat:40.056051,minLon:-75.299692,maxLat:40.065044,maxLon:-75.279208,numLat:1002,numLon:1745});
terrainList.push({name:'PiedmontDrivingClub.mm',source:1,minLat:33.663772,minLon:-84.546731,maxLat:33.677564,maxLon:-84.522336,numLat:1536,numLon:2260});
terrainList.push({name:'PikewoodNational.mm',source:1,minLat:39.533684,minLon:-79.868693,maxLat:39.549199,maxLon:-79.84871,numLat:1727,numLon:1716});
terrainList.push({name:'Pinetree.mm',source:1,minLat:34.027238,minLon:-84.599646,maxLat:34.049787,maxLon:-84.586032,numLat:2509,numLon:1256});
terrainList.push({name:'PineDunes.mm',source:1,minLat:31.974998,minLon:-95.548113,maxLat:31.988131,maxLon:-95.526204,numLat:1462,numLon:2068});
terrainList.push({name:'PineValley.mm',source:1,minLat:39.781479,minLon:-74.978553,maxLat:39.794854,maxLon:-74.960027,numLat:1489,numLon:1585});
terrainList.push({name:'PinnacleCC.mm',source:1,minLat:36.29036,minLon:-94.210673,maxLat:36.301384,maxLon:-94.187932,numLat:1228,numLon:2040});
terrainList.push({name:'PlateauClub.mm',source:1,minLat:47.596964,minLon:-122.01447,maxLat:47.611866,maxLon:-121.989721,numLat:1659,numLon:1857});
terrainList.push({name:'PlumCreek.mm',source:1,minLat:30.008889,minLon:-97.890305,maxLat:30.028279,maxLon:-97.868926,numLat:2158,numLon:2060});
terrainList.push({name:'PotomacShores.mm',source:1,minLat:38.570003,minLon:-77.2959,maxLat:38.585748,maxLon:-77.264989,numLat:1753,numLon:2689});
terrainList.push({name:'PowerRanch.mm',source:1,minLat:33.248701,minLon:-111.704997,maxLat:33.266718,maxLon:-111.68433,numLat:2005,numLon:1924});
terrainList.push({name:'PrairieClubDunes.mm',source:1,minLat:42.711867,minLon:-100.833887,maxLat:42.729995,maxLon:-100.793688,numLat:2018,numLon:3286});
terrainList.push({name:'PrairieClubPines.mm',source:1,minLat:42.701574,minLon:-100.852133,maxLat:42.725159,maxLon:-100.828452,numLat:2625,numLon:1937});
terrainList.push({name:'PrincetonCC.mm',source:1,minLat:40.307075,minLon:-74.679384,maxLat:40.320769,maxLon:-74.666887,numLat:1525,numLon:1062});
terrainList.push({name:'PurdueAckerman.mm',source:1,minLat:40.429546,minLon:-86.938751,maxLat:40.440477,maxLon:-86.917491,numLat:1217,numLon:1801});
terrainList.push({name:'PurdueKampen.mm',source:1,minLat:40.437862,minLon:-86.935987,maxLat:40.45325,maxLon:-86.921688,numLat:1713,numLon:1212});
terrainList.push({name:'RanchoBernardoCC.mm',source:1,minLat:33.021354,minLon:-117.068588,maxLat:33.042253,maxLon:-117.058035,numLat:2326,numLon:986});
terrainList.push({name:'RedTailRun.mm',source:1,minLat:39.795164,minLon:-88.975269,maxLat:39.815335,maxLon:-88.953155,numLat:2245,numLon:1891});
terrainList.push({name:'Reedsburg.mm',source:1,minLat:43.530959,minLon:-89.966923,maxLat:43.54155,maxLon:-89.944542,numLat:1180,numLon:1806});
terrainList.push({name:'Richland.mm',source:1,minLat:39.42266,minLon:-77.535964,maxLat:39.43895,maxLon:-77.518427,numLat:1813,numLon:1508});
terrainList.push({name:'RioBravo.mm',source:1,minLat:35.39606,minLon:-118.84627,maxLat:35.413112,maxLon:-118.828236,numLat:1898,numLon:1636});
terrainList.push({name:'RitzCarltonGrandeLakes.mm',source:1,minLat:28.390382,minLon:-81.437758,maxLat:28.411222,maxLon:-81.42406,numLat:2319,numLon:1342});
terrainList.push({name:'RiverForest.mm',source:1,minLat:40.648571,minLon:-79.694557,maxLat:40.666612,maxLon:-79.682085,numLat:2008,numLon:1054});
terrainList.push({name:'RiverPlantation.mm',source:1,minLat:30.241103,minLon:-95.449186,maxLat:30.257049,maxLon:-95.429665,numLat:1775,numLon:1877});
terrainList.push({name:'RiverwoodFL.mm',source:1,minLat:26.969892,minLon:-82.227861,maxLat:26.99085,maxLon:-82.205735,numLat:2332,numLon:2195});
terrainList.push({name:'Riviera.mm',source:1,minLat:34.038345,minLon:-118.511439,maxLat:34.052131,maxLon:-118.492953,numLat:1535,numLon:1705});
terrainList.push({name:'RobertTrentJonesGC.mm',source:1,minLat:38.770456,minLon:-77.64311,maxLat:38.78835,maxLon:-77.623177,numLat:1992,numLon:1730}); smoothTerrain(5);
terrainList.push({name:'RobbersRow.mm',source:1,minLat:32.212413,minLon:-80.690498,maxLat:32.232781,maxLon:-80.67139,numLat:2267,numLon:1799});
terrainList.push({name:'RockawayHuntingClub.mm',source:1,minLat:40.608986,minLon:-73.719049,maxLat:40.621974,maxLon:-73.697511,numLat:1446,numLon:1820});
terrainList.push({name:'RockRidge.mm',source:1,minLat:40.829735,minLon:-74.825081,maxLat:40.839657,maxLon:-74.807347,numLat:1105,numLon:1494});
terrainList.push({name:'RossmoorDollarRanch.mm',source:1,minLat:37.848659,minLon:-122.071467,maxLat:37.867534,maxLon:-122.054512,numLat:2101,numLon:1491});
terrainList.push({name:'RumPointe.mm',source:1,minLat:38.237146,minLon:-75.172689,maxLat:38.254488,maxLon:-75.154504,numLat:1930,numLon:1590});
terrainList.push({name:'RushCreek.mm',source:1,minLat:45.093011,minLon:-93.534934,maxLat:45.103454,maxLon:-93.5119,numLat:1163,numLon:1810});
terrainList.push({name:'Saddlebrook.mm',source:1,minLat:39.837121,minLon:-86.228697,maxLat:39.862609,maxLon:-86.21468,numLat:2836,numLon:1199});
terrainList.push({name:'SaddleBrookeRanch.mm',source:1,minLat:32.577902,minLon:-110.932582,maxLat:32.600919,maxLon:-110.913417,numLat:2561,numLon:1798});
terrainList.push({name:'Sahalee.mm',source:1,minLat:47.62704,minLon:-122.064957,maxLat:47.643595,maxLon:-122.044888,numLat:1843,numLon:1506});
terrainList.push({name:'Sandbox.mm',source:1,minLat:44.174637,minLon:-89.861173,maxLat:44.181582,maxLon:-89.851412,numLat:774,numLon:780});
terrainList.push({name:'SandestinBaytowne.mm',source:1,minLat:30.370738,minLon:-86.333414,maxLat:30.396685,maxLon:-86.31541,numLat:2887,numLon:1729});
terrainList.push({name:'SandestinBurntPine.mm',source:1,minLat:30.391076,minLon:-86.329396,maxLat:30.411262,maxLon:-86.310208,numLat:2247,numLon:1842});
terrainList.push({name:'SandestinLinks.mm',source:1,minLat:30.375098,minLon:-86.349127,maxLat:30.389648,maxLon:-86.32824,numLat:1620,numLon:2006});
terrainList.push({name:'SandestinRaven.mm',source:1,minLat:30.383774,minLon:-86.323444,maxLat:30.40206,maxLon:-86.307056,numLat:2035,numLon:1574});
terrainList.push({name:'SandHills.mm',source:1,minLat:41.864726,minLon:-101.115416,maxLat:41.87693,maxLon:-101.086269,numLat:1359,numLon:2415});
terrainList.push({name:'SandHollowChamp.mm',source:1,minLat:37.112666,minLon:-113.427131,maxLat:37.128463,maxLon:-113.397826,numLat:1759,numLon:2600});
terrainList.push({name:'SandValley.mm',source:1,minLat:44.161369,minLon:-89.871532,maxLat:44.176288,maxLon:-89.8445,numLat:1661,numLon:2158});
terrainList.push({name:'SanJoseCA.mm',source:1,minLat:37.380935,minLon:-121.832171,maxLat:37.391006,maxLon:-121.812816,numLat:1122,numLon:1712});
terrainList.push({name:'SanJoseFL.mm',source:1,minLat:30.233369,minLon:-81.626312,maxLat:30.244356,maxLon:-81.610092,numLat:1224,numLon:1560});
terrainList.push({name:'SavannahHarbor.mm',source:1,minLat:32.085041,minLon:-81.092015,maxLat:32.098335,maxLon:-81.069254,numLat:1480,numLon:2146});
terrainList.push({name:'SeaIslandPlantation.mm',source:1,minLat:31.135411,minLon:-81.409904,maxLat:31.155842,maxLon:-81.396894,numLat:2274,numLon:1240}); shiftTerrain(3,1);
terrainList.push({name:'SeaIslandRetreat.mm',source:1,minLat:31.144914,minLon:-81.41034,maxLat:31.166467,maxLon:-81.389923,numLat:2399,numLon:1945}); shiftTerrain(3,1);
terrainList.push({name:'SeaIslandSeaside.mm',source:1,minLat:31.138506,minLon:-81.416957,maxLat:31.153055,maxLon:-81.403185,numLat:1620,numLon:1313}); shiftTerrain(3,1);
terrainList.push({name:'SeaviewBay.mm',source:1,minLat:39.443741,minLon:-74.47499,maxLat:39.455281,maxLon:-74.461163,numLat:1285,numLon:1189});
terrainList.push({name:'Sebonack.mm',source:1,minLat:40.901933,minLon:-72.467257,maxLat:40.914085,maxLon:-72.448061,numLat:1353,numLon:1615}); smoothTerrain(10);
terrainList.push({name:'Secession.mm',source:1,minLat:32.38794,minLon:-80.661848,maxLat:32.399491,maxLon:-80.643968,numLat:1286,numLon:1681});
terrainList.push({name:'Seminole.mm',source:1,minLat:26.85775,minLon:-80.056949,maxLat:26.868422,maxLon:-80.045048,numLat:1189,numLon:1183});
terrainList.push({name:'SevilleAZ.mm',source:1,minLat:33.222974,minLon:-111.720565,maxLat:33.234336,maxLon:-111.69334,numLat:1265,numLon:2534});
terrainList.push({name:'ShadowCreek.mm',source:1,minLat:36.252829,minLon:-115.115558,maxLat:36.263127,maxLon:-115.097025,numLat:1147,numLon:1664});
terrainList.push({name:'SheepRanch.mm',source:1,minLat:43.209652,minLon:-124.399282,maxLat:43.225803,maxLon:-124.386216,numLat:1798,numLon:1061}); smoothTerrain(10);
terrainList.push({name:'ShepherdsRock.mm',source:1,minLat:39.798694,minLon:-79.547531,maxLat:39.815713,maxLon:-79.523634,numLat:1894,numLon:2043});
terrainList.push({name:'ShinnecockHills.mm',source:1,minLat:40.89105,minLon:-72.448506,maxLat:40.903677,maxLon:-72.431535,numLat:1406,numLon:1428}); smoothTerrain(10);
terrainList.push({name:'SilveradoNorth.mm',source:1,minLat:38.347513,minLon:-122.269353,maxLat:38.36373,maxLon:-122.256232,numLat:1805,numLon:1146});
terrainList.push({name:'Silverhorn.mm',source:1,minLat:29.560367,minLon:-98.510759,maxLat:29.578473,maxLon:-98.499189,numLat:2015,numLon:1121});
terrainList.push({name:'SilverSpring.mm',source:1,minLat:41.243292,minLon:-73.514322,maxLat:41.261968,maxLon:-73.496979,numLat:2079,numLon:1452});
terrainList.push({name:'SimiHills.mm',source:1,minLat:34.284669,minLon:-118.698418,maxLat:34.301978,maxLon:-118.683256,numLat:1927,numLon:1395});
terrainList.push({name:'Skaneateles.mm',source:1,minLat:42.928229,minLon:-76.458614,maxLat:42.938043,maxLon:-76.425139,numLat:1093,numLon:2727});
terrainList.push({name:'SkytopMountain.mm',source:1,minLat:40.826119,minLon:-78.015059,maxLat:40.838582,maxLon:-77.986567,numLat:1388,numLon:2399});
terrainList.push({name:'SleepyHollow.mm',source:1,minLat:41.11872,minLon:-73.86205,maxLat:41.133649,maxLon:-73.843639,numLat:1662,numLon:1544});
terrainList.push({name:'SobobaSprings.mm',source:1,minLat:33.785794,minLon:-116.94114,maxLat:33.803447,maxLon:-116.926472,numLat:1965,numLon:1357});
terrainList.push({name:'SoldierHill.mm',source:1,minLat:40.960184,minLon:-74.031244,maxLat:40.972295,maxLon:-74.015459,numLat:1349,numLon:1327});
terrainList.push({name:'SomersetHills.mm',source:1,minLat:40.717122,minLon:-74.59852,maxLat:40.726521,maxLon:-74.577645,numLat:1047,numLon:1761});
terrainList.push({name:'Somersett.mm',source:1,minLat:39.525979,minLon:-119.949461,maxLat:39.542084,maxLon:-119.918895,numLat:1793,numLon:2623});
terrainList.push({name:'SouthSide.mm',source:1,minLat:39.796927,minLon:-88.995755,maxLat:39.811017,maxLon:-88.982577,numLat:1569,numLon:1128});
terrainList.push({name:'SpyglassHill.mm',source:1,minLat:36.578911,minLon:-121.966978,maxLat:36.591335,maxLon:-121.943517,numLat:1383,numLon:2097});
terrainList.push({name:'Stanford.mm',source:1,minLat:37.41466,minLon:-122.194068,maxLat:37.430467,maxLon:-122.180277,numLat:1760,numLon:1220});
terrainList.push({name:'Statesville.mm',source:1,minLat:35.782764,minLon:-80.824514,maxLat:35.799652,maxLon:-80.810295,numLat:1880,numLon:1284});
terrainList.push({name:'SteeleCanyonCanyon.mm',source:1,minLat:32.741772,minLon:-116.895853,maxLat:32.750318,maxLon:-116.880831,numLat:952,numLon:1407});
terrainList.push({name:'SteeleCanyonRanch.mm',source:1,minLat:32.742588,minLon:-116.908605,maxLat:32.752849,maxLon:-116.890839,numLat:1143,numLon:1664});
terrainList.push({name:'SteeleCanyonVineyard.mm',source:1,minLat:32.735527,minLon:-116.904746,maxLat:32.746544,maxLon:-116.889111,numLat:1227,numLon:1464});
terrainList.push({name:'SteepleChase.mm',source:1,minLat:42.257328,minLon:-88.069994,maxLat:42.267869,maxLon:-88.040825,numLat:1174,numLon:2402});
terrainList.push({name:'SterlingHills.mm',source:1,minLat:34.235501,minLon:-119.099519,maxLat:34.249939,maxLon:-119.08247,numLat:1607,numLon:1569});
terrainList.push({name:'StonegateCypress.mm',source:1,minLat:28.129469,minLon:-81.483738,maxLat:28.146537,maxLon:-81.456664,numLat:1900,numLon:2657});
terrainList.push({name:'StonegateOaks.mm',source:1,minLat:28.116388,minLon:-81.490857,maxLat:28.138794,maxLon:-81.47123,numLat:2493,numLon:1927});
terrainList.push({name:'StreamsongBlack.mm',source:1,minLat:27.662762,minLon:-81.940521,maxLat:27.67281,maxLon:-81.917121,numLat:1119,numLon:2306});
terrainList.push({name:'StreamsongRedBlue.mm',source:1,minLat:27.670562,minLon:-81.951376,maxLat:27.688592,maxLon:-81.925432,numLat:2007,numLon:2557});
terrainList.push({name:'SugarTree.mm',source:1,minLat:32.60104,minLon:-97.940513,maxLat:32.617602,maxLon:-97.923756,numLat:1844,numLon:1572});
terrainList.push({name:'SultansRun.mm',source:1,minLat:38.395709,minLon:-86.907129,maxLat:38.407674,maxLon:-86.888638,numLat:1332,numLon:1613});
terrainList.push({name:'SunLakesCA.mm',source:1,minLat:33.905289,minLon:-116.948646,maxLat:33.923236,maxLon:-116.928852,numLat:1998,numLon:1829});
terrainList.push({name:'Sunnyvale.mm',source:1,minLat:37.392915,minLon:-122.049401,maxLat:37.404211,maxLon:-122.033843,numLat:1258,numLon:1376});
terrainList.push({name:'SuperstitionMountainLostGold.mm',source:1,minLat:33.377976,minLon:-111.473637,maxLat:33.391327,maxLon:-111.440687,numLat:1487,numLon:3061});
terrainList.push({name:'SuperstitionMountainProspector.mm',source:1,minLat:33.380876,minLon:-111.474021,maxLat:33.395001,maxLon:-111.45513,numLat:1573,numLon:1756});
terrainList.push({name:'TangleRidge.mm',source:1,minLat:32.560529,minLon:-97.027097,maxLat:32.571147,maxLon:-97.008703,numLat:1183,numLon:1726});
terrainList.push({name:'TCCBrookline.mm',source:1,minLat:42.306258,minLon:-71.161404,maxLat:42.319891,maxLon:-71.140292,numLat:1518,numLon:1738});
terrainList.push({name:'TempleHills.mm',source:1,minLat:36.004479,minLon:-86.963064,maxLat:36.031722,maxLon:-86.945677,numLat:3031,numLon:1566});
terrainList.push({name:'TennesseeNational.mm',source:1,minLat:35.756605,minLon:-84.423559,maxLat:35.776471,maxLon:-84.399677,numLat:2211,numLon:2157});
terrainList.push({name:'TerraLago.mm',source:1,minLat:33.732298,minLon:-116.200861,maxLat:33.750792,maxLon:-116.172726,numLat:2058,numLon:2603});
terrainList.push({name:'Tetherow.mm',source:1,minLat:44.023142,minLon:-121.370821,maxLat:44.041028,maxLon:-121.350405,numLat:1991,numLon:1634});
terrainList.push({name:'TexasRangers.mm',source:1,minLat:32.773784,minLon:-97.108396,maxLat:32.786204,maxLon:-97.094187,numLat:1383,numLon:1330});
terrainList.push({name:'TheBridges.mm',source:1,minLat:37.762143,minLon:-121.94363,maxLat:37.783427,maxLon:-121.928824,numLat:2369,numLon:1303});
terrainList.push({name:'TheClubAtGlenmore.mm',source:1,minLat:37.976865,minLon:-78.394552,maxLat:38.003437,maxLon:-78.372668,numLat:2957,numLon:1920});
terrainList.push({name:'TheCreekAtQualchan.mm',source:1,minLat:47.601603,minLon:-117.424123,maxLat:47.615648,maxLon:-117.40235,numLat:1564,numLon:1634});
terrainList.push({name:'TheForest.mm',source:1,minLat:26.493583,minLon:-81.875822,maxLat:26.511121,maxLon:-81.857149,numLat:1952,numLon:1860});
terrainList.push({name:'TheLegendAtBergamont.mm',source:1,minLat:42.912793,minLon:-89.425216,maxLat:42.923564,maxLon:-89.393466,numLat:1200,numLon:2587});
terrainList.push({name:'TheLinksAtSpanishBay.mm',source:1,minLat:36.603755,minLon:-121.952009,maxLat:36.619106,maxLon:-121.931364,numLat:1709,numLon:1845});
terrainList.push({name:'TheMeadowsOfSixmileCreek.mm',source:1,minLat:43.193919,minLon:-89.475078,maxLat:43.204703,maxLon:-89.459574,numLat:1201,numLon:1259});
terrainList.push({name:'TheRidgeAtCastlePinesNorth.mm',source:1,minLat:39.457546,minLon:-104.915853,maxLat:39.484091,maxLon:-104.896078,numLat:2954,numLon:1699});
terrainList.push({name:'Thornblade.mm',source:1,minLat:34.863139,minLon:-82.279586,maxLat:34.877071,maxLon:-82.255874,numLat:1551,numLon:2165});
terrainList.push({name:'TiburonBlack.mm',source:1,minLat:26.242418,minLon:-81.766242,maxLat:26.255767,maxLon:-81.742612,numLat:1486,numLon:2359});
terrainList.push({name:'TiburonGold.mm',source:1,minLat:26.242682,minLon:-81.770869,maxLat:26.268249,maxLon:-81.752596,numLat:2845,numLon:1824});
terrainList.push({name:'TheBroadmoor.mm',source:1,minLat:38.772894,minLon:-104.857032,maxLat:38.790859,maxLon:-104.840224,numLat:2000,numLon:1459});
terrainList.push({name:'TheCrossingsCarlsbad.mm',source:1,minLat:33.122678,minLon:-117.308673,maxLat:33.13756,maxLon:-117.287332,numLat:1657,numLon:1989});
terrainList.push({name:'TheGroveXXIII.mm',source:1,minLat:27.072311,minLon:-80.224496,maxLat:27.085738,maxLon:-80.212455,numLat:1495,numLon:1194});
terrainList.push({name:'TheHaven.mm',source:1,minLat:42.345801,minLon:-71.714392,maxLat:42.359583,maxLon:-71.700325,numLat:1534,numLon:1158});
terrainList.push({name:'TheLinksAtHiawathaLanding.mm',source:1,minLat:42.087223,minLon:-76.180044,maxLat:42.099565,maxLon:-76.154797,numLat:1374,numLon:2085});
terrainList.push({name:'TheRiver.mm',source:1,minLat:33.478095,minLon:-81.973916,maxLat:33.488836,maxLon:-81.95108,numLat:1196,numLon:2120});
terrainList.push({name:'TheSpurAtNorthwoods.mm',source:1,minLat:34.097686,minLon:-80.982018,maxLat:34.109369,maxLon:-80.960316,numLat:1301,numLon:2000});
terrainList.push({name:'TorreyPinesSouth.mm',source:1,minLat:32.888477,minLon:-117.254328,maxLat:32.905876,maxLon:-117.240942,numLat:1937,numLon:1252});
terrainList.push({name:'TPCBoston.mm',source:1,minLat:41.96865,minLon:-71.234463,maxLat:41.989352,maxLon:-71.213165,numLat:2304,numLon:1763});
terrainList.push({name:'TPCColorado.mm',source:1,minLat:40.325822,minLon:-105.120957,maxLat:40.351018,maxLon:-105.102297,numLat:2804,numLon:1584});
terrainList.push({name:'TPCDeereRun.mm',source:1,minLat:41.469657,minLon:-90.401937,maxLat:41.485593,maxLon:-90.385683,numLat:1774,numLon:1356});
terrainList.push({name:'TPCLasColinas.mm',source:1,minLat:32.861396,minLon:-96.963752,maxLat:32.880876,maxLon:-96.944799,numLat:2168,numLon:1772});
terrainList.push({name:'TPCLouisiana.mm',source:1,minLat:29.892077,minLon:-90.201548,maxLat:29.906616,maxLon:-90.186367,numLat:1619,numLon:1465});
terrainList.push({name:'TPCPotomac.mm',source:1,minLat:38.983932,minLon:-77.210945,maxLat:39.006026,maxLon:-77.187267,numLat:2459,numLon:2048}); smoothTerrain(5);
terrainList.push({name:'TPCSanAntonioCanyons.mm',source:1,minLat:29.665644,minLon:-98.41387,maxLat:29.68281,maxLon:-98.390153,numLat:1911,numLon:2293});
terrainList.push({name:'TPCSanAntonioOaks.mm',source:1,minLat:29.646603,minLon:-98.402834,maxLat:29.667776,maxLon:-98.390346,numLat:2356,numLon:1209});
terrainList.push({name:'TPCSawgrassDyeValley.mm',source:1,minLat:30.185842,minLon:-81.407813,maxLat:30.218739,maxLon:-81.392485,numLat:3660,numLon:1475});
terrainList.push({name:'TPCSawgrassStadium.mm',source:1,minLat:30.188977,minLon:-81.40117,maxLat:30.206113,maxLon:-81.383893,numLat:1907,numLon:1662});
terrainList.push({name:'TPCScottsdaleChampions.mm',source:1,minLat:33.631223,minLon:-111.908372,maxLat:33.640671,maxLon:-111.889194,numLat:1053,numLon:1777});
terrainList.push({name:'TPCScottsdaleStadium.mm',source:1,minLat:33.634254,minLon:-111.9258,maxLat:33.645873,maxLon:-111.906244,numLat:1294,numLon:1812});
terrainList.push({name:'TPCSugarloaf.mm',source:1,minLat:33.989259,minLon:-84.120065,maxLat:34.013265,maxLon:-84.098474,numLat:2671,numLon:1992});
terrainList.push({name:'TPCSummerlin.mm',source:1,minLat:36.176843,minLon:-115.300699,maxLat:36.199017,maxLon:-115.285578,numLat:2468,numLon:1359});
terrainList.push({name:'TPCWoodlandTrails.mm',source:1,minLat:40.183999,minLon:-85.476826,maxLat:40.197965,maxLon:-85.459633,numLat:1555,numLon:1462});
terrainList.push({name:'TroonNorthMonument.mm',source:1,minLat:33.735551,minLon:-111.87899,maxLat:33.7511,maxLon:-111.844912,numLat:1731,numLon:3153});
terrainList.push({name:'TroonNorthPinnacle.mm',source:1,minLat:33.7441,minLon:-111.87007,maxLat:33.757355,maxLon:-111.844233,numLat:1476,numLon:2391});
terrainList.push({name:'TrumpNationalBedminster.mm',source:1,minLat:40.642523,minLon:-74.708274,maxLat:40.664772,maxLon:-74.687343,numLat:2476,numLon:1768});
terrainList.push({name:'TwinBridges.mm',source:1,minLat:39.742851,minLon:-86.52014,maxLat:39.754772,maxLon:-86.502681,numLat:1328,numLon:1495});
terrainList.push({name:'TwinLakes.mm',source:1,minLat:38.812374,minLon:-77.414485,maxLat:38.830944,maxLon:-77.395701,numLat:2067,numLon:1629});
terrainList.push({name:'TwinOaks.mm',source:1,minLat:33.153556,minLon:-117.162785,maxLat:33.17491,maxLon:-117.151343,numLat:2376,numLon:1067});
terrainList.push({name:'UCKBigBlue.mm',source:1,minLat:38.110812,minLon:-84.618059,maxLat:38.125122,maxLon:-84.602013,numLat:1593,numLon:1406});
terrainList.push({name:'UCKWildcat.mm',source:1,minLat:38.107298,minLon:-84.618136,maxLat:38.118989,maxLon:-84.599321,numLat:1302,numLon:1648});
terrainList.push({name:'UniversityOfMichigan.mm',source:1,minLat:42.252202,minLon:-83.752377,maxLat:42.264875,maxLon:-83.738043,numLat:1411,numLon:1182});
terrainList.push({name:'UniversityOfTexas.mm',source:1,minLat:30.345356,minLon:-97.900055,maxLat:30.369414,maxLon:-97.882598,numLat:2677,numLon:1677});
terrainList.push({name:'UpperMontclair.mm',source:1,minLat:40.836747,minLon:-74.181521,maxLat:40.850252,maxLon:-74.166799,numLat:1504,numLon:1240});
terrainList.push({name:'UteCreek.mm',source:1,minLat:40.187504,minLon:-105.087199,maxLat:40.204712,maxLon:-105.060203,numLat:1915,numLon:2295});
terrainList.push({name:'Valhalla.mm',source:1,minLat:38.235767,minLon:-85.482666,maxLat:38.250295,maxLon:-85.46028,numLat:1617,numLon:1957});
terrainList.push({name:'VerandahOldOrange.mm',source:1,minLat:26.688621,minLon:-81.76551,maxLat:26.705726,maxLon:-81.74351,numLat:1904,numLon:2187});
terrainList.push({name:'VerandahWhisperingOak.mm',source:1,minLat:26.686233,minLon:-81.752203,maxLat:26.709381,maxLon:-81.725292,numLat:2576,numLon:2675});
terrainList.push({name:'VictoriaClub.mm',source:1,minLat:33.958097,minLon:-117.369303,maxLat:33.966315,maxLon:-117.347728,numLat:916,numLon:1992});
terrainList.push({name:'VillageLinksOfGlenEllyn.mm',source:1,minLat:41.84653,minLon:-88.079612,maxLat:41.859998,maxLon:-88.05986,numLat:1500,numLon:1638});
terrainList.push({name:'WashingtonNational.mm',source:1,minLat:47.299192,minLon:-122.168155,maxLat:47.31423,maxLon:-122.142129,numLat:1674,numLon:1964});
terrainList.push({name:'WestinRanchoMiragePeteDye.mm',source:1,minLat:33.79147,minLon:-116.425283,maxLat:33.802545,maxLon:-116.404742,numLat:1233,numLon:1900});
terrainList.push({name:'WestlakeAustin.mm',source:1,minLat:30.27044,minLon:-97.858082,maxLat:30.288319,maxLon:-97.843317,numLat:1990,numLon:1420});
terrainList.push({name:'WhirlwindCattail.mm',source:1,minLat:33.256569,minLon:-111.999902,maxLat:33.274411,maxLon:-111.976652,numLat:1986,numLon:2164});
terrainList.push({name:'WhirlwindDevilsClaw.mm',source:1,minLat:33.268706,minLon:-111.997012,maxLat:33.283218,maxLon:-111.97732,numLat:1616,numLon:1833});
terrainList.push({name:'WhiskeyCreek.mm',source:1,minLat:39.358579,minLon:-77.306022,maxLat:39.371333,maxLon:-77.289698,numLat:1420,numLon:1405});
terrainList.push({name:'WhisperingWillows.mm',source:1,minLat:42.43082,minLon:-83.416638,maxLat:42.441277,maxLon:-83.403425,numLat:1165,numLon:1086});
terrainList.push({name:'WhistlingStraitsStraits.mm',source:1,minLat:43.833704,minLon:-87.738346,maxLat:43.866435,maxLon:-87.726109,numLat:3642,numLon:983});
terrainList.push({name:'WhiteColumns.mm',source:1,minLat:34.140479,minLon:-84.339995,maxLat:34.15581,maxLon:-84.321649,numLat:1707,numLon:1690});
terrainList.push({name:'WhiteManor.mm',source:1,minLat:39.99699,minLon:-75.486542,maxLat:40.012604,maxLon:-75.475604,numLat:1738,numLon:934});
terrainList.push({name:'WhittierNarrows.mm',source:1,minLat:34.04014,minLon:-118.083673,maxLat:34.060377,maxLon:-118.070428,numLat:2252,numLon:1222});
terrainList.push({name:'WildHawk.mm',source:1,minLat:38.471849,minLon:-121.318252,maxLat:38.48336,maxLon:-121.304657,numLat:1282,numLon:1185});
terrainList.push({name:'WillowOaks.mm',source:1,minLat:37.53388,minLon:-77.511514,maxLat:37.546852,maxLon:-77.49806,numLat:1444,numLon:1188});
terrainList.push({name:'WilshireCC.mm',source:1,minLat:34.067251,minLon:-118.33631,maxLat:34.084875,maxLon:-118.325775,numLat:1962,numLon:972});
terrainList.push({name:'WindingCreek.mm',source:1,minLat:35.893091,minLon:-80.110836,maxLat:35.906841,maxLon:-80.095372,numLat:1531,numLon:1395});
terrainList.push({name:'WindingRidge.mm',source:1,minLat:39.839984,minLon:-85.974503,maxLat:39.857569,maxLon:-85.951506,numLat:1957,numLon:1965});
terrainList.push({name:'WindsongFarmSouth.mm',source:1,minLat:44.977089,minLon:-93.749537,maxLat:44.988198,maxLon:-93.730558,numLat:1237,numLon:1495}); shiftTerrain(-0.5,-0.5);
terrainList.push({name:'Windsor.mm',source:1,minLat:38.52376,minLon:-122.818778,maxLat:38.534445,maxLon:-122.802457,numLat:1190,numLon:1422});
terrainList.push({name:'WindsweptDunes.mm',source:1,minLat:30.479988,minLon:-86.041194,maxLat:30.50079,maxLon:-86.023027,numLat:2315,numLon:1743});
terrainList.push({name:'WingedFoot.mm',source:1,minLat:40.952939,minLon:-73.761234,maxLat:40.972137,maxLon:-73.745897,numLat:2137,numLon:1290});
terrainList.push({name:'WolfCreek.mm',source:1,minLat:36.82912,minLon:-114.065265,maxLat:36.845452,maxLon:-114.049626,numLat:1818,numLon:1394});
terrainList.push({name:'Wolfdancer.mm',source:1,minLat:30.154819,minLon:-97.46469,maxLat:30.167808,maxLon:-97.44307,numLat:1446,numLon:2081});
terrainList.push({name:'WoodlandsNorth.mm',source:1,minLat:30.14236,minLon:-95.495065,maxLat:30.157838,maxLon:-95.470746,numLat:1723,numLon:2340});
terrainList.push({name:'WoodlandsPalmer.mm',source:1,minLat:30.178944,minLon:-95.535091,maxLat:30.205253,maxLon:-95.510061,numLat:2927,numLon:2408});
terrainList.push({name:'WoodlandsPlayer.mm',source:1,minLat:30.186095,minLon:-95.579611,maxLat:30.204615,maxLon:-95.55681,numLat:2061,numLon:2193});
terrainList.push({name:'WoodlandsTournament.mm',source:1,minLat:30.142094,minLon:-95.472613,maxLat:30.156957,maxLon:-95.450558,numLat:1655,numLon:2123});
terrainList.push({name:'WoodlandsWest.mm',source:1,minLat:30.1151,minLon:-95.487523,maxLat:30.145782,maxLon:-95.471324,numLat:3414,numLon:1560});
terrainList.push({name:'WoodleyLakes.mm',source:1,minLat:34.173449,minLon:-118.494517,maxLat:34.186526,maxLon:-118.481761,numLat:1456,numLon:1175});
terrainList.push({name:'WoodWind.mm',source:1,minLat:40.011941,minLon:-86.205046,maxLat:40.0265,maxLon:-86.190996,numLat:1621,numLon:1198});
terrainList.push({name:'WorthingtonManor.mm',source:1,minLat:39.319821,minLon:-77.389809,maxLat:39.330467,maxLon:-77.369228,numLat:1186,numLon:1772});
terrainList.push({name:'WynnLasVegas.mm',source:1,minLat:36.120641,minLon:-115.165886,maxLat:36.131046,maxLon:-115.153413,numLat:1159,numLon:1122});
terrainList.push({name:'Yahnundasis.mm',source:1,minLat:43.076441,minLon:-75.31305,maxLat:43.090298,maxLon:-75.299154,numLat:1543,numLon:1131});
terrainList.push({name:'YoloFliersClub.mm',source:1,minLat:38.674248,minLon:-121.884223,maxLat:38.684069,maxLon:-121.867055,numLat:1094,numLon:1492});

// These have high-def terrain but no green slopes/contours:
terrainList.push({name:'ArcadiaBluffs',source:1,minLat:44.450669,minLon:-86.25338,maxLat:44.462428,maxLon:-86.230717,numLat:1310,numLon:2523});
terrainList.push({name:'AugustaCC',source:1,minLat:33.481192,minLon:-82.027693,maxLat:33.497101,maxLon:-82.008972,numLat:1771,numLon:2084});
terrainList.push({name:'BandonDunes',source:1,minLat:43.182269,minLon:-124.402922,maxLat:43.198013,maxLon:-124.385736,numLat:1753,numLon:1913});
terrainList.push({name:'BandonPreserve',source:1,minLat:43.180054,minLon:-124.40071,maxLat:43.188002,maxLon:-124.388455,numLat:886,numLon:1366});
terrainList.push({name:'BandonTrails',source:1,minLat:43.170028,minLon:-124.395795,maxLat:43.186988,maxLon:-124.375325,numLat:1888,numLon:2279});
terrainList.push({name:'BethpageBlack',source:1,minLat:40.741117,minLon:-73.45759,maxLat:40.758395,maxLon:-73.432465,numLat:1923,numLon:2796});
terrainList.push({name:'BethpageBlue',source:1,minLat:40.74022,minLon:-73.474901,maxLat:40.751007,maxLon:-73.454768,numLat:1201,numLon:2241});
terrainList.push({name:'BethpageGreen',source:1,minLat:40.737837,minLon:-73.456529,maxLat:40.747654,maxLon:-73.43531,numLat:1094,numLon:2363});
terrainList.push({name:'BethpageRed',source:1,minLat:40.740799,minLon:-73.465904,maxLat:40.755194,maxLon:-73.450746,numLat:1603,numLon:1688});
terrainList.push({name:'BethpageYellow',source:1,minLat:40.734175,minLon:-73.472933,maxLat:40.745336,maxLon:-73.456119,numLat:1243,numLon:1873});
terrainList.push({name:'CherryHills',source:1,minLat:39.636839,minLon:-104.977605,maxLat:39.650333,maxLon:-104.958601,numLat:1502,numLon:2116});
terrainList.push({name:'EastLake',source:1,minLat:33.738177,minLon:-84.311748,maxLat:33.746918,maxLon:-84.293165,numLat:974,numLon:2068});
terrainList.push({name:'LawsoniaLinks',source:1,minLat:43.822201,minLon:-89.021991,maxLat:43.837767,maxLon:-89.004734,numLat:1733,numLon:1921});
terrainList.push({name:'MerionEast',source:1,minLat:39.991328,minLon:-75.322908,maxLat:40.008017,maxLon:-75.305222,numLat:1858,numLon:1970});
terrainList.push({name:'OldMacDonald',source:1,minLat:43.198896,minLon:-124.396552,maxLat:43.213244,maxLon:-124.379953,numLat:1597,numLon:1848});
terrainList.push({name:'PacificDunes',source:1,minLat:43.191988,minLon:-124.39968,maxLat:43.208698,maxLon:-124.384858,numLat:1860,numLon:1650});
terrainList.push({name:'RoyKizer',source:1,minLat:30.17155,minLon:-97.743776,maxLat:30.187496,maxLon:-97.730163,numLat:1775,numLon:1517});
terrainList.push({name:'SoldierHollowGold',source:1,minLat:40.479039,minLon:-111.510159,maxLat:40.492965,maxLon:-111.480026,numLat:1551,numLon:3353});
terrainList.push({name:'TheLedges',source:1,minLat:34.659366,minLon:-86.525001,maxLat:34.68457,maxLon:-86.506237,numLat:2805,numLon:2089});
terrainList.push({name:'ThePlayersClubCodrington',source:2,minLat:51.50495,minLon:-2.386053,maxLat:51.522221,maxLon:-2.368807,numLat:1922,numLon:1920});
terrainList.push({name:'ThePlayersClubStranahan',source:2,minLat:51.501363,minLon:-2.38259,maxLat:51.51519,maxLon:-2.368656,numLat:1539,numLon:1552});
terrainList.push({name:'TPCRiverHighlands',source:1,minLat:41.619479,minLon:-72.646706,maxLat:41.637445,maxLon:-72.631305,numLat:2000,numLon:1715});
terrainList.push({name:'Viniterra',source:1,minLat:37.529485,minLon:-77.085912,maxLat:37.547953,maxLon:-77.063967,numLat:2056,numLon:2443});
terrainList.push({name:'Westwood',source:2,minLat:53.092014,minLon:-2.057727,maxLat:53.10119,maxLon:-2.037335,numLat:1022,numLon:2272});

var terrainHeightUnknown = -9999;

// Terrain 1 = 200m buffer around course at high resolution
var terrain1 = null;
var terrain1Ready = false;
var terrain1Canvas = null;
var terrain1MinLat = 0;
var terrain1MinLon = 0;
var terrain1MaxLat = 0;
var terrain1MaxLon = 0;
var terrain1NumLat = 0;
var terrain1NumLon = 0;
var terrain1Index = -1;
var terrain1Name = "";
var terrain1Source = "";
var terrain1SourceID = 0;
var terrain1GF1 = 0.0;
var terrain1GF2 = 1.0;
var terrain1BlendDist = 100;
var terrain1BlendMinLat = 0;
var terrain1BlendMinLon = 0;
var terrain1BlendMaxLat = 0;
var terrain1BlendMaxLon = 0;
var terrain1AllowSmooth = true;
var terrain1AllowFlatten = true;
var terrain1AllowSlopes = false;

// Terrain 2 = 10km buffer around course at medium resolution
var terrain2 = null;
var terrain2Ready = false;
var terrain2Canvas = null;
var terrain2MinLat = 0;
var terrain2MinLon = 0;
var terrain2MaxLat = 0;
var terrain2MaxLon = 0;
var terrain2NumLat = 0;
var terrain2NumLon = 0;
var terrain2Index = -1;
var terrain2Name = "";
var terrain2Source = "";
var terrain2GF1 = 0.0;
var terrain2GF2 = 1.0;
var terrain2BlendDist = 400;
var terrain2BlendMinLat = 0;
var terrain2BlendMinLon = 0;
var terrain2BlendMaxLat = 0;
var terrain2BlendMaxLon = 0;

// Terrain 3 = 50km buffer around course at low resolution
var terrain3 = null;
var terrain3Ready = false;
var terrain3Canvas = null;
var terrain3MinLat = 0;
var terrain3MinLon = 0;
var terrain3MaxLat = 0;
var terrain3MaxLon = 0;
var terrain3NumLat = 0;
var terrain3NumLon = 0;
var terrain3Index = -1;
var terrain3Name = "";
var terrain3Source = "";
var terrain3GF1 = 0.0;
var terrain3GF2 = 1.0;

function newProVisualizerTerrainProvider()
{
	var tp = new Cesium.EllipsoidTerrainProvider();
	tp.requestTileGeometry = function(x,y,level,request){
		var width = 16;
		var height = 16;
		var buffer = new Float32Array(width*height);
		var rect = this.tilingScheme.tileXYToRectangle(x,y,level);
		var minLat = rect.south * 180.0 / Math.PI;
		var maxLat = rect.north * 180.0 / Math.PI;
		var minLon = rect.west * 180.0 / Math.PI;
		var maxLon = rect.east * 180.0 / Math.PI;
		var dLat = (maxLat - minLat) / (height-1);
		var dLon = (maxLon - minLon) / (width-1);
		for (var i = 0; i < height; ++i)
		{
			var lat = maxLat - i*dLat;
			for (var j = 0; j < width; ++j)
			{
				var lon = minLon + j*dLon;
				var h = getProVisualizerTerrainHeight(lat,lon);
				if (h != terrainHeightUnknown)
					buffer[j + i*width] = h;
			}
		}
		var d = new Cesium.HeightmapTerrainData({
				buffer: buffer,
				width: width,
				height: height,
			});
		return Promise.resolve(d);
	}
	return tp;
}

function getProVisualizerTerrainHeight(lat, lon)
{
	var h = getProVisualizerTerrain1Height(lat, lon);
	if (h != terrainHeightUnknown)
		return h;

	h = getProVisualizerTerrain2Height(lat, lon);
	if (h != terrainHeightUnknown)
	{
		if (lat < terrain1BlendMinLat || lat > terrain1BlendMaxLat || lon < terrain1BlendMinLon || lon > terrain1BlendMaxLon)
			return h;
		var lat2 = lat;
		var lon2 = lon;
		if (lat2 < terrain1MinLat) lat2 = terrain1MinLat;
		if (lat2 > terrain1MaxLat) lat2 = terrain1MaxLat;
		if (lon2 < terrain1MinLon) lon2 = terrain1MinLon;
		if (lon2 > terrain1MaxLon) lon2 = terrain1MaxLon;
		var d = geogDist(lat, lon, lat2, lon2);
		if (d < terrain1BlendDist)
		{
			var h2 = getProVisualizerTerrain1Height(lat2, lon2);
			if (h2 != terrainHeightUnknown)
			{
				var t = d/terrain1BlendDist;
				return t*h + (1.0-t)*h2;
			}
		}
		return h;
	}

	h = getProVisualizerTerrain3Height(lat, lon);
	if (h != terrainHeightUnknown)
	{
		if (lat < terrain2BlendMinLat || lat > terrain2BlendMaxLat || lon < terrain2BlendMinLon || lon > terrain2BlendMaxLon)
			return h;
		var lat2 = lat;
		var lon2 = lon;
		if (lat2 < terrain2MinLat) lat2 = terrain2MinLat;
		if (lat2 > terrain2MaxLat) lat2 = terrain2MaxLat;
		if (lon2 < terrain2MinLon) lon2 = terrain2MinLon;
		if (lon2 > terrain2MaxLon) lon2 = terrain2MaxLon;
		var d = geogDist(lat, lon, lat2, lon2);
		if (d < terrain2BlendDist)
		{
			var h2 = getProVisualizerTerrain2Height(lat2, lon2);
			if (h2 != terrainHeightUnknown)
			{
				var t = d/terrain2BlendDist;
				return t*h + (1.0-t)*h2;
			}
		}
		return h;
	}

	return 0;
}

function getProVisualizerTerrainHeightAndGradient(lat, lon, r, b1, b2)
{
	var h = 0.0;
	var g1 = 0.0;
	var g2 = 0.0;
	if (terrainMode == 2)
	{
		h = getProVisualizerTerrainHeight(lat, lon);
		var lat1 = moveLat(lat, lon, -r, b1);
		var lon1 = moveLon(lat, lon, -r, b1);
		var h1 = getProVisualizerTerrainHeight(lat1, lon1);
		var lat2 = moveLat(lat, lon, r, b1);
		var lon2 = moveLon(lat, lon, r, b1);
		var h2 = getProVisualizerTerrainHeight(lat2, lon2);
		var lat3 = moveLat(lat, lon, -r, b2);
		var lon3 = moveLon(lat, lon, -r, b2);
		var h3 = getProVisualizerTerrainHeight(lat3, lon3);
		var lat4 = moveLat(lat, lon, r, b2);
		var lon4 = moveLon(lat, lon, r, b2);
		var h4 = getProVisualizerTerrainHeight(lat4, lon4);
		if (h == terrainHeightUnknown) h = 0;
		if (h1 == terrainHeightUnknown) h1 = 0;
		if (h2 == terrainHeightUnknown) h2 = 0;
		if (h3 == terrainHeightUnknown) h3 = 0;
		if (h4 == terrainHeightUnknown) h4 = 0;
		g1 = (h2 - h1)/(2.0*r);
		g2 = (h4 - h3)/(2.0*r);
	}
	return { h:h, g1:g1, g2:g2 };
}

function getProVisualizerTerrain1Height(lat, lon, smooth = true, flatten = true)
{
	if (terrain1 == null || !terrain1Ready || terrain1.heights == null || terrain1.heights.length != terrain1NumLat * terrain1NumLon)
		return terrainHeightUnknown;

	if (lat < terrain1MinLat || lat > terrain1MaxLat || lon < terrain1MinLon || lon > terrain1MaxLon)
		return terrainHeightUnknown;

	var tLat = (terrain1MaxLat - lat) / (terrain1MaxLat - terrain1MinLat);
	var tLon = (lon - terrain1MinLon) / (terrain1MaxLon - terrain1MinLon);

	var iN = terrain1NumLat; var iMax = iN - 1;
	var jN = terrain1NumLon; var jMax = jN - 1;
	var i = tLat * iMax; var i0 = Math.floor(i); var i1 = Math.ceil(i);
	var j = tLon * jMax; var j0 = Math.floor(j); var j1 = Math.ceil(j);
	if (i0 < 0) i0 = 0;
	if (j0 < 0) j0 = 0;
	if (i1 > iMax) i1 = iMax;
	if (j1 > jMax) j1 = jMax;
	var h00 = terrain1.heights[i0*jN + j0]; // NW
	var h01 = terrain1.heights[i0*jN + j1]; // NE
	var h10 = terrain1.heights[i1*jN + j0]; // SW
	var h11 = terrain1.heights[i1*jN + j1]; // SE
	var zz = terrainHeightUnknown + 1;
	if (h00 < zz || h01 < zz || h10 < zz || h11 < zz)
		return terrainHeightUnknown;
	if (smooth && terrain1AllowSmooth && i0 > 0 && i1 < iMax && j0 > 0 && j1 < jMax)
	{
		var h00N = terrain1.heights[(i0-1)*jN + j0];
		var h00S = terrain1.heights[(i0+1)*jN + j0];
		var h00E = terrain1.heights[i0*jN + j0+1];
		var h00W = terrain1.heights[i0*jN + j0-1];
		if (h00N >= zz && h00S >= zz && h00E >= zz && h00W >= zz) h00 = (h00 + h00N + h00S + h00E + h00W)/5;
		var h01N = terrain1.heights[(i0-1)*jN + j1];
		var h01S = terrain1.heights[(i0+1)*jN + j1];
		var h01E = terrain1.heights[i0*jN + j1+1];
		var h01W = terrain1.heights[i0*jN + j1-1];
		if (h01N >= zz && h01S >= zz && h01E >= zz && h01W >= zz) h01 = (h01 + h01N + h01S + h01E + h01W)/5;
		var h10N = terrain1.heights[(i1-1)*jN + j0];
		var h10S = terrain1.heights[(i1+1)*jN + j0];
		var h10E = terrain1.heights[i1*jN + j0+1];
		var h10W = terrain1.heights[i1*jN + j0-1];
		if (h10N >= zz && h10S >= zz && h10E >= zz && h10W >= zz) h10 = (h10 + h10N + h10S + h10E + h10W)/5;
		var h11N = terrain1.heights[(i1-1)*jN + j1];
		var h11S = terrain1.heights[(i1+1)*jN + j1];
		var h11E = terrain1.heights[i1*jN + j1+1];
		var h11W = terrain1.heights[i1*jN + j1-1];
		if (h11N >= zz && h11S >= zz && h11E >= zz && h11W >= zz) h11 = (h11 + h11N + h11S + h11E + h11W)/5;
	}
	var h0 = h00 + (h01 - h00)*(j - j0);
	var h1 = h10 + (h11 - h10)*(j - j0);
	var h = h0 + (h1 - h0)*(i - i0);
	if (flatten && terrain1AllowFlatten)
	{
		var courseID = currentCourseID();
		var dh = [];
		var dw = [];
		var dn = 0;
		for (var hole = 1; hole <= 18; ++hole)
		{
			var lat2 = getCourseHoleTeeLat(courseID, hole);
			var lon2 = getCourseHoleTeeLon(courseID, hole);
			var d = geogDist(lat, lon, lat2, lon2);
			if (d < 30)
			{
				h2 = getProVisualizerTerrain1Height(lat2, lon2, true, false);
				if (h2 > 0)
				{
					var h3 = h2 + (h - h2)*d/30.0;
					dh[dn] = h3 - h;
					dw[dn] = 1.0 - d/30.01;
					++dn;
				}
			}
			lat2 = getCourseHolePinLat(courseID, hole);
			lon2 = getCourseHolePinLon(courseID, hole);
			d = geogDist(lat, lon, lat2, lon2);
			if (d < 40)
			{
				h2 = getProVisualizerTerrain1Height(lat2, lon2, true, false);
				if (h2 > 0)
				{
					var h3 = h2 + (h - h2)*(terrain1GF1 + terrain1GF2*d/40.0);
					dh[dn] = h3 - h;
					dw[dn] = 1.0 - d/40.01;
					++dn;
				}
			}
		}
		if (dn > 0)
		{
			var swh = 0;
			var sw  = 0;
			for (var i = 0; i < dn; ++i)
			{
				swh += dw[i]*dh[i];
				sw  += dw[i];
			}
			h += swh/sw;
		}
	}
	return h;
}

function getProVisualizerTerrain2Height(lat, lon)
{
	if (terrain2 == null || !terrain2Ready || terrain2.heights == null || terrain2.heights.length != terrain2NumLat * terrain2NumLon)
		return terrainHeightUnknown;

	if (lat < terrain2MinLat || lat > terrain2MaxLat || lon < terrain2MinLon || lon > terrain2MaxLon)
		return terrainHeightUnknown;

	var tLat = (terrain2MaxLat - lat) / (terrain2MaxLat - terrain2MinLat);
	var tLon = (lon - terrain2MinLon) / (terrain2MaxLon - terrain2MinLon);

	var iN = terrain2NumLat; var iMax = iN - 1;
	var jN = terrain2NumLon; var jMax = jN - 1;
	var i = tLat * iMax; var i0 = Math.floor(i); var i1 = Math.ceil(i);
	var j = tLon * jMax; var j0 = Math.floor(j); var j1 = Math.ceil(j);
	if (i0 < 0) i0 = 0;
	if (j0 < 0) j0 = 0;
	if (i1 > iMax) i1 = iMax;
	if (j1 > jMax) j1 = jMax;
	var h00 = terrain2.heights[i0*jN + j0]; // NW
	var h01 = terrain2.heights[i0*jN + j1]; // NE
	var h10 = terrain2.heights[i1*jN + j0]; // SW
	var h11 = terrain2.heights[i1*jN + j1]; // SE
	if (h00 < 0 || h01 < 0 || h10 < 0 || h11 < 0)
		return terrainHeightUnknown;
	var h0 = h00 + (h01 - h00)*(j - j0);
	var h1 = h10 + (h11 - h10)*(j - j0);
	var h = h0 + (h1 - h0)*(i - i0);
	return h;
}

function getProVisualizerTerrain3Height(lat, lon)
{
	if (terrain3 == null || !terrain3Ready || terrain3.heights == null || terrain3.heights.length != terrain3NumLat * terrain3NumLon)
		return terrainHeightUnknown;

	if (lat < terrain3MinLat || lat > terrain3MaxLat || lon < terrain3MinLon || lon > terrain3MaxLon)
		return terrainHeightUnknown;

	var tLat = (terrain3MaxLat - lat) / (terrain3MaxLat - terrain3MinLat);
	var tLon = (lon - terrain3MinLon) / (terrain3MaxLon - terrain3MinLon);

	var iN = terrain3NumLat; var iMax = iN - 1;
	var jN = terrain3NumLon; var jMax = jN - 1;
	var i = tLat * iMax; var i0 = Math.floor(i); var i1 = Math.ceil(i);
	var j = tLon * jMax; var j0 = Math.floor(j); var j1 = Math.ceil(j);
	if (i0 < 0) i0 = 0;
	if (j0 < 0) j0 = 0;
	if (i1 > iMax) i1 = iMax;
	if (j1 > jMax) j1 = jMax;
	var h00 = terrain3.heights[i0*jN + j0]; // NW
	var h01 = terrain3.heights[i0*jN + j1]; // NE
	var h10 = terrain3.heights[i1*jN + j0]; // SW
	var h11 = terrain3.heights[i1*jN + j1]; // SE
	if (h00 < 0 || h01 < 0 || h10 < 0 || h11 < 0)
		return terrainHeightUnknown;
	var h0 = h00 + (h01 - h00)*(j - j0);
	var h1 = h10 + (h11 - h10)*(j - j0);
	var h = h0 + (h1 - h0)*(i - i0);
	return h;
}

function getProVisualizerTerrainData1(minLat, minLon, maxLat, maxLon, buffer, viewer, name)
{
	var bestIndex = -1;
	var bestScore = -1;
	for (var i = 0; i < terrainList.length; ++i)
	{
		var x = terrainList[i];
		if (x.minLat < minLat && x.maxLat > maxLat && x.minLon < minLon && x.maxLon > maxLon)
		{
			var score = 10000 - geogDist((minLat+maxLat)/2, (minLon+maxLon)/2, (x.minLat+x.maxLat)/2, (x.minLon+x.maxLon)/2);
			if (score > bestScore)
			{
				bestIndex = i;
				bestScore = score;
			}
		}
	}
	if (bestIndex < 0)
	{
		getProVisualizerTerrainData1a(minLat, minLon, maxLat, maxLon, buffer, viewer);
		doXHR("MissingHDTerrain", "n=" + encodeURIComponent(name));
	}
	else
	{
		getProVisualizerTerrainData1b(minLat, minLon, maxLat, maxLon, buffer, bestIndex, viewer);
		doXHR("UsingHDTerrain", "n=" + encodeURIComponent(name));
	}
}

function fillTerrainHoles(heights, nlat, nlon)
{
	var n = heights.length;
	if (n != nlat*nlon) return;
	var adjusts = new Float32Array(n);
	var weights = new Float32Array(n);
	for (var j = 0; j < nlat; ++j)
	{
		var k = j*nlon;
		var i1 = -1;
		var h1 = -1;
		for (var i2 = 0; i2 < nlon; ++i2)
		{
			var h2 = heights[k+i2];
			if (h2 >= 0)
			{
				if (i2 > i1 + 1 && h1 >= 0)
				{
					for (var i = i1 + 1; i < i2; ++i)
					{
						var t = (i - i1)/(i2 - i1);
						var w = 1000.0/((i2 - i)*(i - i1));
						h = t*h2 + (1.0-t)*h1;
						adjusts[k+i] += w*h;
						weights[k+i] += w;
					}
				}
				i1 = i2;
				h1 = h2;
			}
		}
	}
	for (var j = 0; j < nlon; ++j)
	{
		var i1 = -1;
		var h1 = -1;
		for (var i2 = 0; i2 < nlat; ++i2)
		{
			var h2 = heights[i2*nlon + j];
			if (h2 >= 0)
			{
				if (i2 > i1 + 1 && h1 >= 0)
				{
					for (var i = i1 + 1; i < i2; ++i)
					{
						var t = (i - i1)/(i2 - i1);
						var w = 1000.0/((i2 - i)*(i - i1));
						h = t*h2 + (1.0-t)*h1;
						var k = i*nlon + j;
						adjusts[k] += w*h;
						weights[k] += w;
					}
				}
				i1 = i2;
				h1 = h2;
			}
		}
	}
	for (var i = 0; i < n; ++i)
	{
		if (weights[i] > 0)
			heights[i] = adjusts[i]/weights[i];
	}
}

function getProVisualizerTerrainData1a(minLat, minLon, maxLat, maxLon, buffer, viewer)
{
	minLat = moveLat(minLat, minLon, buffer, 180);
	minLon = moveLon(minLat, minLon, buffer, 270);
	maxLat = moveLat(maxLat, maxLon, buffer,   0);
	maxLon = moveLon(maxLat, maxLon, buffer,  90);
	while (maxLat < minLat - 90) maxLat += 180;
	while (maxLat > minLat + 90) maxLat -= 180;
	while (maxLon < minLon - 180) maxLon += 360;
	while (maxLon > minLon + 180) maxLon -= 360;
	var d = geogDist(minLat, minLon, maxLat, maxLon);
	if (d > 10000) return; // 10km diameter max.
	// See if we can re-use the previous result.
	if (   terrain1 != null
	    && terrain1Index == -1
	    && terrain1Canvas != null
	    && geogDist(minLat, minLon, terrain1MinLat, terrain1MinLon) < 100
	    && geogDist(maxLat, maxLon, terrain1MaxLat, terrain1MaxLon) < 100)
	{
		if (viewer != null)
			displayTerrain1(viewer);
		return;
	}
	// We can't re-use the previous result.
	var res = d/500.0;
	var dlat = geogDist(minLat, minLon, maxLat, minLon);
	var dlon = geogDist(minLat, minLon, minLat, maxLon);
	var nlat = Math.ceil(dlat/res);
	var nlon = Math.ceil(dlon/res);
	terrain1 = null;
	terrain1Ready = false;
	terrain1Canvas = null;
	terrain1MinLat = minLat;
	terrain1MinLon = minLon;
	terrain1MaxLat = maxLat;
	terrain1MaxLon = maxLon;
	terrain1NumLat = nlat;
	terrain1NumLon = nlon;
	terrain1Index = -1;
	terrain1Name = "";
	terrain1Source = terrainSources[0];
	terrain1SourceID = 0;
	terrain1GF1 = 0.0;
	terrain1GF2 = 1.0;
	terrain1BlendDist = 100;
	terrain1BlendMinLat = moveLat(terrain1MinLat,terrain1MinLon,terrain1BlendDist,180);
	terrain1BlendMinLon = moveLon(terrain1MinLat,terrain1MinLon,terrain1BlendDist,270);
	terrain1BlendMaxLat = moveLat(terrain1MaxLat,terrain1MaxLon,terrain1BlendDist,0);
	terrain1BlendMaxLon = moveLon(terrain1MaxLat,terrain1MaxLon,terrain1BlendDist,90);
	terrain1AllowSmooth = true;
	terrain1AllowFlatten = true;
	terrain1AllowSlopes = false;
	var req = window.location.origin + "/terrain.php"
		+ "?minlat=" + minLat.toString()
		+ "&minlon=" + minLon.toString()
		+ "&maxlat=" + maxLat.toString()
		+ "&maxlon=" + maxLon.toString()
		+ "&nlat=" + nlat.toString()
		+ "&nlon=" + nlon.toString()
		+ "&unit=m";
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				// Parse the response.
				terrain1 = JSON.parse(xhr.responseText);
				if (terrain1 == null) return;
				if (terrain1.heights == null) return;
				var n = nlat*nlon;
				if (terrain1.heights.length != n) return;
				fillTerrainHoles(terrain1.heights, nlat, nlon);

				// Generate the image.
				var minHeight = +9999999;
				var maxHeight = -9999999;
				for (var i = 0; i < n; ++i)
				{
					var height = terrain1.heights[i];
					if (height >= 0)
					{
						if (height < minHeight) minHeight = height;
						if (height > maxHeight) maxHeight = height;
					}
				}
				if (minHeight < -1000000) minHeight = 0;
				if (minHeight > +1000000) minHeight = 0;
				if (maxHeight > +1000000) maxHeight = 0;
				if (maxHeight < minHeight + 1) maxHeight = minHeight + 1;
				var deltaHeight = maxHeight - minHeight;
				var showContours = (deltaHeight > 15);
				terrain1Canvas = document.createElement("canvas");
				terrain1Canvas.width = nlon;
				terrain1Canvas.height = nlat;
				var ctx = terrain1Canvas.getContext("2d");
				var imgData = ctx.getImageData(0, 0, nlon, nlat);
				var h0 = minHeight;
				var h1 = maxHeight;
				var dh = h1 - h0; if (dh < 100) { h0 -= 0.3*(100-dh); h1 += 0.7*(100-dh); dh = h1 - h0; }
				var r0 = 40; var r1 = 180; var dr = r1 - r0;
				var g0 = 40; var g1 = 220; var dg = g1 - g0;
				var b0 = 40; var b1 = 180; var db = b1 - b0;
				var a0 = 255;
				for (var i = 0; i < n; ++i)
				{
					var h = terrain1.heights[i];
					var r = 0;
					var g = 0;
					var b = 0;
					var a = 0;
					var j = i*4;
					if (h >= 0)
					{
						var t = (h - h0)/dh;
						if (showContours && Math.round(h) % 10 == 0) t += 0.1;
						r = r0 + Math.round(t*dr);
						g = g0 + Math.round(t*dg);
						b = b0 + Math.round(t*db);
						a = a0;
						var lat = Math.floor(i/nlon);
						var lon = i - (lat*nlon);
						if (lat < 0 && lat > 0 && lat < nlat - 1 && lon > 0 && lon < nlon - 1)
						{
							hN = terrain1.heights[i+nlon];
							hS = terrain1.heights[i-nlon];
							hE = terrain1.heights[i+1];
							hW = terrain1.heights[i-1];
							if (hN >= 0 && hS >= 0 && hE >= 0 && hW >= 0)
							{
								var convexity = h - (hN+hS+hE+hW)/4.0;
								t += 2*convexity;
								r = r0 + Math.round(t*dr);
								g = g0 + Math.round(t*dg);
								b = b0 + Math.round(t*db);
								if (r < 0) r = 0; if (r > 255) r = 255;
								if (g < 0) g = 0; if (g > 255) g = 255;
								if (b < 0) b = 0; if (b > 255) b = 255;
							}
						}
					}
					imgData.data[j] = r;
					imgData.data[j+1] = g;
					imgData.data[j+2] = b;
					imgData.data[j+3] = a;
				}
				ctx.putImageData(imgData, 0, 0);

				// Smooth the data.
				var iter = 20;
				var incr = 1;
				if (iter > 10) incr *= 2;
				while (iter > 0)
				{
					iter -= 1;
					var adjusts = new Float32Array(n);
					var d = iter + 1;
					for (var j = d; j < nlat - d; ++j)
					{
						for (var i = d; i < nlon - d; ++i)
						{
							var k = j*nlon;
							k -= d*nlon;
							var h00 = terrain1.heights[k+i-d];
							var h01 = terrain1.heights[k+i];
							var h02 = terrain1.heights[k+i+d];
							k += d*nlon;
							var h10 = terrain1.heights[k+i-d];
							var h11 = terrain1.heights[k+i];
							var h12 = terrain1.heights[k+i+d];
							k += d*nlon;
							var h20 = terrain1.heights[k+i-d];
							var h21 = terrain1.heights[k+i];
							var h22 = terrain1.heights[k+i+d];
							k -= d*nlon;
							//if (   h00 > 1.5 && h01 > 1.5 && h02 > 1.5
							//    && h10 > 1.5 && h11 > 1.5 && h12 > 1.5
							//    && h20 > 1.5 && h21 > 1.5 && h22 > 1.5)
							if (h11 > -999.0)
							{
								var min = h11 - incr;
								var max = h11 + incr;
								if (h00 < min) h00 = min; if (h00 > max) h00 = max;
								if (h01 < min) h01 = min; if (h01 > max) h01 = max;
								if (h02 < min) h02 = min; if (h02 > max) h02 = max;
								if (h10 < min) h10 = min; if (h10 > max) h10 = max;
								if (h12 < min) h12 = min; if (h12 > max) h12 = max;
								if (h20 < min) h20 = min; if (h20 > max) h20 = max;
								if (h21 < min) h21 = min; if (h21 > max) h21 = max;
								if (h22 < min) h22 = min; if (h22 > max) h22 = max;
								var h = (  h00 +   h01 + h02
								         + h10 + 2*h11 + h12
								         + h20 +   h21 + h22)/10.0;
								var dh = h - h11;
								adjusts[k+i] = dh;
							}
						}
					}
					for (var i = 0; i < n; ++i)
						terrain1.heights[i] += adjusts[i];
				}

				// Set the ready flag and display if required.
				terrain1Ready = true;
				if (viewer != null)
					displayTerrain1(viewer);
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function getProVisualizerTerrainData2(minLat, minLon, maxLat, maxLon, buffer, viewer)
{
	minLat = moveLat(minLat, minLon, buffer, 180);
	minLon = moveLon(minLat, minLon, buffer, 270);
	maxLat = moveLat(maxLat, maxLon, buffer,   0);
	maxLon = moveLon(maxLat, maxLon, buffer,  90);
	while (maxLat < minLat - 90) maxLat += 180;
	while (maxLat > minLat + 90) maxLat -= 180;
	while (maxLon < minLon - 180) maxLon += 360;
	while (maxLon > minLon + 180) maxLon -= 360;
	var d = geogDist(minLat, minLon, maxLat, maxLon);
	if (d > 100000) return; // 100km diameter max.
	// See if we can re-use the previous result.
	if (   terrain2 != null
	    && terrain2Canvas != null
	    && geogDist(minLat, minLon, terrain2MinLat, terrain2MinLon) < 1000
	    && geogDist(maxLat, maxLon, terrain2MaxLat, terrain2MaxLon) < 1000)
	{
		if (viewer != null)
			displayTerrain2(viewer);
		return;
	}
	// We can't re-use the previous result.
	var res = d/500.0;
	var dlat = geogDist(minLat, minLon, maxLat, minLon);
	var dlon = geogDist(minLat, minLon, minLat, maxLon);
	var nlat = Math.ceil(dlat/res);
	var nlon = Math.ceil(dlon/res);
	terrain2 = null;
	terrain2Ready = false;
	terrain2Canvas = null;
	terrain2MinLat = minLat;
	terrain2MinLon = minLon;
	terrain2MaxLat = maxLat;
	terrain2MaxLon = maxLon;
	terrain2NumLat = nlat;
	terrain2NumLon = nlon;
	terrain2Source = terrainSources[0];
	terrain2GF1 = 0.0;
	terrain2GF2 = 1.0;
	terrain2BlendDist = 400;
	terrain2BlendMinLat = moveLat(terrain2MinLat,terrain2MinLon,terrain2BlendDist,180);
	terrain2BlendMinLon = moveLon(terrain2MinLat,terrain2MinLon,terrain2BlendDist,270);
	terrain2BlendMaxLat = moveLat(terrain2MaxLat,terrain2MaxLon,terrain2BlendDist,0);
	terrain2BlendMaxLon = moveLon(terrain2MaxLat,terrain2MaxLon,terrain2BlendDist,90);
	var req = window.location.origin + "/terrain.php"
		+ "?minlat=" + minLat.toString()
		+ "&minlon=" + minLon.toString()
		+ "&maxlat=" + maxLat.toString()
		+ "&maxlon=" + maxLon.toString()
		+ "&nlat=" + nlat.toString()
		+ "&nlon=" + nlon.toString()
		+ "&unit=m";
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				terrain2 = JSON.parse(xhr.responseText);
				if (terrain2 == null) return;
				if (terrain2.heights == null) return;
				var n = nlat*nlon;
				if (terrain2.heights.length != n) return;
				fillTerrainHoles(terrain2.heights, nlat, nlon);
				var minHeight = +9999999;
				var maxHeight = -9999999;
				for (var i = 0; i < n; ++i)
				{
					var height = terrain2.heights[i];
					if (height >= 0)
					{
						if (height < minHeight) minHeight = height;
						if (height > maxHeight) maxHeight = height;
					}
				}
				if (minHeight < -1000000) minHeight = 0;
				if (minHeight > +1000000) minHeight = 0;
				if (maxHeight > +1000000) maxHeight = 0;
				if (maxHeight < minHeight + 1) maxHeight = minHeight + 1;
				var deltaHeight = maxHeight - minHeight;
				var showContours = (deltaHeight > 15);
				terrain2Canvas = document.createElement("canvas");
				terrain2Canvas.width = nlon;
				terrain2Canvas.height = nlat;
				var ctx = terrain2Canvas.getContext("2d");
				var imgData = ctx.getImageData(0, 0, nlon, nlat);
				var a0 = 255;//Math.round(255*opacity);
				if (a0 < 0) a0 = 0;
				if (a0 > 255) a0 = 255;
				var c1 = (deltaHeight >= 200 ? 200 : Math.round(20.0+180.0*deltaHeight/200.0));
				if (c1 > 160) c1 = 160;
				var c2 = Math.round(c1/1.5);
				var c0 = Math.round(64-32*c1/200);
				for (var i = 0; i < n; ++i)
				{
					var h = terrain2.heights[i];
					var r = 0;
					var g = 0;
					var b = 0;
					var a = 0;
					var j = i*4;
					if (h >= 0)
					{
						var t = (h - minHeight)/deltaHeight;
						if (showContours && Math.round(h) % 10 == 0) t += 0.1;
						r = c0 + Math.round(c2*t);
						g = c0 + Math.round(c1*t);
						b = c0 + Math.round(c2*t);
						a = a0;
					}
					imgData.data[j] = r;
					imgData.data[j+1] = g;
					imgData.data[j+2] = b;
					imgData.data[j+3] = a;
				}
				ctx.putImageData(imgData, 0, 0);
				terrain2Ready = true;
				if (viewer != null)
					displayTerrain2(viewer);
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function getProVisualizerTerrainData3(minLat, minLon, maxLat, maxLon, buffer, viewer)
{
	minLat = moveLat(minLat, minLon, buffer, 180);
	minLon = moveLon(minLat, minLon, buffer, 270);
	maxLat = moveLat(maxLat, maxLon, buffer,   0);
	maxLon = moveLon(maxLat, maxLon, buffer,  90);
	while (maxLat < minLat - 90) maxLat += 180;
	while (maxLat > minLat + 90) maxLat -= 180;
	while (maxLon < minLon - 180) maxLon += 360;
	while (maxLon > minLon + 180) maxLon -= 360;
	var d = geogDist(minLat, minLon, maxLat, maxLon);
	if (d > 200000) return; // 200km diameter max.
	// See if we can re-use the previous result.
	if (   terrain3 != null
	    && terrain3Canvas != null
	    && geogDist(minLat, minLon, terrain3MinLat, terrain3MinLon) < 1000
	    && geogDist(maxLat, maxLon, terrain3MaxLat, terrain3MaxLon) < 1000)
	{
		if (viewer != null)
			displayTerrain3(viewer);
		return;
	}
	// We can't re-use the previous result.
	var res = d/100.0;
	var dlat = geogDist(minLat, minLon, maxLat, minLon);
	var dlon = geogDist(minLat, minLon, minLat, maxLon);
	var nlat = Math.ceil(dlat/res);
	var nlon = Math.ceil(dlon/res);
	terrain3 = null;
	terrain3Ready = false;
	terrain3Canvas = null;
	terrain3MinLat = minLat;
	terrain3MinLon = minLon;
	terrain3MaxLat = maxLat;
	terrain3MaxLon = maxLon;
	terrain3NumLat = nlat;
	terrain3NumLon = nlon;
	terrain3Source = terrainSources[0];
	terrain3GF1 = 0.0;
	terrain3GF2 = 1.0;
	var req = window.location.origin + "/terrain.php"
		+ "?minlat=" + minLat.toString()
		+ "&minlon=" + minLon.toString()
		+ "&maxlat=" + maxLat.toString()
		+ "&maxlon=" + maxLon.toString()
		+ "&nlat=" + nlat.toString()
		+ "&nlon=" + nlon.toString()
		+ "&unit=m";
	if (window.XMLHttpRequest)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				terrain3 = JSON.parse(xhr.responseText);
				if (terrain3 == null) return;
				if (terrain3.heights == null) return;
				var n = nlat*nlon;
				if (terrain3.heights.length != n) return;
				fillTerrainHoles(terrain3.heights, nlat, nlon);
				var minHeight = +9999999;
				var maxHeight = -9999999;
				for (var i = 0; i < n; ++i)
				{
					var height = terrain3.heights[i];
					if (height >= 0)
					{
						if (height < minHeight) minHeight = height;
						if (height > maxHeight) maxHeight = height;
					}
				}
				if (minHeight < -1000000) minHeight = 0;
				if (minHeight > +1000000) minHeight = 0;
				if (maxHeight > +1000000) maxHeight = 0;
				if (maxHeight < minHeight + 1) maxHeight = minHeight + 1;
				var deltaHeight = maxHeight - minHeight;
				var showContours = (deltaHeight > 15);
				terrain3Canvas = document.createElement("canvas");
				terrain3Canvas.width = nlon;
				terrain3Canvas.height = nlat;
				var ctx = terrain3Canvas.getContext("2d");
				var imgData = ctx.getImageData(0, 0, nlon, nlat);
				var a0 = 255;//Math.round(255*opacity);
				if (a0 < 0) a0 = 0;
				if (a0 > 255) a0 = 255;
				var c1 = (deltaHeight >= 200 ? 200 : Math.round(20.0+180.0*deltaHeight/200.0));
				if (c1 > 160) c1 = 160;
				var c2 = Math.round(c1/1.5);
				var c0 = Math.round(64-32*c1/200);
				for (var i = 0; i < n; ++i)
				{
					var h = terrain3.heights[i];
					var r = 0;
					var g = 0;
					var b = 0;
					var a = 0;
					var j = i*4;
					if (h >= 0)
					{
						var t = (h - minHeight)/deltaHeight;
						if (showContours && Math.round(h) % 10 == 0) t += 0.1;
						r = c0 + Math.round(c2*t);
						g = c0 + Math.round(c1*t);
						b = c0 + Math.round(c2*t);
						a = a0;
					}
					imgData.data[j] = r;
					imgData.data[j+1] = g;
					imgData.data[j+2] = b;
					imgData.data[j+3] = a;
				}
				ctx.putImageData(imgData, 0, 0);
				terrain3Ready = true;
				if (viewer != null)
					displayTerrain3(viewer);
			}
		}
		xhr.open("GET", req, true);
		xhr.send();
	}
}

function decodeTerrainRow(s, n)
{
	var numbers = "0123456789";
	var adds = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var subs = "abcdefghijklmnopqrstuvwxyz"
	var heights = new Float32Array(n);
	var i = 0;
	var h = parseInt(s);
	heights[i++] = h;
	var j = s.indexOf(":") + 1;
	if (j <= 0) return null; // Failed
	while (j < s.length)
	{
		var c = s.substr(j, 1);
		if (c == '<')
		{
			var j2 = j + 1;
			if (j2 >= s.length) return null; // Failed
			var c2 = s.substr(j2, 1);
			while (c2 != '>')
			{
				j2 += 1;
				if (j2 >= s.length) return null; // Failed
				var c2 = s.substr(j2, 1);
			}
			if (j2 < j + 2) return null; // Failed
			var dh = parseInt(s.substr(j+1,j2-j-1));
			if (isNaN(dh)) return null; // Failed
			h += dh;
			if (h < -1000 || h > 10000) return null; // Failed
			heights[i++] = h;
			j = j2 + 1;
		}
		else if (numbers.indexOf(c) >= 0)
		{
			var intstr = c;
			if (++j < s.length)
			{
				c = s.substr(j, 1);
				while (numbers.indexOf(c) >= 0)
				{
					intstr += c;
					if (++j < s.length)
						c = s.substr(j, 1);
					else
						c = ".";
				}
			}
			var m = parseInt(intstr);
			if (isNaN(m) || m <= 0) return null; // Failed
			while (m > 0)
			{
				heights[i++] = h;
				m -= 1;
			}
		}
		else
		{
			var add = 1 + adds.indexOf(c);
			var sub = 1 + subs.indexOf(c);
			if (add == 0 && sub == 0) return null; // Failed
			if (add > 0) h += add;
			if (sub > 0) h -= sub;
			heights[i++] = h;
			++j;
		}
	}
	if (heights.length != n) return null; // Failed
	return heights;
}

function getProVisualizerTerrainData1b(minLat, minLon, maxLat, maxLon, buffer, index, viewer)
{
	// See if we can re-use the previous result.
	if (   terrain1 != null
	    && terrain1Canvas != null
	    && terrain1Index == index)
	{
		if (viewer != null)
			displayTerrain1(viewer);
		return;
	}

	// We can't re-use the previous result.
	terrain1 = null;
	terrain1Ready = false;
	terrain1Canvas = null;
	terrain1MinLat = terrainList[index].minLat;
	terrain1MinLon = terrainList[index].minLon;
	terrain1MaxLat = terrainList[index].maxLat;
	terrain1MaxLon = terrainList[index].maxLon;
	terrain1NumLat = terrainList[index].numLat;
	terrain1NumLon = terrainList[index].numLon;
	terrain1Index = index;
	terrain1Name = terrainList[index].name;
	terrain1Source = terrainSources[terrainList[index].source];
	terrain1SourceID = terrainList[index].source;
	terrain1GF1 = 0.5;
	terrain1GF2 = 0.5;
	terrain1BlendDist = 100;
	terrain1BlendMinLat = moveLat(terrain1MinLat,terrain1MinLon,terrain1BlendDist,180);
	terrain1BlendMinLon = moveLon(terrain1MinLat,terrain1MinLon,terrain1BlendDist,270);
	terrain1BlendMaxLat = moveLat(terrain1MaxLat,terrain1MaxLon,terrain1BlendDist,0);
	terrain1BlendMaxLon = moveLon(terrain1MaxLat,terrain1MaxLon,terrain1BlendDist,90);
	terrain1AllowSmooth = true;
	terrain1AllowFlatten = true;
	terrain1AllowSlopes = false;
	var url = "https://www.provisualizer.com/terrain/" + terrain1Name + ".js";
	var script = document.createElement('script');
	var nlat = terrain1NumLat;
	var nlon = terrain1NumLon;
	script.onload = function () {
		// Check the encoded terrain has loaded correctly.
		if (encodedTerrain == null) { alert('Terrain failed to load.'); return; }
		if (encodedTerrain.nlat != nlat || encodedTerrain.nlon != nlon) { alert('Terrain failed to load.'); return; }
		if (encodedTerrain.encoding != 1 && encodedTerrain.encoding != 2 && encodedTerrain.encoding != 'mm') { alert('Terrain failed to load.'); return; }
		if (encodedTerrain.data == null) { alert('Terrain failed to load.'); return; }

		// Now decode the terrain.
		var n = nlat*nlon;
		terrain1 = {};
		terrain1.heights = new Float32Array(n);
		if (encodedTerrain.encoding == 'mm')
		{
			if (encodedTerrain.data.length != nlat*nlon) { alert('Terrain failed to load.'); return; }
			var prevH = 0;
			for (var lat = 0; lat < nlat; ++lat)
			{
				for (var lon = 0; lon < nlon; ++lon)
				{
					var i = lon + lat*nlon;
					var dh = encodedTerrain.data[i] - 50;
					var h = prevH + dh;
					terrain1.heights[i] = h/1000.0;
					prevH = h;
				}
			}
			terrain1AllowSmooth = false;
			terrain1AllowFlatten = false;
			terrain1AllowSlopes = true;
			if (terrainList[index].smoothingFactor && terrainList[index].smoothingFactor > 2)
				terrain1AllowSlopes = false;
		}
		else if (encodedTerrain.encoding == 1)
		{
			if (encodedTerrain.data.length != nlat) { alert('Terrain failed to load.'); return; }
			for (var lat = 0; lat < nlat; ++lat)
			{
				var s = encodedTerrain.data[lat];
				var heights = decodeTerrainRow(s, nlon);
				if (heights == null || heights.length != nlon) { alert('Terrain failed to load.'); return; }
				for (var lon = 0; lon < nlon; ++lon)
					terrain1.heights[lon + lat*nlon] = heights[lon];
			}
		}
		else if (encodedTerrain.encoding == 2)
		{
			if (encodedTerrain.data.length != nlon) { alert('Terrain failed to load.'); return; }
			for (var lon = 0; lon < nlon; ++lon)
			{
				var s = encodedTerrain.data[lon];
				var heights = decodeTerrainRow(s, nlat);
				if (heights == null || heights.length != nlat) { alert('Terrain failed to load.'); return; }
				for (var lat = 0; lat < nlat; ++lat)
					terrain1.heights[lon + lat*nlon] = heights[lat];
			}
		}

		if (encodedTerrain.encoding != 'mm')
		{
		// Adjust heights to avoid steps due to 1m height resolution.
		// ToDo: Weight the adjustments by distance from nearest end of interval.
		var adjusts1 = new Float32Array(n);
		var adjusts2 = new Float32Array(n);
		var weights1 = new Float32Array(n);
		var weights2 = new Float32Array(n);
		for (var j = 0; j < nlat; ++j)
		{
			var i1 = 1;
			var k = j*nlon;
			while (i1 < nlon - 2)
			{
				var h0 = terrain1.heights[k+i1-1];
				var h1 = terrain1.heights[k+i1];
				var i2 = i1;
				while (i2 < nlon - 2 && terrain1.heights[k+i2+1] == h1) i2 += 1;
				if (h1 > 1.5)
				{
					var h2 = terrain1.heights[k+i2+1];
					if (h0 < h1 - 0.5) h0 = h1 - 0.5;
					if (h0 > h1 + 0.5) h0 = h1 + 0.5;
					if (h2 < h1 - 0.5) h2 = h1 - 0.5;
					if (h2 > h1 + 0.5) h2 = h1 + 0.5;
					if (i2 > i1)
					{
						var d = i2 - i1 + 1.0;
						if ((h0 < h1 && h2 < h1) || (h0 > h1 && h2 > h1))
						{
							var h1b = h1; if (d < 10.0) { if (h0 < h1) h1b -= 0.5*(1.0-d/10.0); else h1b += 0.5*(1.0-d/10.0); }
							for (var i = i1; i <= i2; ++i)
							{
								var t = (i - i1 + 0.5)/d;
								var h = h1;
								if (t < 0.3) { var t2 = t/0.3;       h = (1.0-t2)*h0 + t2*h1b; }
								if (t > 0.7) { var t2 = (1.0-t)/0.3; h = (1.0-t2)*h2 + t2*h1b; }
								var dh = h - h1;
								adjusts1[k+i] = dh;
								weights1[k+i] = 10.0/d;
							}
						}
						else
						{
							for (var i = i1; i <= i2; ++i)
							{
								var t = (i - i1 + 0.5)/d;
								var h = (1.0-t)*h0 + t*h2;
								var dh = h - h1;
								adjusts1[k+i] = dh;
								weights1[k+i] = 10.0/d;
							}
						}
					}
					else if (h0 < h1 && h2 < h1)
					{
						adjusts1[k+i] = -0.25;
						weights1[k+i] = 10.0;
					}
					else if (h0 > h1 && h2 > h1)
					{
						adjusts1[k+i] = 0.25;
						weights1[k+i] = 10.0;
					}
				}
				i1 = i2 + 1;
			}
		}
		for (var j = 0; j < nlon; ++j)
		{
			var i1 = 1;
			while (i1 < nlat - 2)
			{
				var h0 = terrain1.heights[j+nlon*(i1-1)];
				var h1 = terrain1.heights[j+nlon*(i1)];
				var i2 = i1;
				while (i2 < nlat - 2 && terrain1.heights[j+nlon*(i2+1)] == h1) i2 += 1;
				if (h1 > 1.5)
				{
					var h2 = terrain1.heights[j+nlon*(i2+1)];
					if (h0 < h1 - 0.5) h0 = h1 - 0.5;
					if (h0 > h1 + 0.5) h0 = h1 + 0.5;
					if (h2 < h1 - 0.5) h2 = h1 - 0.5;
					if (h2 > h1 + 0.5) h2 = h1 + 0.5;
					if (i2 > i1)
					{
						var d = i2 - i1 + 1.0;
						if ((h0 < h1 && h2 < h1) || (h0 > h1 && h2 > h1))
						{
							var h1b = h1; if (d < 10.0) { if (h0 < h1) h1b -= 0.5*(1.0-d/10.0); else h1b += 0.5*(1.0-d/10.0); }
							for (var i = i1; i <= i2; ++i)
							{
								var t = (i - i1 + 0.5)/d;
								var h = h1;
								if (t < 0.3) { var t2 = t/0.3;       h = (1.0-t2)*h0 + t2*h1b; }
								if (t > 0.7) { var t2 = (1.0-t)/0.3; h = (1.0-t2)*h2 + t2*h1b; }
								var dh = h - h1;
								adjusts2[j+nlon*i] = dh;
								weights2[j+nlon*i] = 10.0/d;
							}
						}
						else
						{
							for (var i = i1; i <= i2; ++i)
							{
								var t = (i - i1 + 0.5)/d;
								var h = (1.0-t)*h0 + t*h2;
								var dh = h - h1;
								adjusts2[j+nlon*i] = dh;
								weights2[j+nlon*i] = 10.0/d;
							}
						}
					}
					else if (h0 < h1 && h2 < h1)
					{
						adjusts2[j+nlon*i] = -0.25;
						weights2[j+nlon*i] = 10.0;
					}
					else if (h0 > h1 && h2 > h1)
					{
						adjusts2[j+nlon*i] = 0.25;
						weights2[j+nlon*i] = 10.0;
					}
				}
				i1 = i2 + 1;
			}
		}
		for (var i = 0; i < n; ++i)
		{
			var w = weights1[i] + weights2[i];
			if (w > 0.0)
				terrain1.heights[i] += (adjusts1[i]*weights1[i] + adjusts2[i]*weights2[i])/w;
		}
		}

		// Smooth the data.
		var iter = 5;
		var incr = 0.25;
		var showConvexity = false;
		if (encodedTerrain.encoding == 'mm')
		{
			iter = 5;
			incr = 0.02;
			showConvexity = true;
			if (terrainList[index].smoothingFactor && terrainList[index].smoothingFactor > 1)
				incr *= terrainList[index].smoothingFactor;
		}
		while (iter > 0)
		{
			iter -= 1;
			var adjusts = new Float32Array(n);
			for (var j = 1; j < nlat - 1; ++j)
			{
				for (var i = 1; i < nlon - 1; ++i)
				{
					var k = j*nlon;
					k -= nlon;
					var h00 = terrain1.heights[k+i-1];
					var h01 = terrain1.heights[k+i];
					var h02 = terrain1.heights[k+i+1];
					k += nlon;
					var h10 = terrain1.heights[k+i-1];
					var h11 = terrain1.heights[k+i];
					var h12 = terrain1.heights[k+i+1];
					k += nlon;
					var h20 = terrain1.heights[k+i-1];
					var h21 = terrain1.heights[k+i];
					var h22 = terrain1.heights[k+i+1];
					k -= nlon;
					if (   h00 > 1.5 && h01 > 1.5 && h02 > 1.5
					    && h10 > 1.5 && h11 > 1.5 && h12 > 1.5
					    && h20 > 1.5 && h21 > 1.5 && h22 > 1.5)
					{
						var min = h11 - incr;
						var max = h11 + incr;
						if (h00 < min) h00 = min; if (h00 > max) h00 = max;
						if (h01 < min) h01 = min; if (h01 > max) h01 = max;
						if (h02 < min) h02 = min; if (h02 > max) h02 = max;
						if (h10 < min) h10 = min; if (h10 > max) h10 = max;
						if (h12 < min) h12 = min; if (h12 > max) h12 = max;
						if (h20 < min) h20 = min; if (h20 > max) h20 = max;
						if (h21 < min) h21 = min; if (h21 > max) h21 = max;
						if (h22 < min) h22 = min; if (h22 > max) h22 = max;
						var h = (  h00 +   h01 + h02
						         + h10 + 2*h11 + h12
						         + h20 +   h21 + h22)/10.0;

						var dh = h - h11;
						adjusts[k+i] = dh;
					}
				}
			}
			for (var i = 0; i < n; ++i)
				terrain1.heights[i] += adjusts[i];
		}

		// Create the terrain overlay image.
		var minHeight = +9999999;
		var maxHeight = -9999999;
		for (var i = 0; i < n; ++i)
		{
			var height = terrain1.heights[i];
			if (height > terrainHeightUnknown)
			{
				if (height < minHeight) minHeight = height;
				if (height > maxHeight) maxHeight = height;
			}
		}
		if (minHeight > 0 && minHeight < 10) minHeight = 0;
		if (minHeight < -1000000) minHeight = 0;
		if (minHeight > +1000000) minHeight = 0;
		if (maxHeight > +1000000) maxHeight = 0;
		if (maxHeight < minHeight + 1) maxHeight = minHeight + 1;
		var deltaHeight = maxHeight - minHeight;
		var showContours = (deltaHeight > 15);
		terrain1Canvas = document.createElement("canvas");
		terrain1Canvas.width = nlon;
		terrain1Canvas.height = nlat;
		var ctx = terrain1Canvas.getContext("2d");
		var imgData = ctx.getImageData(0, 0, nlon, nlat);
		var h0 = minHeight;
		var h1 = maxHeight;
		var dh = h1 - h0; if (dh < 100) { h0 -= 0.3*(100-dh); h1 += 0.7*(100-dh); dh = h1 - h0; }
		var r0 = 40; var r1 = 180; var dr = r1 - r0;
		var g0 = 40; var g1 = 220; var dg = g1 - g0;
		var b0 = 40; var b1 = 180; var db = b1 - b0;
		var a0 = 255;
		var zz = terrainHeightUnknown + 1;
		for (var i = 0; i < n; ++i)
		{
			var h = terrain1.heights[i];
			var r = 0;
			var g = 0;
			var b = 0;
			var a = 0;
			var j = i*4;
			if (h > zz)
			{
				var t = (h - h0)/dh;
				if (showContours && Math.round(h) % 10 == 0) t += 0.1;
				r = r0 + Math.round(t*dr);
				g = g0 + Math.round(t*dg);
				b = b0 + Math.round(t*db);
				a = a0;
				if (showConvexity)
				{
					var lat = Math.floor(i/nlon);
					var lon = i - (lat*nlon);
					if (lat > 0 && lat < nlat - 1 && lon > 0 && lon < nlon - 1)
					{
						hN = terrain1.heights[i+nlon];
						hS = terrain1.heights[i-nlon];
						hE = terrain1.heights[i+1];
						hW = terrain1.heights[i-1];
						if (hN > zz && hS > zz && hE > zz && hW > zz)
						{
							var convexity = h - (hN+hS+hE+hW)/4.0;
							t += 2*convexity;
							r = r0 + Math.round(t*dr);
							g = g0 + Math.round(t*dg);
							b = b0 + Math.round(t*db);
							if (r < 0) r = 0; if (r > 255) r = 255;
							if (g < 0) g = 0; if (g > 255) g = 255;
							if (b < 0) b = 0; if (b > 255) b = 255;
						}
					}
				}
			}
			imgData.data[j] = r;
			imgData.data[j+1] = g;
			imgData.data[j+2] = b;
			imgData.data[j+3] = a;
		}
		ctx.putImageData(imgData, 0, 0);
		terrain1Ready = true;
		if (viewer != null)
			displayTerrain1(viewer);
	}
	script.src = url;
	document.head.appendChild(script);
}

function displayTerrain1(viewer)
{
	var degToRad = Math.PI / 180.0;
	viewer.scene.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider(
	{
		url : terrain1Canvas.toDataURL(),
		credit: terrain1Source,
		rectangle : new Cesium.Rectangle(terrain1MinLon*degToRad, terrain1MinLat*degToRad, terrain1MaxLon*degToRad, terrain1MaxLat*degToRad)
	}));
}

function displayTerrain2(viewer)
{
	var degToRad = Math.PI / 180.0;
	viewer.scene.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider(
	{
		url : terrain2Canvas.toDataURL(),
		credit: terrain2Source,
		rectangle : new Cesium.Rectangle(terrain2MinLon*degToRad, terrain2MinLat*degToRad, terrain2MaxLon*degToRad, terrain2MaxLat*degToRad)
	}));
}

function displayTerrain3(viewer)
{
	var degToRad = Math.PI / 180.0;
	viewer.scene.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider(
	{
		url : terrain3Canvas.toDataURL(),
		credit: terrain3Source,
		rectangle : new Cesium.Rectangle(terrain3MinLon*degToRad, terrain3MinLat*degToRad, terrain3MaxLon*degToRad, terrain3MaxLat*degToRad)
	}));
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


