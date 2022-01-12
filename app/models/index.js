//init sequelizer

const  dbConfig = require("../config/db.config.js");
const mysql = require('mysql2');

const db = {};

db.connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

// db.personne = require('./personne.model')(sequelize, Sequelize);
// db.chantier = require('./chantier.model')(sequelize, Sequelize);
// db.equipement = require('./equipement.model')(sequelize, Sequelize);
// db.fermer = require('./fermer.model')(sequelize, Sequelize);
// db.installer = require('./installer.model')(sequelize, Sequelize);
// db.ouvrier = require('./ouvrier.model')(sequelize, Sequelize);
// db.specialite = require('./specialite.model')(sequelize, Sequelize);
// db.tache = require('./tache.model')(sequelize, Sequelize);
// db.terminer = require('./terminer.model')(sequelize, Sequelize);
// db.travaille = require('./travaille.model')(sequelize, Sequelize);


module.exports = db;