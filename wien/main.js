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
        // if (point.properties.BEMERKUNG == null) {
        //     bemerkung = "keine Beschreibung verfügbar";
        // } else {
        //     bemerkung = point.properties.BEMERKUNG;
        // }
        point.properties.BEMERKUNG == null ? bemerkung = "keine Beschreibung verfügbar" : bemerkung = point.properties.BEMERKUNG;

        let popupText = `<h3>${point.properties.NAME}</h3>` +
            `<p><i>${bemerkung}</i></p>` +
            `<p><b>Adresse:</b> ${point.properties.ADRESSE}</p>` +
            `<p><a target="links" href="${point.properties.WEITERE_INF}">>> weitere Informationen</a></p>`

        marker.bindPopup(popupText)
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
        function setLineStyle(Typ) {
            return Typ == "1" ? "5,6" : //strichliert 
                Typ == "2" ? "1,10" : ""; //"gepunktet" / sehr kurze Striche
        };

        return {
            color: "#111111", //schwarz
            dashArray: setLineStyle(feature.properties.TYP),
            fillOpacity: 0.3
        }

    },
    onEachFeature: function (feature, layer) {
        // console.log("Wanderweg Feature", feature);
        layer.bindPopup(`${feature.properties.BEZ_TEXT}`)
    }
}).addTo(map);

//Weltkulturerbe
let heritage = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";

let drawHeritageSorted = function (jsondata) { //Definieren des geordneten Zeichens
    heritage_list = jsondata.features
    console.log("original", heritage_list);
    //Features zunächst in Liste übergeben und sortiert
    heritage_list.sort(function compareTyp(obj1, obj2) { //vergleicht jetzt den TYP der zwei Objekte
        //Bezeichnung "compareTyp" ist willkührlich --> "compareIwas" funktioniert auch
        console.log(obj1, obj2);
        console.log(obj1.properties.TYP, obj2.properties.TYP);
        return obj2.properties.TYP - obj1.properties.TYP; //obj2 - obj1 --> im Array erst 2 dann 1 (Kern- über Pufferzone) //// obj1 - obj2 --> erst 1 dann 2 (Puffer- über Kernzone)
    })
    console.log("sorted", heritage_list); //Array nun zuerst mit Typ2, dann Typ1

    //Anschließend Features basierend auf Liste zeichnen
    L.geoJson(heritage_list, {
        style: function (feature) {
            function setColor(Typ) {
                return Typ == "1" ? "#FF4136" : //rot = Kernzone
                    Typ == "2" ? "#FFDC00" : ""; //gelb = Pufferzone
            };

            return {
                fillOpacity: 0.3,
                color: setColor(feature.properties.TYP), //Einfärben nach Kern- und Pufferzone
            };

        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                <h3>${feature.properties.NAME}</h3>
                <p>${feature.properties.INFO}</p>
            `)
        }
    }).addTo(map);

}

//Abrufen / Aktivieren der drawHeritageSorted Funktion inklusive Zeichnen der Features
let heritage_layer = L.geoJson.ajax(heritage, { //Übergeben der URL
    middleware: function (jsondata) {
        return drawHeritageSorted(jsondata);

    }

});

// //Heritage ohne Sortieren
// //let heritage_list = [];
// L.geoJson.ajax(heritage, {
//     style: function (feature) {
//         //Einfärben nach Kern- oder Pufferzone
//         if (feature.properties.TYP == "1") {
//             // console.log("=Kernzone")
//             return {
//                 color: "#FF4136", //rot
//                 fillOpacity: 0.3
//             };
//         } else if (feature.properties.TYP == "2") {
//             // console.log("=Pufferzone")
//             return {
//                 color: "#FFDC00", //gelb
//                 fillOpacity: 0.3
//             };

//         }

//     },
//     onEachFeature: function (feature, layer) {
//         // console.log("Feature: ", feature);
//         // console.log("Layer", layer);

//         layer.bindPopup(`<h3>${feature.properties.NAME}</h3>
//         <p>${feature.properties.INFO}</p>`)

//         // heritage_list.push(feature); //add feature to array
//     },

// }).addTo(map);




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