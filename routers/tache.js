

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
//tested and works
router.post("/chantier/:chantier/nom/:nom/duree/:duree/description/:description", function(req, res) {

let query = `INSERT INTO Tache(idchantier,nom, duree, description) values ((select idchantier from chantier where nomchantier="${req.params.chantier}"), "${req.params.nom}", ${req.params.duree}, "${req.params.description}")`;


db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Tache Added successfully!"
  });
})
});


//rendre tache terminer
//tested and works
router.put("/setTerminer/nomTache/:nomTache", function(req, res) {

  let query = 
  `update tache set termine = 1 where (nom = "${req.params.nomTache}")`;


  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Tache est maintenant terminer!"
    });
  })
  });

  //affecter une tache a un ouvrier dans un chantier
  
  router.post("/chantier/:nomChantier/nomTache/:nomTache/emailOuvrier/:emailOuvrier", function(req, res) {

    //check if ouvrier existe
  query = `select * from personne where email= "${req.params.emailOuvrier}"`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      //ouvrier n'existe pas
      res.json({
        status: 100,
        message: "Ouvrier n'existe pas"
      });
    }else {
      //ouvrier existe

      //check if chantier existe
      query = `select * from chantier where nomchantier= "${req.params.nomChantier}"`;

      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
        if (data.length === 0) {
          //chantier n'existe pas
          res.json({
            status: 100,
            message: "chantier n'existe pas"
          });
        }else {
          //chantier existe
      //check if tache existe
      query = `select * from tache where nom= "${req.params.nomTache}"`;

      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
        if (data.length === 0) {
          //tache n'existe pas
          res.json({
            status: 100,
            message: "tache n'existe pas"
          });
        }else {
          //tache existe
          //inserting
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


        }
      
      })
        }
      
      })
    
  }

  });
    });


 //tested and works
 router.delete("/tacheId/:tacheID/ouvrierid/:ouvrierid",  function(req, res){
  let query = `DELETE FROM travaille WHERE ((tache = ${req.params.tacheID})and(ouvrier =  ${req.params.ouvrierid}));`;
  
db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "Ouvrier supprimer du tache avec succee!"
  });
})
});

    ///tache/chantier/toure eiffel/nomTache//emailOuvrier/bbb@email.com

module.exports = router;