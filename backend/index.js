const sharp = require('sharp');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Keep file in memory

app.post("/api/v1/png-to-jpg", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // Convert PNG Buffer to JPG Buffer
        const jpgBuffer = await sharp(req.file.buffer)
            .jpeg({ quality: 90 }) 
            .toBuffer();

        // Send back as Base64 so the frontend can display/download it
        const base64Image = jpgBuffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64Image}`;

        res.json({ 
            success: true, 
            message: "Conversion complete", 
            downloadUrl: dataUri 
        });

    } catch (error) {
        console.error("Conversion error:", error);
        res.status(500).json({ error: "Failed to convert image" });
    }
});