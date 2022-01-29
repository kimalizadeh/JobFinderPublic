const config = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.HOST,
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
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "mysql"
  }
}

module.exports = config;


