const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')
const cors = require('cors');
const http = require('http');

const { setupWebsocket } = require('./websocket')

const app = express();

const server = http.Server(app);

mongoose.connect('mongodb+srv://venonh2:adeacerta@cluster0-rzslr.mongodb.net/week10?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
)
// definindo o que o express vai usar
//app.use(cors({ origin: 'http://localhost:3000'})) aqui a string mesta dizendo esse end pode acessar o back
app.use(cors()) // aqui diz qualquer endereo pode acessar
app.use(express.json());
app.use(routes);

server.listen(3333);
