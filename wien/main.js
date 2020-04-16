let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [48.208333, 16.373056],
    zoom: 12,
    layers: [
        startLayer
    ]
});

let walkGroup = L.featureGroup().addTo(map);

L.control.layers({
    "BasemapAT.grau": startLayer,
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Stadtspaziergang (Punkte)": walkGroup
}).addTo(map);

let walkUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD%20&srsName=EPSG:4326&outputFormat=json";


let walk = L.geoJson.ajax(walkUrl, { //Punkte werden automatisch als Marker gesetzt
    pointToLayer: function (point, latlng) { //beeinflussen, welcher Marker entstehen soll
        let icon = L.icon({
            iconUrl: 'icons/sight.svg',
            iconSize: [32, 32]
        })
        let marker = L.marker(latlng, {
            icon: icon
        });
        console.log("Point", point);
        marker.bindPopup(`<h3>${point.properties.NAME}</h3>
        <p><a target="links" href="${point.properties.WEITERE_INF}">Link</a></p>`); //bei nur "points" würde {object Object} kommen
        return marker;
        // return L.circleMarker(latlng, {color: "red", radius: 5})
    }
}).addTo(walkGroup); //Marker nicht direkt auf der Karte, sondern in walkGroup Layer

walk.on("data:loaded", function() { //wenn das Event walk geladen wurde (asynchron und so), dann führe etwas aus
    console.log("data loaded");
    map.fitBounds(walkGroup.getBounds()); //Kartengrenzen an walkGroup Gruppe ausrichten
})
