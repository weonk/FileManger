const { createClient } = require('webdav');
const data = require('../data.js');
const db = require('../database.js'); // 引入 database 以便查詢

let clients = {};

function getClient(userId) {
    // 透過延遲載入來避免循環依賴
    const storageManager = require('./index'); 
    const config = storageManager.readConfig();
    const userWebdavConfig = config.webdav.find(c => c.userId === userId);
    if (!userWebdavConfig) {
        throw new Error('找不到該使用者的 WebDAV 設定');
    }

    // 如果設定有變更，重新建立客戶端連線
    const clientKey = `${userId}-${userWebdavConfig.url}-${userWebdavConfig.username}`;
    if (!clients[clientKey]) {
        clients[clientKey] = createClient(userWebdavConfig.url, {
            username: userWebdavConfig.username,
            password: userWebdavConfig.password
        });
    }
    return clients[clientKey];
}

async function getFolderPath(folderId, userId) {
    // 修正：正確找到使用者的根目錄 ID
    const userRoot = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM folders WHERE user_id = ? AND parent_id IS NULL", [userId], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject(new Error('找不到使用者根目錄'));
            resolve(row);
        });
    });

    if (folderId === userRoot.id) return '/';
    
    const pathParts = await data.getFolderPath(folderId, userId);
    // 移除根目錄部分，因為 WebDAV 路徑是相對的
    return '/' + pathParts.slice(1).map(p => p.name).join('/');
}

async function upload(fileBuffer, fileName, mimetype, userId, folderId) {
    const client = getClient(userId);
    const folderPath = await getFolderPath(folderId, userId);
    const remotePath = (folderPath === '/' ? '' : folderPath) + '/' + fileName;

    const success = await client.putFileContents(remotePath, fileBuffer, { overwrite: true });

    if (!success) {
        throw new Error('WebDAV putFileContents 操作失敗');
    }

    const stat = await client.stat(remotePath);
    const messageId = Date.now() + Math.floor(Math.random() * 1000);

    const dbResult = await data.addFile({
        message_id: messageId,
        fileName,
        mimetype,
        size: stat.size,
        file_id: remotePath, // 儲存相對路徑
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
            // 如果檔案在遠端不存在，也視為成功
            if (error.response && error.response.status !== 404) {
                 console.warn(`刪除 WebDAV 檔案失敗: ${file.file_id}`, error.message);
            }
        }
    }
    await data.deleteFilesByIds(files.map(f => f.message_id), userId);
    return { success: true };
}

async function getUrl(file_id, userId) {
    const client = getClient(userId);
    return client.getFileDownloadLink(file_id);
}

module.exports = { upload, remove, getUrl, type: 'webdav' };
