const fetch = require('node-fetch')

class MusixMatch {
  constructor (artistName, trackName) {
    this.artistName = artistName;
    this.trackName = trackName;
  }

  getData () {
    const data = fetch(`http://api.musixmatch.com/ws/1.1/track.search?q_artist=${this.artistName}&q_track=${this.trackName}&page=1&s_track_rating=desc&apikey=${process.env.MUSIX_API_KEY}`)
      .catch((error) => console.error({ error }))
    return data
  }
}
module.exports = MusixMatch;
