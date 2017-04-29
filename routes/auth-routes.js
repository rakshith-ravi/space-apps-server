var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
const uuidV1 = require('uuid/v1');

var router = express.Router();

const saltRounds = 10;
const secret = "don't tell anyone";

var connection = mysql.createConnection({
  host: 'localhost',
  user: config.mysqlUserName,
  password: config.mysqlPassword,
  database: 'spaceapps'
});
connection.connect();

router.post('/login', function(req, res) {
  connection.query('SELECT * FROM users WHERE username = ?;', [req.body.username], function(error, results, fields) {
    if(error) {
      console.error(error);
      res.json({
        success: false,
        error: "errordb",
        message: "Error checking database"
      });
    }
    if(results.length == 0) {
      res.json({
        success: false,
        error: "invaliduser",
        message: "User not found"
      });
      return;
    }
    bcrypt.compare(req.body.password, results[0].password, function(err, answer) {
      if(err) {
        console.error(err);
        res.json({
          success: false,
          error: "errorpassword",
          message: "Error checking password"
        });
      }
      if(answer) {
        jwt.sign(req.body.username, secret, function(err, token) {
          res.json({
            success: true,
            accesstoken: token
          });
        });
      } else {
        res.json({
          success: false,
          error: "invalidpassword",
          message: "Invalid password"
        });
      }
    })
  });
});

router.post('/signup', function(req, res) {
  connection.query('SELECT * FROM users WHERE username = ?;', [req.body.username], function(error, results, fields) {
    if(error) {
      console.error(error);
      res.json({
        success: false,
        error: "errordb",
        message: "Error checking database"
      });
      return;
    }
    if(results.length > 0) {
      res.json({
        success: false,
        error: "existingusername",
        message: "That username is taken"
      });
      return;
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      connection.query("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", [uuid, req.body.username, hash, req.body.name, req.body.email, 0], function(error, results, fields) {
        if(error) {
          console.error(error);
          res.json({
            success: false,
            error: "errordb",
            message: "Error checking database"
          });
          return;
        }
        jwt.sign(req.body.username, secret, function(err, token) {
          res.json({
            success: true,
            accesstoken: token
          });
        });
      });
    });
  });
});

module.exports = router;
