

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object EQUIPEMENT

router.get('/', function(req, res){
let query = "SELECT * FROM EQUIPEMENT";
db.connection.query(query, function(err, data, fields) {
  if(err) throw err;
  res.json({
    status: 200,
    data,
    message: "Object EQUIPEMENT list retrieved successfully"
  })
})
});

//create new personne
router.post("/", function(req, res) {

let values = [
  req.body.numEquipement,
  req.body.libele,
  req.body.prix
];

let query = `insert into equipement (numEquipement, libele, prix) values (${values[0]} ,${values[1]}, ${values[2]});# 1 ligne affectée.`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Equipement Added successfully!"
  });
})
});


module.exports = router;