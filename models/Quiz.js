    const mongoose = require("mongoose");
    const subCourse = require("./subCourse");

    const QuestionSchema = new mongoose.Schema({
      question_id: String,
      text: String,
      options: [String],
      correct: String,
      type: String,
      explanation: String,
    });

    const QuizSchema = new mongoose.Schema({
      title: String,
      subCourseId: String,
      courseId:String,
      difficulty: String,
      totalQuestions: Number,
      timeLimit: Number,
      createdBy: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      questions: [QuestionSchema],
    });



    module.exports = mongoose.model("Quiz", QuizSchema);
