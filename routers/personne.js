

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

//create new personne
router.post("/", function(req, res) {
  let query = "INSERT INTO PERSONNE values (?)"
  let values = [
    req.body.nom,
    req.body.prenom,
    req.body.numero,
    req.body.email
  ];

  db.connection.query(query, [values], function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New Object Personne Added successfully!"
    });
  })
});


module.exports = router;