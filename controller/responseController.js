const Response = require("../models/Response");
const Quiz = require("../models/Quiz");
const User = require("../models/user");

// Créer une nouvelle réponse
async function createResponse(req, res) {
    try {
        const { user_id, quiz_id, subCourse_id, course_id, answers, score, isPassed, timeTaken } = req.body;

        if (!user_id || !quiz_id || !answers) {
            return res.status(400).json({ message: "Missing required fields: user_id, quiz_id, answers" });
        }

        const newResponse = new Response({
            user_id,
            quiz_id,
            subCourse_id,
            course_id,
            answers,
            score,
            isPassed,
            timeTaken,
            dateAttempted: new Date(),
        });

        await newResponse.save();
        res.status(200).json(newResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating response");
    }
}

// Récupérer toutes les réponses
async function getAllResponses(req, res) {
    try {
        const responses = await Response.find();
        res.status(200).json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching responses");
    }
}

// Récupérer une réponse par ID
async function getResponseById(req, res) {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) return res.status(404).send("Response not found");
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching response");
    }
}

// Récupérer les réponses d’un utilisateur
async function getResponseByUserId(req, res) {
    try {
        const responses = await Response.find({ user_id: req.params.userid });
        if (!responses.length) return res.status(404).send("No responses found for this user");
        res.status(200).json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching responses");
    }
}

// Récupérer les réponses d’un quiz
async function getResponseByQuizId(req, res) {
    try {
        const responses = await Response.find({ quiz_id: req.params.quizid});
        if (!responses.length) return res.status(404).send("No responses found for this quiz");
        res.status(200).json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching responses");
    }
}

// Récupérer les réponses par subCourse_id
async function getResponseBySubCourseId(req, res) {
    try {
        const responses = await Response.find({ subCourse_id: req.params.subCourseid });
        console.log(responses);
        if (!responses.length) return res.status(404).send("No responses found for this sub-course");
        res.status(200).json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching responses");
    }
}

// Récupérer les réponses par course_id
async function getResponseByCourseId(req, res) {
    try {
        const responses = await Response.find({ course_id: req.params.courseId });
        console.log(responses);
        if (!responses.length) return res.status(404).send("No responses found for this course");
        res.status(200).json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching responses");
    }
}

// Supprimer une réponse
async function deleteResponse(req, res) {
    try {
        const deleted = await Response.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send("Response not found");
        res.status(200).send("Response deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting response");
    }
}

module.exports = {
    createResponse,
    getAllResponses,
    getResponseById,
    deleteResponse,
    getResponseByUserId,
    getResponseByQuizId,
    getResponseBySubCourseId,
    getResponseByCourseId,
};
