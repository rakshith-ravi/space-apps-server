var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var router = express.Router();

const saltRounds = 10;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'spaceapps'
});
connection.connect();

router.post('/login', function(req, res) {
  connection.query('SELECT * FROM users WHERE username = ?;', function(error, results, fields) {
    if(error) {
      console.error(error);
      res.json({
        success: false,
        message: "Error checking database"
      });
    }
    bcrypt.compare(req.body.password, results[0].password, function(err, answer) {
      if(err) {
        console.error(err);
        res.json({
          success: false,
          message: "Error checking password"
        });
      }
      if(answer) {
        
      }
    })
  });
});

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
