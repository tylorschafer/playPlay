const express = require('express')
const router = express.Router()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)

router.post('/', async (request, response) => {
    const title = request.body.title 
    database('playlists')
     .returning(['id', 'title', 'created_at', 'updated_at'])
     .insert({ title: title })
     .then(result => { response.status(201).json(result)})
     .catch(error => { response.status(400).json({ error }) })
})

module.exports = router 