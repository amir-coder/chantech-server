

const express = require("express");
router = express.Router();


//importing database
const db = require('../app/models');


//getting the list of object EQUIPEMENT
//tested and works
router.get('/', function(req, res){
let query = "SELECT * FROM EQUIPEMENT";
db.connection.query(query, function(err, data, fields) {
  if(err) throw err;
  res.json({
    status: 200,
    data,
    message: "Object EQUIPEMENT list retrieved successfully"
  })
})
});

//getting the list of object EQUIPEMENT
//tested and works
router.get('/disponible', function(req, res){
  let query = "SELECT * FROM EQUIPEMENT where nb_echantillon > 0";
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object EQUIPEMENT list retrieved successfully"
    })
  })
  });

  //getting the list of object EQUIPEMENT
//tested and works
router.get('/occupe', function(req, res){
  let query = "SELECT * FROM EQUIPEMENT where nb_echantillon = 0";
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object EQUIPEMENT list retrieved successfully"
    })
  })
  });
//  tested and works
router.get('/numEquipement/:numEquipement', function(req, res){
  let query = `SELECT * FROM EQUIPEMENT where numEquipement = "${req.params.numEquipement}"`;
  db.connection.query(query, function(err, data, fields) {
    if(err) throw err;
    res.json({
      status: 200,
      data,
      message: "Object EQUIPEMENT list retrieved successfully"
    })
  })
  });

//create new equipement
//tested and works
router.post("/numEquipement/:numEquipement/libele/:libele/prix/:prix/nbArticle/:nbArticle", function(req, res) {


let query = `insert into equipement (numEquipement, libele, prix, nb_echantillon) values (${req.params.numEquipement} ,"${req.params.libele}", ${req.params.prix}, ${req.params.nbArticle});# 1 ligne affectée.`;

db.connection.query(query, function(err, data, fields) {
  if (err) throw err;
  res.json({
    status: 200,
    message: "New Object Equipement Added successfully!"
  });
})
});

//updating number of articles
//tested and works
router.put("/numEquipement/:numEquipement/nbArticle/:nbArticle", function(req, res) {
  searchquery = `select nb_echantillon from equipement where numEquipement = ${req.params.numEquipement}`;
  //getting the number of echantillion in equipement
  db.connection.query(searchquery, function(err, data, fields){
    if(data.length ===0){
      //the is not equipement with the coressponding number
      if (err) throw err;
      res.json({
        status: 100,
        message: `No equipement with numero= ${req.params.numEquipement}`
      });
    }else{
      //equipement existe
      let update = req.params.ndArticle;
      let old = data[0].nb_echantillon;
      if (update > old) {
        //update safely
        updatequery = `update Equipement set nb_echantillon = ${req.params.nbArticle} where (numEquipement = ${req.params.numEquipement})`;
        db.connection.query(updatequery, function(err, data, fields) {
          if (err) throw err;
          res.json({
            status: 200,
            message: "Object equipement updated successfully!"
          });
        });
      }else{
        //verify if the update is possible
        //update safely
        updatequery = `update Equipement set nb_echantillon = ${req.params.nbArticle} where (numEquipement = ${req.params.numEquipement})`;
        db.connection.query(updatequery, function(err, data, fields) {
          if (err) throw err;
          res.json({
            status: 200,
            message: "Object equipement updated successfully!"
          });
        });
      }
    }
  });
  console.log(`numEquipement: ${req.params.numEquipement}, nbArticle:  ${req.params.nbArticle}`);
});


//installing equipement in chantier
router.post("/numEquipement/:numEquipement/chantier/:chantier/nbArticle/:nbArticle", function(req, res){
  //recuperer le nombre d'article dans le stock
  let stock = 0;
  let stockquery =`select sum(nb_echantillon) as 'stock'  from equipement where numEquipement = ${req.params.numEquipement}`;
  db.connection.query(stockquery, function(err, data, fields) {
    if (err) throw err;
    stock = data[0].stock;
    if (stock){
      //stock existe
      //get the number of articles installed in the chantier
      let getquery = `select sum(nombreArticle) as 'nombreInstallerChantier' from installer where ((equipement IN (select idEquipement from equipement where numEquipement = ${req.params.numEquipement})) and (chantier = ${req.params.chantier}))`;
      db.connection.query(getquery, function(err, data2, fields){
        if(err) throw err;
        if(!(data2[0].nombreInstallerChantier == null)){
          //equipement deja installer
          let equipementDansChantier = data2[0].nombreInstallerChantier;
          stock = stock + equipementDansChantier; 
          //get the new articles number to add
          let newNumber = parseInt(req.params.nbArticle);
          //test if adding is possible
          if(newNumber <= stock) {
            //adding possible
            let addQueryy = `update installer set nombreArticle = ${newNumber} where ((equipement IN (select idEquipement from equipement where numEquipement = ${req.params.numEquipement})) and (chantier = ${req.params.chantier}))`;
            db.connection.query(addQueryy, function(err, data2, fields){
              if(err) throw err;
              //updating stock
              stock = stock - newNumber;
              updatequery = `update Equipement set nb_echantillon = ${stock} where (numEquipement = ${req.params.numEquipement})`;
              db.connection.query(updatequery, function(err, data2, fields){
                if(err) throw err;
                //responding
                res.json({
                  status: 200,
                  message: "Equipement installed successfully!"
                });
              });
            });
          }else{
            //adding not possible
            //stock doesn't existe
            
            console.log(`condition true stock = ${stock}, data2[0].nombreInstallerChantier = ${data2[0].nombreInstallerChantier}`);
            res.json({
              status: 100,
              message: "Stock is not enaugh for to installe this number of articles"
            });
          }
        }else{
          //equipement n'est pas installer deja
          //get the new articles number to add
          let newNumber = parseInt(req.params.nbArticle);
          //test if adding is possible
            console.log(` before comparision check: stock = ${stock}, newNumber = ${newNumber}`);
          if(newNumber <= stock) {
            //adding possible
            let addQueryy = `insert into installer(chantier, equipement, nombreArticle) values (
              ${req.params.chantier},\
              (select idEquipement from equipement where numEquipement = ${req.params.numEquipement}),\
              ${newNumber}\
            );`;
            db.connection.query(addQueryy, function(err, data2, fields){
              if(err) throw err;
              //updating stock
              stock = stock - newNumber;
              updatequery = `update Equipement set nb_echantillon = ${stock} where (numEquipement = ${req.params.numEquipement})`;
              db.connection.query(updatequery, function(err, data2, fields){
                if(err) throw err;
                //responding
                res.json({
                  status: 200,
                  message: "Equipement installed successfully!"
                });
              });
            });
          }else{
            //adding not possible
            //stock doesn't existe
            console.log(`condition false stock = ${stock}, data2[0].nombreInstallerChantier = ${data2[0].nombreInstallerChantier}`);
            res.json({
              status: 100,
              message: "Stock is not enaugh for to installe this number of articles"
            });
          }
        }
      });
    }else{
      //stock doesn't existe
      res.json({
        status: 100,
        message: "Cet equipement n'existe pas dans le stock"
      });
    }
  });
});



          // //recuperer le nombre d'equipement installer dans les autre chantier
          // let installedother = `select sum(nombrebArticle) as 'nombreInstalledOther' from installed where ((equipement =${req.params.numEquipement}) and not (chantier = ${req.params.chantier}))`;
          // //get the new articles number to add
          // let newNumber = req.params.nbArticle
          // db.connection.query(installedother, function(err, data2, fields){
          //   if(data[0].nombreInstalledOther){
          //     //equipement installed in other chantier

          //   }else{
          //     //equipement is not in other chantier
          //     if ()
          //   }
          // });

//delete chantier
router.delete("/id/:id", function(req, res) {

  let query = 
  `delete from equipement where (idequipement = ${req.params.id})`;


  db.connection.query(query, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "equipement est maintenant supprimer!"
    });
  })
});

module.exports = router;