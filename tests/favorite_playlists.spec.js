var shell = require('shelljs')
var request = require('supertest')
var app = require('../app')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

describe('Test Playlist Endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlist_favorites cascade')
  })
  afterEach(() => {
    database.raw('truncate table playlist_favorites cascade')
  })

  describe('Post Favorite to Playlist', () => {
    it('Adds a favorite entry into a playlist', async () => {
      const playlist = await database('playlists').insert({ title: 'Driving' }).returning(['id', 'title']).then(result => result[0])
      const favorite = await database('favorites').insert({ title: 'Tiny Dancer', artistName: 'Elton John', rating: 99, genre: 'Classic Pop' })
        .returning(['id', 'title'])
        .then(result => result[0])

      const res = await request(app)
        .post(`/api/v1/playlists/${playlist.id}/favorites/${favorite.id}`)

      expect(res.body.success).toBe(`${favorite.title} has been added to ${playlist.title}!`)
    })
  })

  describe('Delete Favorite of Playlist', () => {
    it('Deletes a favorite from the joins table', async () => {
      const playlist = await database('playlists')
        .insert({ title: 'Driving' })
        .returning(['id'])
        .then(result => result[0])
      const favorite = await database('favorites')
        .insert({ title: 'Tiny Dancer', artistName: 'Elton John', rating: 99, genre: 'Classic Pop' })
        .returning(['id'])
        .then(result => result[0])
      const playFav = await database('playlist_favorites')
        .insert({ favorite_id: favorite.id, playlist_id: playlist.id })
        .then(result => result[0])   
      const res = await request(app)
        .delete(`/api/v1/playlists/${playlist.id}/favorites/${favorite.id}`)

      expect(res.statusCode).toBe(201)
    })
  })
})
