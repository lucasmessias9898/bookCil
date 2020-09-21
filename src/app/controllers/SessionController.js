const User = require('../models/User')
const Area = require('../models/Area')
const { date } = require('../../lib/utils')
const { compare } = require('bcryptjs')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  async login(req, res) {
    const keys = Object.keys(req.body)

    for( key of keys) {
      if(req.body[key] == "") {
        return res.render('session/login', {
          user: req.body,
          error: 'Por favor preencha todos os campos.'
        })
      }
    }
   
    const { idambev, password } = req.body
    const user = await User.findOne({ where: {idambev}})

    if(!user) return res.render('session/login', {
      user: req.body,
      error: 'Usuário não cadastrado'
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('session/login', {
      user: req.body,
      error: 'ID Ambev ou senha incorreta'
    })

    req.session.userId = user.id
    req.session.nivel = user.nivel

    return res.redirect("/users")

  },
  logout(req, res) {
    req.session.destroy()

    return res.redirect("/")
  }
}