// app.js

var express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
var Chat = require('./models/chat');
var app = express();


// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://eqsk134:parallel134@parallel-fnvjs.mongodb.net/test?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
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
                message: msg.message
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
})