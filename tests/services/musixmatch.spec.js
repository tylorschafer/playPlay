var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const musix = require('../../app/services/musixmatch')

describe('Test the MusixMatch Service', () => {
 it ('Should return data from MusixMatch Service', async () => {
   const musicData = await musix.getData('Queen', 'We Will Rock You')
   expect(musicData.body.track_list[0].track.track_id).toBe(30109723)
 })
});
