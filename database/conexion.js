const mongoose = require('mongoose');

mongoose.connect(process.env.DB)
    .then(() => console.log('db conectada 😍😍'))
    .catch((e) => console.log('fallo la conexion 😭😭 ' + e))