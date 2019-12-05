var shell = require('shelljs')
var request = require('supertest')
var app = require('../app')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

describe('Test favorites endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade')
  })
  afterEach(() => {
    database.raw('truncate table favorites cascade')
  })

  describe('Post Favorite Songs', () => {
    it('Creates a new Favorite Song', async () => {
      const res = await request(app)
        .post('/api/v1/favorites')
        .send({ title: 'Daughters', artistName: 'John Mayer' })
      expect(res.body[0].title).toBe('Daughters')
      expect(res.body[0].artistName).toBe('John Mayer')
      expect(res.body[0].genre).toBe('Blues-Rock')
    })
  })

  describe('Get Favorites', () => {
    it('Gets all favorites in database', async () => {
      const favorite = {
        title: 'We Will Rock You',
        artistName: 'Queen',
        genre: 'Rock',
        rating: 88
      }

      await database('favorites').insert(favorite, 'id').then(result => result)
      const res = await request(app)
        .get('/api/v1/favorites')

      expect(res.body[0].title).toBe('We Will Rock You')
      expect(res.body[0].artistName).toBe('Queen')
      expect(res.body[0].genre).toBe('Rock')
    })

    it('Gets a single favorite by id', async () => {
      const favorite = {
        title: 'We Will Rock You',
        artistName: 'Queen',
        genre: 'Rock',
        rating: 88
      }
      const fav = await database('favorites').insert(favorite, 'id').then(result => result)

      const res = await request(app)
        .get(`/api/v1/favorites/${fav[0]}`)

      expect(res.body[0].title).toBe('We Will Rock You')
      expect(res.body[0].artistName).toBe('Queen')
      expect(res.body[0].genre).toBe('Rock')
    })
  })

  describe('Delete Favorites', () => {
    it('Deletes a single favorite by id', async () => {
      const res = await request(app)
        .delete('/api/v1/favorites/1')

      expect(res.body).toBe('Entry not found')
    })
  })
})
