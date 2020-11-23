const Machine = require('../models/Machine')
const Area = require('../models/Area')
const { date } = require('../../lib/utils')

module.exports = {
  async indexMachines(req, res) {

    let results = await Machine.allMachines()
    const machines = results.rows

    if(!machines) return res.send("Nenhuma máquina encontrada!")

    results = await Area.allAreas()
    const areas = results.rows

    return res.render("maquinas/index", {  machines, areas })
  },
  async showMachines(req, res) {

    let results = await Area.allAreas()
    const areas = results.rows

    results = await Machine.find(req.params.id)
    const machine = results.rows[0]

    if(!machine) return res.send("Máquina Não Encontrada!")

    return res.render("maquinas/show", { machine, areas })
  },
  createMachine(req, res) {

    Area.allAreas().then(
      function(results) {
        const areas = results.rows;
        return res.render("maquinas/create", { areas })
      }
    ).catch(function(err) {
      throw new Error(err)
    })
  },
  async postMachine(req, res) {
    const keys = Object.keys(req.body)

    for( key of keys) {
      if(req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }
   
    const results = await Machine.createMachine(req.body)
    const machineId = results.rows[0].id

    return res.redirect(`maquinas`)
  },
  async editMachine(req, res) {
    let results = await Machine.find(req.params.id)
    const machine = results.rows[0]

    if(!machine) return res.send("Máquina não encontrada!")

    results = await Area.allAreas()
    const areas = results.rows

    return res.render("maquinas/edit", { machine, areas })
  },
  async putMachine(req, res) {
    const keys = Object.keys(req.body)

    for( key of keys) {
      if(req.body[key] == "" && key != "removed_files") {
        return res.send('Please, fill all fields!')
      }
    }

    //req.body.periodicidade = req.body.periodicidade.replace(/\D/g, "")
    await Machine.update(req.body)
    
    return res.redirect(`maquinas/${req.body.id}`)
  }
}