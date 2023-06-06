const TestResult = require('../models/testResultModel');
const Test = require('../models/customTestModel');
const Questions = require('../models/questionModel');

const createTestResult = async (req, res) => {
  const { testId, answers } = req.body;
  const userId = '1234567890';

  try {
    const test = await Test.findById(testId);
    const testQuestionIdArray = test.questionsId;
    const foundQuestions = await Questions.find({
      _id: { $in: testQuestionIdArray },
    });

    const result = foundQuestions.map((question, index) => {
      const questionId = question._id.toString();
      const questionAnswer = question.answer;
      const userAnswer = answers[index];
      const isCorrect = questionAnswer === userAnswer;
      return { questionId, questionAnswer, userAnswer, isCorrect };
    });

    const newTestResult = new TestResult({
      userId: userId,
      testId: test._id,
      result: result,
      category: test.category,
      complexity: test.complexity,
    });

    await newTestResult.save();
    // console.log(newTestResult);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

module.exports = { createTestResult };
