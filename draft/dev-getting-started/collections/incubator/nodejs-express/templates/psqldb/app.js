const app = require('express')()
var pgp = require('pg-promise')(/* options */)

var db = pgp('postgres://postgres:mysecretpassword@workshop-postgres:5432/')

app.get('/', (req, res) => {
  res.send("Hello from Appsody!");
});

app.get('/database', (req, res) => {
  db.one('SELECT version () AS value')
    .then(function (data) {
      res.send(data.value);
    })
    .catch(function (error) {
      res.send("ERROR:".concat(error));
    })
});
 
module.exports.app = app;
