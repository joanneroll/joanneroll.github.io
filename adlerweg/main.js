let startLayer = L.tileLayer.provider("BasemapAT.terrain");

let map = L.map("map", {
    center: [47.25, 11.5],
    zoom: 9,
    layers: [
        startLayer
    ]
});

let overlay = {
    adlerblicke: L.featureGroup(),
    etappen: L.featureGroup(),
    einkehr: L.featureGroup(),
    wikipedia: L.featureGroup()
};

L.control.layers({
    "BasemapAT.grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": startLayer,
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Adlerblicke": overlay.adlerblicke,
    "Adlerweg Etappen": overlay.etappen,
    "Einkehrmöglichkeiten": overlay.einkehr,
    "Wikipedia-Artikel": overlay.wikipedia
}).addTo(map);


// console.log(ETAPPEN);
// console.log(ADLERBLICKE);

//Speichern des HTML contents
let html_original = document.querySelectorAll('*[id^="et-"]');
let html_original_list = []
for (let i = 0; i < html_original.length; i++) {
    let element = html_original[i];
    html_original_list.push([element.id, element.innerHTML])
}

for (const blick of ADLERBLICKE) {
    // console.log(blick);
    let mrk = L.marker([blick.lat, blick.lng], {
        icon: L.icon({
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
            iconUrl: "icons/panoramicview.png"
        })
    }).addTo(overlay.adlerblicke);

    mrk.bindPopup(`Standort ${blick.standort} (${blick.seehoehe}m)`);
    //icon anchor auf mitte von icon setzen 

}

overlay.adlerblicke.addTo(map);

let drawEtappe = function (nr) {
    overlay.etappen.clearLayers();
    let vis;

    //Metadaten verwenden, um die richtige Etappe zu erwischen
    //nr ist ein key in ETAPPEN; track
    // console.log(ETAPPEN[nr].track); 
    let track = ETAPPEN[nr].track.replace("A", ""); //"A" zu Beginn der TrackNr entfernen
    // console.log(track);

    if (nr == 0) { //nr = 0 --> Ausgangsseite
        map.fitBounds(overlay.adlerblicke.getBounds()); //Mapbounds auf Adlerblicke
        // visibility = document.getElementsByClassName("optional-visible").style = "optional-hidden";
        vis = document.getElementsByClassName("optional");
        document.getElementById("profile").style.visibility = "hidden";
        for (let i = 0; i < vis.length; i++) {
            vis[i].style.display = "none";
        }

        //Original HTML Content einfügen 
        // console.log(html_original_list);
        for (let i = 0; i < html_original_list.length; i++) {
            let element = html_original_list[i];
            let key = element[0];
            let value = element[1];
            // console.log(key, value);     
            let html_element = document.querySelector(`#${key}`);
            html_element.innerHTML = value;
        }

    } else {
        // visibility = document.getElementsByClassName("optional-hidden").className = "optional-visible";
        document.getElementById("profile").style.visibility = "visible";
        vis = document.getElementsByClassName("optional");
        for (let i = 0; i < vis.length; i++) {
            vis[i].style.display = "inline";
        }

        let gpx = new L.GPX(`gpx/AdlerwegEtappe${track}.gpx`, {
            async: true,
            marker_options: { //in dem plugin können die normalen icons settings mitverwendet werdn
                startIconUrl: `icons/number_${nr}.png`,
                endIconUrl: 'icons/finish.png',
                shadowUrl: null,
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -37]
            },
            polyline_options: {
                color: 'black',
                dashArray: 5
            }
        });

        gpx.on("loaded", function (evt) {
            // console.log("Event", evt);
            map.fitBounds(evt.target.getBounds());

            controlElevation.clear();
            controlElevation.load(`gpx/AdlerwegEtappe${track}.gpx`);
        }).addTo(overlay.etappen);

        overlay.etappen.addTo(map);

        //Metadateninfos auf Seite anzeigen, wenn verfügbar
        for (const key in ETAPPEN[nr]) { //man geht durch alle elemente durch 
            if (ETAPPEN[nr].hasOwnProperty(key)) { //hasOwnProperty - saubere variante für "existiert"
                let val = ETAPPEN[nr][key];

                // value von "einkehr" überschreiben: # mit , ersetzen
                if (key == "einkehr") {
                    val = val.split("#").join(", ");
                    // val = val.replace(/#/g, ", ")
                }

                // console.log(`et-${key}`);
                let element = document.querySelector(`#et-${key}`);
                if (element) { //wenn es die meta info gibt, entsprechend in html überschreiben
                    if (key == "track") {
                        // console.log("track", element.outerHTML)
                        // console.log(track)
                        let outer = `<a id="et-track" href="/adlerweg/gpx/AdlerwegEtappe${track}.gpx" download="">Download Etappe (GPX-Datei)</a>`
                        element.outerHTML = outer;

                    } else {
                        element.innerHTML = val;
                    }

                };

            }
        }

    }


};
drawEtappe(0); //Übergeben der Etappennummer

let pulldown = document.querySelector("#pulldown");
pulldown.innerHTML += `<option value="0">Etappe auswählen</option>`

//im Pulldown Menü alle Etappen zur Auswahl stellen, dazu über ETAPPEN iterieren
for (let i = 1; i < ETAPPEN.length; i++) { //beginnen bei 1 um Header zu überspringen
    const etappe = ETAPPEN[i]; //Objekt der Etappe wird in Variable gespeichert
    // console.log(etappe);
    etappe_pd = etappe.titel.split("  ").join(" - ");
    pulldown.innerHTML += `<option value="${i}">${etappe_pd}</option>`
}


pulldown.onchange = function (evt) {
    // console.log("evt", evt);
    let nr = evt.target.options[evt.target.options.selectedIndex].value;
    // console.log("Nummer", nr);
    drawEtappe(nr);
}

let drawEinkehr = function () {
    for (let einkehr of EINKEHR) {
        // console.log(einkehr);
        let mrk = L.marker([einkehr[2], einkehr[3]], {
            icon: L.icon({
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -37],
                iconUrl: "icons/restaurant.png"
            })
        }).addTo(overlay.einkehr);
        mrk.bindPopup(`${einkehr[1]} (Etappe ${einkehr[0]})`);
    }
}

drawEinkehr();
overlay.einkehr.addTo(map);

//elevation plugin
let controlElevation = L.control.elevation({
    theme: "adler-theme",
    detached: true, //Profile in Div (außerhalb der Karte) dargestellt 
    elevationDiv: "#profile",
    followMarker: false
}).addTo(map);

L.control.scale({
    imperial: false //nur metrische Angabe 
}).addTo(map);

let drawnMarkers = {}; //alle gezeichneten Marker setzen 

map.on("zoomend moveend", function (evt) { //map.on gilt für beide Events
    let ext = {
        north: map.getBounds().getNorth(),
        south: map.getBounds().getSouth(),
        east: map.getBounds().getEast(),
        west: map.getBounds().getWest(),
    };

    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${ext.north}&south=${ext.south}&east=${ext.east}&west=${ext.west}&username=joanneroll&lang=de&maxRows=30`
    // console.log(url);

    let wiki = L.Util.jsonp(url).then(function (data) { //https://github.com/calvinmetcalf/leaflet-ajax
        // console.log(data.geonames); //hier sind die Artikel drinnen

        for (let article of data.geonames) {
            // console.log(article);
            for (let article of data.geonames) {
                let ll = `${article.lat}${article.lng}`;
                if (drawnMarkers[ll]) { //ist der Marker schon in drawnMarker
                    continue; //dann überspringen
                } else {
                    drawnMarkers[ll] = true; //iein Wert zu weisen, also in die Liste setzen und Marker anschließend zeichnen
                };
            }

            //Icons tunen
            let png = "";
            // console.log(article.feature);
            switch (article.feature) { //arbeitete nach und nach Fälle ab - Alternative zu else if
                case "city":
                    png = "city.png";
                    break;
                case "landmark":
                    png = "landmark.png";
                    break;
                case "waterbody":
                    png = "lake.png";
                    break;
                case "river":
                    png = "river.png";
                    break;
                case "mountain":
                    png = "mountain.png";
                    break;
                default: //wenn keines der oberen zutrifft
                    png = "information.png";
            }
            // console.log(png);


            let mrk = L.marker([article.lat, article.lng], {
                icon: L.icon({
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                    iconUrl: `icons/${png}`
                })

            }).addTo(overlay.wikipedia);
            
            let img = "";
            if (article.thumbnailImg) {
                img = `<img src="${article.thumbnailImg}" alt="thumbnail">`
            }

            mrk.bindPopup(`
            <small>${article.feature}</small>
            <h3>${article.title} (${article.elevation}m)</h3>
            ${img} 
            <p>${article.summary}</p>
            <a target="wikipedia" href="https://${article.wikipediaUrl}">Wikipedia Artikel</a>`)
        }


    })

});
//https://secure.geonames.org/wikipediaBoundingBoxJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&username=joanneroll&lang=de&maxRows=30

overlay.wikipedia.addTo(map);