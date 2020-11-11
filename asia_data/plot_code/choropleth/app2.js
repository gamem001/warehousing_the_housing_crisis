var mapboxAccessToken = "pk.eyJ1IjoiYWhld2V0dCIsImEiOiJja2d2ZzA4aHEwMDFtMnNwbmt6cWZobGUxIn0.CHxUYC5kdmK1XNViTlBAPw";
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: ...,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

L.geoJson(statesData).addTo(map);