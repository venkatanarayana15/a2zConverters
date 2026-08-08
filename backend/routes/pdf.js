const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { PDFDocument, StandardFonts, degrees, rgb } = require('pdf-lib');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

function sendData(res, buffer, mime, fileName) {
    res.json({
        success: true,
        mime,
        fileName,
        size: buffer.length,
        dataUrl: `data:${mime};base64,${buffer.toString('base64')}`,
    });
}

async function officeToPdf(inputBuffer, ext) {
    const soffice = process.env.SOFFICE_BIN || 'soffice';
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'office-conv-'));
    const inPath = path.join(dir, `document${ext}`);
    const outPdf = path.join(dir, 'document.pdf');
    fs.writeFileSync(inPath, inputBuffer);

    try {
        await new Promise((resolve, reject) => {
            const proc = spawn(soffice, ['--headless', '--norestore', '--convert-to', 'pdf', '--outdir', dir, inPath]);
            let errOutput = '';
            proc.stderr.on('data', (d) => (errOutput += d));
            proc.on('error', reject);
            const timer = setTimeout(() => {
                proc.kill('SIGKILL');
                reject(new Error('Conversion timed out'));
            }, 120000);
            proc.on('close', (code) => {
                clearTimeout(timer);
                if (code === 0) resolve();
                else reject(new Error(`LibreOffice exited with code ${code}: ${errOutput.trim()}`));
            });
        });

        if (!fs.existsSync(outPdf)) throw new Error('LibreOffice did not produce a PDF output');
        return fs.readFileSync(outPdf);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

async function imagesToPdf(fileList) {
    const pdf = await PDFDocument.create();
    for (const file of fileList) {
        let buffer = file.buffer;
        const mime = file.mimetype || '';

        let image;
        if (mime === 'image/png' || file.originalname.toLowerCase().endsWith('.png')) {
            image = await pdf.embedPng(buffer);
        } else {
            const jpeg = await sharp(buffer).rotate().jpeg().toBuffer();
            image = await pdf.embedJpg(jpeg);
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    return Buffer.from(await pdf.save());
}

async function subsetPdf(srcBuffer, pageIndexes) {
    const src = await PDFDocument.load(srcBuffer);
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, pageIndexes);
    pages.forEach((p) => out.addPage(p));
    return Buffer.from(await out.save());
}

function parsePages(str, max) {
    const parts = String(str || '').split(/[, ]+/);
    const nums = new Set();
    for (const part of parts) {
        const n = parseInt(part, 10);
        if (isNaN(n) || n < 1 || n > max) return null;
        nums.add(n);
    }
    return nums.size ? [...nums].sort((a, b) => a - b) : null;
}

function parseRanges(str, max) {
    const ranges = [];
    const parts = String(str || '').split(',');
    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const m = trimmed.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
        if (!m) return null;
        const a = parseInt(m[1], 10);
        const b = m[2] ? parseInt(m[2], 10) : a;
        if (a < 1 || b > max || a > b) return null;
        ranges.push([a, b]);
    }
    return ranges.length ? ranges : null;
}

function sendFiles(res, files) {
    res.json({ success: true, count: files.length, files });
}

function runCmd(cmd, args, opts = {}) {
    const timeoutMs = opts.timeout || 120000;
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { cwd: opts.cwd, env: opts.env });
        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', (d) => (stdout += d));
        proc.stderr.on('data', (d) => (stderr += d));
        proc.on('error', reject);
        const timer = setTimeout(() => {
            proc.kill('SIGKILL');
            reject(new Error('Command timed out'));
        }, timeoutMs);
        proc.on('close', (code) => {
            clearTimeout(timer);
            if (code === 0) resolve({ stdout, stderr });
            else reject(new Error(`Command failed (${code}): ${stderr.trim() || stdout.trim()}`));
        });
    });
}

const PDFA_DEF_PS = path.join(__dirname, '..', 'lib', 'PDFA_def.ps');
const PDFA_ICC_PROFILE = '/usr/share/color/icc/ghostscript/srgb.icc';

router.post('/jpg-to-pdf', upload.array('images', 20), async (req, res) => {
    try {
        const files = req.files || [];
        if (files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

        const pdfBytes = await imagesToPdf(files);
        sendData(res, pdfBytes, 'application/pdf', 'images.pdf');
    } catch (error) {
        console.error('jpg-to-pdf error:', error);
        res.status(500).json({ error: 'Failed to create PDF' });
    }
});

router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const ext = path.extname(req.file.originalname).toLowerCase() || '.docx';
        const pdfBuffer = await officeToPdf(req.file.buffer, ext);
        sendData(res, pdfBuffer, 'application/pdf', req.file.originalname.replace(/\.[^.]+$/, '') + '.pdf');
    } catch (error) {
        console.error('word-to-pdf error:', error);
        res.status(500).json({ error: 'Failed to convert Word document: ' + error.message });
    }
});

router.post('/excel-to-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const ext = path.extname(req.file.originalname).toLowerCase() || '.xlsx';
        const pdfBuffer = await officeToPdf(req.file.buffer, ext);
        sendData(res, pdfBuffer, 'application/pdf', req.file.originalname.replace(/\.[^.]+$/, '') + '.pdf');
    } catch (error) {
        console.error('excel-to-pdf error:', error);
        res.status(500).json({ error: 'Failed to convert Excel document: ' + error.message });
    }
});

router.post('/validate', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const buffer = req.file.buffer;
        const details = [];

        const headerMatch = buffer.slice(0, 1024).toString('latin1').match(/%PDF-\d+(\.\d+)?/);
        if (headerMatch) {
            details.push(`Header check passed (${headerMatch[0]})`);
        } else {
            details.push('Header check failed: missing %PDF magic bytes');
        }

        const hasEOF = /%%EOF\s*$/.test(buffer.toString('latin1'));
        const tailText = buffer.slice(-8192).toString('latin1');
        const hasXrefStream = tailText.includes('/Type /XRef');
        const hasLegacyXref = tailText.includes('xref');
        const hasXref = hasXrefStream || hasLegacyXref;
        const hasTrailer = hasXrefStream || tailText.includes('trailer');
        const hasStartXref = tailText.includes('startxref');

        if (hasXrefStream) details.push('Cross-reference stream found (PDF 1.5+)');
        else if (hasLegacyXref) details.push('Classic cross-reference table found');
        else details.push('Cross-reference table missing');
        if (hasTrailer) details.push('Trailer dictionary found');
        else details.push('Trailer dictionary missing');
        if (hasStartXref) details.push('Cross-reference offset found');
        else details.push('Cross-reference offset missing');
        if (hasEOF) details.push('EOF marker found');
        else details.push('EOF marker missing');

        let pageCount = 0;
        let parseOk = false;
        let parseError = null;
        try {
            const doc = await PDFDocument.load(buffer, { ignoreEncryption: true, throwOnInvalidObject: false });
            pageCount = doc.getPageCount();
            parseOk = pageCount > 0;
            details.push(`Parsed successfully (${pageCount} page${pageCount === 1 ? '' : 's'})`);
        } catch (e) {
            parseError = e.message;
            details.push('Structural parse failed');
        }

        const isValid = Boolean(headerMatch && hasEOF && hasStartXref && hasXref && parseOk);

        res.json({
            success: true,
            isValid,
            message: isValid
                ? 'PDF is valid and structurally sound.'
                : 'PDF appears to be corrupted or malformed.',
            pageCount: parseOk ? pageCount : null,
            parseError: parseError || null,
            details,
        });
    } catch (error) {
        console.error('validate error:', error);
        res.status(500).json({ error: 'Failed to validate PDF' });
    }
});

function getPosition(pos, pageW, pageH, w, h, margin = 40) {
    switch (pos) {
        case 'top-left':
            return { x: margin, y: pageH - h - margin };
        case 'top-right':
            return { x: pageW - w - margin, y: pageH - h - margin };
        case 'bottom-left':
            return { x: margin, y: margin };
        case 'bottom-right':
            return { x: pageW - w - margin, y: margin };
        default:
            return { x: (pageW - w) / 2, y: (pageH - h) / 2 };
    }
}

router.post('/watermark', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const pdfFile = req.files && req.files.file && req.files.file[0];
        if (!pdfFile) return res.status(400).json({ error: 'No PDF uploaded' });

        const type = req.body.type === 'image' ? 'image' : 'text';
        const opacity = Math.min(100, Math.max(0, parseFloat(req.body.opacity) || 50)) / 100;
        const position = req.body.position || 'center';
        const margin = 40;

        const pdf = await PDFDocument.load(pdfFile.buffer);
        const pages = pdf.getPages();

        if (type === 'text') {
            const text = String(req.body.text || 'CONFIDENTIAL').trim() || 'CONFIDENTIAL';
            const font = await pdf.embedFont(StandardFonts.HelveticaBold);
            const color = rgb(0.55, 0.55, 0.55);

            for (const page of pages) {
                const pageW = page.getWidth();
                const pageH = page.getHeight();
                let size = Math.round(pageW * 0.07);
                let textWidth = font.widthOfTextAtSize(text, size);
                if (textWidth > pageW * 0.7) {
                    size = Math.round(size * (pageW * 0.7) / textWidth);
                    textWidth = font.widthOfTextAtSize(text, size);
                }
                const textHeight = size;
                const rot = degrees(-45);
                const rad = Math.abs(45 * Math.PI / 180);
                const bboxW = textWidth * Math.cos(rad) + textHeight * Math.sin(rad);
                const bboxH = textWidth * Math.sin(rad) + textHeight * Math.cos(rad);
                const pos = getPosition(position, pageW, pageH, bboxW, bboxH, margin);

                page.drawText(text, {
                    x: pos.x,
                    y: pos.y,
                    size,
                    font,
                    color,
                    opacity,
                    rotate: rot,
                });
            }
        } else {
            const imageFile = req.files && req.files.image && req.files.image[0];
            if (!imageFile) return res.status(400).json({ error: 'No watermark image uploaded' });

            const pngBuffer = await sharp(imageFile.buffer).resize({ width: 300, height: 300, fit: 'inside' }).png().toBuffer();
            const wmImage = await pdf.embedPng(pngBuffer);

            for (const page of pages) {
                const pageW = page.getWidth();
                const pageH = page.getHeight();
                const drawW = Math.min(wmImage.width, pageW * 0.3);
                const drawH = drawW * (wmImage.height / wmImage.width);
                const pos = getPosition(position, pageW, pageH, drawW, drawH, margin);

                page.drawImage(wmImage, {
                    x: pos.x,
                    y: pos.y,
                    width: drawW,
                    height: drawH,
                    opacity,
                    rotate: degrees(-45),
                });
            }
        }

        const pdfBytes = await pdf.save();
        sendData(res, Buffer.from(pdfBytes), 'application/pdf', pdfFile.originalname.replace(/\.pdf$/i, '') + '-watermarked.pdf');
    } catch (error) {
        console.error('watermark error:', error);
        res.status(500).json({ error: 'Failed to add watermark: ' + error.message });
    }
});

router.post('/sign', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'signatureFile', maxCount: 1 }]), async (req, res) => {
    try {
        const pdfFile = req.files && req.files.file && req.files.file[0];
        if (!pdfFile) return res.status(400).json({ error: 'No PDF uploaded' });

        let sigBuffer = null;
        if (req.body.signature && typeof req.body.signature === 'string') {
            const match = req.body.signature.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
            if (match) sigBuffer = Buffer.from(match[2], 'base64');
        }
        if (!sigBuffer && req.files && req.files.signatureFile && req.files.signatureFile[0]) {
            sigBuffer = req.files.signatureFile[0].buffer;
        }
        if (!sigBuffer) return res.status(400).json({ error: 'No signature provided' });

        const pngBuffer = await sharp(sigBuffer).trim().png().toBuffer();
        const pdf = await PDFDocument.load(pdfFile.buffer);
        const sig = await pdf.embedPng(pngBuffer);

        const pageIndex = Math.min(parseInt(req.body.page, 10) - 1 || 0, pdf.getPageCount() - 1);
        const page = pdf.getPage(pageIndex);
        const pageW = page.getWidth();
        const pageH = page.getHeight();

        let x = parseFloat(req.body.x);
        let y = parseFloat(req.body.y);
        const scale = parseFloat(req.body.scale) || 0.5;
        const drawW = sig.width * scale;
        const drawH = sig.height * scale;

        if (isNaN(x) || isNaN(y)) {
            x = (pageW - drawW) / 2;
            y = (pageH - drawH) / 2;
        }

        page.drawImage(sig, { x, y, width: drawW, height: drawH });

        const pdfBytes = await pdf.save();
        sendData(res, Buffer.from(pdfBytes), 'application/pdf', pdfFile.originalname.replace(/\.pdf$/i, '') + '-signed.pdf');
    } catch (error) {
        console.error('sign error:', error);
        res.status(500).json({ error: 'Failed to sign PDF: ' + error.message });
    }
});

router.post('/info', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const doc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true, throwOnInvalidObject: false });
        res.json({
            success: true,
            fileName: req.file.originalname,
            size: req.file.size,
            pageCount: doc.getPageCount(),
        });
    } catch (error) {
        console.error('info error:', error);
        res.status(500).json({ error: 'Failed to read PDF' });
    }
});

router.post('/merge', upload.array('files', 20), async (req, res) => {
    try {
        const files = (req.files || []).filter((f) => /\.pdf$/i.test(f.originalname) || f.mimetype === 'application/pdf');
        if (files.length === 0) return res.status(400).json({ error: 'No PDF files uploaded' });

        const out = await PDFDocument.create();
        for (const file of files) {
            const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
            const pages = await out.copyPages(src, src.getPageIndices());
            pages.forEach((p) => out.addPage(p));
        }
        const pdfBytes = await out.save();
        sendData(res, Buffer.from(pdfBytes), 'application/pdf', 'merged.pdf');
    } catch (error) {
        console.error('merge error:', error);
        res.status(500).json({ error: 'Failed to merge PDFs: ' + error.message });
    }
});

router.post('/split', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const src = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
        const total = src.getPageCount();
        const mode = req.body.mode === 'ranges' ? 'ranges' : 'all';

        let groups = [];
        if (mode === 'all') {
            for (let i = 1; i <= total; i++) groups.push([[i, i], `page-${i}`]);
        } else {
            const ranges = parseRanges(req.body.ranges, total);
            if (!ranges) return res.status(400).json({ error: `Invalid ranges. Pages must be within 1-${total}` });
            groups = ranges.map(([a, b], idx) => {
                const label = a === b ? `${a}` : `${a}-${b}`;
                return [[a, b], `split-${idx + 1}-pages-${label}`];
            });
        }

        const results = [];
        for (const [[a, b], name] of groups) {
            const indexes = [];
            for (let i = a - 1; i < b; i++) indexes.push(i);
            const buf = await subsetPdf(req.file.buffer, indexes);
            results.push({
                fileName: `${name}.pdf`,
                size: buf.length,
                dataUrl: `data:application/pdf;base64,${buf.toString('base64')}`,
            });
        }

        sendFiles(res, results);
    } catch (error) {
        console.error('split error:', error);
        res.status(500).json({ error: 'Failed to split PDF: ' + error.message });
    }
});

router.post('/remove-pages', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const src = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
        const total = src.getPageCount();
        const remove = parsePages(req.body.pages, total);
        if (!remove) return res.status(400).json({ error: `Invalid page numbers. Pages must be within 1-${total}` });

        const removeSet = new Set(remove.map((p) => p - 1));
        const keep = [];
        for (let i = 0; i < total; i++) if (!removeSet.has(i)) keep.push(i);
        if (keep.length === 0) return res.status(400).json({ error: 'Cannot remove all pages' });

        const buf = await subsetPdf(req.file.buffer, keep);
        const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
        sendData(res, buf, 'application/pdf', `${base}-reduced.pdf`);
    } catch (error) {
        console.error('remove-pages error:', error);
        res.status(500).json({ error: 'Failed to remove pages: ' + error.message });
    }
});

router.post('/extract-pages', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const src = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
        const total = src.getPageCount();
        const pages = parsePages(req.body.pages, total);
        if (!pages || pages.length === 0) {
            return res.status(400).json({ error: `Provide page numbers to extract (1-${total})` });
        }

        const indexes = pages.map((p) => p - 1);
        const buf = await subsetPdf(req.file.buffer, indexes);
        const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
        sendData(res, buf, 'application/pdf', `${base}-extracted.pdf`);
    } catch (error) {
        console.error('extract-pages error:', error);
        res.status(500).json({ error: 'Failed to extract pages: ' + error.message });
    }
});

router.post('/organize', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const src = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
        const total = src.getPageCount();
        const order = parsePages(req.body.order, total);
        if (!order || order.length !== total) {
            return res.status(400).json({ error: `Order must contain exactly ${total} page number(s), each 1-${total}` });
        }
        if (new Set(order).size !== total) {
            return res.status(400).json({ error: 'Order contains duplicate or missing pages' });
        }

        const buf = await subsetPdf(req.file.buffer, order.map((p) => p - 1));
        const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
        sendData(res, buf, 'application/pdf', `${base}-organized.pdf`);
    } catch (error) {
        console.error('organize error:', error);
        res.status(500).json({ error: 'Failed to organize PDF: ' + error.message });
    }
});

router.post('/scan-to-pdf', upload.array('images', 30), async (req, res) => {
    try {
        const files = req.files || [];
        if (files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

        const pdfBytes = await imagesToPdf(files);
        sendData(res, pdfBytes, 'application/pdf', 'scan.pdf');
    } catch (error) {
        console.error('scan-to-pdf error:', error);
        res.status(500).json({ error: 'Failed to create PDF: ' + error.message });
    }
});

router.post('/pdf-to-jpg', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdftojpg-'));
        try {
            const inPath = path.join(dir, 'input.pdf');
            const prefix = path.join(dir, 'page');
            fs.writeFileSync(inPath, req.file.buffer);
            await runCmd('pdftoppm', ['-jpeg', '-r', '150', inPath, prefix]);

            const pages = fs.readdirSync(dir)
                .filter((f) => /^page-\d+\.jpg$/.test(f))
                .sort((a, b) => parseInt(a.match(/(\d+)/)[1], 10) - parseInt(b.match(/(\d+)/)[1], 10));
            if (pages.length === 0) throw new Error('No images generated');

            const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
            const files = pages.map((f) => {
                const buf = fs.readFileSync(path.join(dir, f));
                const n = f.match(/(\d+)/)[1];
                return {
                    fileName: `${base}-page-${n}.jpg`,
                    size: buf.length,
                    dataUrl: `data:image/jpeg;base64,${buf.toString('base64')}`,
                };
            });
            sendFiles(res, files);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('pdf-to-jpg error:', error);
        res.status(500).json({ error: 'Failed to convert PDF to JPG: ' + error.message });
    }
});

router.post('/pdf-to-word', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdftoword-'));
        try {
            const inPath = path.join(dir, 'input.pdf');
            const outPath = path.join(dir, 'output.docx');
            fs.writeFileSync(inPath, req.file.buffer);
            const script = `from pdf2docx import Converter\nc = Converter(${JSON.stringify(inPath)})\nc.convert(${JSON.stringify(outPath)})\nc.close()`;
            const scriptPath = path.join(dir, 'convert.py');
            fs.writeFileSync(scriptPath, script);
            await runCmd('python3', [scriptPath], { timeout: 180000 });
            if (!fs.existsSync(outPath)) throw new Error('Conversion produced no output');

            const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
            sendData(res, fs.readFileSync(outPath), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', `${base}.docx`);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('pdf-to-word error:', error);
        res.status(500).json({ error: 'Failed to convert PDF to Word: ' + error.message });
    }
});

router.post('/pdf-to-ppt', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdftoppt-'));
        try {
            const inPath = path.join(dir, 'input.pdf');
            fs.writeFileSync(inPath, req.file.buffer);
            await runCmd(process.env.SOFFICE_BIN || 'soffice', ['--headless', '--norestore', '--convert-to', 'pptx:Impress MS PowerPoint 2007 XML', '--outdir', dir, inPath], { timeout: 180000 });
            const outPath = path.join(dir, 'input.pptx');
            if (!fs.existsSync(outPath)) throw new Error('Conversion produced no output');

            const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
            sendData(res, fs.readFileSync(outPath), 'application/vnd.openxmlformats-officedocument.presentationml.presentation', `${base}.pptx`);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('pdf-to-ppt error:', error);
        res.status(500).json({ error: 'Failed to convert PDF to PowerPoint: ' + error.message });
    }
});

router.post('/pdf-to-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const XLSX = require('xlsx');
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdftoxlsx-'));
        try {
            const inPath = path.join(dir, 'input.pdf');
            fs.writeFileSync(inPath, req.file.buffer);

            const infoRes = await runCmd('pdfinfo', [inPath]);
            const pagesMatch = infoRes.stdout.match(/Pages:\s+(\d+)/);
            const pageCount = pagesMatch ? parseInt(pagesMatch[1], 10) : 0;
            if (!pageCount) throw new Error('Could not determine page count');

            const wb = XLSX.utils.book_new();
            for (let p = 1; p <= pageCount; p++) {
                const { stdout } = await runCmd('pdftotext', ['-f', String(p), '-l', String(p), '-layout', inPath, '-']);
                const rows = stdout.split(/\r?\n/).map((line) =>
                    line.trimEnd() === '' ? [] : line.split(/\s{2,}/).map((c) => c.trim())
                ).filter((row) => row.some((c) => c !== ''));
                const ws = XLSX.utils.aoa_to_sheet(rows);
                XLSX.utils.book_append_sheet(wb, ws, `Page ${p}`);
            }

            const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
            const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
            sendData(res, Buffer.from(buf), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `${base}.xlsx`);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('pdf-to-excel error:', error);
        res.status(500).json({ error: 'Failed to convert PDF to Excel: ' + error.message });
    }
});

router.post('/pdf-to-pdfa', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdftopdfa-'));
        try {
            const inPath = path.join(dir, 'input.pdf');
            const outPath = path.join(dir, 'output.pdf');
            fs.writeFileSync(inPath, req.file.buffer);
            await runCmd('gs', [
                '-dPDFA=1', '-dBATCH', '-dNOPAUSE',
                '-sProcessColorModel=DeviceRGB',
                '-sDEVICE=pdfwrite',
                '-sPDFACompatibilityPolicy=1',
                `--permit-file-read=${PDFA_ICC_PROFILE}`,
                `-sOutputFile=${outPath}`,
                PDFA_DEF_PS,
                inPath,
            ], { timeout: 180000, env: { ...process.env, GS_CACHE_DIR: dir } });
            if (!fs.existsSync(outPath)) throw new Error('Conversion produced no output');

            const base = req.file.originalname.replace(/\.pdf$/i, '') || 'document';
            sendData(res, fs.readFileSync(outPath), 'application/pdf', `${base}-pdfa.pdf`);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('pdf-to-pdfa error:', error);
        res.status(500).json({ error: 'Failed to convert PDF to PDF/A: ' + error.message });
    }
});

module.exports = router;
