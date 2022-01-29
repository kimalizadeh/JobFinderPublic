const config = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: "heroku_f68aee06d98e17a",
    host: "us-cdbr-east-05.cleardb.net",
    dialect: "mysql"
  },  
  test: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: "jobfinder",
    host: "localhost",
    dialect: "mysql"
  },  
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: "heroku_f68aee06d98e17a",
    host: "us-cdbr-east-05.cleardb.net",
    dialect: "mysql"
  }
}

module.exports = config;


