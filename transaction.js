const pool = require('./conexion')


const insertTransaccion = async ( emisor, receptor, monto ) => {

    const buscarEmisor = `SELECT id FROM usuarios WHERE nombre = '${emisor}'`
        const res_buscarEmisor = await pool.query(buscarEmisor)

    const buscarReceptor = `SELECT id FROM usuarios WHERE nombre = '${receptor}'`
        const res_buscarReceptor = await pool.query(buscarReceptor)
  
    const registrarTransferenciaQuery = {
      text:
        "INSERT INTO transferencias (emisor, receptor, monto, fecha) values ( $1, $2, $3, NOW())",
      values: [res_buscarEmisor.rows[0].id, res_buscarReceptor.rows[0].id, monto],
    };
  
    const actualizarBalanceEmisor = {
      text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2",
      values: [monto, emisor],
    };
  
    const actualizarBalanceReceptor = {
      text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2",
      values: [monto, receptor],
    };
  
    try {
      await pool.query("BEGIN");
      await pool.query(registrarTransferenciaQuery);
      await pool.query(actualizarBalanceEmisor);
      await pool.query(actualizarBalanceReceptor);
      await pool.query("COMMIT");
      console.log(registrarTransferenciaQuery);
        return {emisor, receptor, monto} 
    } catch (e) {
      console.log(e);
      await pool.query("ROLLBACK");
      throw e;
    }
  };


  const getTransferencias = async () =>{
    const consulta = {
      text: `SELECT t.id, u.nombre AS emisor, us.nombre AS receptor, monto, fecha FROM transferencias AS t 
      INNER JOIN usuarios AS u ON u.id = t.emisor 
      INNER JOIN usuarios AS us ON us.id = t.receptor;`,
      rowMode: 'array'
    }

    const result = await pool.query(consulta)


   return result.rows
  }



module.exports = { insertTransaccion, getTransferencias }