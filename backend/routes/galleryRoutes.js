const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImages, getAllImages, deleteImage } = require('../controllers/galleryController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.array('images'), uploadImages);
router.get('/', getAllImages);
router.delete('/:id', deleteImage);

module.exports = router;
