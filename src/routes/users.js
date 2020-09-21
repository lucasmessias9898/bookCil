const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const Validator = require('../app/validators/user')

//Login / Logout 
routes.get('/login', SessionController.loginForm)
//routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

//Users
routes.get('/users', UserController.index)
routes.get('/users/create', UserController.create)
routes.get('/users/:id', UserController.show)
routes.get('/users/:id/edit', UserController.edit)
routes.post('/users', Validator.post, UserController.post)
routes.put('/users', UserController.put)
routes.delete('/users', UserController.delete)

//Reset password / forgot
/*
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionController.forgot)
routes.post('/password-reset', SessionController.reset)*/

module.exports = routes