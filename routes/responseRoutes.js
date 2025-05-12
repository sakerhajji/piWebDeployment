const express = require("express");
const router = express.Router();
const { createResponse, getAllResponses, getResponseById, deleteResponse,getResponseByUserId,getResponseByQuizId ,getResponseBySubCourseId,getResponseByCourseId} = require("../controller/responseController");

// Routes
router.post("/", createResponse); // Create a new response
router.get("/", getAllResponses); // Get all responses
router.get("/:id", getResponseById); // Get a response by ID
router.get("/user/:userid", getResponseByUserId); // Get responses by user ID
router.get("/quiz/:quizid", getResponseByQuizId); // Get responses by quiz ID
router.get("/subCourse/:subCourseid", getResponseBySubCourseId); // Get responses by sub-course ID
router.get("/course/:courseId", getResponseByCourseId); // Get responses by course ID
router.delete("/:id", deleteResponse); // Delete a response by ID

module.exports = router;