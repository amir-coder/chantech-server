

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




//getting the list of object equipement in chantier
router.get('/idChantier/:idChantier/equipement', function(req, res){
  let query = `SELECT libele, prix, numEquipement, nombreArticle from equipement, installer i
  where ((idequipement in (
  select equipement from installer i where (i.chantier = ${req.params.idChantier}
  ))) and (i.equipement = idEquipement))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object Chantier list retrieved successfully"
    })
  })
  });


//getting the list of object Chantier termminer
router.get('/fermer', function(req, res){
  let query = `SELECT 
  p1.idPersonne as 'idProprietaire',
  p1.nom as 'nomProprietaire',
  p1.prenom as 'prenomProprietaire',
  p1.numero as 'numeroProprietaire',
  p1.email as 'emailProprietaire',
  p1.mdp as 'mdpProprietaire',
  p1.email as 'emailProprietaire',
  p2.idPersonne as 'idResponsable',
  p2.nom as 'nomResponsable',
  p2.prenom as 'prenomResponsable',
  p2.numero as 'numeroResponsable',
  p2.email as 'emailResponsable',
  p2.mdp as 'mdpResponsable',
  p2.email as 'emailResponsable',
  idChantier,
  nomChantier,
  proprietaire,
  responsable,
  fermer,
  address
  FROM chantier, personne p1, personne p2 where ((fermer = 1)and( p1.idpersonne = proprietaire) and (p2.idpersonne = responsable))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object Chantier list retrieved successfully"
    })
  })
  });


  //getting the list of object Chantier courant
router.get('/courant', function(req, res) {
  let query = `SELECT 
  p1.idPersonne as 'idProprietaire',
  p1.nom as 'nomProprietaire',
  p1.prenom as 'prenomProprietaire',
  p1.numero as 'numeroProprietaire',
  p1.email as 'emailProprietaire',
  p1.mdp as 'mdpProprietaire',
  p1.email as 'emailProprietaire',
  p2.idPersonne as 'idResponsable',
  p2.nom as 'nomResponsable',
  p2.prenom as 'prenomResponsable',
  p2.numero as 'numeroResponsable',
  p2.email as 'emailResponsable',
  p2.mdp as 'mdpResponsable',
  p2.email as 'emailResponsable',
  idChantier,
  nomChantier,
  proprietaire,
  responsable,
  fermer,
  address
  FROM chantier, personne p1, personne p2 where ((fermer = 0)and( p1.idpersonne = proprietaire) and (p2.idpersonne = responsable))`;
  datatosend = []
  // {
  //   data = {},
  //   responsable = {},
  //   proprietaire = {}
  // }
  db.connection.query(query, function(err, data, fields)  {
    if(err) throw err;
      res.json({
        status: 200,
        data,
        message: "Object Chantier list retrieved successfully"
      });
    
  })
  });

//installe equipement in chantier
//tested and works
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
//tested and works
router.post("/nomchantier/:nomChantier/emailproprietaire/:emailpro/emailresponsable/:emailrespo/address/:address", function(req, res) {
  
  let query = `select * from personne where email = "${req.params.emailpro}"`;
  
  db.connection.query(query, function(err, data, fields) {
    if(data.length === 0) {
      //proptietaire n'existe pas
      res.json({
        status: 100,
        message: "Proprietaire n'existe pas."
      });

    }else{
      //proprietaire existe
      //verifier responsable
      let query = `select * from personne where email = "${req.params.emailrespo}"`;
      db.connection.query(query, function(err, data, fields) {
        if(data.length === 0) {
          //responsable n'existe pas
          res.json({
            status: 100,
            message: "Responsable n'existe pas."
          });
        }else{
          //responsable existe

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
        }
      });
    }
  })

  });


  //tested and works
  router.delete("/chantierId/:chantierID/ouvrierid/:ouvrierid",  function(req, res){
    let query = `DELETE FROM affecter WHERE ((chantier = ${req.params.chantierID})and(ouvrier =  ${req.params.ouvrierid}));`;
    
  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Ouvrier supprimer du chantier avec succee!"
    });
  })
  });


  router.put("/setfermer/idChantier/:idChantier", function(req, res) {

    let query = 
    `update chantier set fermer = 1 where (idChantier = "${req.params.idChantier}")`;
  
  
    db.connection.query(query, function(err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        message: "Chantier est maintenant fermer!"
      });
    })
    });


//delete chantier
router.delete("/id/:id", function(req, res) {

  let query = 
  `delete from chantier where (idChantier = ${req.params.id})`;


  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Chantier est maintenant supprimer!"
    });
  })
});

    //ALTER TABLE chantier DROP foreign key

//chantier_ibfk_1

// chantier_ibfk_2
//fk_chantier_proprietaire1
// fk_chantier_responsable
// fk_chantier_responsable1

module.exports = router;