const router = require('express').Router();

const { superAdmin, userExists } = require('../middlewares/authMiddleware');

const { getUser, getAllUsers } = require('../controllers/userController');

router.get('/get-user', getUser);

router.get('/get-all-users', userExists, getAllUsers);

module.exports = router;
