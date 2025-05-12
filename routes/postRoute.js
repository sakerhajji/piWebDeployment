const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

// Routes pour les postes
router.post('/post/add', postController.upload.single('file'), postController.addPost);
router.get('/post/all', postController.showAllPosts);
router.get('/post/:id', postController.showPostById);
router.get('/post/user/:id', postController.showPostsByUser);
router.put('/post/update/:id', postController.upload.single('file'), postController.updatePost);
router.delete('/post/delete/:id', postController.deletePost);

// Routes pour les candidats
router.post(
    '/candidat/add',
    postController.upload.fields([
      { name: 'cv', maxCount: 1 },
      { name: 'diplome', maxCount: 1 }
    ]),
    postController.addCandidat
  );
router.get('/candidat/all', postController.showAllCandidats);
router.get('/candidat/:id', postController.showCandidatById);
router.get('/candidat/post/:postId', postController.showCandidatsByPost);
router.put('/candidat/update/:id', postController.upload.array('files', 5), postController.updateCandidat);
router.delete('/candidat/delete/:id', postController.deleteCandidat);

// Routes pour accepter ou rejeter un candidat
router.post('/candidat/accept/:id', postController.acceptCandidat);
router.post('/candidat/reject/:id', postController.rejectCandidat);

module.exports = router;
