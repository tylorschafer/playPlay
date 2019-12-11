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
    .returning('*')
    .where('id', id)
    .update({ title: newTitle })
    .then(result => { response.status(200).json(result) })
    .catch(error => { response.status(404).json(error) })
})

router.get('/', async (request, response) => {
  const playlists = await database('playlists').then(result => result)
  if (playlists) {
    response.status(200).json(playlists)
  } else {
    response.status(404).json('No playlists in database')
  }
})

router.delete('/:id', async (request, response) => {
  const id = request.params.id
  const delPlaylist = await database('playlists').where('id', parseInt(id)).del()
  if (delPlaylist) {
    response.status(204).json('Playlist successfully removed')
  } else {
    response.status(404).json('Entry not found')
  }
})

router.post('/:playlistId/favorites/:favoriteId', async (request, response) => {
  const fav = await database('favorites')
    .returning('*')
    .where('id', request.params.favoriteId)
    .then(result => result[0])
  const play = await database('playlists')
    .returning('*')
    .where('id', request.params.playlistId)
    .then(result => result[0])

  database('playlist_favorites')
    .insert({ playlist_id: play.id, favorite_id: fav.id })
    .then(result => response.status(201).json({ success: `${fav.title} has been added to ${play.title}!` }))
    .catch(error => { response.status(400).json({ error }) })
})

module.exports = router
