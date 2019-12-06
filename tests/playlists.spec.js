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
      expect(res.body[0].id).toBe(1)
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
        .put('/api/v1/playlists')
        .send({title: 'Different Playlist Name'})
      expect(res.body[0].id).toBe(oldPlaylist.id)
      expect(res.body[0].title).toBe('Different Playlist Name')
    })
  })
})
