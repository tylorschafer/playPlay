var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const musixMatch = require('../app/services/musixmatch')
const musix = new musixMatch('Queen', 'We Will Rock You')

describe('Post Favorite Songs', () => {
  it('Creates a new Favorite Song', async () =>{
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({ title: "We Will Rock You", artistName: "Queen"});

    expect(res.body[0].title).toBe("We Will Rock You")
    expect(res.body[0].artistName).toBe("Queen")
    expect(res.body[0].genre).toBe("Rock")
  })
})
