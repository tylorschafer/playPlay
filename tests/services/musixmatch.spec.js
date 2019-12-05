var shell = require('shelljs')
var request = require('supertest')
var app = require('../../app')

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)
const musixMatch = require('../../app/services/musixmatch')
const musix = new musixMatch('Queen', 'We Will Rock You')

describe('Test the MusixMatch Service', () => {
  it('Should return data from MusixMatch Service', async () => {
    const musicData = await musix.getData().then(response => response.json())
    expect(musicData.message.body.track_list[0].track.artist_id).toBe(26759376)
  })
})
