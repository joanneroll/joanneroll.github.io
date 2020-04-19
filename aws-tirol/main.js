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
        // console.log(feature.properties.LT)
        // if (feature.properties.LT < 5) {
        //     return true;
        // } else {
        //     return false;
        // }
        // return feature.properties.LT <5;
        // return feature.geometry.coordinates[2] > 3000,
        return feature.properties.LT != null;
    },
    pointToLayer: function (point, latlng) {
        let marker = L.marker(latlng);
        marker.bindPopup(`<h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3></br>
        <ul>
        <li><b>Position:</b> Lat: ${point.geometry.coordinates[0]}/Lng: ${point.geometry.coordinates[1]}</li>
        <li><b>Datum:</b> ${point.properties.date}</li>
        <li><b>Temperatur:</b> ${point.properties.LT} °C</li>
        </ul>`); //bei nur "points" würde {object Object} kommen
        return marker;
    }
}).addTo(awsLayer);