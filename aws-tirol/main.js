let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47.3, 11.5],
    zoom: 8,
    layers: [
        startLayer
    ]
});

let awsLayer = L.featureGroup().addTo(map);

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
    "Wetterstationen Tirol": awsLayer
}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";

let aws = L.geoJson.ajax(awsUrl, {
    filter: function (feature) {
        console.log("Feature in filer: ", feature);
        // if (feature.properties.LT < 5) {
        //     return true;
        // } else {
        //     return false;
        // }
        // return feature.properties.LT <5;
        return feature.geometry.coordinates[2] > 3000;
    },
    pointToLayer: function (point, latlng) {
        let marker = L.marker(latlng);
        marker.bindPopup(`<h3>${point.properties.name}</h3></br>
        <b>Datum:</b> ${point.properties.date}</br>
        <b>Temperatur:</b> ${point.properties.LT} °C`); //bei nur "points" würde {object Object} kommen
        return marker;
    }
}).addTo(awsLayer);