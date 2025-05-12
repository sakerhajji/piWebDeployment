const express = require("express");
const router = express.Router();
const {
    validateQuizData,
    checkQuizExists,
}=require("../middleware/quizValidate");

const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizByCourseId,
    getQuizBySubCourseId,
    getQuizByUserId
} = require("../controller/quizController");


// Test route simple
router.get('/show', (req, res) => {
    res.send('salut 4 twin 9');
});

// 🎯 CRUD Routes pour Quiz
router.post("/", createQuiz);                                      // Créer un quiz
router.get("/", getAllQuizzes);                                   // Obtenir tous les quiz
router.get("/:id", getQuizById);                                // Obtenir un quiz par ID
router.put("/:id",checkQuizExists, updateQuiz);                // Mettre à jour un quiz par ID
router.delete("/:id",checkQuizExists, deleteQuiz);            // Supprimer un quiz par ID

// 🧩 Routes spécifiques
router.get("/course/:courseid", getQuizByCourseId);        // Quiz par courseId
router.get("/subCourse/:subCourseId", getQuizBySubCourseId);        // Quiz par subCourseId
router.get("/user/:userId", getQuizByUserId);            // Quiz créés par un utilisateur

module.exports = router;
