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


