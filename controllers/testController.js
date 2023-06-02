const Test = require('../models/customTestModel');
const Question = require('../models/questionModel');
const { saveTestImages, getTestImages } = require('../fileUpload/awsS3');

const createTest = async (req, res) => {
  const testData = req.body;
  console.log(testData);
  const { name, category, complexity, questions } = testData;
  const files = req.files;

  try {
    let fileData = [];
    if (files !== undefined) {
      const filesArray = await saveTestImages(files);
      fileData = filesArray;
    }

    const explanationKeys = Object.keys(req.body)
      .filter((key) => key.startsWith('explanation'))
      .map((key) => {
        const order = parseInt(key.split('-')[1]);
        return { explanation: req.body[key], order };
      });

    const mergedArray = [];

    let currentIndex = 0;
    let explanationIndex = 0;

    while (
      currentIndex < fileData.length ||
      explanationIndex < explanationKeys.length
    ) {
      if (explanationIndex < explanationKeys.length) {
        const explanation = explanationKeys[explanationIndex];
        const { order } = explanation;

        if (currentIndex === order) {
          mergedArray.push({
            explanation: explanation.explanation,
            order: mergedArray.length, // Set the order based on the length of mergedArray
            type: 'text',
          });
          explanationIndex++;
          continue;
        }
      }

      mergedArray.push({
        image: fileData[currentIndex],
        order: mergedArray.length, // Set the order based on the length of mergedArray
        type: 'image',
      });
      currentIndex++;
    }

    const newTest = new Test({
      testName: name,
      explanation: mergedArray,
      questionsId: questions,
      category: category,
      complexity: complexity,
    });

    const result = await newTest.save();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(400).json(err);
  }
};

const getAllTest = async (req, res) => {
  try {
    const tests = await Test.find({}, '_id testName category');
    res.status(200).json(tests);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const getTestById = async (req, res) => {
  const testId = req.params.id;
  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    const questionsArray = test.questionsId;
    const questions = await Question.find({ _id: { $in: questionsArray } });

    const newTest = await getTestImages(test);

    if (questions.length > 0) {
      newTest.questions = questions;
    }

    res.json(newTest);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = { createTest, getAllTest, getTestById };
