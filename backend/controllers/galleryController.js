const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Upload Images
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    // Validate files
    for (const file of req.files) {
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ 
          message: `File ${file.originalname} is too large. Maximum size is 5MB` 
        });
      }
      
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return res.status(400).json({ 
          message: `File ${file.originalname} is not a supported image type` 
        });
      }
    }

    const uploadedImages = [];

    let names = req.body.names || [];
    let tags = req.body.tags || [];

    // If names and tags are sent as comma-separated strings, convert to arrays
    if (typeof names === 'string') {
      names = names.split(',').map(n => n.trim());
    }

    if (typeof tags === 'string') {
      tags = tags.split(',').map(t => t.trim());
    }

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'image',
            folder: 'gallery',
            quality: 'auto:good',
            fetch_format: 'auto'
          },
          async (error, result) => {
            if (error) return reject(error);

            try {
              const newImage = new Image({
                url: result.secure_url,
                publicId: result.public_id,
                name: names[index] || 'Unnamed',
                tag: tags[index] || '',
                size: result.bytes,
                format: result.format
              });

              await newImage.save();
              uploadedImages.push(newImage);
              resolve();
            } catch (err) {
              // If database save fails, delete from cloudinary
              await cloudinary.uploader.destroy(result.public_id);
              reject(err);
            }
          }
        ).end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);
    res.status(200).json({ message: 'Images uploaded successfully', images: uploadedImages });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Image upload failed', 
      error: error.message 
    });
  }
};

// Get All Images (optional search)
exports.getAllImages = async (req, res) => {
  try {
    const { name, tag } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (tag) query.tag = { $regex: tag, $options: 'i' };

    const images = await Image.find(query).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};

// Delete Image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await image.deleteOne();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
};
