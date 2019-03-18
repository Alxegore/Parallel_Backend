var express = require('express');
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var chatController = require('../controllers/chat');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', chatController.test);
router.post('/register', chatController.register);
router.post('/login', chatController.login);

// router.post('/create', chatController.chat_create);

// router.get('/:id', chatController.chat_details);

// router.put('/:id/update', chatController.chat_update);

// router.delete('/:id/delete', chatController.chat_delete);


module.exports = router;