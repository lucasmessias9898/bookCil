const Activity = require('../models/Activity')
const Area = require('../models/Area')
const Machine = require('../models/Machine')

async function post(req, res, next){
  const activityId = req.body.activity_id
  let results = await Activity.find(activityId)
  const activity = results.rows

  results = await Area.allAreas()
  const areas = results.rows

  results = await Machine.allMachines()
  const machines = results.rows

  const keys = Object.keys(req.body)

  for( key of keys) {
    if(req.body[key] == "") {
      return res.render('execucoes/create', {
        accomplish: req.body,
        activity,
        machines,
        areas,
        error: 'Por favor preencha todos os campos.'
      })
    }
  }

  next()
}

module.exports = {
  post
}