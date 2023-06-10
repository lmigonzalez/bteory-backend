const TestResult = require("../models/testResultModel");
const Test = require("../models/customTestModel");
const Questions = require("../models/questionModel");

const createTestResult = async (req, res) => {
  const { testId, answers } = req.body;
  const userId = "1234567890";

  try {
    const test = await Test.findById(testId);
    const testQuestionIdArray = test.questionsId;
    const foundQuestions = await Questions.find({
      _id: { $in: testQuestionIdArray },
    });

    result = answers.map((item) => {
      const { id, userAnswer } = PrepareAnswer(item);
      const question = foundQuestions.find(
        (question) => question._id.toString() === id
      );
      const isCorrect = userAnswer === question.answer;

      return {
        questionId: question._id,
        questionAnswer: question.answer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
      };
    });

    const newTestResult = new TestResult({
      userId: userId,
      testId: test._id,
      result: result,
      category: test.category,
      complexity: test.complexity,
    });

    console.log(result);

    await newTestResult.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

function PrepareAnswer(answer) {
  return {
    id: answer.split("-")[0],
    userAnswer: answer.slice(answer.indexOf("-") + 1),
  };
}

const sanitizeAnswer = (answer) => {
  let sanitizedAnswer = answer.trim();

  if (sanitizedAnswer.endsWith(".")) {
    sanitizedAnswer = sanitizedAnswer.slice(0, -1);
  }

  return sanitizedAnswer;
};

const compareAnswers = (questionAnswer, userAnswer) => {
  const sanitizedQuestionAnswer = sanitizeAnswer(questionAnswer);
  const sanitizedUserAnswer = sanitizeAnswer(userAnswer);

  return sanitizedQuestionAnswer === sanitizedUserAnswer;
};

module.exports = { createTestResult };
