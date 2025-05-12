const yup = require("yup");

// Validation pour Forum
async function validateForum(req, res, next) {
    try {
        const Schema = yup.object().shape({
            title: yup.string(),
            description: yup.string(),
            categorie: yup.string(),
            image: yup.string().url(),
            user: yup.string(), 
            commentCount: yup.number().default(0),
            likeCount: yup.number().default(0),
            reported: yup.boolean().default(false),
        });
        await Schema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}

// Validation pour Comment
async function validateComment(req, res, next) {
    try {
        const Schema = yup.object().shape({
            content: yup.string().required(),
        });
        await Schema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}

module.exports = {  validateForum, validateComment };
