// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/play_play_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/play_play_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://zrdoqjleatoncs:39beb10a77a9bdc09b67ea745fd0ecbac027404dc9efa9708ac5125eb28e5fea@ec2-107-22-234-103.compute-1.amazonaws.com:5432/danv7cor8fdn3v',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}
