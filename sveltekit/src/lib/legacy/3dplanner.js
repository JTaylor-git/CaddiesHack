import {
  Viewer,
  MapboxStyleImageryProvider,
  OpenStreetMapImageryProvider,
  GeoJsonDataSource,
  createWorldTerrain
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

/**
 * Initialize the 3D planner using Cesium.
 * @param {HTMLElement} container
 * @param {'distance'|'dispersion'} mode
 * @param {object} courseData
 * @param {{ mapbox: string, esri: string, opentopo: string }} keys
 * @returns {Viewer}
 */
export function init3D(container, mode, courseData, keys) {
  container.innerHTML = '';

  const imageryProvider = keys.mapbox
    ? new MapboxStyleImageryProvider({
        styleId: 'streets-v11',
        accessToken: keys.mapbox
      })
    : new OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      });

  const viewer = new Viewer(container, {
    imageryProvider,
    baseLayerPicker: false,
    terrainProvider: createWorldTerrain()
  });

  if (courseData?.features) {
    GeoJsonDataSource.load({
      type: 'FeatureCollection',
      features: courseData.features
    }).then((ds) => {
      viewer.dataSources.add(ds);
      viewer.zoomTo(ds);
    });
  }

  console.log('3D planner initialized:', { mode, courseData });
  return viewer;
export function init3D(container, mode, courseData, keys) {
  console.log('init3D planner', { container, mode, courseData, keys });
export function init3D(container, mode) {
  console.log('init3D planner', container, mode);
}
