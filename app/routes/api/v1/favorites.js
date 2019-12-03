const express = require('express')
const musixmatch = require('../../../services/musixmatch')
const router = express.Router()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)

router.post('/', (request, response) => {
  (async () => {
    const req = request.body
    const trackName = req.title
    const artistName = req.artistName

    if (trackName && artistName) {
      const musix = new musixmatch(trackName, artistName)
      const musicData = await musix.getData().then(response => response.json())
      const title = musicData.message.body.track_list[0].track.track_name
      const name = musicData.message.body.track_list[0].track.artist_name
      const rating = musicData.message.body.track_list[0].track.track_rating
      const genre = musicData.message.body.track_list[0].track.primary_genres.music_genre_list[0].music_genre.music_genre_name || 'undefined'

      database('favorites')
        .returning('id')
        .insert({ title: title, artistName: name, rating: rating, genre: genre })
        .then(favorite => {
          database('favorites').where('id', parseInt(favorite)).then(result => { response.status(201).json(result) })
        })
        .catch(error => {
          response.status(400).json({ error })
        })
    } else {
      response.status(400).json({ error: 'Bad request' })
    }
  })()
})

router.get('/:id', (request, response) => {
  (async () => {
    const id = request.params.id
    const favorite = await database('favorites').where('id', parseInt(id)).then(result => result)

    if (favorite) {
      response.status(200).json(favorite)
    } else {
      response.status(404).json('Entry not found')
    }
  })()
})

router.get('/', (request, response) => {
  (async () => {
    const favorites = await database('favorites').then(result => result)
    if (favorites) {
      response.status(200).json(favorites)
    } else {
      response.status(404).json('No favorites in database')
    }
  })()
})

module.exports = router
