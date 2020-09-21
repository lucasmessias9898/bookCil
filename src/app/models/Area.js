const db = require ('../../config/db')

module.exports = {
  allAreas() {
    return db.query(`SELECT * FROM areas`)
  }
}