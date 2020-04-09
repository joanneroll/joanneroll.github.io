let startLayer = L.tileLayer.provider("Esri.WorldStreetMap");

let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

let circleGroup = L.featureGroup().addTo(map);

L.control.layers({
    "Esri.WorldStreetMap": L.tileLayer.provider("Esri.WorldStreetMap"),
    "Esri.WorldPhysical": L.tileLayer.provider("Esri.WorldPhysical"),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "OpenStreetMap-Mapnik": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Stamen.TonerLite": L.tileLayer.provider("Stamen.TonerLite")
}, {
    "Thematische Darstellung": circleGroup

}).addTo(map);

let drawCircles = function () {
    let data = CONFIRMED;
    let header = CONFIRMED[0];
    let index = header.length -1; //letzter Dateneintrag erwischen

    // Datum anzeigen
    document.querySelector("#datum").innerHTML = `am ${header[index]}`
    
    //console.log(data);
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        //console.log(row[2],row[3]);
        let reg = `${row[0]} ${row[1]}`;
        let lat = row[2];
        let lng = row[3];
        let val = row[index];
        //let mrk = L.marker([lat,lng]).addTo(map);
        //mrk.bindPopup(`${reg}: ${val}`);

        //A = r²*PI
        //r² = A/PI
        //r = WURZEL(A/PI)
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI);
        let circle = L.circleMarker([lat, lng], {
            radius: r
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
};

drawCircles(); // CONFIRMED wird oben direkt der Funktion übergeben
// drawCircles(RECOVERED);
// drawCircles(DEATHS);