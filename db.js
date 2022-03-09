//import pg from 'pg'
const { Pool } = require('pg')

// creamos nuestro pool de conexiones
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'bancosolar',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

// insertar un nuevo usuario
async function insertarusuario (nombre, balance) {
    const client = await pool.connect()
    
    // Ejemplo de consulta con string parametrizado
    const res = await client.query(
        `insert into usuarios (nombre, balance) values ($1, $2)`,
        [nombre, balance]
    ) 

    client.release()
    pool.end()
}

// Editar un usuario
async function editarusuario (id, nombre, balance) {
    const client = await pool.connect()
    // ejemplo de consulta pasándole como parámetro 1 objeto
    const res = await client.query({
        text: "update usuarios set nombre=$2, balance=$3 where id=$1",
        values: [nombre, balance]
    })

    client.release()
    return res
}


// transferencia 
async function editarusuario (id, nombre, balance) {
    const client = await pool.connect()
    // ejemplo de consulta pasándole como parámetro 1 objeto
    const res = await client.query({
        text: "update transferencias set emisor=$2, receptor=$3, monto=$3  where id=$1",
        values: [nombre, balance]
    })

    client.release()
    return res
}

async function transferencia (nombre, balance) {
    const client = await pool.connect()
    
    // Ejemplo de consulta con string parametrizado
    const res = await client.query(
        `insert into transferencias (emisor, receptor, monto ) values ($1, $2, $3)`,
        [emisor, receptor, monto]
    ) 

    client.release()
    pool.end()
}



// ejemplo de consulta con Pool
async function insertarusuario() {
    /** 
   * Primero solicitamos un cliente al pool, en caso de error,
   * tiramos el error a la consola (con el "catch")
   */
    try {
        const client = await pool.connect()
    } catch (conn_error) {
        console.log(conn_error)
        return
    }
    //const res = await client.query('select * from ropa')
    /**
   * Después realizamos la consulta
   */
    let res;
    try {
        res = await client.query({
        text: 'select * from usuarios',
        rowMode: 'array'
        })
    } catch (pg_error) {
        console.log(pg_error)
        return;
    }
    console.log(res.rows)
    /**
     * Finalmente liberamos el cliente
     */
    client.release()
    pool.end()
}
// consultar()

// Ejemplo de Query con Strings Parametrizados
async function ingresar (nombre, color,  talla) {
    const client = await pool.connect()
    
    // Ejemplo de consulta con string parametrizado
    const res = await client.query(
        `insert into ropa (nombre, color, talla) values ($1, $2, $3)`,
        [nombre, color, talla]
    ) 
    
    // Ejemplo de consulta con string parametrizado y JSON
    const res2 = await client.query({
        text: `insert into ropa (nombre, color, talla) values ($1, $2, $3)`,
        values: [nombre, color, talla]
    })
    // res y res2 son ambas formas válidas de ejecutar una sentencia SQL
    client.release()
    pool.end()
}
//ingresar('Camisa', 'Celeste', 'Skinny')
//consultar()