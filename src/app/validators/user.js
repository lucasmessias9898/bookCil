const User = require('../models/User')
const Area = require('../models/Area')
const { compare } = require('bcryptjs')

async function post(req, res, next) {
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
    error: 'Usuário com ID AMBEV já existe.'
  })

  if(password != passwordRepeat) return res.render('users/create', {
    user: req.body,
    areas,
    error: 'Senhas não confere.'
  })

  next()
}

async function update(req, res, next){
  const keys = Object.keys(req.body)
  let resultsAreas = await Area.allAreas()
  const areas = resultsAreas.rows

  for( key of keys) {
    if(req.body[key] == "") {
      return res.render(`users/edit`, {
        user: req.body,
        areas,
        error: 'Por favor preencha todos os campos.'
      })
    }
  }

  const { id, password } = req.body

  if(!password) return res.render(`users/edit`, {
    user: req.body,
    areas,
    error: "Coloque sua senha para atualizar o cadastro."
  })

  const user = await User.findOne({ where: {id} })

  const passed = await compare(password, user.password)

  if(!passed) return res.render(`users/edit`, {
    user: req.body,
    areas,
    error: "Senha incorreta"
  })

  req.user = user

  next()
}

module.exports = {
  post,
  update
}