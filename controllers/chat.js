var Chat = require('../models/chat');
var User = require('../models/userModel');
var Connection = require('../models/connectionModel');
var Group = require('../models/groupModel');

exports.test = function (req, res) {
    res.send('This is Parallel Backend jaa');
};

exports.register = async function (req, res) {
    // var x = await User.find({})
    // console.log("eq")
    var userNameResult = await User.find({ username: req.body.username })
    if (userNameResult.length == 0) {
        var userResult = await User.find({})
        var maxUserID = 0
        for (var userData of userResult) {
            if (userData['userid'] > maxUserID) {
                maxUserID = userData['userid']
            }
        }
        var user = new User(
            {
                username: req.body.username,
                password: req.body.password,
                userid: maxUserID + 1
            });
        user.save(function (err, docsInserted) {
            if (err) {
                res.status(200).send('Fail');
                console.log(err)
            }
            res.status(200).send(docsInserted);
        })
    } else {
        res.status(200).send('This username has already existed');
    }

};

exports.login = function (req, res) {
    User.find({ username: req.body.username, password: req.body.password }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user.length == 0) {
            res.status(200).send('Again Pls');
        } else {
            res.status(200).send(user[0]);
        }
    })
};

exports.getChatByGroupID = function (req, res) {
    Chat.find({ groupid: req.body.groupid }, function (err, chat) {
        if (err) {
            res.status(200).send('Error');
            return next(err);
        }
        res.status(200).send(chat);
    })
};

exports.createGroup = async function (req, res) {
    var groupResult = await Group.find({})
    var maxGroupID = 0
    for (var groupData of groupResult) {
        if (groupData['groupid'] > maxGroupID) {
            maxGroupID = groupData['groupid']
        }
    }
    var group = new Group(
        {
            creator: req.body.userid,
            groupname: req.body.groupname,
            groupid: maxGroupID + 1
        }
    );
    group.save(function (err, groupRes) {
        if (err) {
            res.status(200).send('Error');
        }
        var connection = new Connection(
            {
                username: req.body.username,
                userid: req.body.userid,
                groupid: groupRes['groupid'],
                groupname: req.body.groupname,
            }
        );
        connection.save(function (err, connectionRes) {
            if (err) {
                res.status(200).send('Error');
            }
            var chat = new Chat(
                {
                    username: connectionRes['username'],
                    userid: connectionRes['userid'],
                    message: " ",
                    groupid: connectionRes['groupid'],
                    groupname: connectionRes['groupname'],
                    logicalTime: 0,
                    timestamp: new Date().getTime()
                }
            );
            chat.save(function (err) {
                if (err) {
                    return next(err);
                }
                console.log('Chat Created successfully')
            })
            res.status(200).send(chat);
        })
    })
};

exports.getAllUserInGroupID = function (req, res) {
    Connection.find({ groupid: req.body.groupid }, function (err, connection) {
        if (err) {
            res.status(200).send('Error');
            return next(err);
        }
        res.status(200).send(connection);
    })
}

exports.getAllCurrentChat = async function (req, res) {
    let connectionArray = await Connection.find({ userid: req.body.userid })
    let allGroup = []
    let allChat = []
    if (connectionArray.length == 0) {
        return res.status(200).send(allChat)
    }
    for (let connectionIndex in connectionArray) {
        console.log(connectionIndex)
        allGroup.push(connectionArray[connectionIndex]['groupid'])
        let chat = await Chat.find({ groupid: connectionArray[connectionIndex]['groupid'] })
        var latestChat = chat[0]
        if (chat[0]['message'] === " ") {
            latestChat['logicalTime'] = 0
        }
        for (let chatData of chat) {
            if (chatData['message'] != " " && chatData['logicalTime'] > latestChat['logicalTime']) {
                latestChat = chatData
            }
        }
        allChat.push(latestChat)
    }
    return res.status(200).send(allChat)
};