

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

  router.get("/id/:id/libre", function (req, res) {
    let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
    FROM Personne p, ouvrier o, Specialite s
    where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (p.idPersonne IN (select ouvrier from affecter where chantier = ${req.params.id})) and (not exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        data,
        message: "user list retrieved successfully",
      });
    });
  });
  
  //getting the list of object Ouvrier with condition (est occupe)
  //tested and works
  router.get("/id/:id/occupe", function (req, res) {
    let query = `SELECT idPersonne, nom, prenom, numero, email, nomSpecialite
    FROM Personne p, ouvrier o, Specialite s
    where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (p.idPersonne IN (select ouvrier from affecter where chantier = ${req.params.id})) and (exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        data,
        message: "user list retrieved successfully",
      });
    });
  });
  
  //getting the list of object tache in chantier
router.get('/idChantier/:idChantier/tacheTerminer', function(req, res){
  let query = `SELECT * FROM Tache where ((idchantier =  ${req.params.idChantier}) and (termine = 1))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object tache list retrieved successfully"
    })
  })
  });

   //getting the list of object tache in chantier
router.get('/idChantier/:idChantier/tacheCourant', function(req, res){
  let query = `SELECT * FROM Tache where ((idchantier =  ${req.params.idChantier}) and (termine = 0))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object tache list retrieved successfully"
    })
  })
  });


//getting the list of object Chantier termminer
router.get('/fermer', function(req, res){
  let query = `SELECT distinct
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
  FROM chantier, personne p1, personne p2 where ((fermer = 1) and (( p1.idpersonne = proprietaire) and (p2.idpersonne = responsable)))`;
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
  let query = `SELECT distinct
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
  FROM chantier, personne p1, personne p2 where ((fermer = 0) and (( p1.idpersonne = proprietaire) and (p2.idpersonne = responsable)))`;
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

  //getting the list of object Chantier courant
  router.get('/info/id/:id', function(req, res) {
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
    FROM chantier ch, personne p1, personne p2 where ((ch.idchantier = ${req.params.id})and( p1.idpersonne = proprietaire) and (p2.idpersonne = responsable))`;
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
router.post("/idChantier/:idChantier/numEquipement/:numEquipement/nombreArticle/:nombreArticle", function(req, res) {

let query = `
insert into installer (chantier, Equipement, nombreArticle) values (
  ${req.params.idChantier}, 
  (select idEquipement from equipement where (numero = ${req.params.numEquipement})),
  ${req.params.nombreArticle}
  )`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Equipement installed successfully!"
  });
})
});

//ajouter ouvrier a chantier
router.post(
  "idChantier/:idChantier/idOuvrier/:idOuvrier",
  function (req, res) {
    //check if ouvrier existe
    query = `select * from personne where idPersonne= ${req.params.idOuvrier}`;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      if (data.length === 0) {
        //ouvrier n'existe pas
        res.json({
          status: 100,
          message: "Ouvrier n'existe pas",
        });
      } else {
        //ouvrier existe
        
        query = `select * from chantier where idChantier= ${req.params.idChantier}`;

        db.connection.query(query, function (err, data, fields) {
          if (err) throw err;
          if (data.length === 0) {
            //tache n'existe pas
            res.json({
              status: 100,
              message: "Chantier n'existe pas",
            });
          } else {
            //tache existe
            //inserting
            let query = `insert into affecter(chantier, ouvrier) values (
              ${req.params.idChantier},
              ${req.params.idOuvrier})`;
            db.connection.query(query, function (err, data, fields) {
              if (err) throw err;
              res.json({
                status: 200,
                message: "Ouvrier affecter avec succee!",
              });
            });
          }
        });
      }
    });
  }
);
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

//modifier chantier
//tested and works
router.put("/idchantier/:idchantier/nomChantier/:nomChantier/emailproprietaire/:emailpro/emailresponsable/:emailrespo/address/:address", function(req, res) {
  
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

  let searchquery = `select * from chantier where responsable = ${req.params.responsable}`;

  db.connection.query(searchquery, function (err, data, fields) {
    if(data.lenght = 0){
      //ouvrier n'est pas un responsable

          let query = `update chantier set 
          nomchantier = "${req.params.nomChantier}",
          proprietaire = (select idPersonne from personne where email = "${req.params.emailpro}"), 
          responsable = (select idPersonne from personne where email = "${req.params.emailrespo}"), 
          address = "${req.params.address}";`;
          
          db.connection.query(query, function(err, data, fields) {
            if (err) throw err;
            res.json({
              status: 200,
              message: "Object Chantier modified successfully!"
            });
          });
  
    }else{
      //ouvrier existe
      res.json({
        status: 100,
        message: "Ce ouvrier ne peut pas etre un responsable a des chantiers multiple",
      });
    }
    });
        }
      });
    }
  })

  });
//rendre chantier fermer
//tested and works
router.put("/setFermer/idChantier/:idChantier", function (req, res) {
  let query = `update chantier set fermer = 1 where (idChanteir = "${req.params.idChantier}")`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Chantier est maintenant fermer!",
    });
  });
});


router.put("/idChantier/:idChantier/responsable/:responsable", function (req, res) {

  let searchquery = `select * from chantier where responsable = ${req.params.responsable}`;

  db.connection.query(searchquery, function (err, data, fields) {
    if(data.lenght = 0){
      //ouvrier n'est pas un responsable
      let addquery = `update chantier set responsable = ${req.params.responsable} where (idChanteir = "${req.params.idChantier}")`;

      db.connection.query(addquery, function (err, data, fields) {
        if (err) throw err;
        res.json({
          status: 200,
          message: " responsable affecter au chantier!",
        });
  });
  
    }else{
      //ouvrier existe
      res.json({
        status: 100,
        message: "Ce ouvrier ne peut pas etre un responsable a des chantiers multiple",
      });
    }
    });
});

 //get time de travaille
router.get('/id/:id/travaille', function(req, res){

  let query = `SELECT sum(duree) as 'heureTravaillerChantier'
  from tache 
  where ((termine = 1)
  and (idchantier = ${req.params.id}))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully"
    })
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