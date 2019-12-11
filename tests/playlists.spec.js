var shell = require('shelljs')
var request = require('supertest')
var app = require('../app')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

describe('Test Playlist Endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade')
  })
  afterEach(() => {
    database.raw('truncate table playlists cascade')
  })

  describe('Post Playlist', () => {
    it('Creates a new playlist', async () => {
      const res = await request(app)
        .post('/api/v1/playlists')
        .send({ title: 'Working Out' })
      expect(res.body[0].title).toBe('Working Out')
    })
  })

  describe('Put Playlist', () => {
    it('Replaces a playlist', async () => {
      const oldPlaylist = await database('playlists')
        .returning(['id', 'title'])
        .insert({ title: 'Wild Wild West' })
        .then(result => result)
      const res = await request(app)
        .put(`/api/v1/playlists/${oldPlaylist[0].id}`)
        .send({title: 'Different Playlist Name'})
      expect(res.body[0].id).toBe(oldPlaylist[0].id)
      expect(res.body[0].title).toBe('Different Playlist Name')
      expect(res.body[0].title).toBe('Different Playlist Name')
    })
  })

  describe('Gets all Playlists', () => {
    it('Gets a list of all playlists and their favorites', async () => {
        const playlist1 = { title: 'Working Out' }
        const playlist2 = { title: 'Driving' }
        const db1 = await database('playlists').returning(['id', 'title']).insert(playlist1).then(result => result)
        const db2 = await database('playlists').returning(['id', 'title']).insert(playlist2).then(result => result)
        const favorite = await database('favorites')
            .insert({ title: 'Tiny Dancer', artistName: 'Elton John', rating: 100, genre: 'Classic Pop' })
            .returning(['*'])
            .then(result => result[0])
        const favorite2 = await database('favorites')
            .insert({ title: 'Enter Sandman', artistName: 'Metalica', rating: 50, genre: 'Old Guy Metal' })
            .returning(['*'])
            .then(result => result[0])
        const playFav = await database('playlist_favorites')
            .insert({ favorite_id: favorite.id, playlist_id: db1[0].id })
            .returning(['*'])
            .then(result => result[0])
        const playFav2 = await database('playlist_favorites')
            .insert({ favorite_id: favorite2.id, playlist_id: db1[0].id })
            .returning(['*'])
            .then(result => result[0])
        const res = await request(app)
            .get('/api/v1/playlists')

        expect(res.body[0].title).toBe('Working Out')
        expect(res.body[0].id).toBe(db1[0].id)
        expect(res.body[0].songCount).toBe(2)
        expect(res.body[0].songAvgRating).toBe(75.0)

        expect(res.body[0].favorites[0].id).toBe(favorite.id)
        expect(res.body[0].favorites[0].title).toBe(favorite.title)
        expect(res.body[0].favorites[0].artistName).toBe(favorite.artistName)
        expect(res.body[0].favorites[0].genre).toBe(favorite.genre)
        expect(res.body[0].favorites[0].rating).toBe(favorite.rating)

        expect(res.body[0].favorites[1].id).toBe(favorite2.id)
        expect(res.body[0].favorites[1].title).toBe(favorite2.title)
        expect(res.body[0].favorites[1].artistName).toBe(favorite2.artistName)
        expect(res.body[0].favorites[1].genre).toBe(favorite2.genre)
        expect(res.body[0].favorites[1].rating).toBe(favorite2.rating)

        expect(res.body[1].title).toBe('Driving')
        expect(res.body[1].id).toBe(db2[0].id)
        expect(res.body[1].songCount).toBe(0)
        expect(res.body[1].songAvgRating).toBe(0)
console.log(res.body[1].favorites)
        expect(res.body[1].favorites).toEqual([])

    })
  })
  
  describe('Delete Playlist', () => {
    it('Deletes a single playlist by id', async () => {
        const newPlaylist = { title: 'At Home' }
        const req = await database('playlists')
         .returning(['id', 'title'])
         .insert(newPlaylist)
        const res = await request(app)
         .delete(`/api/v1/playlists/${req[0].id}`)

        expect(res.statusCode).toBe(204)
    })
   })
})
