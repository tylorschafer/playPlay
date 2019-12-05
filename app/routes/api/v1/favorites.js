const express = require('express')
const musixmatch = require('../../../services/musixmatch')
const router = express.Router()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)
const Favorite = require('../../../models/favorite')

router.post('/', (request, response) => {
  (async () => {
    const trackName = request.body.title
    const artistName = request.body.artistName

    if (trackName && artistName) {
      const musix = new musixmatch(trackName, artistName)
      const musicData = await musix.getData().then(response => response.json())
      const favorite = new Favorite(musicData)
      const favoriteData = favorite.returnFavorite()
      const favoriteCheck = await favorite.favoriteCheck(trackName, artistName).then(result => result)

      if (favoriteCheck === false) {
        database('favorites')
          .returning(['id', 'title', 'artistName', 'rating', 'genre'])
          .insert(favoriteData)
          .then(result => { response.status(201).json(result) })
          .catch(error => { response.status(400).json({ error }) })
      } else { response.status(500).json({ error: 'Record already exists' }) }
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

router.delete('/:id', (request, response) => {
  (async () => {
    const id = request.params.id
    const delFavorite = await database('favorites').where('id', parseInt(id)).del()

    if (delFavorite) {
      response.status(204).json('Favorite successfully removed')
    } else {
      response.status(404).json('Entry not found')
    }
  })()
})

module.exports = router
