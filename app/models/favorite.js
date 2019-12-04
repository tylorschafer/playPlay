const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

class Favorite {
  constructor (musixData) {
    this.title = musixData.message.body.track_list[0].track.track_name
    this.name = musixData.message.body.track_list[0].track.artist_name
    this.rating = musixData.message.body.track_list[0].track.track_rating
    this.genre = musixData.message.body.track_list[0].track.primary_genres.music_genre_list[0].music_genre.music_genre_name || 'Undefined'
  }

  returnFavorite () {
    return { title: this.title, artistName: this.name, rating: this.rating, genre: this.genre }
  }

  async favoriteCheck (title, name) {
    const favorite = await database('favorites').where('title', title).then(result => result)
    return favorite.length > 0
  }
}
module.exports = Favorite
