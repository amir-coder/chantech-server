

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object Ouvrier
//tested and works
router.get('/', function(req, res){
let query = `SELECT idPersonne, nom, prenom, numero, email, nomSpecialite
FROM Personne p, ouvrier o, Specialite s 
where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) )`;
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
//tested and works
///ouvrier/email/ddd@email.com/travaille   sum(duree) 
router.get('/email/:email/travaille', function(req, res){

  let query = `SELECT sum(duree) 
  from tache 
  where (termine = 1)
  and idTache IN (select idTache 
    from travaille where (ouvrier IN (select idPersonne from personne where (email = "${req.params.email}"))))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Ouvrier list retrieved successfully"
    })
  })
  });

  //chercher ouvrier
router.get("/email/:email", function(req, res) {
  
  //check if ouvrier existe
  query = `select * from ouvrier where (idouvrier in (select idPersonne from personne where email= "${req.params.email}"))`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      //send message that user does not existe
      res.json({
        status: 120,
        message: "ouvrier n'existe pas!"
      });
    }else{
      //send resonse
      res.json({
        status: 200,
        data: data,
        message: "ouvrier existe!"
      });
    }
  });
});


//getting the list of object Ouvrier with condition (est libre)
//tested 
router.get('/libre', function(req, res){
  let query = `SELECT idPersonne,nom, prenom, numero, email, nomspecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (not exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "user list retrieved successfully"
    })
  })
  });

  //getting the list of object Ouvrier with condition (est occupe)
  //tested and works
router.get('/occupe', function(req, res){
  let query = `SELECT idPersonne, nom, prenom, numero, email, nomspecialite
  FROM Personne p, ouvrier o, Specialite s
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and (exists (select * from travaille t where ((t.Ouvrier = o.idouvrier) and (t.tache in (select idTache from tache where termine = 0))))))`;
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
//tested
router.get('/nomChantier/:nomChantier/', function(req, res){

  let query = `SELECT distinct idPersonne, nom, prenom, numero, email, nomSpecialite
  FROM Personne p, ouvrier o, Specialite s, affecter aff
  where ((p.idPersonne = o.idouvrier) and (o.idspecialite = s.idSpecialite) and ( o.idouvrier in (
  select ouvrier
  from affecter where chantier in (select idchantier from chantier where nomchantier="chantier les frere")
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
  //tested and works
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
//tested
router.post('/email/:email/nomChantier/:nomChantier', (req, res)=> {
  query = `insert into affecter(ouvrier, chantier) values (

    (select idouvrier from ouvrier o where (idOUvrier in (select idpersonne from personne p where (p.email = "${req.params.email}"))))
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
//tested and works
router.post('/nom/:nom/prenom/:prenom/numero/:numero/email/:email/specialite/:nomSpecialite', (req, res)=> {
  
  //check if ouvrier existe
  query = `select * from personne where email= "${req.params.email}"`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    if (data.length === 0) {
      console.log("Creating user");
      //ouvrier doesn't existe in personne so create
      let query = `INSERT INTO PERSONNE(nom, prenom, numero, email) values ("${req.params.nom}", "${req.params.prenom}", ${req.params.numero}, "${req.params.email}")`;
      
      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
      });
    };
    
  //personne now existes

  //checking if specialite existes
  query = `select * from specialite where nomSpecialite= "${req.params.nomSpecialite}"`;

  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;

    if (data.length === 0) {
      //create pecialite
      let query = `INSERT INTO specialite(nomSpecialite) values ("${req.params.nomSpecialite}")`;
      
  
      db.connection.query(query, function(err, data, fields) {
        if (err) throw err;
      });
    };
    //Specialite now existe now existes

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

  });
});





module.exports = router