const { createClient } = require('webdav');
const data = require('../data.js');
const storageManager = require('./index');

let clients = {};

function getClient(userId) {
    const config = storageManager.readConfig();
    const userWebdavConfig = config.webdav.find(c => c.userId === userId);
    if (!userWebdavConfig) {
        throw new Error('找不到該使用者的 WebDAV 設定');
    }

    if (!clients[userId]) {
        clients[userId] = createClient(userWebdavConfig.url, {
            username: userWebdavConfig.username,
            password: userWebdavConfig.password
        });
    }
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
    if (folderId === 1) return '/';
    const pathParts = await data.getFolderPath(folderId, userId);
    return '/' + pathParts.map(p => p.name).join('/');
}

module.exports = { upload, remove, getUrl, type: 'webdav' };
