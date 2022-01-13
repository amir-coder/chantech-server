

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object Tache
router.get('/', function(req, res){
let query = "SELECT * FROM Tache";
db.connection.query(query, function(err, data, fields) {
  if(err) throw err;
  res.json({
    status: 200,
    data,
    message: "Tache list retrieved successfully"
  })
})
});


//afficher tache par chantier
router.get('/nomChantier/:nomChantier', function(req, res){
  let query = `SELECT * FROM Tache where chantier = (select idchantier from chantier where nomchantier = ${req.params.nomChantier})`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Tache list retrieved successfully"
    })
  })
  });


  
//create new Tache
router.post("/chantier/:chantier/nom/:nom/duree/:duree/description/:description", function(req, res) {

let query = `INSERT INTO Tache(chantier, duree, description) values (${req.params.chantier}, ${req.params.nom}, ${req.params.duree}, ${req.params.desciption})`;

db.connection.query(query, [values], function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Tache Added successfully!"
  });
})
});


//rendre tache terminer
router.put("/setTerminer/nomTache/:nomTache", function(req, res) {

  let query = 
  `update teche set terminer = 1 where (nomTache = ${req.params.nomTache})`;


  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Tache affecter avec succee!"
    });
  })
  });
  router.post("/chantier/:nomChantier/nomTache/:nomTache/emailOuvrier/:emailOuvrier", function(req, res) {

    let query = 
    `insert into travaille(tache, ouvrier) values (
      (select idTache from tache where (nom= "${req.params.nomTache}")),
      (select ouvrier from Affecter a where (
        (exists (select idChantier from chantier where (nomchantier= "${req.params.nomChantier}")))
        and (exists (select * from personne p where ( (a.ouvrier = p.idpersonne) and ( p.email = "${req.params.emailOuvrier}" ) ) ))
          )))`;
  
  
    db.connection.query(query, function(err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        message: "Tache affecter avec succee!"
      });
    })
    });


module.exports = router;