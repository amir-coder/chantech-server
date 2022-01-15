const express = require("express");
router = express.Router();

//importing database
const db = require("../app/models");

//getting the list of object Tache
router.get("/", function (req, res) {
  let query = "SELECT * FROM Tache";
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Tache list retrieved successfully",
    });
  });
});

//getting the list of object ouvrier in tache
router.get("/idTache/:idTache/ouvrier", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (p.idPersonne in (select ouvrier from travaille where tache =${req.params.idTache} )) )`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully",
    });
  });
});

//getting the list of object Tache
router.get("/id/:id", function (req, res) {
  let query = `SELECT * FROM Tache where idtache = ${req.params.id}`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Tache retrieved successfully",
    });
  });
});

//afficher tache par chantier
router.get("/idChantier/:idChantier", function (req, res) {
  let query = `SELECT * FROM Tache where idchantier =  ${req.params.idChantier}`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "chantier list retrieved successfully",
    });
  });
});

//create new Tache
//tested and works
router.post(
  "/chantier/:chantier/nom/:nom/duree/:duree/description/:description",
  function (req, res) {
    let query = `INSERT INTO Tache(idchantier,nom, duree, description) values ((select idchantier from chantier where nomchantier="${req.params.chantier}"), "${req.params.nom}", ${req.params.duree}, "${req.params.description}")`;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        message: "New Object Tache Added successfully!",
      });
    });
  }
);

//rendre tache terminer
//tested and works
router.put("/setTerminer/nomTache/:nomTache", function (req, res) {
  let query = `update tache set termine = 1 where (nom = "${req.params.nomTache}")`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Tache est maintenant terminer!",
    });
  });
});

//affecter une tache a un ouvrier dans un chantier

router.post(
  "idTache/:idTache/idOuvrier/:idOuvrier",
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
        
        query = `select * from tache where idTache= ${req.params.idTache}`;

        db.connection.query(query, function (err, data, fields) {
          if (err) throw err;
          if (data.length === 0) {
            //tache n'existe pas
            res.json({
              status: 100,
              message: "tache n'existe pas",
            });
          } else {
            //tache existe
            //inserting
            let query = `insert into travaille(tache, ouvrier) values (
              ${req.params.idTache},
              ${req.params.idOuvrier})`;
            db.connection.query(query, function (err, data, fields) {
              if (err) throw err;
              res.json({
                status: 200,
                message: "Tache affecter avec succee!",
              });
            });
          }
        });
      }
    });
  }
);

//tested and works
router.delete("/tacheId/:tacheID/ouvrierid/:ouvrierid", function (req, res) {
  let query = `DELETE FROM travaille WHERE ((tache = ${req.params.tacheID})and(ouvrier =  ${req.params.ouvrierid}));`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Ouvrier supprimer du tache avec succee!",
    });
  });
});

///tache/chantier/toure eiffel/nomTache//emailOuvrier/bbb@email.com

module.exports = router;
