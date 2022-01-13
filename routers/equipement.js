

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

//create new equipement
router.post("/", function(req, res) {

let values = [
  req.body.numEquipement,
  req.body.libele,
  req.body.prix,
  req.body.nbArticle
];

let query = `insert into equipement (numEquipement, libele, prix, nbArticle) values (${values[0]} ,"${values[1]}", ${values[2]}, ${values[3]});# 1 ligne affectée.`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Equipement Added successfully!"
  });
})
});

//updating number of articles
router.put("/numEquipement/:numEquipement/ndArticle/:nbArticle", function(req, res) {
  query = `update Equipement set nbArticle = ${req.params.nbArticle} where (numEquipement = ${req.params.nbArticle})`;
  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Object equipement updated successfully!"
    });
  })
});


module.exports = router;