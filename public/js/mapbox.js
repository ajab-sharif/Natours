/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LXNoYWlmIiwiYSI6ImNsaW52enJ6MDAzNHoza29jbDZkMmF5ZmYifQ.Wf3fe1i6WviAgw0pdMAsfg';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox-shaif/clinx0d6r00hs01qv8md39ps0', // style URL
    scrollZoom: false
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
      elment: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // add popup 
    new mapboxgl.Popup({
      offset: 40
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</P>`)
      .addTo(map)
    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      left: 100,
      right: 100,
      top: 200,
      bottom: 150
    }
  });
}