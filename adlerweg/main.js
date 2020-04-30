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
    etappen: L.featureGroup()
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
    "Adlerweg Etappen": overlay.etappen
}).addTo(map);


// console.log(ETAPPEN);
// console.log(ADLERBLICKE);

// array mit objekte --> for of 

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

let drawEtappe = function(nr) {
    overlay.etappen.clearLayers();

    //Metadaten verwenden, um die richtige Etappe zu erwischen
    //nr ist ein key in ETAPPEN; track
    // console.log(ETAPPEN[nr].track); 
    let track = ETAPPEN[nr].track.replace("A", ""); //"A" zu Beginn der TrackNr entfernen
    // console.log(track);

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
        // console.log(evt);
        map.fitBounds(evt.target.getBounds());
    }).addTo(overlay.etappen);
    
    overlay.etappen.addTo(map);
};
drawEtappe(1); //Übergeben der Etappennummer

let pulldown = document.querySelector("#pulldown");
// console.log(pulldown);

//im Pulldown Menü alle Etappen zur Auswahl stellen 
//dazu wird über ETAPPEN iteriert
for (let i = 1; i < ETAPPEN.length; i++) { //beginnen bei 1 um header zu überspringen
    //Objekt der Etappe wird in Variable gespeichert
    const etappe = ETAPPEN[i]; 
    // console.log(etappe);
    pulldown.innerHTML += `<option value="${i}">${etappe.titel}</option>`    
}

pulldown.onchange = function(evt) {
    console.log("evt", evt);
    let nr = evt.target.options[evt.target.options.selectedIndex].value;
    // console.log("Nummer", nr);
    drawEtappe(nr);
}