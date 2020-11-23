const db = require ('../../config/db')

module.exports = {
  allAtividadesRealizadasUtilidades() {
    return db.query(`SELECT * FROM activitiesdones`)
  },
  create(data) {
    const query = `
      INSERT INTO activitiesdones (
        activity_id,
        horimetroexec,
        gaphorimetro,
        idFuncionario,
        nomeFuncionario,
        observation
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const values = [
      data.activity_id,
      data.horimetroexec,
      data.gaphorimetro,
      data.idambev,
      data.namefuncionario,
      data.observation
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`SELECT * FROM activitiesdones WHERE id = $1`, [id])
  }
}