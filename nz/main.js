// Leaflet
// Abrufen von Informationen aus html Dokument
let Map = document.querySelector("#map");
let lat = Map.dataset.lat;
let lng = Map.dataset.lng;
let markerTitle = Map.dataset.title;

// // Darstellung der Karte nur mit Topomap und ohne Layer Control
// let mymap = L.map(Map).setView([lat, lng], 13);
// L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     maxZoom: 17,
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
// }).addTo(mymap);

// Darstellung der Karte mit drei BaseLayer und Layer Control
// Definieren der BaseLayer
let OpenTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }),
    OpenStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }),
    NZaerial = L.tileLayer('http://tiles-a.data-cdn.linz.govt.nz/services;key=4bd8f17980d14deb9f679ecbc9cfc8aa/tiles/v4/set=4702/EPSG:3857/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data &copy; Land Information New Zealand Data Service <a href="https://www.linz.govt.nz/data/linz-data-service">(LINZ)</a> | ' +
            'Imagery &copy; <a href="https://data.linz.govt.nz/set/4702-nz-aerial-imagery/">NZ Aerial Imagery</a>'
    });

NZtopo = L.tileLayer('http://tiles-a.data-cdn.linz.govt.nz/services;key=4bd8f17980d14deb9f679ecbc9cfc8aa/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data &copy; Land Information New Zealand Data Service <a href="https://www.linz.govt.nz/data/linz-data-service">(LINZ)</a> | ' +
        'Imagery &copy; <a href="https://data.linz.govt.nz/layer/50767-nz-topo50-maps/">NZ Topo50 Maps</a>'
});

//L.tileLayer.provider("OpenTopoMap") noch adden


// Definieren der Karte mit OpenTopo als default Baselayer
let mymap = L.map(Map, {
    center: [lat, lng],
    zoom: 13,
    zoomControl: false, // Deaktivieren des Standardzooms
    layers: OpenTopo
})
// BaseLayer Objekt
let baseMaps = {
    "OpenTopomap": OpenTopo,
    "OpenStreets": OpenStreets,
    "NZ Aerial Imagery": NZaerial,
    "NZ Topo50 Maps": NZtopo,
};
// Hinzufügen der Layercontroll
L.control.layers(baseMaps).addTo(mymap);

// Marker
let marker = L.marker([lat, lng]).addTo(mymap);
marker.bindPopup(markerTitle).openPopup();
// marker.bindPopup(markerTitle);

// Zome Home Plugin
let zoomHome = L.Control.zoomHome();
zoomHome.addTo(mymap);