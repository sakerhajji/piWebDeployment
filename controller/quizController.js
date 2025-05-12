const Quiz = require("../models/Quiz");
const User = require("../models/user");

// Créer un nouveau quiz
async function createQuiz(req, res) {
    try {
        const {
            title,
            category,
            difficulty,
            totalQuestions,
            timeLimit,
            createdBy,
            questions,
            courseId,
            subCourseId
        } = req.body;

        const newQuiz = new Quiz({
            title,
            courseId,
            subCourseId,
            category,
            difficulty,
            totalQuestions,
            timeLimit,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
            questions
        });

        await newQuiz.save();
        res.status(200).json(newQuiz);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating quiz");
    }
}

// Obtenir tous les quiz
async function getAllQuizzes(req, res) {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching quizzes");
    }
}

// Obtenir un quiz par ID
async function getQuizById(req, res) {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        res.json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching quiz");
    }
}

// Obtenir les quiz par subCourseId
async function getQuizBySubCourseId(req, res) {
    try {
        const quiz = await Quiz.findOne({ subCourseId: req.params.subCourseId });
        if (!quiz) return res.status(404).send("Quiz not found for this subCourseId");
        res.json(quiz);          // ← returns ONE object, not an array
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching quiz");
    }
}

// Obtenir les quiz par courseId
async function getQuizByCourseId(req, res) {
    try {
        const quiz = await Quiz.findOne({ courseId: req.params.courseId });
        if (!quiz) return res.status(404).send("Quiz not found for this courseId");
        res.json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching quiz");
    }
}

// Obtenir les quiz par utilisateur (créateur)
async function getQuizByUserId(req, res) {
    try {
        const quiz = await Quiz.findOne({ createdBy: req.params.userId });
        if (!quiz) return res.status(404).send("Quiz not found for this user");
        res.json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching quiz");
    }
}

// Mettre à jour un quiz par ID
async function updateQuiz(req, res) {
    try {
        const {
            title,
            category,
            difficulty,
            totalQuestions,
            timeLimit,
            questions
        } = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {
                title,
                category,
                difficulty,
                totalQuestions,
                timeLimit,
                questions,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).send("Quiz not found");
        }

        res.status(200).json(updatedQuiz);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating quiz");
    }
}

// Supprimer un quiz
async function deleteQuiz(req, res) {
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!deletedQuiz) {
            return res.status(404).send("Quiz not found");
        }
        res.status(200).send("Quiz deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting quiz");
    }
}

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizBySubCourseId,
    getQuizByCourseId,
    getQuizByUserId
};
