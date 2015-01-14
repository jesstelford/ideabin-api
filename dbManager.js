var path = require('path'),
    level = require('level'),
    forkdb = require('forkdb'),

    directory = './',
    databases = {},
    databasesMeta = {},

    db = level(path.resolve(directory, 'data.db')),
    ideaDb = forkdb(db, {dir: path.resolve(directory, 'data.blob')});

/**
 * @param key String The name of the database (existing keys will NOT be
 * overwritten)
 * @param db Object The database to store
 * @param meta Object Meta data associated with stored database
 */
function add(key, db, meta) {
  meta = meta || {};
  databases[key] = databases[key] || db;
  databasesMeta[key] = databasesMeta[key] || meta;
}

/**
 * @param key String The name of the database to get
 * @return Object The stored database | undefined if not found
 */
function get(key) {
  return databases[key];
}

/**
 * @param key String The name of the database to get
 * @return Object The stored database meta info | undefined if not found
 */
function getMeta(key) {
  return databasesMeta[key];
}


// Setup some default databases
add('ideas', ideaDb, {type: 'forkdb'});
add('comments', ideaDb.db.sublevel('comments'), {type: 'leveldb'});
add('tags', ideaDb.db.sublevel('tags'), {type: 'leveldb'});

module.exports = {
  add: add,
  get: get,
  getMeta: getMeta
}
