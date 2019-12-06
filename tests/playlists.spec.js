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
})
