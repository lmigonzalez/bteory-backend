const router = require('express').Router();

const { createTestResult } = require('../controllers/testResultController');

router.post('/create-test-result', createTestResult);

module.exports = router;
