const fs = require('fs');
const path = require('path');
const data = require('../data.js');

const UPLOADS_DIR = path.join(__dirname, '..', 'data', 'uploads');

async function upload(readStream, fileName, mimetype, userId, folderId, size) {
    const userUploadsDir = path.join(UPLOADS_DIR, String(userId));
    if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true });
    }

    const messageId = Date.now() + Math.floor(Math.random() * 1000);
    const finalFilePath = path.join(userUploadsDir, String(messageId));
    
    // 使用 pipe 进行流式写入
    const writeStream = fs.createWriteStream(finalFilePath);
    
    await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        readStream.on('error', reject);
    });

    const dbResult = await data.addFile({
        message_id: messageId,
        fileName,
        mimetype,
        size,
        file_id: finalFilePath,
        date: Date.now(),
    }, folderId, userId, 'local');

    return { success: true, message: '文件已上传至本地。', fileId: dbResult.fileId };
}

async function remove(files, userId) {
    for (const file of files) {
        try {
            if (file.file_id && fs.existsSync(file.file_id)) {
                fs.unlinkSync(file.file_id);
            }
        } catch (error) {
            console.warn(`删除本地文件失败: ${file.file_id}`, error.message);
        }
    }
    await data.deleteFilesByIds(files.map(f => f.message_id), userId);
    return { success: true };
}

async function stream(file_id, userId) {
    return fs.createReadStream(file_id);
}

// 本地存储模式下，getUrl 没有实际意义，但保留接口统一性
async function getUrl(file_id, userId) {
    return null; 
}


module.exports = { upload, remove, stream, getUrl, type: 'local' };
