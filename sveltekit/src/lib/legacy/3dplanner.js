import { Viewer, MapboxStyleImageryProvider, OpenStreetMapImageryProvider, GeoJsonDataSource, createWorldTerrain } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export function init3D(container, mode, courseData, keys) {
  container.innerHTML = '';

  const imageryProvider = keys.mapbox
    ? new MapboxStyleImageryProvider({ styleId: 'streets-v11', accessToken: keys.mapbox })
    : new OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' });

  const viewer = new Viewer(container, {
    imageryProvider,
    terrainProvider: createWorldTerrain(),
    baseLayerPicker: false
  });

  if (courseData?.features) {
    GeoJsonDataSource.load({
      type: 'FeatureCollection',
      features: courseData.features
    }).then(ds => {
      viewer.dataSources.add(ds);
      viewer.zoomTo(ds);
    });
  }

  return viewer;
}
