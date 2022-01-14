

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

//installe equipement in chantier
router.post("/chantier/:nomChantier/nomEquipement/:nomEquipement/nombreArticle/:nombreArticle", function(req, res) {

let query = `
insert into installer (chantier, Equipement, nombreArticle) values (
  (select idchantier from chantier where (nomChantier="${req.params.nomChantier}")), 
  (select idEquipement from equipement where (libele = "${req.params.nomEquipement}")),
  ${req.params.nombreArticle}
  )`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Chantier Added successfully!"
  });
})
});

//ajouter un chantier
router.post("/nomchantier/:nomChantier/emailproprietaire/:emailpro/emailresponsable/:emailrespo/address/:address", function(req, res) {

  let query = `insert into chantier (nomchantier, proprietaire, responsable, address) values ( 
    "${req.params.nomChantier}",
    (select idPersonne from personne where email="${req.params.emailpro}"), 
    (select idPersonne from personne where email = "${req.params.emailrespo}"),
    "${req.params.address}"
    );`;
  
  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New Object Chantier Added successfully!"
    });
  })
  });


module.exports = router;