var express = require('express');
const pool  = require('./postgres_config.js')
var path    = require('path');
const User  = require('./user.js');

var app     = express.Router();
var logged  = false;
var current_user = new User;


var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

//Avoid error on the favicon request 
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res, next) => {
  //if (logged == true){
    var name
    var post
    pool.connect(function (err, client, done) {
    
      if (err) {
        console.log("Can not connect to the DB" + err);
      }
  
      client.query('SELECT * FROM post ORDER BY post_id DESC', function (err, result) {
        done();
  
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }
        //TODO try if there are no posts
        name = current_user.username;
        console.log(result.rows);
        //post = result.rows[0].post_id + '--> ' + result.rows[0].title + ': ' + result.rows[0].content + '\n by: ' + result.rows[0].username;
        res.render('index', { title: 'Express', message: name, result: result.rows, time: req.requestTime});
      })

    })
  // } else {
  //   res.sendFile(path.join(__dirname, '..' ,'views', 'login.html'));
  // }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..' ,'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const post = req.body;
   
    var query = `SELECT password FROM users WHERE username = \'${post.username}\'`; 
    
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

        if (result.rowCount == 0 ){
          res.sendFile(path.join(__dirname, '..' ,'views', 'singup.html'));
        } else if (result.rows[0].password == post.password) {
          console.log("Login succesfull");
          current_user = new User(result.rows[0].id, result.rows[0].name, result.rows[0].last_name, result.rows[0].username);
          logged = true;
          res.redirect('/');
        } else {
          console.log("Login falied");
        }
      })
    })
  });

app.post('/singup', (req, res) => {
    const post = req.body;
    
    //TODO Check if user alredy exist 

    var query = `INSERT INTO public.users (username, name, last_name, email, password, birth_date, gender)  
                VALUES (\'${post.username}\', \'${post.name}\', \'${post.last_name}\', \'${post.email}\', \'${post.password}\', \'${post.birth_date}\', \'${post.gender}\')`;
        
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
        console.log('New user is added to the database');
        res.redirect('/login');
      })
    })
  });



app.get('/post', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..' ,'views', 'new_post.html'));
});


app.post('/post', (req, res) => {
  const post = req.body;
 
  var query = `INSERT INTO public.post (title, content, image_id, location, date, owner) 
              VALUES (\'${post.title}\', \'${post.content}\', \'${post.image_id}\', \'${post.location}\', \'${Date.now()}\', \'${current_user.username}\')`;
  
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
});

module.exports = app;
