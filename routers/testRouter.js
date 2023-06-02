const multer = require('multer');
const router = require('express').Router();

const { createTest } = require('../controllers/testController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-test', upload.array('files', 5), createTest);

module.exports = router;
