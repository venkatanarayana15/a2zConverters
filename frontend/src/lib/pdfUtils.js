import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let pdfjsReady = false;

export const initPdfJs = () => {
    if (!pdfjsReady) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        pdfjsReady = true;
    }
    return pdfjsLib;
};

export const readFileAsArrayBuffer = (file) => file.arrayBuffer();

export const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadDataUrl = (dataUrl, filename) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

export const stripExtension = (name) => name.replace(/\.[^.]+$/, '');

export const loadPdfDoc = async (data, password) => {
    initPdfJs();
    const task = pdfjsLib.getDocument({ data, password: password || undefined });
    return task.promise;
};

export const renderPdfPageToCanvas = async (pdf, pageNumber, scale = 2) => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    return { canvas, page };
};

export const extractPageTextLines = async (pdf, pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const items = content.items
        .filter((item) => item.str && item.str.trim())
        .map((item) => ({
            text: item.str,
            x: item.transform[4],
            y: item.transform[5],
        }))
        .sort((a, b) => b.y - a.y);

    const lines = [];
    let currentLine = null;
    const yTolerance = 3;

    for (const item of items) {
        if (currentLine && Math.abs(item.y - currentLine.y) <= yTolerance) {
            currentLine.parts.push(item);
        } else {
            if (currentLine) lines.push(currentLine.parts);
            currentLine = { y: item.y, parts: [item] };
        }
    }
    if (currentLine) lines.push(currentLine.parts);

    return lines
        .map((parts) => parts.sort((a, b) => a.x - b.x).map((p) => p.text).join(' '))
        .filter((line) => line.trim());
};
