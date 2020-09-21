const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("../src/routes")
const methodOverride = require('method-override')
const session = require('./config/session')
const server = express()

server.use(session)
server.use((req, res, next) => {
  res.locals.session = req.session
  //console.log(req.session)
  next()
})

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
  express:server,
  autoescape: false,
  noCache: true
})

server.listen(8000, function() {
  console.log("server")
})