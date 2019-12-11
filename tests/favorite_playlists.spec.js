var shell = require('shelljs')
var request = require('supertest')
var app = require('../app')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

describe('Test Playlist Endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlist_favorites cascade')
    await database.raw('truncate table favorites cascade')
    await database.raw('truncate table playlists cascade')
  })
  afterEach(() => {
    database.raw('truncate table playlist_favorites cascade')
    database.raw('truncate table favorites cascade')
    database.raw('truncate table playlists cascade')
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
        .returning(['id'])
        .then(result => result[0])

      const res = await request(app)
        .delete(`/api/v1/playlists/${playlist.id}/favorites/${favorite.id}`)

      expect(res.statusCode).toBe(204)
    })
  })

  describe('Get playlist favorites', () => {
    it('Returns the playlist and all of its favorites', async () => {
      const playlist = await database('playlists')
        .insert({ title: 'Driving' })
        .returning(['*'])
        .then(result => result[0])
      const favorite = await database('favorites')
        .insert({ title: 'Tiny Dancer', artistName: 'Elton John', rating: 100, genre: 'Classic Pop' })
        .returning(['*'])
        .then(result => result[0])
      const favorite2 = await database('favorites')
        .insert({ title: 'Enter Sandman', artistName: 'Metalica', rating: 50, genre: 'Old Guy Metal' })
        .returning(['*'])
        .then(result => result[0])
      const playFav = await database('playlist_favorites')
        .insert({ favorite_id: favorite.id, playlist_id: playlist.id })
        .returning(['*'])
        .then(result => result[0])
      const playFav2 = await database('playlist_favorites')
        .insert({ favorite_id: favorite2.id, playlist_id: playlist.id })
        .returning(['*'])
        .then(result => result[0])

      const res = await request(app)
        .get(`/api/v1/playlists/${playlist.id}/favorites`)

      expect(res.body.id).toBe(playlist.id)
      expect(res.body.title).toBe(playlist.title)
      expect(res.body.songCount).toBe(2)
      expect(res.body.songAvgRating).toBe(75.0)

      expect(res.body.favorites[0].id).toBe(favorite.id)
      expect(res.body.favorites[0].title).toBe(favorite.title)
      expect(res.body.favorites[0].artistName).toBe(favorite.artistName)
      expect(res.body.favorites[0].genre).toBe(favorite.genre)
      expect(res.body.favorites[0].rating).toBe(favorite.rating)

      expect(res.body.favorites[1].id).toBe(favorite2.id)
      expect(res.body.favorites[1].title).toBe(favorite2.title)
      expect(res.body.favorites[1].artistName).toBe(favorite2.artistName)
      expect(res.body.favorites[1].genre).toBe(favorite2.genre)
      expect(res.body.favorites[1].rating).toBe(favorite2.rating)
    })
  })
})
