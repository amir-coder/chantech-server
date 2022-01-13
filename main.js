//yarn add express cors mysql

const express = require("express");
const cors = require("cors");


//creating express app
const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of centent-type app/json
app.use(express.json());

//importing db
const db = require('./app/models/index');


// parse requests of c type app/x-www-form-urlencoded
app.use(express.urlencoded({ entended: true}));

// simple route for testing
app.get("/", (request, response) => {
    response.json({ message: "Welcome to Amir's application."});
});

//set server port and listen for requests
const PORT = process.env.PORT || 8080;

var server = {
    port : PORT
}

//routers:
var routers = {
    personne: require('./routers/personne'),
    ouvrier: require('./routers/ouvrier'),
    tache: require('./routers/tache'),
    equipement: require('./routers/equipement'),
}

//use routers
app.use("/personne", routers.personne);
app.use("/ouvrier", routers.ouvrier);
app.use("/tache", routers.tache);
app.use("/equipement", routers.equipement);

app.listen(server.port, () => {
    console.log(`Server is running in port ${PORT}`);
});


