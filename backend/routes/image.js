const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const { encodeBMP } = require('../lib/bmp');
const { removeBackground } = require('../lib/bgRemove');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

const MIME = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
};

const SHARP_FORMAT = {
    png: 'png',
    jpeg: 'jpeg',
    jpg: 'jpeg',
    webp: 'webp',
    gif: 'gif',
    tiff: 'tiff',
    bmp: 'bmp',
};

const DPI = 300;

function sendData(res, buffer, mime, fileName) {
    res.json({
        success: true,
        mime,
        fileName,
        size: buffer.length,
        dataUrl: `data:${mime};base64,${buffer.toString('base64')}`,
    });
}

function clamp(value, min, max, fallback) {
    const num = parseFloat(value);
    if (isNaN(num)) return fallback;
    return Math.min(max, Math.max(min, num));
}

function unitToPx(value, unit, originalDim) {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) return null;
    switch (unit) {
        case '%':
            return Math.round(originalDim * v / 100);
        case 'cm':
            return Math.round((v / 2.54) * DPI);
        case 'inch':
            return Math.round(v * DPI);
        default:
            return Math.round(v);
    }
}

async function outputImage(buffer, format, quality) {
    if (format === 'bmp') {
        const { data, info } = await sharp(buffer)
            .rotate()
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        return {
            buffer: encodeBMP(data, info.width, info.height),
            mime: 'image/bmp',
        };
    }

    const q = parseInt(quality, 10) || 90;
    let instance = sharp(buffer).rotate();
    if (format === 'jpeg') instance = instance.jpeg({ quality: q, chromaSubsampling: '4:4:4' });
    else if (format === 'webp') instance = instance.webp({ quality: q });
    else if (format === 'png') instance = instance.png({ compressionLevel: 6 });
    else if (format === 'gif') instance = instance.gif();

    const out = await instance.toBuffer();
    return { buffer: out, mime: MIME[format] };
}

router.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        let format = String(req.body.format || 'jpeg').toLowerCase().replace('image/', '');
        if (!MIME[format]) return res.status(400).json({ error: `Unsupported target format: ${format}` });

        const result = await outputImage(req.file.buffer, format, req.body.quality);
        const baseName = req.file.originalname.replace(/\.[^.]+$/, '') || 'converted';
        sendData(res, result.buffer, result.mime, `${baseName}.${format}`);
    } catch (error) {
        console.error('convert error:', error);
        res.status(500).json({ error: 'Failed to convert image' });
    }
});

router.post('/resize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const metadata = await sharp(req.file.buffer).metadata();
        const unit = req.body.unit || 'px';
        const lockAspect = req.body.lockAspect === 'true' || req.body.lockAspect === true;

        let width = unitToPx(req.body.width, unit, metadata.width);
        let height = unitToPx(req.body.height, unit, metadata.height);

        if (!width && !height) return res.status(400).json({ error: 'Provide at least one dimension' });

        let resizeOpts = {};
        if (width && height) {
            if (lockAspect) {
                const target = Math.min(width / metadata.width, height / metadata.height);
                width = Math.round(metadata.width * target);
                height = Math.round(metadata.height * target);
            }
            resizeOpts = { width, height, fit: 'fill' };
        } else if (width) {
            resizeOpts = { width, fit: 'inside' };
        } else {
            resizeOpts = { height, fit: 'inside' };
        }

        const quality = clamp(req.body.quality, 1, 100, 90);
        const format = SHARP_FORMAT[metadata.format] || 'jpeg';
        const pipeline = sharp(req.file.buffer).rotate().resize(resizeOpts);

        let buffer;
        if (format === 'jpeg') buffer = await pipeline.jpeg({ quality, chromaSubsampling: '4:4:4' }).toBuffer();
        else if (format === 'webp') buffer = await pipeline.webp({ quality }).toBuffer();
        else buffer = await pipeline.toBuffer();

        const outMeta = await sharp(buffer).metadata();
        const baseName = req.file.originalname.replace(/\.[^.]+$/, '') || 'resized';
        sendData(res, buffer, MIME[format] || `image/${format}`, `${baseName}-${outMeta.width}x${outMeta.height}.${format}`);
    } catch (error) {
        console.error('resize error:', error);
        res.status(500).json({ error: 'Failed to resize image' });
    }
});

router.post('/edit', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const brightness = clamp(req.body.brightness, 0, 300, 100) / 100;
        const contrast = clamp(req.body.contrast, 0, 300, 100) / 100;
        const saturation = clamp(req.body.saturation, 0, 300, 100) / 100;
        const grayscale = clamp(req.body.grayscale, 0, 100, 0);
        const sepia = clamp(req.body.sepia, 0, 100, 0);
        const rotation = parseFloat(req.body.rotation) || 0;

        let pipeline = sharp(req.file.buffer).rotate().modulate({
            brightness,
            saturation,
        });

        if (contrast !== 1) {
            pipeline = pipeline.linear(contrast, 128 * (1 - contrast));
        }
        if (grayscale > 0) pipeline = pipeline.grayscale();
        if (sepia > 0) {
            const t = sepia / 100;
            pipeline = pipeline.recomb([
                [0.393 * t + (1 - t), 0.769 * t, 0.189 * t],
                [0.349 * t, 0.686 * t + (1 - t), 0.168 * t],
                [0.272 * t, 0.534 * t, 0.131 * t + (1 - t)],
            ]);
        }
        if (rotation % 360 !== 0) pipeline = pipeline.rotate(rotation);

        const metadata = await sharp(req.file.buffer).metadata();
        const format = SHARP_FORMAT[metadata.format] || 'jpeg';
        let buffer;
        if (format === 'jpeg') buffer = await pipeline.jpeg({ quality: 92 }).toBuffer();
        else buffer = await pipeline.toBuffer();

        const baseName = req.file.originalname.replace(/\.[^.]+$/, '') || 'edited';
        sendData(res, buffer, MIME[format] || `image/${format}`, `${baseName}-edited.${format}`);
    } catch (error) {
        console.error('edit error:', error);
        res.status(500).json({ error: 'Failed to edit image' });
    }
});

router.post('/bg-remove', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const tolerance = clamp(req.body.tolerance, 5, 100, 40);
        const buffer = await removeBackground(req.file.buffer, tolerance);
        const baseName = req.file.originalname.replace(/\.[^.]+$/, '') || 'image';
        sendData(res, buffer, 'image/png', `${baseName}-no-bg.png`);
    } catch (error) {
        console.error('bg-remove error:', error);
        res.status(500).json({ error: 'Failed to remove background' });
    }
});

router.post('/gov-resize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const metadata = await sharp(req.file.buffer).metadata();
        const unit = req.body.unit || 'px';
        const maxSizeKB = clamp(req.body.maxSize, 5, 20000, 50);
        const maxBytes = maxSizeKB * 1024;

        let width = unitToPx(req.body.width, unit, metadata.width);
        let height = unitToPx(req.body.height, unit, metadata.height);
        if (!width || !height) return res.status(400).json({ error: 'Provide valid width and height' });

        const format = SHARP_FORMAT[metadata.format] || 'jpeg';
        const mime = MIME[format];

        const encode = (w, h, quality) => {
            let pipeline = sharp(req.file.buffer).rotate().resize({ width: w, height: h, fit: 'fill' });
            if (format === 'jpeg') return pipeline.jpeg({ quality, chromaSubsampling: '4:2:0' }).toBuffer();
            if (format === 'webp') return pipeline.webp({ quality }).toBuffer();
            return pipeline.png({ compressionLevel: 9 }).toBuffer();
        };

        let currentWidth = width;
        let currentHeight = height;
        let result = await encode(currentWidth, currentHeight, 90);

        if (result.length > maxBytes) {
            let low = 10;
            let high = 90;
            let best = null;
            for (let i = 0; i < 8; i++) {
                const q = Math.round((low + high) / 2);
                const candidate = await encode(currentWidth, currentHeight, q);
                if (candidate.length <= maxBytes) {
                    best = candidate;
                    low = q;
                } else {
                    high = q;
                }
            }
            if (best) result = best;
            else {
                let scale = Math.sqrt(maxBytes / result.length);
                let iterations = 0;
                while (result.length > maxBytes && iterations < 8) {
                    scale = Math.max(0.2, Math.sqrt(maxBytes / result.length));
                    currentWidth = Math.round(width * scale);
                    currentHeight = Math.round(height * scale);
                    result = await encode(currentWidth, currentHeight, 10);
                    iterations++;
                }
            }
        }

        const outMeta = await sharp(result).metadata();
        sendData(res, result, mime, `gov-photo-${outMeta.width}x${outMeta.height}.${format}`);
    } catch (error) {
        console.error('gov-resize error:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

module.exports = router;
