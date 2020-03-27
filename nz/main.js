// Leaflet 
let Map = document.querySelector("#map");
let lat = Map.dataset.lat;
let lng = Map.dataset.lng;
let markerTitle = Map.dataset.title;

// Check Coordinates
// console.log(lat, lng);

let mymap = L.map(Map).setView([lat, lng], 13);

// Topographische Karte
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 11, //Anpassen des MaxZooms an Platzierung Marker
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(mymap);

// Marker
// Bowen Falls: lat -44.6652185, lng 167.9209507
let marker = L.marker([-44.6652185, 167.9209507]).addTo(mymap);
marker.bindPopup(markerTitle);
//marker.bindPopup("Bowen Falls").openPopup();

// Alternativer Openstreetlayer (streets/satellite)
// L.tileLayer(
//     'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//         maxZoom: 18,
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//             '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//             'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         id: 'mapbox/streets-v11',
//         //id: 'mapbox/satellite-v9',
//         tileSize: 512,
//         zoomOffset: -1
//     }).addTo(mymap);