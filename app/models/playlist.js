const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

class Playlist {
  constructor (id) {
    this.id = id
  }

  async songCount () {
    const playFavs = await database('playlist_favorites')
      .returning('*')
      .where('playlist_id', this.id)
      .then(result => result.length)
      .catch(error => error)
    return playFavs
  }

  async averageRating () {
    const playFavs = await database('playlist_favorites AS p')
      .innerJoin('favorites as f', 'p.favorite_id', 'f.id')
      .where('p.playlist_id', this.id)
      .avg('f.rating')
      .catch(error => error)
    return playFavs
  }

  async formatFavorites (playlist) {
    const rating = await this.averageRating()
    const count = await this.songCount()
    const favs = await this.favorites() 
    const output = {}
      output.id = playlist.id
      output.title = playlist.title 
      output.songCount = count
      output.songAvgRating = parseFloat((parseFloat(rating[0].avg)).toFixed(2))
      output.favorites = favs
      output.createdAt = playlist.created_at 
      output.updatedAt = playlist.updated_at 
    return output
  };

  async favorites () {
    const result = await database('playlist_favorites AS p')
      .innerJoin('favorites as f', 'p.favorite_id', 'f.id')
      .select(['f.id', 'f.title', 'f.artistName', 'f.genre', 'f.rating'])
      .where('p.playlist_id', this.id)
      .then(result => result)
      .catch(error => error)
    return result
  }
}

module.exports = Playlist