const User = require('../models/User')

async function post(req, res, next) {
  const keys = Object.keys(req.body)

  for( key of keys) {
    if(req.body[key] == "") {
      return res.send('Please, fill all fields!')
    }
  }

  const { idambev, password, passwordRepeat } = req.body
  const user = await User.findOne({ where: {idambev}})

  if(user) return res.send("Usuário já existe")

  if(password != passwordRepeat) return res.send("Senhas não confere")

  next()
}

module.exports = {
  post
}