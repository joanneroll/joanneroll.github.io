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

        //falls keine Information vorhanden (null), alternativer Text
        let bemerkung;
        if (point.properties.BEMERKUNG == null) {
            bemerkung = "keine Beschreibung verfügbar";
        } else {
            bemerkung = point.properties.BEMERKUNG;
        }

        marker.bindPopup(`<h3>${point.properties.NAME}</h3>
        <p><i>${bemerkung}</i></p>
        <p><b>Adresse:</b> ${point.properties.ADRESSE}</p>
        <p><a target="links" href="${point.properties.WEITERE_INF}">>> weitere Informationen</a></p>`); //bei nur "points" würde {object Object} kommen
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
    style: function (feature) {
        //Linienstil nach Stadtwanderweg (Typ 1/schwarz strichliert) oder Rundumadum (Typ 2/schwarz punktiert)
        if (feature.properties.TYP == "1") {
            // console.log
            return {
                color: "#111111", //schwarz
                dashArray: "5,6", //strichliert
                fillOpacity: 0.3
            };
        } else if (feature.properties.TYP == "2") {
            // console.log
            return {
                color: "#111111", //schwarz
                dashArray: "1,10", //gepunktet
                fillOpacity: 0.3
            };

        }

    },
    onEachFeature: function (feature, layer) {
        // console.log("Wanderweg Feature", feature);
        layer.bindPopup(`${feature.properties.BEZ_TEXT}`)
    }
}).addTo(map);

//Weltkulturerbe
let heritage = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";

let heritage_list = [];
let heritage_layer = L.geoJson.ajax(heritage, {
    style: function (feature) {
        //Einfärben nach Kern- oder Pufferzone
        if (feature.properties.TYP == "1") {
            // console.log("=Kernzone")
            return {
                color: "#FF4136", //rot
                fillOpacity: 0.3
            };
        } else if (feature.properties.TYP == "2") {
            // console.log("=Pufferzone")
            return {
                color: "#FFDC00", //gelb
                fillOpacity: 0.3
            };

        }

    },
    onEachFeature: function (feature, layer) {
        // console.log("Feature: ", feature);
        // console.log("Layer", layer);
        if (feature.properties.TYP == "1") { //Kernzone (rot) soll über Pufferzone (gelb) dargestellt werden
            // console.log("layer vor!")
            layer.bringToFront(); //funktioniert aber aus Gründen noch nicht 
        };

        layer.bindPopup(`<h3>${feature.properties.NAME}</h3>
        <p>${feature.properties.INFO}</p>`)

        heritage_list.push(feature); //add feature to array
    },

}).addTo(map);

heritage_layer.on("data:loaded", function () {
    console.log("Heritage loaded");
    console.log("Heritage Array", heritage_list);
    for (i in heritage_list) {
        feature = heritage_list[i];
        console.log("i", i, "- Typ", feature.properties.TYP);
        // console.log("i", i, "- Typ (Integer): ", parseInt(heritage_list[i].properties.TYP));
        TYP_int = parseInt(feature.properties.TYP);
        console.log("i", i, "- Typ Integer 2: ", TYP_int);
        // console.log(feature);

        // //Sortieren Versuch 1
        // if (feature.properties.TYP == "1") { //Kernzone (rot) soll über Pufferzone (gelb) dargestellt werden
        //     console.log(feature);
        //     console.log("layer vor!")
        //     this.bringToFront(); //funktioniert nicht 
        //     feature.bringToFront(); //funktioniert auch nicht
        // };

        //Sortieren Versuch 2
        //Problem hier --> Typ als String angegeben.. in integer konvertieren?
        //wie einpflegen? vermutlich außerhalb der Schleife, aber wie dann darauf zugreifen?

        // Daten der Größe nach sortieren und dann darstellen --> großer Kreis unter kleinem Kreis
        // i1 = parseInt(heritage_list[i].properties.TYP);
        // i2 = parseInt(heritage_list[i+1].properties.TYP);
        // heritage_list.sort(function compareNumbers(i1, i2) { 
        //     // return parseInt(heritage_list[i].properties.TYP) - parseInt(heritage_list[i+1].properties.TYP);
        //     return i1-i2;
        // });

        //funktioniert so auf jeden Fall nicht...
        //würde mit diesem i+1 Ansatz wsl auch überhaupt nicht richtig durchlaufen in der aktuellen Form

    }
    // console.log
})

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