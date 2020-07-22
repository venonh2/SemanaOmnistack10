const axios = require('axios');
const Dev = require('../models/Dev'); // importando Schema dev
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket')

//index, show
module.exports = {
    async index(req, res) { // listar
        const devs = await Dev.find();

        return res.json(devs);
    },


    async store(req, res) { // criar
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username })



        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            //console.log(apiResponse.data); test de resposta

            const { name = login, avatar_url, bio } = apiResponse.data;

            //console.log(name, avatar_url, bio, github_username, techs)

            const techsArray = parseStringAsArray(techs); // o trim remove espaço antes e depois de uma string

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            // Filtrar as conexões que estão há no maximo 10km de distância
            // e que o novo dev tenha pelo menos umas das techs  filtradas

            const SendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(SendSocketMessageTo, 'new-dev', dev)
        }

        return res.json(dev);
    },

    async update(req, res) {
        const id = req.params.id;

        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findById(id);

        if (dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            //console.log(apiResponse.data); test de resposta

            const { name = login, avatar_url, bio } = apiResponse.data;
            
            const techsArray = parseStringAsArray(techs); // o trim remove espaço antes e depois de uma string

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            /////////////////////////
             await dev.save({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

        }

        if (!dev) {
            return res.status(404).json({ error: 'dev inexistente' });
        }

        return res.json(dev);

    },


    async destroy(req, res) {
        const id = req.params.id;

        let dev = await Dev.findById(id);
        //console.log(dev)

        if (!dev) {
            return res.status(404).json({ error: 'dev inexistente' });
        }

       await Dev.findByIdAndDelete(id);
       return res.status(200).json({ message: 'deletado' })
    }
};