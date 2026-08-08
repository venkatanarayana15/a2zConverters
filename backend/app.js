const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');

const imageRoutes = require('./routes/image');
const pdfRoutes = require('./routes/pdf');

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/v1/image', imageRoutes);
app.use('/api/v1/pdf', pdfRoutes);

app.post('/api/v1/png-to-jpg', multer({ storage: multer.memoryStorage() }).single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        const jpgBuffer = await sharp(req.file.buffer).rotate().jpeg({ quality: 90 }).toBuffer();
        res.json({
            success: true,
            message: 'Conversion complete',
            downloadUrl: `data:image/jpeg;base64,${jpgBuffer.toString('base64')}`,
        });
    } catch (error) {
        console.error('png-to-jpg error:', error);
        res.status(500).json({ error: 'Failed to convert image' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Payload too large' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
