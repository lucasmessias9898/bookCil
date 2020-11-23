const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ActivitiesController = require('../app/controllers/ActivitiesController')
const ActivitiesDonesController = require('../app/controllers/ActivitiesDonesController')
const MachinesController = require('../app/controllers/MachinesController')
const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const ValidatorUser = require('../app/validators/user');
const ValidatorActivitieDone = require('../app/validators/activitieDone');

const { onlyUsers } = require('../app/middlewares/session')

//Home
routes.get('/home', function(req, res) {
  return res.render("home/index")
})

routes.get('/', function(req, res) {
  return res.redirect("/home")
})

routes.get('/users/login', function(req, res) {
  return res.redirect("/session/login")
})

//Login / Logout 
routes.get('/session/login', SessionController.loginForm)
routes.post('/session/login', SessionController.login)
routes.post('/users/logout', SessionController.logout)


//Utilidades
routes.get('/utilidades', ActivitiesController.indexUtilidades)
routes.get('/utilidades/atividades', onlyUsers, ActivitiesController.indexAtividadesUtilidades)
routes.get('/utilidades/create', onlyUsers, ActivitiesController.create)
routes.post('/utilidades', multer.array("pdf", 1), ActivitiesController.postActivity)
routes.get('/utilidades/:id', onlyUsers, ActivitiesController.show)
routes.get('/utilidades/:id/edit', onlyUsers, ActivitiesController.editActivity)
routes.put('/utilidades', multer.array("pdf", 1), ActivitiesController.putActivity)

//Atividades realizadas
routes.get('/execucoes', onlyUsers, ActivitiesDonesController.indexAtividadesRealizadasUtilidades)
routes.get('/execucoes/:id', onlyUsers, ActivitiesDonesController.show)
routes.get('/execucoes/:id/create', ActivitiesDonesController.create)
routes.post('/execucoes', ValidatorActivitieDone.post, ActivitiesDonesController.postActivityDone)

//Machines
routes.get('/maquinas', onlyUsers, MachinesController.indexMachines)
routes.get('/maquinas/create', onlyUsers, MachinesController.createMachine)
routes.get('/maquinas/:id', onlyUsers, MachinesController.showMachines)
routes.get('/maquinas/:id/edit', onlyUsers, MachinesController.editMachine)
routes.post('/maquinas', onlyUsers, MachinesController.postMachine)
routes.put('/maquinas', onlyUsers, MachinesController.putMachine)
// routes.delete('/machines', onlyUsers, MachinesController.deleteMachines);

//Users
routes.get('/users', onlyUsers, UserController.index)
routes.get('/users/create', onlyUsers, UserController.create)
routes.get('/users/:id', onlyUsers, UserController.show)
routes.get('/users/:id/edit', onlyUsers, UserController.edit)
routes.post('/users', ValidatorUser.post, UserController.post)
routes.put('/users', ValidatorUser.update, UserController.update)
routes.delete('/users', UserController.delete)

//Reset password / forgot
/*
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionController.forgot)
routes.post('/password-reset', SessionController.reset)
*/

module.exports = routes