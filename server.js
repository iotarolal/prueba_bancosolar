const express = require('express')
const { get_now, insertar, consultar, editar, eliminar, total_reps }= require('./db.js')

const app = express()
app.use(express.static('static'))

    app.get('/fecha', async (req, res) => {
    const now = await get_now()
    res.json(now)
})


// linea 219  - nombre, balance
app.post('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        // primero desempaquetamos la respuesta
        const datos = Object.values(JSON.parse(body));
        // llamamos a la función insertar
        try {
        const algo = await insertarusuario(datos[0], datos[1])  // nombre, balance
        } catch(error) {
        return res.status(400).send(error.message)
        }
        //res.end(JSON.stringify(respuesta));
        // devolvemos "algo"
        res.status(201)
        res.send(algo)
    })
})

// linea 201
// edit usuario - parametro id
// name, balance
app.put('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        // primero desempaquetamos la respuesta
        const datos = Object.values(JSON.parse(body));
        // llamamos a la función editar usuario
        const usuarioeditado = await editarusuario(datos[0], datos[1], datos[2])
        res.send(usuarioeditado)
//        res.send("Recurso editado con éxito")
    })
})

// linea 244 emisor receptor monto
app.post('/transferencia', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        // primero desempaquetamos la respuesta
        const datos = Object.values(JSON.parse(body));
        // llamamos a la función insertar
        try {
        const algo = await transferencia(datos[0], datos[1], datos[2])   // emisor, receptor, monto
        } catch(error) {
        return res.status(400).send(error.message)
        }
        //res.end(JSON.stringify(respuesta));
        // devolvemos "algo"
        res.status(201)
        res.send(algo)
    })
})

// linea 261 nombre balance
app.get('/usuarios', async (req, res) => {
    const ejercicios = await consultar()
    res.send(JSON.stringify(ejercicios))
})


// linea 289 eliminaUsuario
app.delete('/usuario', async (req, res) => {
    await eliminar(req.query.nombre)
    res.send('Eliminado')
})

// linea 296 - gettransferencias
app.get('/transferencias', async (req, res) => {
    const total = await total_reps()
    res.send(`Hay en total ${total} repeticiones`)
});


app.listen(3000, () => console.log('Servidor en puerto 3000'))