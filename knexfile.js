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
  },
  staging: {
    client: 'pg',
    connection: 'postgres://iurypswyubneey:29a5fbf851d153518e4aac523fd84c105bc28c42c27f96799962739b9573e883@ec2-174-129-255-21.compute-1.amazonaws.com:5432/d36hmi61p6f1k8',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}
