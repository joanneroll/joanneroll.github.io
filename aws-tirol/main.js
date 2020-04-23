let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47.3, 11.5],
    zoom: 8,
    layers: [
        startLayer
    ]
});

let overlay = {
    stations: L.featureGroup()
}

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
    "Wetterstationen Tirol": overlay.stations
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
        // return feature.properties.LT != null;
        return feature.properties.LT; 
    },
    pointToLayer: function (point, latlng) {
        let marker = L.marker(latlng);
        popupText = `<h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3>`
                    + `<ul>`
                    + `<li><b>Position:</b> Lat: ${point.geometry.coordinates[0].toFixed(5)}/Lng: ${point.geometry.coordinates[1].toFixed(5)}</li>`
                    + `<li><b>Datum:</b> ${point.properties.date}</li>`
                    + `<li><b>Temperatur:</b> ${point.properties.LT} °C</li>`
                    //sind folgende Parameter für die Station nicht definiert, erscheinen sie auch nicht im Popup
                    + ( typeof point.properties.WG  !== "undefined" ? `<li><b>Windgeschwindigkeit:</b> ${point.properties.WG} m/s</li>` : "" ) 
                    + ( typeof point.properties.RH !== "undefined" ? `<li><b>Relative Luftfeuchte:</b> ${point.properties.RH} %</li>` : "")
                    + ( typeof point.properties.HS !== "undefined" ? `<li><b>Schneehöhe:</b> ${point.properties.HS} cm</li>` : "")
                    + `</ul>`
                    + `<a target="plot" href="https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png">>> Graphik der Wetterstation</a>`
                    ;

        marker.bindPopup(popupText); 
        return marker;
    }
}).addTo(overlay.stations);