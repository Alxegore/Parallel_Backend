// app.js

var express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
var Chat = require('./models/chat');
var User = require('./models/userModel');
var Connection = require('./models/connectionModel');
var app = express();

// Set up mongoose connection
var mongoose = require('mongoose');
const dev_db_url = 'mongodb+srv://admineq:admineq@parallel-fnvjs.mongodb.net/test?retryWrites=true';
// var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(dev_db_url);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = 1234;

// app.listen(port, () => {
//     console.log('Server is up and running on port numner ' + port);
// });

const server = http.Server(app)
server.listen(3000)
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log("User connected")
    Chat.find({}, function (err, chat) {
        if (err) return next(err);
        console.log(chat)
        socket.emit('getAllChat', chat)
    })
    socket.on('addNewChat', function (msg) {
        console.log(msg)
        var chat = new Chat(
            {
                username: msg.username,
                message: msg.message,
                groupid: msg.groupid
            }
        );
        chat.save(function (err) {
            if (err) {
                return next(err);
            }
            console.log('Chat Created successfully')
        })
        io.sockets.emit('addNewChat', msg)
    });
    socket.on('invite', function (msg) {
        var userArray = msg.userArray
        var groupid = msg.groupid
        io.sockets.emit('invite', msg)
    })
    socket.on('leave', function (msg) {
        var username = msg.username
        var groupid = msg.groupid
        io.sockets.emit('leave', msg)
    })
    socket.on('createGroup', function (msg) {
        var userArray = msg.userArray
        io.sockets.emit('createGroup', msg)
    })
    socket.on('joinGroup', function (msg) {
        var username = msg.username
        var groupid = msg.groupid
        io.sockets.emit('joinGroup', msg)
    })
    socket.on('login', function (msg) {
        var username = msg.username
        var password = msg.password
        // io.sockets.emit('login', msg)
    })
    socket.on('register', function (msg) {
        var user = new User(
            {
                username: msg.username,
                password: msg.password,
            }
        );
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            console.log('User Created successfully')
        })
        // io.sockets.emit('register', msg)
    })
})