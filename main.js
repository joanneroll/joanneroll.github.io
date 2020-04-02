let startLayer = L.tileLayer.provider("Esri.WorldStreetMap");

let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

L.control.layers({
    "Esri.WorldStreetMap": L.tileLayer.provider("Esri.WorldStreetMap"),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "OpenStreetMap-Mapnik": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    // "Thunderforest-SpinalMap": L.tileLayer.provider("Thunderforest.SpinalMap"),
    // "Stadia.AlidadeSmoothDark": L.tileLayer.provider("Stadia.AlidadeSmoothDark"),
    // "Thunderforest-Landscape": L.tileLayer.provider("Thunderforest.Landscape"),
    "Stamen.TonerLite": L.tileLayer.provider("Stamen.TonerLite")
},{
    "Thematische Darstellung": circleGroup

}).addTo(map)

console.log(CONFIRMED);
// loopen durch alle Elemende
// i fängt bei 1 ein, um den header mit buchstaben - statt zeilen - zu überspringed
// for (let i = 1; i < CONFIRMED.length; i++) {
//     let row = CONFIRMED[i];
//     // console.log(row[2],row[3]);
//     let reg = `${row[0]} ${row[1]}`
//     let lat = row[2];
//     let lng = row[3];
//     let val = row[low.length-1]; //letzter Wert in der Zeile


//     let mrk = L.marker([lat, lng]).addTo(map);
//     mrk.bindPopup(`${reg} ${val}`).addTo(map);

//     let circle = L.circleMarker(|)
// }

for (let i = 1; i < CONFIRMED.length; i++) {
    let row = CONFIRMED[i];
    //console.log(row[2],row[3]);
    let val = row[row.length - 1];
    let mrk = L.marker([row[2], row[3]]).addTo(map);
    // mrk.bindPopup(`${row[0]} ${row[1]}: ${val}`);

    let r = Math.sqrt(val * s / Math.PI);
    let s = 0.5
    let circle = L.circleMarker([row[2], row[3], {
            radius: r
        }).addTo(map); circle.bindPopup(`${row[0]} ${row[1]}`);

    }






    let drawCircles = function (data) {
        //console.log(data);
        for (let i = 1; i < data.length; i++) {
            let row = data[i];
            //console.log(row[2],row[3]);
            let reg = `${row[0]} ${row[1]}`;
            let lat = row[2];
            let lng = row[3];
            let val = row[row.length - 1];
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
    
    drawCircles(CONFIRMED);
    drawCircles(DEATHS);
    drawCircles(RECOVERED);