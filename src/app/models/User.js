const db = require('../../config/db')
const { date } = require('../../lib/utils')
const { hash } = require('bcryptjs')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM users ORDER BY name ASC`, function(err, results){
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  async create(data) {
    try{

      const query = `
      INSERT INTO users (
        idambev,
        name,
        nivel,
        area_id,
        position_id,
        password,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `
    
      const passwordHash = await hash(data.password, 8)
      //data.position_id,
      const values = [
        data.idambev,
        data.name,
        data.nivel,
        data.area_id,
        1,
        passwordHash,
        data.status || 1
      ]

      const results = db.query(query, values)
      return results

    }catch(err) {
      console.error(err)
    }
  },
  find(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id])
  },
  async findOne(filters) {
    let query = "SELECT * FROM users"

    Object.keys(filters).map(key => {
      query = `${query}
        ${key}
      `
      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)
    return results.rows[0]
  },
  async update(id, fields) {

    const query = `
      UPDATE users SET
        idambev=($1),
        name=($2),
        nivel=($3),
        area_id=($4),
        position_id=($5),
        status=($6)
      WHERE id = $7
    `

    const values = [
      fields.idambev,
      fields.name,
      fields.nivel,
      fields.area_id,
      1,
      fields.status || 1,
      id
    ]
  
    return db.query(query, values)
    
  },
  delete(id) {
    return db.query(`DELETE FROM users WHERE id = $1`, [id])
  }
}