const express = require('express');
const router = express.Router();
const likeController = require('../controller/likeController');
const validate = require('../middleware/forumValidate');


router.post('/likes', likeController.addLike);
router.delete('/likes', likeController.removeLike);
router.get('/likes/:forumId', likeController.showLikesByForum);
router.get('/like-count/:forumId', likeController.countLikesByForum);

module.exports = router;
