var express  = require('express');
const pool   = require('./postgres_config.js')

var app      = express.Router();

var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

app.get('/', (req, res, next) => {
  pool.connect(function (err, client, done) {

    if (err) {
      console.log("Can not connect to the DB" + err);
    }

    client.query('SELECT * FROM person', function (err, result) {
      done();

      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      res.render('index', { title: 'Express', message: result.rows[0].person_id, time: req.requestTime});
    })
  })
});

app.get('/name', (req, res, next) => {
  pool.connect(function (err, client, done) {

    if (err) {
      console.log("Can not connect to the DB" + err);
    }

    client.query('SELECT first_name FROM person', function (err, result) {
      done();

      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      res.render('index', { title: 'Express', message: result.rows[0].first_name, time: req.requestTime});
    })
  })
});

app.get('/allData', (req, res, next) => {
  pool.connect(function (err, client, done) {

    if (err) {
      console.log("Can not connect to the DB" + err);
    }

    client.query('SELECT * FROM person', function (err, result) {
      done();

      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      var msg = result.rows[0].person_id + ", " + result.rows[0].first_name + ", " + result.rows[0].last_name + ", " + result.rows[0].username + ", " + result.rows[0].birth_date + ", " + result.rows[0].city + ", " + result.rows[0].address;
      res.render('index', { title: 'Express', message: msg, time: req.requestTime});
    })
  })
});


module.exports = app;
