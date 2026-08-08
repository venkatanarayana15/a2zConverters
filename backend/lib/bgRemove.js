const sharp = require('sharp');

async function removeBackground(inputBuffer, tolerance = 40) {
    const { data, info } = await sharp(inputBuffer)
        .rotate()
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    const getPixel = (x, y) => {
        const i = (y * width + x) * channels;
        return { r: data[i], g: data[i + 1], b: data[i + 2] };
    };

    const corners = [
        getPixel(0, 0),
        getPixel(width - 1, 0),
        getPixel(0, height - 1),
        getPixel(width - 1, height - 1),
    ];

    const bg = {
        r: Math.round(corners.reduce((s, c) => s + c.r, 0) / corners.length),
        g: Math.round(corners.reduce((s, c) => s + c.g, 0) / corners.length),
        b: Math.round(corners.reduce((s, c) => s + c.b, 0) / corners.length),
    };

    const tol2 = tolerance * tolerance;
    const similar = (r, g, b) => {
        const dr = r - bg.r;
        const dg = g - bg.g;
        const db = b - bg.b;
        return dr * dr + dg * dg + db * db <= tol2;
    };

    const visited = new Uint8Array(width * height);
    const queue = [];

    const push = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const idx = y * width + x;
        if (visited[idx]) return;
        const i = idx * channels;
        if (!similar(data[i], data[i + 1], data[i + 2])) return;
        visited[idx] = 1;
        queue.push(idx);
    };

    for (let x = 0; x < width; x++) {
        push(x, 0);
        push(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
        push(0, y);
        push(width - 1, y);
    }

    while (queue.length) {
        const idx = queue.pop();
        const x = idx % width;
        const y = (idx / width) | 0;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
    }

    for (let i = 0; i < width * height; i++) {
        if (visited[i]) data[i * channels + 3] = 0;
    }

    return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

module.exports = { removeBackground };
