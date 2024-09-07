const path = require('path');

const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./db/config') 
const cors = require('cors');

//Crear el servidor de express
const app = express();

//Database
dbConnection();

// CIRS

app.use( cors());

//directorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );


// Rutas
 
//Todo lo que este archivo va a exportar lo va a habilitar
//en esta ruta
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// TODO CRUD: Eventos
 
//Directorio publico
app.use('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
 
 
//Escuchar peticiones
app.listen( process.env.PORT , ()=> {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );


