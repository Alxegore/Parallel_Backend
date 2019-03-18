var Chat = require('../models/chat');
var User = require('../models/userModel');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('This is Parallel Backend jaa');
};

exports.register = function (req, res) {
    User.find({ username: req.body.username }, function (err, user) {
        if (err) {
            return next(err);
        }
        console.log(user)
        if (user.length == 0) {
            var user = new User(
                {
                    username: req.body.username,
                    password: req.body.password,
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
    })

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

exports.chat_create = function (req, res) {
    var chat = new Chat(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    chat.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Chat Created successfully')
    })
};

exports.chat_details = function (req, res) {
    Chat.findById(req.params.id, function (err, chat) {
        if (err) return next(err);
        res.send(chat);
    })
};

exports.chat_update = function (req, res) {
    Chat.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, chat) {
        if (err) return next(err);
        res.send('Chat udpated.');
    });
};

exports.chat_delete = function (req, res) {
    Chat.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};