function onlyUsers(req, res, next) {
  if(!req.session.userId) 
    return res.redirect('/session/login')
  
  next()
}

module.exports =  {
  onlyUsers
}