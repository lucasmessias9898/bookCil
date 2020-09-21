const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ActivitiesController = require('../app/controllers/ActivitiesController')

//Utilidades
routes.get('/', ActivitiesController.indexUtilidades)
routes.get('/create', ActivitiesController.create)
routes.post('/', multer.array("pdf", 1), ActivitiesController.postActivity)
//routes.get('/utilidades/:id', SupervisorController.show)
routes.get('/:id/edit', ActivitiesController.editActivity)
routes.put('/', multer.array("pdf", 1), ActivitiesController.putActivity)

module.exports = routes