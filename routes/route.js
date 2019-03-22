var express = require('express');
var router = express.Router();

var chatController = require('../controllers/chat');

router.get('/test', chatController.test);
router.post('/register', chatController.register);
router.post('/login', chatController.login);
router.post('/getChatByGroupID', chatController.getChatByGroupID)
router.post('/createGroup', chatController.createGroup)
// router.post('/joinGroup', chatController.joinGroup)
// router.post('/leaveGroup', chatController.leaveGroup)
router.post('/getAllUserInGroupID', chatController.getAllUserInGroupID)
router.post('/getAllCurrentChat', chatController.getAllCurrentChat)

module.exports = router;