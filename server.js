const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Ensure the 'uploads' folder exists
const uploadsFolder = 'uploads';
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder); // Create the 'uploads' folder if it doesn't exist
}

// Set up Multer storage engine (using local storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolder); // Files will be saved in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
    }
});

// Initialize Multer
const upload = multer({ storage: storage });

// Serve static files (e.g., front-end HTML, CSS, JS)
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, fileUrls });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsFolder));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
