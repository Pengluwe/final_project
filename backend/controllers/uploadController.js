// Upload photo handler
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the file path
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(201).json({ imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error uploading file' });
    }
};
