

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
router.post("/chantier/:nomChantier/equipement/:nomEquipement", function(req, res) {

let query = `
insert into installer (chantier, Equipement) values (
  (select idchantier from chantier where (nomChantier="${req.params.nomchantier}")), 
  (select idEquipement from equipement where (libele = "${req.params.nomchantier}"))
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