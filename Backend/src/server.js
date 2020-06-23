const express = require('express');
const bcrypt = require('bcrypt');
const clientRoutes = require('./routes/client');
const addressRoutes = require('./routes/address');
const categoryRoutes = require('./routes/category');
const companyRoutes = require('./routes/company');

const app = express();

app.use(express.json());
app.use(clientRoutes);
app.use(addressRoutes);
app.use(categoryRoutes);
app.use(companyRoutes);

// not Found

app.use((request, response, next) => {

    const error = new Error('Not found')
    error.status = 404
    next(error)

});

// pegar todos os erros

app.use((error, request, response, next) => {

    response.status(error.status || 500)

    response.json({ error: error.message })

});


app.listen(3333, () => console.log("Server rodando!"));