function encodeBMP(rgbaBuffer, width, height) {
    const imageSize = width * height * 4;
    const fileSize = 54 + imageSize;
    const header = Buffer.alloc(54);

    header.write('BM', 0, 'ascii');
    header.writeUInt32LE(fileSize, 2);
    header.writeUInt32LE(54, 10);

    header.writeUInt32LE(40, 14);
    header.writeInt32LE(width, 18);
    header.writeInt32LE(height, 22);
    header.writeUInt16LE(1, 26);
    header.writeUInt16LE(32, 28);
    header.writeUInt32LE(0, 30);
    header.writeUInt32LE(imageSize, 34);
    header.writeInt32LE(2835, 38);
    header.writeInt32LE(2835, 42);
    header.writeUInt32LE(0, 46);
    header.writeUInt32LE(0, 50);

    const pixelData = Buffer.alloc(imageSize);
    for (let y = 0; y < height; y++) {
        const srcRow = y * width * 4;
        const dstRow = (height - 1 - y) * width * 4;
        for (let x = 0; x < width; x++) {
            const s = srcRow + x * 4;
            const d = dstRow + x * 4;
            pixelData[d] = rgbaBuffer[s + 2];
            pixelData[d + 1] = rgbaBuffer[s + 1];
            pixelData[d + 2] = rgbaBuffer[s];
            pixelData[d + 3] = rgbaBuffer[s + 3];
        }
    }

    return Buffer.concat([header, pixelData]);
}

module.exports = { encodeBMP };
