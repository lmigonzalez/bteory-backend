const router = require('express').Router();

const {
  createNewAdmin,
  getAdmins,
  deleteAdmin,
  patchAdmin,
} = require('../controllers/adminController');

router.post('/create-admin', createNewAdmin);
router.get('/get-admins', getAdmins);
router.delete('/delete-admin/:_id', deleteAdmin);
router.patch('/patch-admin/:_id', patchAdmin);

module.exports = router;
