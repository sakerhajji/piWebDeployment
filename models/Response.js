const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  question_id: String,
  selected_option: String,
  is_correct: Boolean,
});

const ResponseSchema = new mongoose.Schema({
  user_id: String,
  quiz_id: String,
  subCourse_id: String,
  course_id: String, // ✅ ajouté ici
  answers: [AnswerSchema],
  score: Number,
  isPassed: Boolean,
  timeTaken: Number,
  dateAttempted: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model("Response", ResponseSchema);
