

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

//getting the list of object Personne with id

router.get('/id/:id', function(req, res){
  let query = `SELECT * FROM PERSONNE where idPersonne= ${req.params.id}`;
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
      if(data[0].mdp === req.params.mdp) {
        //mot de passe correct
        //checking if admin
        if(data[0].admin === 1){
          //is admin
          res.json({
            status: 200,
            role:"admin",
            data : data,
            message: "Mot de passe correct!"
          });

        }else{
          //is not admin
          //check if proprietaire
         query = `select idchantier from chantier
          where proprietaire = ${data[0].idPersonne}`;

          db.connection.query(query, function (err, dataproprietaire, fields) {
            if (err) throw err;
            if (dataproprietaire.length === 0) {
              //n'est pas un proprietaire
              //check if responsable

              query = `select idchantier from chantier
              where Responsable = ${data[0].idPersonne}`;

              db.connection.query(query, function (err, dataresponsable, fields) {
                if (err) throw err;
                if (dataresponsable.length === 0) {
                  //n'est pas responsable
                  //check if ouvrier
                  query = `select idouvrier from ouvrier
                  where idouvrier = ${data[0].idPersonne}`;
                  db.connection.query(query, function (err, dataouvrier, fields){
                    if (dataouvrier.length === 0){
                      //n'est pas un ouvrier
                      //check if proprietaire
         query = `select idchantier from chantier
         where proprietaire = ${data[0].idPersonne}`;

         db.connection.query(query, function (err, dataproprietaire, fields) {
           if (err) throw err;
           if (dataproprietaire.length === 0) {
             //n'est pas un proprietaire
                      res.json({
                        status: 200,
                        role:"<UKN>",
                        data: data,
                        message: "Utilisateur n'a pas un role",
                      });
                    }else{
                      res.json({
                        status: 200,
                        role:"proprietaire",
                        data: data,
                        message: "Action complete successfully!",
                      });
                    }
                  });
                    }else{
                      //est un ouvrier
                    query = `select chantier from affecter
                    where ouvrier = ${data[0].idPersonne}`;
                    db.connection.query(query, function (err, datachantier, fields){
                      res.json({
                        status: 200,
                        role:"ouvrier",
                        data: datachantier,
                        message: "Action complete successfully!",
                      });
                    });
                    }
                  });
                }else{
                  res.json({
                    status: 200,
                    role:"responsable",
                    data: dataresponsable,
                    message: "Action complete successfully!",
                  });
                }
              });

            }else{
              res.json({
                status: 200,
                role:"proprietaire",
                data: data,
                message: "Action complete successfully!",
              });
            }
          });
 
        }
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

//chercher personne
router.get("/email/:email", function(req, res) {
  
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
      //send resonse
      res.json({
        status: 200,
        data: data,
        message: "personne existe!"
      });
    }
  });
});

//chercher personne par num
router.get("/numero/:numero", function(req, res) {
  
  //check if personne existe
  query = `select * from personne where numero= ${req.params.numero}`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      //send message that user does not existe
      res.json({
        status: 100,
        message: "Personne n'existe pas!"
      });
    }else{
      //send resonse
      res.json({
        status: 200,
        data: data,
        message: "personne existe!"
      });
    }
  });
});




router.get("/idPersonne/:idPersonne/proprietaire", function (req, res) {

  query = `select idchantier from chantier
  where proprietaire = ${req.params.idPersonne}`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {

      res.json({
        status: 100,
        message: "n'est pas un responsable",
      });
    }else{
      res.json({
        status: 200,
        data: data,
        message: "Action complete successfully!",
      });
    }
  });
});



//create new personne
router.post("/nom/:nom/prenom/:prenom/numero/:numero/email/:email/mdp/:mdp", function(req, res) {
  let query = `INSERT INTO PERSONNE(nom, prenom, numero, email, mdp) values ("${req.params.nom}", "${req.params.prenom}", ${req.params.numero}, "${req.params.email}", "${req.params.mdp}")`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New Object Personne Added successfully!"
    });
  })
});

//modifier personne
router.put("/id/:id/nom/:nom/prenom/:prenom/numero/:numero/email/:email", function(req, res) {

  //updating personne info
  let query = `update personne set 
  nom = "${req.params.nom}",
  prenom = "${req.params.prenom}",
  numero = ${req.params.numero},
  email = "${req.params.email}"
   where (idPersonne = "${req.params.id}")`;
  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Object Personne mofidied successfully!"
    });
  })
});



module.exports = router;