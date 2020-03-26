// alert("Hello worlds");

// let message = "Hello world";
// alert(message);
// message = "Hallo Welt";
// alert(message)

const LINK_COLOR = "#ff0000"
console.log("Link bitte in der Farbe", LINK_COLOR);

let highscore = 238582;
console.log(highscore / 10);

let firstname = "John";
let lastname = "Smith";
console.log("Name: ", firstname, lastname);

let fullname = 'Jeffrey "The Dude" Lebobski';
console.log(fullname);

let template = `Dein Highscore sind ${highscore} Punkte`;
console.log(template)

let isOver18 = true;
console.log(isOver18);

let age = 17;
console.log("über 18?:", age > 18)

let participants = ["John", "Jane", "Max"]
console.log(participants)
console.log("Einträge im Array: ", participants.length);
console.log(participants[1]);

let gameHighscores = [2099, 3010, 333, 5000];
console.log(gameHighscores);

// Objekt:
let user = {
    firstname: "John",
    lastname: "Smith",
    age: 25
};

console.log(user);
console.log(user.firstname);
// neuer Wert zum Objekt hinzufügen
user.highscore = 200;
console.log(user);

// spezielle Syntax für Variblennamen mit Leerzeichen
user["highscore ever"] = 400; 
console.log(user);


let a = 2;
let b = 4;
console.log(a+b);
console.log(b/(a-1));
a++; //+1
console.log(a);


// let myAge = prompt("Wie alt bist du?");
// console.log(`Du bist ${myAge} Jahre alt.`)
// console.log(`über 18? ${myAge > 18}`);

// if (myAge >18) {
//     console.log("Glückwunsch: über 18");
// } else {
//     console.log("Leider unter 18.")
// }

// Schleifen: for Schleife
// i startet bei 0, endet bei 10, in jeder Schleife um +1

for (let i=0; i<10; i++) {
    console.log(`Schleife ${i}`);
}

for (let j = 0; j < participants.length; j++) {
    const participant = participants[j];
    console.log(`Teilnehmer*in ${j}: ${participant}`);
}

participants.forEach(participant => {
    console.log(`Teilnehmer*in ${participant}`);
});

// Funktionen

function showAge (birthYear) {
    console.log(`Du bist ca. ${2020-birthYear} Jahre alt.`);
}

showAge(1964);
showAge(1996);