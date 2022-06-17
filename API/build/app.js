"use strict";

var express = require('express');

var mysql = require('mysql2');

var bodyParser = require('body-parser');

var app = express();
var port = 3000;
app.use(bodyParser.json()); //mysql

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'company'
});
connection.connect(function (error) {
  if (error) throw error;
  console.log('database server running!');
});
app.get('/', function (req, res) {
  res.send('Hello World!');
}); // all users

app.get('/users', function (req, res) {
  var sql = 'SELECT * FROM users';
  connection.query(sql, function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not results');
    }
  });
});
app.get('/users/:id', function (req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM users WHERE id = ".concat(id);
  connection.query(sql, function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not results');
    }
  });
});
app.post('/add', function (req, res) {
  var sql = 'INSERT INTO users SET ?';
  var userObj = {
    user: req.body.user,
    password: req.body.password
  };
  connection.query(sql, userObj, function (error) {
    if (error) throw error;
    res.send('User created!');
  });
});
app.put('/update/:id', function (req, res) {
  var id = req.params.id;
  var _req$body = req.body,
      user = _req$body.user,
      password = _req$body.password;
  var sql = "UPDATE users SET user = '".concat(user, "', password = '").concat(password, "' WHERE id = ").concat(id);
  connection.query(sql, function (error) {
    if (error) throw error;
    res.send('User updated!');
  });
});
app["delete"]('/delete/:id', function (req, res) {
  var id = req.params.id;
  var sql = "DELETE FROM users WHERE id = ".concat(id);
  connection.query(sql, function (error) {
    if (error) throw error;
    res.send('User deleted!');
  });
});
app.listen(port, function () {
  console.log("Server running on port ".concat(port));
});