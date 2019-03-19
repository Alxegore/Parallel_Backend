// app.js

var express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
var Chat = require('./models/chat');
var User = require('./models/userModel');
var Connection = require('./models/connectionModel');
const app = express()
const cors = require('cors')
app.use(cors())

var logicalTimes = {};

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

// var port = 1234;
// app.listen(port, () => {
//     console.log('Server is up and running on port numner ' + port);
// });

const server = http.Server(app)
server.listen(8000)

var parallelRoute = require('./routes/route');
app.use('/parallel', parallelRoute);

const io = socketIo(server);
io.on('connection', (socket) => {
    console.log("User connected")
    socket.on('addNewChat', function (msg) {
        console.log('addNewChat')
        console.log(msg)
        if(!(msg.groupid in key)){
            logicalTimes[msg.groupid] = 0;
        }
        logicalTimes[msg.groupid] += 1;
        var chat = new Chat(
            {
                username: msg.username,
                userid: msg.userid,
                message: msg.message,
                groupid: msg.groupid,
                timestamp: Date(),
                logicalTime: logicalTimes[msg.groupid]
            }
        );
        chat.save(function (err) {
            if (err) {
                return next(err);
            }
            console.log('Chat Created successfully')
        })
        io.sockets.emit('addNewChat', chat)
    });
    socket.on('leave', function (msg) {
        console.log('leave')
        console.log(msg)
        var username = msg.username
        var userid = msg.userid
        var groupid = msg.groupid
        //delete one connection
        Connection.findOneAndDelete({ username: username, userid: userid, groupid: groupid }, function (err, connection) {
            if (err) return next(err);
            io.sockets.emit('leave', msg)
        })
    })
    // socket.on('createGroup', function (msg) {
    //     console.log('createGroup')
    //     console.log(msg)
    //     var userArray = msg.userArray
    //     //for user in userArray
    //     for (user in userArray) {
    //         var connection = new Connection(
    //             {
    //                 username: user.username,
    //                 userid: user.userid,
    //                 groupid: msg.groupid,
    //             }
    //         );
    //         connection.save(function (err) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             io.sockets.emit('joinGroup', msg)
    //         })
    //     }
    //     // io.sockets.emit('createGroup', msg)
    // })
    socket.on('joinGroup', function (msg) {
        console.log('joinGroup')
        console.log(msg)
        //create one connection
        var connection = new Connection(
            {
                username: msg.username,
                userid: msg.userid,
                groupid: msg.groupid,
            }
        );
        connection.save(function (err) {
            if (err) {
                return next(err);
            }
            io.sockets.emit('joinGroup', msg)
        })
    })
})