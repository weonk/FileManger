const { createClient } = require('webdav');
const data = require('../data.js');
// const storageManager = require('./index'); // REMOVED FROM HERE

let clients = {};

function getClient(userId) {
    const storageManager = require('./index'); // MOVED HERE
    const config = storageManager.readConfig();
    const userWebdavConfig = config.webdav.find(c => c.userId === userId);
    if (!userWebdavConfig) {
        throw new Error('找不到該使用者的 WebDAV 設定');
    }

    // Invalidate client cache if config changed, for simplicity we create a new one each time for now.
    clients[userId] = createClient(userWebdavConfig.url, {
        username: userWebdavConfig.username,
        password: userWebdavConfig.password
    });
    
    return clients[userId];
}

async function upload(fileBuffer, fileName, mimetype, userId, folderId) {
    const client = getClient(userId);
    const folderPath = await getFolderPath(folderId, userId);
    const remotePath = `${folderPath}/${fileName}`;

    await client.putFileContents(remotePath, fileBuffer, { overwrite: true });

    const stat = await client.stat(remotePath);
    const messageId = Date.now() + Math.floor(Math.random() * 1000);

    const dbResult = await data.addFile({
        message_id: messageId,
        fileName,
        mimetype,
        size: stat.size,
        file_id: remotePath,
        date: new Date(stat.lastmod).getTime(),
    }, folderId, userId, 'webdav');
    
    return { success: true, message: '檔案已上傳至 WebDAV。', fileId: dbResult.fileId };
}

async function remove(files, userId) {
    const client = getClient(userId);
    for (const file of files) {
        try {
            await client.deleteFile(file.file_id);
        } catch (error) {
            console.warn(`刪除 WebDAV 檔案失敗: ${file.file_id}`, error.message);
        }
    }
    await data.deleteFilesByIds(files.map(f => f.message_id), userId);
    return { success: true };
}

async function getUrl(file_id, userId) {
    const client = getClient(userId);
    return client.getFileDownloadLink(file_id);
}

async function getFolderPath(folderId, userId) {
    // Find the root folder ID for the user first
    const userRoot = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM folders WHERE user_id = ? AND parent_id IS NULL", [userId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });

    if (!userRoot || folderId === userRoot.id) return '/';
    
    const pathParts = await data.getFolderPath(folderId, userId);
    // Slice(1) to remove the root folder, as WebDAV path doesn't need it
    return '/' + pathParts.slice(1).map(p => p.name).join('/');
}

module.exports = { upload, remove, getUrl, type: 'webdav' };
