var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const musix = require('../../app/services/musixmatch')

describe('Test the MusixMatch Service', () => {
 
});
