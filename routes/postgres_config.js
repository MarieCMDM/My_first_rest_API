const pg     = require('pg');
const config = { user: 'isonlab', database: 'SocialAttemp', password: 'isonlab', port: 5432 };
const pool   = new pg.Pool(config);

function executeQuery(query) {
    pool.connect(function (err, client, done) {

    if (err) {
      console.log("Can not connect to the DB" + err);
    }

    client.query(`${query}`, function (err, result) {
      done();

      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.send('Post is added to the database');
    })
  })
}

module.exports = pool;