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

    const result = answers.map((answer) => {
      // this splits the serialized answer 'cause the answer is comming in this way questionId-answer
      const { questionId, selectedAnswer } = answerInterprete(answer);
      const userAnswer = sanitizeAnswer(selectedAnswer);

      // find the cuestion
      const question = foundQuestions.find((item) => {
        return item._id.toString() === questionId;
      });
      const rightAnswer = question.answer;

      // compare the answers
      const isCorrect = compareAnswers(rightAnswer, userAnswer);

      return { questionId, rightAnswer, userAnswer, isCorrect };
    });

    const newTestResult = new TestResult({
      userId: userId,
      testId: test._id,
      result: result,
      category: test.category,
      complexity: test.complexity,
    });

    await newTestResult.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const sanitizeAnswer = (answer) => {
  let sanitizedAnswer = answer.trim();

  if (sanitizedAnswer.endsWith(".")) {
    sanitizedAnswer = sanitizedAnswer.slice(0, -1);
  }

  return sanitizedAnswer;
};

const answerInterprete = (answer) => {
  const res = answer.split("-");
  return { questionId: res[0], selectedAnswer: res[1] };
};

const compareAnswers = (questionAnswer, userAnswer) => {
  const sanitizedQuestionAnswer = sanitizeAnswer(questionAnswer);
  const sanitizedUserAnswer = sanitizeAnswer(userAnswer);

  return sanitizedQuestionAnswer === sanitizedUserAnswer;
};

module.exports = { createTestResult };
