const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/product')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, ctrl.getProducts);
router.get('/all', auth, ctrl.getAllProducts);
router.get('/:id', auth, ctrl.getOneProduct);
router.post('/', auth, multer, ctrl.createProduct);
router.put('/:id', auth, multer, ctrl.modifyProduct);  
router.delete('/:id', auth, ctrl.deleteProduct);
router.post('/:id/like', auth, ctrl.likeProduct);

module.exports = router;