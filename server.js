/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var app = express();
var port = 8081;
var bodyParser = require('body-parser');
var cors = require('cors');
const db = require('./model');

db.sequelize.sync();

var corsOption = {
    origin: "https://127.0.0.1:8081/"
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOption));

var routes = require('./utils/routes');
routes(app);

var server = app.listen(port, function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log("server listening at http://%s:%s", host, port);
})