const express = require("express");
const router = express.Router();

const QuizController = require('../Controller/quiz')
const verifyToken = require('../Middlewares/VerifyToken')

router.post("/create",verifyToken.verifyToken,QuizController.PostQuiz)
router.get("/userquiz",verifyToken.verifyToken,QuizController.GetQuizByUserId)
router.get("/:id",QuizController.GetQuiz)
router.get("/correctquizans/:quizid/:questionindex/:optionindex",QuizController.isCorrectQuizAns)
router.delete("/delete/:id",QuizController.DeleteQuizById)
router.put("/update",QuizController.UpdateQuiz)

module.exports = router;