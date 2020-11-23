const db = require ('../../config/db')

module.exports = {
  allMachines() {
    return db.query(`SELECT * FROM machines ORDER BY id ASC`)
  },
  createMachine(data) {
    const query = `
      INSERT INTO machines (
        name,
        tag,
        area_id,
        horimetro
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `
    const values = [
      data.nomemaquina,
      data.tag,
      data.area_id,
      data.horimetro
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`SELECT * FROM machines WHERE id = $1`, [id])
  },
  update(data) {
    const query = `
      UPDATE machines SET
        name=($1),
        tag=($2)
        area_id=($3),
        horimetro=($4)
      WHERE id = $5
    `
    const values = [
      data.nomemaquina,
      data.tag,
      data.area_id,
      data.horimetro,
      data.id
    ]

    return db.query(query, values)    
  }
}