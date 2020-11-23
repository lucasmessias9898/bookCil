const db = require ('../../config/db')

module.exports = {
  allUtilidades() {
    return db.query(`SELECT * FROM activities WHERE area_id = $1`, [1])
  },
  allAtividadesUtilidadesAtiva(){
    return db.query(`SELECT * FROM activities WHERE area_id = $1 and status = $2`, [1, 1])
  },
  create(data, supervisorId, horimetroAtual, horimetroProxima) {
    const query = `
      INSERT INTO activities (
        area_id,
        machine_id,
        description,
        periodicidade,
        horimetro_ultima,
        horimetro_proxima,
        supervisor_id,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `
    const values = [
      data.area_id,
      data.machine_id,
      data.description,
      data.periodicidade,
      horimetroAtual,
      horimetroProxima,
      supervisorId,
      data.status || 1
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`SELECT * FROM activities WHERE id = $1`, [id])
  },
  update(data, supervisorId) {
    const query = `
      UPDATE activities SET
        area_id=($1),
        machine_id=($2),
        description=($3),
        periodicidade=($4),
        supervisor_id=($5),
        status=($6)
      WHERE id = $7
    `
    const values = [
      data.area_id,
      data.machine_id,
      data.description,
      data.periodicidade,
      supervisorId,
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