import maplibregl from 'maplibre-gl'
export const initMap = () => {
    const map = new maplibregl.Map({
        container: 'map',
        center: [37.87169219934515, 55.715158842773064],
        zoom: 6,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
    });
    window.map = map

    return map
}
