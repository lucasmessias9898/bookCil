const Activity = require('../models/Activity')
const Area = require('../models/Area')
const File = require('../models/File')
const { date } = require('../../lib/utils')
const { edit } = require('./UserController')
const Machine = require('../models/Machine')

module.exports = {
  async indexUtilidades(req, res) {

    let results = await Activity.allAtividadesUtilidadesAtiva()
    const activities = results.rows

    results = await Machine.allMachines()
    const machines = results.rows

    if(!activities) return res.send("Nenhuma atividade encontrada!")

    results = await Area.allAreas()
    const areas = results.rows

    results = await Activity.allFiles(2)
    let files = results.rows

    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))
   
    return res.render("utilidades/index", {  activities, areas, files, machines })
  },
  async indexAtividadesUtilidades(req, res) {

    let results = await Activity.allUtilidades()
    const activities = results.rows

    if(!activities) return res.send("Nenhuma atividade encontrada!")

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
   
    return res.render("utilidades/atividades", {  activities, areas, machines })
  },
  async show(req, res) {

    let results = await Activity.find(req.params.id)
    const activity = results.rows[0]

    if(!activity) return res.send("Atividade Não Encontrada!")

    results = await Activity.allFiles(activity.id)
    let files = results.rows

    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    results = await Machine.allMachines()
    const machines = results.rows

    results = await Area.allAreas()
    const areas = results.rows

    return res.render("utilidades/show", { activity, machines, areas, files })
  },
  async create(req, res) {

    let results = await Machine.allMachines()
    const machines = results.rows

    Area.allAreas().then(
      function(results) {
        const areas = results.rows;
        return res.render("utilidades/create", { areas, machines })
      }
    ).catch(function(err) {
      throw new Error(err)
    })
  },
  async postActivity(req, res) {
    const keys = Object.keys(req.body)
    let supervisorId = req.session.userId

    let results = await Machine.find(req.body.machine_id)
    const machine = results.rows[0]

    let horimetroAtual = machine.horimetro
    let horimetroProxima =  horimetroAtual + parseInt(req.body.periodicidade)

    for( key of keys) {
      if(req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }
   
    if(req.files.length == 0) 
      return res.send('Por favor, insira o procedimento em pdf')
    
    results = await Activity.create(req.body, supervisorId, horimetroAtual, horimetroProxima)
    const activityId = results.rows[0].id

    const filesPromise = req.files.map(file => File.create({...file, activity_id: activityId}))
    await Promise.all(filesPromise)

    //return res.render("utilidades/create", { activityId })
    return res.redirect(`utilidades/atividades`)
  },
  async editActivity(req, res) {
    let results = await Activity.find(req.params.id)
    const activity = results.rows[0]

    if(!activity) return res.send("Atividade não encontrada!")

    results = await Area.allAreas()
    const areas = results.rows

    results = await Activity.files(activity.id)
    let files = results.rows

    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))
    
    results = await Machine.allMachines()
    const machines = results.rows

    return res.render("utilidades/edit", { activity, machines, areas, files})
  },
  async putActivity(req, res) {
    const keys = Object.keys(req.body)
    let supervisorId = req.session.userId

    for( key of keys) {
      if(req.body[key] == "" && key != "removed_files") {
        return res.send('Please, fill all fields!')
      }
    }

    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => 
        File.create({...file, activity_id: req.body.id}))

      await Promise.all(newFilesPromise)
    }

    if(req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)
      
      const removeFilesPromise = removedFiles.map(id => File.delete(id))

      await Promise.all(removeFilesPromise)
    }

    req.body.periodicidade = req.body.periodicidade.replace(/\D/g, "")
    await Activity.update(req.body, supervisorId)

    let results = await Activity.allUtilidades()
    const activities = results.rows

    results = await Machine.allMachines()
    const machines = results.rows

    results = await Area.allAreas()
    const areas = results.rows
    
    return res.render("utilidades/atividades", {  activities, areas, machines })
  }
}