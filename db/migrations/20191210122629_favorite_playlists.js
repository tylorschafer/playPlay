

exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('playlist_favorites', function (table) {
            table.increments('id').primary();
            table.integer('playlist_id').references('playlists.id').onDelete('SET NULL');
            table.integer('favorite_id').references('favorites.id').onDelete('SET NULL');
        })
    ])
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('playlist_favorites')
    ])
};