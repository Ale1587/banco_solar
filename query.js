const pool = require('./conexion')

// insert

const insert = async (data) =>{

    const queryInsert = {
        text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)",
        values: data,
    };

    try {
        const result = await pool.query(queryInsert)
        return result;
    } catch (err) {
        console.log(err.code);
        return err;
    }
}

// queryBbdd

const queryBbdd = async () =>{
    try {
        const result = await pool.query("SELECT * FROM usuarios")
        return result.rows
    } catch (err) {
        console.log(err.code);
        return err;
    }
}

// update

const updateUser = async (data, id ) =>{
    const queryNewUser = {
        text: `UPDATE usuarios SET
        nombre = $1,
        balance = $2
        WHERE id = ${id}`,
        values: data,
    };

    try {
        const result = await pool.query(queryNewUser);
        return result;
    } catch (err) {
        console.log(err.code);
        return err;
    }
}

// delete

const deleteUser = async (id) =>{
    try {
        const result = await pool.query (` DELETE FROM usuarios WHERE id = ${id}`)
        return result;
    } catch (err) {
        console.log(err.code);
        return err;
    }
}




module.exports = { insert, queryBbdd, updateUser, deleteUser }