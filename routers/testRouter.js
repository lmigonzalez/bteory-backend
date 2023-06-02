const multer = require('multer');
const router = require('express').Router();

const {
  createTest,
  getAllTest,
  getTestById,
} = require('../controllers/testController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/get-all-test', getAllTest);

router.get('/get-test/:id', getTestById);

router.post('/create-test', upload.array('files', 5), createTest);

module.exports = router;
