

const express = require("express");
  router = express.Router();

//importing database
const db = require('../app/models');

//getting the list of object Personne

router.get('/', function(req, res){
  let query = "SELECT * FROM PERSONNE";
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object Personne list retrieved successfully"
    })
  })
});

//authenticate personne
router.get("/email/:email/mdp/:mdp", function(req, res) {
  
  //check if personne existe
  query = `select * from personne where email= "${req.params.email}"`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      //send message that user does not existe
      res.json({
        status: 100,
        message: "Personne n'existe pas!"
      });
    }else{
      //check if mdp is correct
      if(data.mdp === req.params.mdp) {
        //mot de passe correct
          res.json({
            status: 200,
            message: "Mot de passe correct!"
          });
      }else {
        //mot de passe incorrect
          res.json({
            status: 100,
            message: "mot de passe incorrect!"
          });
      }
    }
  });
});


//create new personne
router.post("/nom/:nom/prenom/:prenom/numero/:numero/email/:email", function(req, res) {
  let query = `INSERT INTO PERSONNE(nom, prenom, numero, email) values ("${req.params.nom}", "${req.params.prenom}", ${req.params.numero}, "${req.params.email}")`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New Object Personne Added successfully!"
    });
  })
});




module.exports = router;