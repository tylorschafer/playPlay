const express = require('express')
const musixmatch = require('../../../services/musixmatch')
const router = express.Router()

router.post('/', (request, response) => {
  (async () => {
    const req = request.body
    console.log(req)
    const trackName = req.title
    const artistName = req.artistName

    if (trackName && artistName){
      const musix = new musixmatch(trackName, artistName)
      const musicData = await musix.getData().then(response => response.json())
      console.log(musicData)
    }
    else {
      response.status(400).json({ error: 'Bad request' })
    }
  })()
})
module.exports = router;
