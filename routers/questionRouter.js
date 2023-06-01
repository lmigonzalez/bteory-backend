const multer = require('multer');
const router = require('express').Router();

const {
  createQuestion,
  uploadImg,
  getQuestions,
} = require('../controllers/questionController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// console.log(upload);

router.get('/get-all-question', getQuestions);

router.post('/file', upload.single('file'), uploadImg);

router.post('/create-question', upload.array('files', 5), createQuestion);

module.exports = router;
