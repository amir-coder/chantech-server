

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object EQUIPEMENT
//tested and works
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
//tested and works
router.post("/numEquipement/:numEquipement/libele/:libele/prix/:prix/nbArticle/:nbArticle", function(req, res) {


let query = `insert into equipement (numEquipement, libele, prix, nb_echantillon) values (${req.params.numEquipement} ,"${req.params.libele}", ${req.params.prix}, ${req.params.nbArticle});# 1 ligne affectée.`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Equipement Added successfully!"
  });
})
});

//updating number of articles
//tested and works
router.put("/numEquipement/:numEquipement/ndArticle/:nbArticle", function(req, res) {
  console.log(`numEquipement: ${req.params.numEquipement}, nbArticle:  ${req.params.nbArticle}`);
  query = `update Equipement set nb_echantillon = ${req.params.nbArticle} where (numEquipement = ${req.params.numEquipement})`;
  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Object equipement updated successfully!"
    });
  })
});


module.exports = router;