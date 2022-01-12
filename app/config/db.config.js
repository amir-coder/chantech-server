
module.exports = {
    HOST  : 'localhost',
    USER : 'devloper',
    PASSWORD : 'dev1234',
    DB : 'bd_test_chantier',
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }

}