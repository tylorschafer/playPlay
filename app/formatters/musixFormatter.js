class MusixFormatter {
  constructor (musixData) {
    this.title = musixData.message.body.track_list[0].track.track_name
    this.name = musixData.message.body.track_list[0].track.artist_name
    this.rating = musixData.message.body.track_list[0].track.track_rating
    this.genre = musixData.message.body.track_list[0].track.primary_genres.music_genre_list[0].music_genre.music_genre_name || 'Undefined'
  }

  returnData () {
    return { title: this.title, artistName: this.name, rating: this.rating, genre: this.genre }
  }
}
module.exports = MusixFormatter
