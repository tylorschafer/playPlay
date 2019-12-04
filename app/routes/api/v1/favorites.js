const express = require('express')
const musixmatch = require('../../../services/musixmatch')
const router = express.Router()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)
const Formatter = require('../../../formatters/musixFormatter')

router.post('/', (request, response) => {
  (async () => {
    const trackName = request.body.title
    const artistName = request.body.artistName

    if (trackName && artistName) {
      const musix = new musixmatch(trackName, artistName)
      const musicData = await musix.getData().then(response => response.json())
      const musixFormatter = new Formatter(musicData)
      const formatData = musixFormatter.returnData()

      database('favorites')
        .returning(['id', 'title', 'artistName', 'rating', 'genre'])
        .insert(formatData)
        .then(result => { response.status(201).json(result) })
        .catch(error => { response.status(400).json({ error }) })
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
