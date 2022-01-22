const express = require("express");
const Query = require("mysql/lib/protocol/sequences/Query");
router = express.Router();

//importing database
const db = require("../app/models");

//getting the list of object Ouvrier
//tested and works
router.get("/", function (req, res) {
  let query = `SELECT idPersonne, nom, prenom, numero, email, nomSpecialite
FROM Personne p, ouvrier o, Specialite s 
where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) )`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully",
    });
  });
});

//getting the time of work by ouvrier
//tested and works
///ouvrier/email/ddd@email.com/travaille   sum(duree)
router.get("/email/:email/travaille", function (req, res) {
  //'heureTravaillerChantier'

  let query = `SELECT sum(duree) 
  from tache 
  where (termine = 1)
  and idTache IN (select idTache 
    from travaille where (ouvrier IN (select idPersonne from personne where (email = "${req.params.email}"))))`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully",
    });
  });
}); //tested and works
///ouvrier/email/ddd@email.com/travaille   sum(duree)
router.get("/idOuvrier/:idOuvrier/travaille", function (req, res) {
  //'heureTravaillerChantier'

  let query = `SELECT sum(duree) as 'heureTravailleOuvrier'
  from tache 
  where (termine = 1)
  and idTache IN (select idTache 
    from travaille where (ouvrier = ${req.params.idOuvrier} ))`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully",
    });
  });
});

//role
router.get("/idOuvrier/:idOuvrier/role/", function (req, res) {
  resdata = {
    admin: 0,
    responsable: 0,
    chantierRespo: [""],
    ouvrier: 1,
    chantierAffecter: [""],
  };

  //selecting if admin or not
  query = `select admin from personne where email= "${req.params.email}"`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    resdata.admin = data[0];

    query = `select nomChantier from chantier
    where Responsable in (
    select idPersonne from personne where email = "${req.params.email}"
    )`;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      resdata.chantierRespo = data;
      if (data.length > 0) {
        resdata.responsable = 0;
      }
    });

    query = `select nomChantier from chantier
    where idchantier in (
    select chantier from affecter where (ouvrier in (select idpersonne from personne where email = "${req.params.email}"))
    )`;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      resdata.chantierAffecter = data;
    });

    res.json({
      status: 200,
      message: "Action complete successfully!",
    });
  });
});

//chercher ouvrier
router.get("/email/:email", function (req, res) {
  //check if ouvrier existe
  query = `select * from ouvrier where (idouvrier in (select idPersonne from personne where email= "${req.params.email}"))`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      //send message that user does not existe
      res.json({
        status: 120,
        message: "ouvrier n'existe pas!",
      });
    } else {
      //send resonse
      res.json({
        status: 200,
        data: data,
        message: "ouvrier existe!",
      });
    }
  });
});

//getting the list of object Ouvrier with condition (est libre)
//tested
router.get("/libre", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (not exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully",
    });
  });
});

//getting the list of object Ouvrier with condition (est libre)
//tested
router.get("/responsable", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (o.idOUvrier IN (select responsable from travaille)))`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully",
    });
  });
});

//getting the list of object Ouvrier with condition (est libre)
//tested
router.get("/nonResponsable", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (o.idOUvrier NOT IN (select responsable from travaille)))`;
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
router.get("/occupe", function (req, res) {
  let query = `SELECT idPersonne, nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully",
    });
  });
});

//getting the list of object Ouvrier with condition (est disponible dans un chantier)
//tested
router.get("/idChantier/:idChantier/", function (req, res) {
  let query = `SELECT distinct idPersonne, nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s, affecter aff
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and ( o.idouvrier in (
  select ouvrier
  from affecter where chantier = ${req.params.idChantier}
  ))
  )`;

  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "ouvrier list retrieved successfully",
    });
  });
});

//ajouter un ouvrier a une tache
//tested and works
router.post("/idOuvrier/:idOuvrier/idTache/:idTache", (req, res) => {
  query1 = `select * from travaille where (tache = ${req.params.idTache} and ouvrier = ${req.params.idOuvrier})`;

  db.connection.query(query1, function (err, data, fields) {
    if (data.length === 0) {
      query = `insert into travaille(ouvrier, tache) values (
    
          ${req.params.idOuvrier}
          ,
          ${req.params.idTache}
          );`;

      db.connection.query(query, function (err, data, fields) {
        if (err) throw err;
        res.json({
          status: 200,
          message: "Ouvrier ajouter a la tache!",
        });
      });
    } else {
      //already affected
      res.json({
        status: 200,
        message: "Ouvrier travaille deja dans la tache!",
      });
    }
  });
});

//ajouter un ouvrier a un chantier
//tested
router.post("/idOuvrier/:idOuvrier/idChantier/:idChantier", (req, res) => {
  query1 = `select * from affecter where (chantier = ${req.params.idChantier} and ouvrier = ${req.params.idOuvrier})`;

  db.connection.query(query1, function (err, data, fields) {
    if (data.length === 0) {
      query = `insert into affecter(ouvrier, chantier) values (
    
        ${req.params.idOuvrier}
        ,
        ${req.params.idChantier}
        );`;

      db.connection.query(query, function (err, data, fields) {
        if (err) throw err;
        res.json({
          status: 200,
          message: "Ouvrier ajouter au chantier!",
        });
      });
    } else {
      //already affected
      res.json({
        status: 200,
        message: "Ouvrier deja affecter au chantier!",
      });
    }
  });
});

//creer un nouveau ouvrier
//tested and works
router.post(
  "/nom/:nom/prenom/:prenom/numero/:numero/email/:email/specialite/:nomSpecialite",
  (req, res) => {
    //check if ouvrier existe
    query = `select * from personne where email= "${req.params.email}"`;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      if (data.length === 0) {
        console.log("Creating user");
        //ouvrier doesn't existe in personne so create
        let query = `INSERT INTO PERSONNE(nom, prenom, numero, email) values ("${req.params.nom}", "${req.params.prenom}", ${req.params.numero}, "${req.params.email}")`;

        db.connection.query(query, function (err, data, fields) {
          if (err) throw err;
        });
      }

      //personne now existes

      //checking if specialite existes
      query = `select * from specialite where nomSpecialite= "${req.params.nomSpecialite}"`;

      db.connection.query(query, function (err, data, fields) {
        if (err) throw err;

        if (data.length === 0) {
          //create pecialite
          let query = `INSERT INTO specialite(nomSpecialite) values ("${req.params.nomSpecialite}")`;

          db.connection.query(query, function (err, data, fields) {
            if (err) throw err;
          });
        }
        //Specialite now existe now existes

        //creating ouvrier
        query = `insert into ouvrier (idouvrier, idspecialite) values ( 
    (select idPersonne from personne where email="${req.params.email}"), 
    (select idSpecialite from specialite where nomSpecialite = "${req.params.nomSpecialite}")
    );`;

        db.connection.query(query, function (err, data, fields) {
          if (err) throw err;
          //responding
          res.json({
            status: 200,
            message: "Ouvrier ajouter!",
          });
        });
      });
    });
  }
);

//getting the list of object Ouvrier with condition (est libre)
//tested
router.get("/info/email/:email", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (p.email = "${req.params.email}") )`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully",
    });
  });
});

router.get("/info/id/:id", function (req, res) {
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomSpecialite
    FROM Personne p, ouvrier o, Specialite s
    where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (p.idPersonne =  "${req.params.id}") )`;
  db.connection.query(query, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully",
    });
  });
});

router.delete("/id/:id", function (req, res) {
  let searchquery = `select * from chantier where responsable = ${req.params.id}`;

  db.connection.query(searchquery, function (err, data, fields) {
    if (err) throw err;
    if(data.length === 0){
      //on peut supprimer
      let query = `delete from ouvrier where idouvrier = ${req.params.id} `;

      db.connection.query(query, function (err, data, fields) {
        if (err) throw err;
        //responding
        res.json({
          status: 200,
          message: "Ouvrier supprimer!",
        });
      });
    }else{
      //responding
      res.json({
        status: 100,
        message: "On ne peut pas supprimer un ouvrier qui est un responsable",
      });

    }
  });
});

//modifier ouvrier
router.put(
  "/id/:id/nom/:nom/prenom/:prenom/numero/:numero/email/:email/specialite/:specialite",
  function (req, res) {
    //verifying if email is duplicated
    searchemailquery = `select * from personne where ((email = "${req.params.email}") and not (idPersonne = ${req.params.id})`;
    db.connection.query(searchemailquery, function (err, data, fields) {
      if (data.lengh === 0) {
        //email unique
        searchnumeroquery = `select * from personne where ((numero = ${req.params.numero}) and not (idPersonne = ${req.params.id})`;
        db.connection.query(searchnumeroquery, function (err, data, fields) {
          if (data.lengh === 0) {
            //numero unique

            //updating personne info
            let query1 = `update personne set 
    nom = "${req.params.nom}",
    prenom = "${req.params.prenom}",
    numero = ${req.params.numero},
    email = "${req.params.email}"
     where (idPersonne = ${req.params.id})`;
            db.connection.query(query1, function (err, data, fields) {
              if (err) throw err;
              let query2 = `select idSpecialite from specialite where nomSpecialite = "${req.params.specialite}"`;

              db.connection.query(query2, function (err, data1, fields) {
                //checking if specialite existe
                if (data1.length === 0) {
                  //specialite n'existe pas
                  //cree specialite
                  let query21 = `INSERT INTO specialite(nomSpecialite) values("${req.params.specialite}");`;
                  db.connection.query(query21, function (err, data, fields) {
                    let query3 = "SELECT LAST_INSERT_ID() as idSpecialite;";
                    db.connection.query(query3, function (err, data, fields) {
                      //specialite creer
                      //updating personne info
                      console.log(data);
                      let query211 = `update ouvrier set 
                  idspecialite = ${data[0].idSpecialite}
                  where (idouvrier = ${req.params.id})`;
                      db.connection.query(
                        query211,
                        function (err, data, fields) {
                          //modified successfully
                          //succee
                          if (err) throw err;
                          res.json({
                            status: 200,
                            message: "Object Ouvrier mofidied successfully!",
                          });
                        }
                      );
                    });
                  });
                } else {
                  let query22 = `update ouvrier set 
          idspecialite = ${data1[0].idSpecialite}
          where (idouvrier = ${req.params.id})`;
                  db.connection.query(query22, function (err, data, fields) {
                    res.json({
                      status: 200,
                      message: "Object Ouvrier mofidied successfully!",
                    });
                  });
                }
              });
            });
          } else {
            //refuser le numero
            //refuser l'email
            res.json({
              status: 100,
              message: "Numero deja utiliser!",
            });
          }
        });
      } else {
        //refuser l'email
        res.json({
          status: 100,
          message: "Email deja utiliser!",
        });
      }
    });
  }
);

router.delete("/id/:id/tache/:tache", function (req, res) {
    let query = `delete from taravaille where (ouvrier = ${req.params.id} and tache =  ${req.params.tache}) `;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      //responding
      res.json({
        status: 200,
        message: "Ouvrier supprimer! de la tache",
      });
    });
});


router.delete("/id/:id/chantier/:chantier", function (req, res) {
    //on peut supprimer
    let query = `delete from affecter where (ouvrier = ${req.params.id} and chantier =  ${req.params.chantier}) `;

    db.connection.query(query, function (err, data, fields) {
      if (err) throw err;
      //responding
      res.json({
        status: 200,
        message: "Ouvrier supprimer du chantier",
      });
    });
});
module.exports = router;

// alter table installer
// add constraint fk_type foreign key(equipement) references equipement(idequipement) on delete cascade on update cascade
//
// add constraint fk_chantier_responsable foreign key(responsable) references ouvrier(idOuvrier) on delete cascade on update cascade
//
// add constraint fk_travaille_chantier2 foreign key(ouvrier) references ouvrier(idouvrier) on delete cascade on update set null

// alter table travaille
// add constraint fk_tache foreign key(tache) references tache(idtache) on delete cascade on update cascade,
// add constraint fk_ouvrier foreign key(ouvrier) references ouvrier(idouvrier) on delete cascade on update cascade
