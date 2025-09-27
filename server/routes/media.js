const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/videos';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept video files only
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/media/upload-video
// @desc    Upload video file
// @access  Private (Instructor/Admin)
router.post('/upload-video', [auth], upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      videoUrl: videoUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Video upload failed' });
  }
});

// @route   GET /api/media/stream/:filename
// @desc    Stream video file
// @access  Private
router.get('/stream/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, '../uploads/videos', filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Support for video seeking
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Video streaming failed' });
  }
});

// @route   POST /api/media/upload-thumbnail
// @desc    Upload course thumbnail
// @access  Private (Instructor/Admin)
const thumbnailUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'uploads/thumbnails';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/upload-thumbnail', [auth], thumbnailUpload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No thumbnail file uploaded' });
    }

    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      thumbnailUrl: thumbnailUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Thumbnail upload failed' });
  }
});

module.exports = router;