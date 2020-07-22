const {Router} = require('express');
const axios = require('axios');
const Dev = require('./models/Dev'); // importando Schema dev
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router();

routes.post('/devs', DevController.store); // o .store é o metodo que esta sendo utilizado
routes.get('/devs', DevController.index);
routes.put('/devs/:id', DevController.update);
routes.delete('/devs/:id', DevController.destroy);


routes.get('/search', SearchController.index);

module.exports = routes;