import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Initialize the 2D planner map using Leaflet.
 * @param {HTMLElement} container - The div container for the map.
 * @param {'distance'|'dispersion'} mode - Data mode toggle (future use).
 * @param {object} courseData - { centroid: [lon, lat], features: GeoJSON[] }.
 * @param {{ mapbox: string, esri: string, opentopo: string }} keys - Stored API keys.
 */
export function initPlanner(container, mode, courseData, keys) {
  // Clear any previous map instance
  container.innerHTML = '';

  // Instantiate map centered on course centroid
  const map = L.map(container).setView(
    [courseData.centroid[1], courseData.centroid[0]],
    15
  );

  // Select tile layer source
  let tileUrl;
  let attribution = '© OpenStreetMap contributors';

  if (keys.mapbox) {
    tileUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}@2x?access_token=${keys.mapbox}`;
    attribution = '© Mapbox © OpenStreetMap contributors';
  } else if (keys.esri) {
    tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`;
    attribution = 'Tiles © Esri — Source: Esri, HERE, Garmin, USGS';
  } else if (keys.opentopo) {
    tileUrl = 'https://tile.opentopomap.org/{z}/{x}/{y}.png';
    attribution = '© OpenTopoMap contributors';
  } else {
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }

  // Add the base map
  L.tileLayer(tileUrl, {
    maxZoom: 19,
    attribution
  }).addTo(map);

  // Render GeoJSON features (tees, fairways, greens, hazards)
  if (courseData.features && Array.isArray(courseData.features)) {
    L.geoJSON(courseData.features, {
      style: feature => ({
        color: feature.properties.stroke || '#3388ff',
        weight: feature.properties.weight || 2,
        fillColor: feature.properties.fill || 'transparent'
      }),
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: feature.properties.radius || 6,
          color: feature.properties.stroke || '#3388ff',
          fillColor: feature.properties.fill || '#3388ff',
          fillOpacity: 1
        })
    }).addTo(map);
  }

  // Auto-zoom to show all features with padding
  try {
    const geoLayers = [];
    map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) geoLayers.push(layer);
    });
    if (geoLayers.length) {
      const group = L.featureGroup(geoLayers.map(l => l));
      map.fitBounds(group.getBounds().pad(0.2));
    }
  } catch (e) {
    console.warn('2D planner auto-fit bounds failed:', e);
  }

  // Mode stub (you can style differently based on `mode`)
  console.log('2D planner initialized:', { mode, courseData });

// Partial port of legacy 2D planner logic
// TODO: replace console logs with real map implementation
export function initPlanner(container, mode, courseData, keys) {
  console.log('initPlanner called with', { container, mode, courseData, keys });
export function initPlanner(container) {
  console.log('initPlanner called with', container);
  // Placeholder for legacy planner initialization

}
