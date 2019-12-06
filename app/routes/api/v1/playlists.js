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
    .then(result => { response.status(201).json(result) })
    .catch(error => { response.status(400).json({ error }) })
})

router.put('/:id', async (request, response) => {
  const newTitle = request.body.title
  const id = request.params.id

  database('playlists')
    .returning(['id', 'title', 'created_at', 'updated_at'])
    .where('id', id)
    .update({ title: newTitle })
    .then(result => { response.status(200).json(result) })
    .catch(error => { response.status(404).json(error) })
})

module.exports = router
