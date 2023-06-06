const pg     = require('pg');
const config = { user: 'isonlab', database: 'SocialFamily', password: 'isonlab', port: 5432 };
const pool   = new pg.Pool(config);


module.exports = pool;