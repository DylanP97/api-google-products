const express = require('express');
const router = express.Router();
const multer = require('multer');

const ctrl = require('../controllers/product')
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/', auth, upload.single('imageUrl'), ctrl.createProduct);
router.put('/:id', auth, upload.single('imageUrl'), ctrl.modifyProduct);  
router.get('/', auth, ctrl.getProducts);
router.get('/all', auth, ctrl.getAllProducts);
router.get('/:id', auth, ctrl.getOneProduct);
router.delete('/:id', auth, ctrl.deleteProduct);
router.post('/:id/like', auth, ctrl.likeProduct);

module.exports = router;