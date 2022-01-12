

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object Chantier

router.get('/', function(req, res){
let query = "SELECT * FROM chantier";
db.connection.query(query, function(err, data, fields) {
  if(err) throw err;
  res.json({
    status: 200,
    data,
    message: "Object Chantier list retrieved successfully"
  })
})
});

//create new personne
router.post("/", function(req, res) {

let values = [
  req.body.nomchantier,
  req.body.proprietaireEmail,
  req.body.responsableEmail,
  req.body.address
];

let query = `insert into chantier (nomchantier, proprietaire, responsable, address) values ( ${values[0]},
    (select idPersonne from personne where email=${values[1]}), 
    (select idPersonne from personne where email = ${values[2]}),
    ${values[3]}
    )`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Chantier Added successfully!"
  });
})
});


module.exports = router;