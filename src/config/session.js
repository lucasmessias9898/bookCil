const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session({
  store: new pgSession({
    pool: db
  }),
  secret: 'secretamente',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 10000
  }
})