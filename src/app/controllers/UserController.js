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
    const keys = Object.keys(req.body)
    let resultsAreas = await Area.allAreas()
    const areas = resultsAreas.rows

    for( key of keys) {
      if(req.body[key] == "") {
        return res.render('users/create', {
          user: req.body,
          areas,
          error: 'Por favor preencha todos os campos.'
        })
      }
    }
   
    const { idambev, password, passwordRepeat } = req.body
    const user = await User.findOne({ where: {idambev}})

    if(user) return res.render('users/create', {
      user: req.body,
      areas,
      error: 'Usuário já existe.'
    })

    if(password != passwordRepeat) return res.render('users/create', {
      user: req.body,
      areas,
      error: 'Senhas não confere.'
    })

    let results = await User.create(req.body)
    const userId = results.rows[0].id

    req.session.userId = userId

    return res.redirect(`/users/${userId}`, {
      success: "Usuário cadastrado com sucesso!"
    })
  },
  async show(req, res) {
    let results = await User.find(req.params.id)
    const user = results.rows[0]
    if(!user) return res.send("Usuário não encontrado!")

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
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)

      for( key of keys) {
        if(req.body[key] == "") {
          return res.send('Please, fill all fields!')
        }
      }

      const { id, password } = req.body

      if(!password) return res.render("user/index", {
        user: req.body,
        error: "Coloque sua senha para atualizar o cadastro."
      })

      const user = await User.findOne({ where: {id} })

      const passed = await compare(password, user.password)

      if(!passed) return res.render("user/index", {
        user: req.body,
        error: "Senha incorreta"
      })

      await User.update(req.body)

      return res.redirect(`users/${req.body.id}`, {
        success: "Usuário atualizado com sucesso!"
      })
    } catch (error) {
      console.log(err)
      return res.render("user/index", {
        error: "Algum erro aconteceu!"
      })
    }
  },
  async delete(req, res) {
    await User.delete(req.body.id)

    return res.redirect(`users`)
  }
}