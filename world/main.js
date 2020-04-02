
let startLayer = L.tileLayer.provider("OpenTopoMap");

let map = L.map("map", {
    center: [0,0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

L.control.layers({
    "OpenTopoMap" : startLayer,
    "OpenStreetMap.Mapnik" : L.tileLayer.provider("OpenStreetMap.Mapnik"),


}).addTo(map)