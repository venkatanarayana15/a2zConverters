const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const sharp = require('sharp');

const packageDef = protoLoader.loadSync("image.proto", {});
const imageProto = grpc.loadPackageDefinition(packageDef).converter;

async function convertImage(call, callback) {
    try {
        const { image_data, target_format, quality } = call.request;
        
        // Process raw buffer directly
        const buffer = await sharp(image_data)
            .toFormat(target_format, { quality: quality || 90 })
            .toBuffer();

        callback(null, { 
            converted_data: buffer, 
            file_name: `converted-${Date.now()}.${target_format}`,
            size_kb: (buffer.length / 1024).toFixed(2)
        });
    } catch (err) {
        callback({ code: grpc.status.INTERNAL, message: err.message });
    }
}

const server = new grpc.Server();
server.addService(imageProto.ImageProcessor.service, { convertImage });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log("🚀 gRPC Worker running on port 50051");
    server.start();
});