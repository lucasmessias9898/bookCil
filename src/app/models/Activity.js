const db = require ('../../config/db')

module.exports = {
  allUtilidades() {
    return db.query(`SELECT * FROM activities WHERE area_id = $1`, [1])
  },
  create(data) {
    const query = `
      INSERT INTO activities (
        area_id,
        equipamento,
        tag,
        description,
        periodicidade,
        supervisor_id,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.area_id,
      data.equipamento,
      data.tag,
      data.description,
      data.periodicidade,
      data.supervisor_id,
      data.status || 1
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`SELECT * FROM activities WHERE id = $1`, [id])
  },
  update(data) {
    const query = `
      UPDATE activities SET
        area_id=($1),
        equipamento=($2),
        tag=($3),
        description=($4),
        periodicidade=($5),
        supervisor_id=($6),
        status=($7)
      WHERE id = $8
    `
    const values = [
      data.area_id,
      data.equipamento,
      data.tag,
      data.description,
      data.periodicidade,
      data.supervisor_id,
      data.status,
      data.id
    ]

    return db.query(query, values)    
  },
  files(id) {
    return db.query(`
      SELECT * FROM files WHERE activity_id = $1
    `, [id])
  },
  allFiles(id) {
    return db.query(`
    SELECT * FROM files WHERE activity_id in ($1)
  `, [id])
  }
}