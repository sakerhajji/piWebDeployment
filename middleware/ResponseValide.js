const yup = require('yup');
const Quiz = require("../models/Quiz");
const Response = require("../models/Response");

async function validateResponseData(req, res, next) {
    try {
        const schema = yup.object().shape({
            user_id: yup.string().required("user_id is required"),
            quiz_id: yup.string().required("quiz_id is required"),
            subCourse_id: yup.string().required("subCourse_id is required"),

            answers: yup.array().of(
                yup.object().shape({
                    question_id: yup.string().required("question_id is required"),
                    selected_option: yup.string().required("selected_option is required"),
                    is_correct: yup.boolean().required("is_correct is required"),
                })
            ).min(1, "At least one answer is required").required(),

            score: yup.number().min(0).required("score is required"),
            isPassed: yup.boolean().required("isPassed is required"),
            timeTaken: yup.number().min(0).required("timeTaken is required")
        });

        await schema.validate(req.body, { abortEarly: false }); // pour collecter toutes les erreurs
        next();
    } catch (err) {
        console.error("Validation error:", err.errors);
        res.status(400).json({ errors: err.errors });
    }
}

module.exports = validateResponseData;
