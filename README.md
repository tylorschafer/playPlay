## playPlay

playPlay is a node.js Express REST API that allows users to create playlists and favorites with full CRUD functionality. Favorite song information is found using the musicMatch API. Users can add favorites to playlists and can hit endpoints that will return the nested summary of resources for a single or all playlists.

## Contributors

playPlay was written by Andrew Johnson and Tylor Schafer as a school project at Turing School of Software and design.

## Local Setup

1. Fork and Clone down this repo
1. Install all dependencies by navigating to the root project directory in terminal and running `npm install`.
1. Enter `psql` mode and run `CREATE DATABASE play_play_dev;` and `CREATE DATABASE play_play_test`to create the PostgreSQL databases.
1. Run the table migrations with `knex migrate:latest` and `knex migrate:lastest --env test`

## Heroku Production Link
  * You can access the production endpoints of this application at https://play-play-master.herokuapp.com/

## Database Schema
![DBSchema](/bin/schema.png?raw=true "Optional Title")

## Tech Stack
* playPlay is a node.js application built with the Express framework
* Knex query builder
* PostgreSQL database
* Heroku production host

## **Endpoints**

**1.** `POST /api/v1/favorites`
   * Summary: The Post Favorite endpoint creates a new favorite in the database and returns the newly created resource. Must supply
   all required json body parameters. Invalid requests will receive a 404 error.

   * Headers:
   ``` Content-Type: application/json
       Accept: application/json
   ```
   * Required Request Body:
   ```
   body:

   {
     "title": "<SONG_TITLE>",
     "artistName": "<ARTIST_NAME>"
   }
   ```
   * Expected Response:
   ```
   {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
   ```

**2.** `GET /api/v1/favorites/:id`
   * Summary: The Get Favorite endpoint returns a favorite from the database. Must supply
   valid resource id in path parameter. Invalid requests will receive a 404 not found response.

   * Headers:
   ``` Content-Type: application/json
       Accept: application/json
   ```

   * Expected Response:
   ```
   {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
   ```

**3.** `GET /api/v1/favorites/`
   * Summary: The Get Favorites endpoint returns all favorites from the database.

   * Headers:
   ``` Content-Type: application/json
       Accept: application/json
   ```

   * Expected Response:
   ```
    [
      {
        "id": 1,
        "title": "We Will Rock You",
        "artistName": "Queen"
        "genre": "Rock",
        "rating": 88
      },
      {
        "id": 2,
        "title": "Careless Whisper",
        "artistName": "George Michael"
        "genre": "Pop",
        "rating": 93
      },
    ]
   ```

**4.** `DELETE /api/v1/favorites/:id`
   * Summary: The Delete Favorite endpoint deletes a favorite resource from the database. Must supply
   valid resource id in path parameter. Invalid requests will receive a 404 not found response.

   * Headers:
   ``` Content-Type: application/json
       Accept: application/json
   ```

   * Expected Response:
   ```
    statusCode: 204
   ```

 **5.** `POST /api/v1/playlists`
    * Summary: The Post Playlist endpoint creates a new playlist in the database. Must supply
    all required json body parameters. Invalid requests will receive a 400 error.

    * Headers:
    ``` Content-Type: application/json
        Accept: application/json
    ```
    * Required Request Body:
    ```
    body:

    {
      "title": "<PLAYLIST_TITLE>",
    }
    ```
    * Expected Response:
    ```
    statusCode: 201
    ```
 **6.** `PUT /api/v1/playlists/:id`
    * Summary: The Put Playlist endpoint allows a user to change an existing playlist title. The resource is returned with the new title. Must supply
    a valid resource id in path parameters. Invalid requests will receive a 404 error.

    * Headers:
    ``` Content-Type: application/json
        Accept: application/json
    ```
    * Required Request Body:

    * Expected Response:
    ```
    {
      "id": 2,
      "title": "Marathon Running Mix",
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
    }
    ```

  **7.** `DELETE /api/v1/playlists/:id`
     * Summary: The Delete Playlist endpoint deletes a playlist resource from the database. Must supply
     valid resource id in path parameter. Invalid requests will receive a 404 not found response.

     * Headers:
     ``` Content-Type: application/json
         Accept: application/json
     ```

     * Expected Response:
     ```
      statusCode: 204
     ```
  **8.** `GET /api/v1/playlists/`
    * Summary: The Get Playlists endpoint returns all playlists from the database.

    * Headers:
    ``` Content-Type: application/json
        Accept: application/json
    ```

    * Expected Response:
    ```
    [
      {
      "id": 1,
      "title": "Cleaning House",
      "songCount": 2,
      "songAvgRating": 27.5,
      "favorites": [
          {
          "id": 1,
          "title": "We Will Rock You",
          "artistName": "Queen"
          "genre": "Rock",
          "rating": 25
          },
          {
          "id": 4,
          "title": "Back In Black",
          "artistName": "AC/DC"
          "genre": "Rock",
          "rating": 30
          }
      ],
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
      }
    ]
    ...
    ```

  **9.** `POST /api/v1/playlists/:playlist_id/favorites/:favorite_id`
     * Summary: The Post Playlist Favorite endpoint adds an existing favorite to an existing playlist. Must supply
     valid resource ids in path parameters. Invalid requests will receive a 400 error.

     * Headers:
     ``` Content-Type: application/json
         Accept: application/json
     ```

     * Expected Response:
     ```
     statusCode: 201
     ```

  **10.** `GET /api/v1/playlists/:id/favorites`
    * Summary: The Get Playlist Favorites endpoint returns all favorites associated with the given playlist. Must supply a valid resource id in path parameter. Invalid requests will receive a 400 error.

    * Headers:
    ``` Content-Type: application/json
        Accept: application/json
    ```

    * Expected Response:
    ```
    {
      "id": 1,
      "title": "Cleaning House",
      "songCount": 2,
      "songAvgRating": 27.5,
      "favorites" : [
                      {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                      },
                      {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                      }
                    ],
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
    }
    ```
    **11.** `DELETE /api/v1/playlists/:playlist_id/favorites/:favorite_id`
       * Summary: The Delete Playlist Favorite endpoint deletes an existing favorite from a playlist. Must supply
       valid resource ids in path parameters. Invalid requests will receive a 404 not found response.

       * Headers:
       ``` Content-Type: application/json
           Accept: application/json
       ```

       * Expected Response:
       ```
        statusCode: 204
       ```
