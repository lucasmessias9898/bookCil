const User = require('../models/User')
const Area = require('../models/Area')
const { date } = require('../../lib/utils')
const { compare } = require('bcryptjs')

module.exports = {
  async index(req, res) {
    
    results = await Area.allAreas()
    const areas = results.rows

    User.all(function(users) {
      return res.render("users/index", { users, areas })
    })
  },
  create(req, res) {
    Area.allAreas().then(
      function(results) {
        const areas = results.rows;
        return res.render("users/create", { areas })
      }
    ).catch(function(err) {
      throw new Error(err)
    })
  },
  async post(req, res) {

    let results = await User.create(req.body)
    const userId = results.rows[0].id

    req.session.userId = userId

    results = await Area.allAreas()
    const areas = results.rows

    User.all(function(users) { 
      return res.render(`users/index`, {
        users,
        areas,
        success: "Usuário cadastrado com sucesso!"
      })
    })
  },
  async show(req, res) {
    let results = await User.find(req.params.id)
    const user = results.rows[0]
    user.created_at = date(user.created_at).format
    
    if(!user) return res.render("users/show", {
      error: 'Usuário não encontrado'
    })

    let resultsAreas = await Area.allAreas()
    const areas = resultsAreas.rows

    return res.render("users/show", { user, areas })
  },
  async edit(req, res) {
    let results = await User.find(req.params.id)
    const user = results.rows[0]

    if(!user) return res.send("Usuário não encontrado")

    results = await Area.allAreas()
    const areas = results.rows

    return res.render("users/edit", { user, areas })
    
  },
  async update(req, res) {
    try {
      const { user } = req
      let { idambev, name, nivel, area_id } = req.body
      
      await User.update(user.id, {
        idambev, name, nivel, area_id
      })

      results = await Area.allAreas()
      const areas = results.rows

      User.all(function(users) {
        return res.render("users/index", {
          users, 
          areas,
          success: "Conta atualizado com sucesso!"
        })
      })
    } catch (error) {
      return res.render("users/show", {
        error: "Algum erro aconteceu!"
      })
    }
  },
  async delete(req, res) {
    await User.delete(req.body.id)

    return res.redirect(`users`)
  }
}