const Question = require('../models/questionModel');

const {
  saveSingleImage,
  getQuestionImage,
  saveQuestionImages,
} = require('../fileUpload/awsS3');

const uploadImg = async (req, res) => {
  const file = req.file;

  try {
    const fileName = await saveSingleImage(file);
    console.log(fileName);
    res.status(201).json(fileName);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const createQuestion = async (req, res) => {
  const questionData = req.body;

  const { question, options, answer, category, subject, complexity } =
    questionData;

  const files = req.files;

  try {
    let fileData = [];
    if (files !== undefined) {
      const filesArray = await saveQuestionImages(files);
      fileData = filesArray;
    }
    // console.log(fileData);
    const explanationKeys = Object.keys(req.body)
      .filter((key) => key.startsWith('explanation'))
      .map((key) => {
        const order = parseInt(key.split('-')[1]);
        return { explanation: req.body[key], order };
      });

    // console.log(explanationKeys);

    const mergedArray = [];
    let currentIndex = 0;

    explanationKeys.forEach((explanation) => {
      const { order } = explanation;

      while (currentIndex < order) {
        mergedArray.push({
          image: fileData[currentIndex],
          order: currentIndex,
          type: 'image',
        });
        currentIndex++;
      }

      mergedArray.push({
        explanation: explanation.explanation,
        order,
        type: 'text',
      });
      currentIndex++;
    });

    while (currentIndex < fileData.length) {
      mergedArray.push({
        image: fileData[currentIndex],
        order: currentIndex,
        type: 'image',
      });
      currentIndex++;
    }

    console.log(mergedArray);

    const newQuestion = new Question({
      question,
      questionImg: fileData[0],
      options,
      answer,
      explanation: mergedArray,
      category,
      subject,
      complexity,
    });

    const result = await newQuestion.save();
    console.log(result);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    const result = await getQuestionImage(questions);
    // console.log(result);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { uploadImg, createQuestion, getQuestions };
