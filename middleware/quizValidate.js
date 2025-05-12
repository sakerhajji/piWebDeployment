const yup = require('yup');
const Quiz = require("../models/Quiz");

async function checkQuizExists(req, res, next) {
    try {
        const Schema = yup.object().shape({
            id: yup.string().required(),
        });

        await Schema.validate(req.params);


        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        req.quiz = quiz;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function validateQuizData(req, res, next) {
    try {
        const Schema = yup.object().shape({
            title: yup.string().required(),
            courseId: yup.string().required(),
            subCourseId: yup.string().required(),
            difficulty: yup.string().required(),
            //totalQuestions: yup.number().required(),
            timeLimit: yup.number().required(),
            questions: yup.array().of(
                yup.object().shape({
                    text: yup.string().required(),
                    options: yup.array().of(yup.string()).required(),
                    correct: yup.string().required(),
                    explanation: yup.string().required(),
                })
            ).required(),
        });
        await Schema.validate(req.body);
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function authenticateUser(req, res, next) {
    try {
        const Schema = yup.object().shape({
            authorization: yup.string().required(),
        });
        await Schema.validate(req.headers);

        // Replace with actual JWT verification or auth logic
        req.user = { id: "user123" }; // Mock user object
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
}

module.exports = { checkQuizExists, validateQuizData, authenticateUser };
