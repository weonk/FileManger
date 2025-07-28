const { createClient } = require('webdav');
const data = require('../data.js');
const db = require('../database.js');

let clients = {};

// (getClient 和 getFolderPath 函式保持不變)
// ...

async function upload(readStream, fileName, mimetype, userId, folderId, size) {
    const client = getClient(userId);
    const folderPath = await getFolderPath(folderId, userId);
    const remotePath = (folderPath === '/' ? '' : folderPath) + '/' + fileName;
    
    if (folderPath && folderPath !== "/") {
        try {
            await client.createDirectory(folderPath, { recursive: true });
        } catch (e) {
            if (e.response && (e.response.status !== 405 && e.response.status !== 501)) {
                 throw e;
            }
        }
    }

    // 核心重構：使用 pipe 將讀取流對接到 WebDAV 的寫入流
    const writeStream = client.createWriteStream(remotePath, {
        headers: {
            "Content-Length": size
        }
    });

    await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        readStream.on('error', reject);
    });

    const messageId = Date.now() + Math.floor(Math.random() * 1000);

    const dbResult = await data.addFile({
        message_id: messageId,
        fileName,
        mimetype,
        size, // 使用從 multer 獲取的正確大小
        file_id: remotePath,
        date: Date.now(),
    }, folderId, userId, 'webdav');
    
    return { success: true, message: '檔案已上傳至 WebDAV。', fileId: dbResult.fileId };
}

// (remove, stream, getUrl 等函式保持不變)
// ...

module.exports = { upload, remove, getUrl, stream, type: 'webdav' };
