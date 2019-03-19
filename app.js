// app.js

var express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
var Chat = require('./models/chat');
var User = require('./models/userModel');
var Connection = require('./models/connectionModel');
var Group = require('./models/groupModel');
const app = express()
const cors = require('cors')
app.use(cors())

var logicalTimes = 0;

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

const server = http.Server(app)
server.listen(8000)

var parallelRoute = require('./routes/route');
app.use('/parallel', parallelRoute);
app.get('/', (req, res) => {
    return res.send('Hiiiii')
})
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log("User connected")
    socket.on('addNewChat', function (msg) {
        console.log('addNewChat')
        console.log(msg)
        logicalTimes += 1;
        Group.find({ groupid: msg.groupid }, function (err, group) {
            var chat = new Chat(
                {
                    username: msg.username,
                    userid: msg.userid,
                    message: msg.message,
                    groupid: msg.groupid,
                    groupname: group[0]['groupname'],
                    logicalTime: logicalTimes
                }
            );
            chat.save(function (err) {
                if (err) {
                    return next(err);
                }
                console.log('Chat Created successfully')
            })
            io.sockets.emit('addNewChat', chat)
        })
    });
    socket.on('leave', function (msg) {
        console.log('leave')
        console.log(msg)
        var username = msg.username
        var userid = msg.userid
        var groupid = msg.groupid
        var groupname = msg.groupname
        //delete one connection
        Connection.findOneAndDelete({ username: username, userid: userid, groupid: groupid, groupname: groupname }, function (err, connection) {
            if (err) return next(err);
            io.sockets.emit('leave', msg)
        })
    })
    socket.on('joinGroup', function (msg) {
        console.log('joinGroup')
        console.log(msg)
        //create one connection
        Group.find({ groupid: msg.groupid }, function (err, group) {
            if (err) {
                return next(err);
            }
            if (group.length == 0) {
            } else {
                var connection = new Connection(
                    {
                        username: msg.username,
                        userid: msg.userid,
                        groupid: msg.groupid,
                        groupname: group[0]['groupname']
                    }
                );
                connection.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                })
                Chat.find({ groupid: msg.groupid }, function (err, chat) {
                    if (err) {
                        return next(err);
                    }
                    var latestChat = chat[0]
                    for (chatData of chat) {
                        if (chatData['logicalTime'] > latestChat['logicalTime']) {
                            latestChat = chatData
                        }
                    }
                    io.sockets.emit('joinGroupChat', latestChat)
                })
                io.sockets.emit('joinGroup', msg)
            }
        })
    })
})