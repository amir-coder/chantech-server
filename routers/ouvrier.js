

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object Ouvrier

router.get('/', function(req, res){
let query = "SELECT nom, prenom, numero, email, nomSpecialite\
FROM Personne p, ouvrier o, Specialite s \
where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) )";
db.connection.query(query, function(err, data, fields) {
  if(err) throw err;
  res.json({
    status: 200,
    data,
    message: "Ouvrier list retrieved successfully"
  })
})
});

//getting the time of work by ouvrier

router.get('/:email/travaille', function(req, res){
  let query = 
  `SELECT sum(duree) 
  from tache 
  where (termine = 1)
  and idTache IN (select idTache 
    from travaille where (ouvrier IN (select idPersonne from personne where email = "${req.params.email}")))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully"
    })
  })
  });


//getting the list of object Ouvrier with condition (est libre)
router.get('/libre', function(req, res){
  let query = `SELECT nom, prenom, numero, email, nomSpecialite\
  FROM Personne p, ouvrier o, Specialite s \
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (o.idouvrier not in (select idOUvrier from tache where termine = 0)))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully"
    })
  })
  });


//getting the list of object Ouvrier with condition (est disponible dans un chantier)
router.get('/nomChantier/:nomChantier/', function(req, res){

  let query = `SELECT nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s, affecter aff
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and ( idouvrier in (
  select idouvrier
  from affecter where chantier = (select idchantier from chantier where nomchantier="${req.params.nomchantier}")
  ))
  )`;

  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "ouvrier list retrieved successfully"
    })
  })
  });

  //ajouter un ouvrier a une tache
  router.post('/email/:email/nomtache/:nomtache', (req, res)=> {
    
    query = `insert into travaille(ouvrier, tache) values (

      (select idouvrier from ouvrier o where exists (select * from personne p where (( o.idouvrier = idpersonne) and (p.email = "${req.params.email}"))))
      ,
      (select idtache from tache where (nom= "${req.params.nomtache}"))
      );`;

    db.connection.query(query, function(err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        message: "Ouvrier ajouter a la tache!"
      });
    });
  });


//ajouter un ouvrier a un chantier
router.post('/email/:email/nomChantier/:nomChantier', (req, res)=> {
  query = `insert into affecter(ouvrier, chantier) values (

    (select idouvrier from ouvrier o where exists (select * from personne p where (( o.idouvrier = idpersonne) and (p.email = "${req.params.email}"))))
    ,
    (select idChantier from chantier where (nomchantier= "${req.params.nomChantier}"))
    );`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Ouvrier ajouter au chantier!"
    });
  });
});



//creer un nouveau ouvrier
router.post('/nom/:nom/prenom/:prenom/numero/:numero/email/:email/specialite/:nomSpecialite', (req, res)=> {
  
  //check if ouvrier existe
  query = `select * from personne where email= ${req.params.email}`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (length(data) = 0) {
      //ouvrier doesn't existe in personne so create
      let query = `INSERT INTO PERSONNE(nom, prenom, numero, email) values ("${req.params.nom}", "${req.params.prenom}", ${req.params.numero}, "${req.params.email}")`;
      
      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
      });
    };
    //personne now existes
  });

  //checking if specialite existes
  query = `select * from specialite where nomSpecialite= "${req.params.nomSpecialite}"`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;

    if (length(data) = 0) {
      //create pecialite
      let query = `INSERT INTO specialite(nomSpecialite) values ("${req.params.nomSpecialite}")`;
      
  
      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
      });
    };
    //Specialite now existe now existes
  });

  //creating ouvrier
  query = `insert into ouvrier (idouvrier, idspecialite) values ( 
    (select idPersonne from personne where email="${req.params.email}"), 
    (select idSpecialite from specialite where nomSpecialite = "${req.params.nomSpecialite}")
    );`

    db.connection.query(query, function(err, data, fields) {
      if (err) throw err;
      //responding
      res.json({
        status: 200,
        message: "Ouvrier ajouter!"
      });
      
    });
});





module.exports = router