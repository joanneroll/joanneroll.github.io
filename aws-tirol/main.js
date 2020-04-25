let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    layers: [
        startLayer
    ]
});

let overlay = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    wind: L.featureGroup()
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
    "Wetterstationen Tirol": overlay.stations,
    "Temperatur (°C)": overlay.temperature,
    "Windgeschwindigkeit (km/h)": overlay.wind

}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";

let aws = L.geoJson.ajax(awsUrl, {
    filter: function (feature) {
        // console.log("Feature in filer: ", feature);
        return feature.properties.LT;
    },
    pointToLayer: function (point, latlng) {
        let marker = L.marker(latlng);
        popupText = `<h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3>` +
            `<ul>` +
            `<li><b>Position:</b> Lat: ${point.geometry.coordinates[0].toFixed(5)}/Lng: ${point.geometry.coordinates[1].toFixed(5)}</li>` +
            `<li><b>Datum:</b> ${point.properties.date}</li>` +
            `<li><b>Temperatur:</b> ${point.properties.LT} °C</li>` +
            //sind folgende Parameter für die Station nicht definiert, erscheinen sie auch nicht im Popup
            (typeof point.properties.WG !== "undefined" ? `<li><b>Windgeschwindigkeit:</b> ${point.properties.WG} m/s</li>` : "") +
            (typeof point.properties.RH !== "undefined" ? `<li><b>Relative Luftfeuchte:</b> ${point.properties.RH} %</li>` : "") +
            (typeof point.properties.HS !== "undefined" ? `<li><b>Schneehöhe:</b> ${point.properties.HS} cm</li>` : "") +
            `</ul>` +
            `<a target="plot" href="https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png">>> Graphik der Wetterstation</a>`;

        marker.bindPopup(popupText);
        return marker;
    }
}).addTo(overlay.stations);

//ajax geoJSON ->  in der Variable "aws" werden die Daten vom Server abgerufen
//möchte man die Daten in individuell als Layer darstellen, anders visualisieren, ... müssen entsprechende ZeichenFunktionen erstellt werden
//diese können aufgerufen werden, sobald die Daten geladen wurden ("aws.on")
//dabei muss das geoJSON Objekt aus der "aws" Funktion wieder abgerufen werden und den ZeichenFunktionen übergeben werden

//Farbzuweisung anhang der Breaks
let getColor = function (val, ramp) {
    // console.log(val, ramp);
    //Solange der Wert niedriger ist als die Schwelle, Farbcode übergeben
    for (let i = 0; i < ramp.length; i++) {
        const pair = ramp[i];
        if (val >= pair[0]) {
            break;
        } else {
            col = pair[1]
        }
        // console.log(val,pair);     
    }

    return col;

};

//ZeichenFunktionen der einzelnen Parameter/DatenLayer
let drawTemperature = function (jsonData) {
    // console.log(jsonData);
    L.geoJson(jsonData, {
        filter: function (feature) {
            return feature.properties.LT
        },
        pointToLayer: function (feature, latlng) {
            color = getColor(feature.properties.LT, COLORS.temperature);
            // console.log(color);
            return L.marker(latlng, {
                title: `${feature.properties.name} (${feature.geometry.coordinates[2]}m)`,
                icon: L.divIcon({
                    html: `<div class="label-temperature" style="background-color:${color}">${feature.properties.LT.toFixed(1)}</div>`,
                    className: "ignore-me" // dirty hack - Standard StyleClass wird überschrieben und im CSS neu definiert
                })

            });
        }
    }).addTo(overlay.temperature); //neuer Layer wird hinzugefügt zum Overlay Layer

};


let drawWind = function (jsonData) {
    // console.log(jsonData);
    L.geoJson(jsonData, {
        filter: function (feature) {
            return feature.properties.WG
        },
        pointToLayer: function (feature, latlng) {

            let windKMH = Math.round(feature.properties.WG * 3.6);
            let color = getColor(windKMH, COLORS.wind);
            let rotation = feature.properties.WR;

            return L.marker(latlng, {
                title: `${feature.properties.name} (${feature.geometry.coordinates[2]}m) - ${windKMH} km/h`,
                icon: L.divIcon({
                    html: `<div class="label-wind"><i class="fas fa-arrow-circle-up" style="color:${color};transform: rotate(${rotation}deg)"></i></div>`,
                    className: "ignore-me"
                })

            });
        }
    }).addTo(overlay.wind);

};

//Aufrufen der ZeichenFunktionen
aws.on("data:loaded", function () {
    // console.log(aws.toGeoJSON()); //aws wieder als GeoJSON abrufen
    //Funktion wird aufgerufen und GeoJSON Objekt übergeben
    drawTemperature(aws.toGeoJSON());
    drawWind(aws.toGeoJSON());

    map.fitBounds(overlay.stations.getBounds()); //Boundaries auf angezeigte Station setzen 

    overlay.wind.addTo(map); //dieser Layer wird als default angezeigt
});