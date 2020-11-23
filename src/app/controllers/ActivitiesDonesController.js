const Activity = require('../models/Activity')
const Area = require('../models/Area')
const ActivityDone = require('../models/ActivityDone')
const { date } = require('../../lib/utils')
const { edit } = require('./UserController')
const Machine = require('../models/Machine')

module.exports = {
  async indexAtividadesRealizadasUtilidades(req, res) {

    let results = await ActivityDone.allAtividadesRealizadasUtilidades()
    const activitiesDones = results.rows

    if(!activitiesDones) return res.send("Nenhuma atividade encontrada!")

    results = await Area.allAreas()
    const areas = results.rows

    results = await Machine.allMachines()
    const machines = results.rows

    results = await Activity.allUtilidades()
    const activities = results.rows
   
    return res.render("execucoes/index", {  activitiesDones, areas, machines, activities })
  },
  async show(req, res) {
    let results = await ActivityDone.find(req.params.id)
    const activitiesDones = results.rows[0]
    activitiesDones.created_at = date(activitiesDones.created_at).formatDateHour

    results = await Activity.find(activitiesDones.activity_id)
    const activity = results.rows[0]

    if(!activitiesDones) return res.render("execucoes/show", {
      error: 'Atividade Não Encontrada!'
    })

    results = await Machine.allMachines()
    const machines = results.rows

    results = await Area.allAreas()
    const areas = results.rows

    return res.render("execucoes/show", { activity, activitiesDones, machines, areas })
  },
  async create(req, res) {

    let results = await Activity.find(req.params.id)
    const activity = results.rows

    results = await Area.allAreas()
    const areas = results.rows

    results = await Machine.allMachines()
    const machines = results.rows

    return res.render("execucoes/create", { activity, areas, machines })
  },
  async postActivityDone(req, res) {
    
    let results = await ActivityDone.create(req.body)
    const activitydoneId = results.rows[0].id
    
    results = await Activity.allUtilidades()
    const activities = results.rows

    results = await Machine.allMachines()
    const machines = results.rows

    results = await Area.allAreas()
    const areas = results.rows

    results = await Activity.allFiles(2)
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    //return res.render("utilidades/create", { activityId })
    return res.render("utilidades/index", {
      activities,
      areas,
      machines,
      files,
      success: "Atividade executada com sucesso!"
    })
  }
}