const express = require('express');
const router = express.Router();
const forumController = require('../controller/forumController');
const validate = require('../middleware/forumValidate');


router.post('/forums', forumController.upload.single('image'),validate.validateForum, forumController.addForum);
router.get('/forums', forumController.showAllForums);
router.get('/forums/:id', forumController.showForumById);
router.get('/forums/user/:id', forumController.showForumsByUser);
router.put('/forums/:id',forumController.upload.single('image'), validate.validateForum, forumController.updateForum);
router.delete('/forums/:id', forumController.deleteForum);

module.exports = router;
