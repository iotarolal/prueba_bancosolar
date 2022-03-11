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
//    pool.end()
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


async function consultausuarios() {
    const client = await pool.connect()
    const res = await client.query(
      "select * from usuarios"
    )
    client.release()
    return res.rows
}

async function eliminausuario (id) {
    const client = await pool.connect()
    // ejemplo de consulta con 2 parámetros
    const res = await client.query(
        "delete from usuarios where id=$1",
        [id]
    )
    client.release();

    eliminausuariodetransferencia(id);
}    

// Emimina trnsferencias del usuario eliminado, como emisor y receptor
async function eliminausuariodetransferencia(id) {
    const client = await pool.connect()
    // ejemplo de consulta con 2 parámetros
    const res = await client.query(
        "delete from transferencia where emisor=$1",
        [id]
    )

    const res1 = await client.query(
        "delete from transferencia where receptor=$1",
        [id]
    )

    client.release()
}    

// nueva transferencia transferencia y actualizacion de saldos emisor y receptor 

async function add_transferencia (name_emisor, name_receptor, monto) {
    const client = await pool.connect()

    // obtengo el id receptor
    const { rows } = await client.query({
            text: `select * from usuarios where nombre= $1`,
        values: [name_receptor]
        });
        
    const id_receptor = parseInt(rows[0].id);
    const b_receptor = parseInt(rows[0].balance);

  //  console.log(b_receptor)

    // obtengo el id emisor
    const datos_emisor = await client.query({
        text: "select * from usuarios where nombre=$1",     // 
        values: [name_emisor]
    });

    const id_emisor = parseInt(datos_emisor.rows[0].id);
    const b_emisor = parseInt(datos_emisor.rows[0].balance);

// Tiene saldo el emisor para cubrir la transferencia 
    if (b_emisor  >= monto) {

// 1.- Agrego Transferencia        
        const res1 = await client.query(
            `INSERT INTO "transferencia" (emisor, receptor, monto)  VALUES ($1, $2, $3)`,
            [id_emisor, id_receptor, monto]
        ) 

// 2.- actualizo balance emisor
        const res2 = await client.query(
            `Update  usuarios set balance= $1 where id=$2`,
            [ b_emisor - parseInt(monto), id_emisor]
        ) 

// 3.- actualizo balance receptor
        const res3 = await client.query(
            `Update usuarios set balance= $1 where id=$2`,
            [ b_receptor + parseInt(monto), id_receptor]
        ) 

// si no tiene saldo para cubrir la transferencia
    } else {
        throw "No tiene saldo para cubrir la transferencia";
    }

    client.release()
    return rows[0] 
}

// Consulta transferencias
async function consultatransferencias() {
    let client
    client = await pool.connect();

    // [ [?, "nombre emisor", "nombre recept1o", monto, fecha] ]

    let res = await client.query({
/*        text: `select transferencias.id, emisor.nombre, receptor.nombre as nombre1, transferencias.monto, transferencias.fecha
                from transferencias join usuarios as emisor on transferencias.emisor = emisor.id 
                join usuarios as receptor on transferencias.receptor = receptor.id`,
        rowMode: "array"
*/

        text: `select transferencia.id, emisor.nombre, receptor.nombre as nombre1, transferencia.monto, transferencia.fecha
                from transferencia join usuarios as emisor on transferencia.emisor = emisor.id 
                join usuarios as receptor on transferencia.receptor = receptor.id`,
        rowMode: "array"
    });


//    console.log(res.rows);
    client.release();
    return res.rows;
};


module.exports = { insertarusuario, editarusuario, consultausuarios, eliminausuario, consultatransferencias, add_transferencia}
