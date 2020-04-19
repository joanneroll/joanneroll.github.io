let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [48.208333, 16.373056],
    zoom: 12,
    layers: [
        startLayer
    ]
});

//Feature Groups
// let sightGroup = L.featureGroup().addTo(map);
let sightGroup = L.markerClusterGroup().addTo(map); //Stadtspaziergang
// let singleSightsGroup = L.featureGroup().addTo(map); //Sehenswürdigkeiten


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
    "Stadtspaziergang (Punkte)": sightGroup,
    // "Sehenswürdigkeiten (Punkte)": singleSightsGroup
}).addTo(map);


//Stadtspaziergang
let walkUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD%20&srsName=EPSG:4326&outputFormat=json";

let sights = L.geoJson.ajax(walkUrl, { //Punkte werden automatisch als Marker gesetzt
    pointToLayer: function (point, latlng) { //beeinflussen, welcher Marker entstehen soll
        let icon = L.icon({
            iconUrl: 'icons/sight.svg',
            iconSize: [16, 16]
        })
        let marker = L.marker(latlng, {
            icon: icon
        });
        // console.log("Point", point);
        marker.bindPopup(`<h3>${point.properties.NAME}</h3>
        <p><a target="links" href="${point.properties.WEITERE_INF}">Link</a></p>`); //bei nur "points" würde {object Object} kommen
        return marker;
        // return L.circleMarker(latlng, {color: "red", radius: 5})
    }
}); //.addTo(sightGroup); //Marker nicht direkt auf der Karte, sondern in walkGroup Layer

sights.on("data:loaded", function () { //wenn das Event walk geladen wurde (asynchron und so), dann führe etwas aus
    sightGroup.addLayer(sights); //gruppierte Sights nach laden der Daten hinzufügen
    console.log("data loaded");
    map.fitBounds(sightGroup.getBounds()); //Kartengrenzen an walkGroup Gruppe ausrichten
})

//Wanderweg
let wandern = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WANDERWEGEOGD&srsName=EPSG:4326&outputFormat=json";

L.geoJson.ajax(wandern, {
    style: function () {
        return {
            color: "green",
            weight: 5
        }
    }
}).addTo(map);

//Weltkulturerbe
let heritage = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";

L.geoJson.ajax(heritage, {
    style: function () {
        return {
            color: "salmon",
            fillOpacity: 0.3
        };
    },
    onEachFeature: function (feature, layer) {
        // console.log("Feature: ", feature);
        layer.bindPopup(`<h3>${feature.properties.NAME}</h3>
        <p>${feature.properties.INFO}</p>`)
    }
}).addTo(map);


// //Sehenswürdigkeiten 
// let singleSights_URL = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json";

// let singleSights = L.geoJson.ajax(singleSights_URL, {
//     pointToLayer: function (point, latlng) {
//         console.log("Punkte Sehenswürdigkeiten: ", point);
//         let marker = L.marker(latlng);
//         marker.bindPopup(`<p><h3>${point.properties.NAME}</h3></p>
//                     <img src="${point.properties.THUMBNAIL}" align="left" style="margin-right:10px"/>
//                     <b>Adresse:</b> ${point.properties.ADRESSE}</br>
//                     <a target="links" href="${point.properties.WEITERE_INF}">>> Link</a>`)
//         return marker;
//     }
// })

// singleSights.on("data:loaded", function () {
//     singleSightsGroup.addLayer(singleSights);
// })