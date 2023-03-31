const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAllUsers);
router.get('/:id', auth, ctrl.getOneUser);

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);

module.exports = router;