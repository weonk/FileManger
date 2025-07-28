const { createClient } = require('webdav');
const data = require('../data.js');
const db = require('../database.js');

let clients = {};

function getClient(userId) {
    const storageManager = require('./index'); 
    const config = storageManager.readConfig();
    const userWebdavConfig = config.webdav.find(c => c.userId === userId);
    if (!userWebdavConfig) {
        throw new Error('找不到该用户的 WebDAV 设定');
    }

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
    const userRoot = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM folders WHERE user_id = ? AND parent_id IS NULL", [userId], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject(new Error('找不到用户根目录'));
            resolve(row);
        });
    });

    if (folderId === userRoot.id) return '/';
    
    const pathParts = await data.getFolderPath(folderId, userId);
    return '/' + pathParts.slice(1).map(p => p.name).join('/');
}

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

    const writeStream = client.createWriteStream(remotePath, {
        headers: { "Content-Length": size }
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
        size,
        file_id: remotePath,
        date: Date.now(),
    }, folderId, userId, 'webdav');
    
    return { success: true, message: '文件已上传至 WebDAV。', fileId: dbResult.fileId };
}

async function remove(files, userId) {
    const client = getClient(userId);
    for (const file of files) {
        try {
            await client.deleteFile(file.file_id);
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                 console.warn(`删除 WebDAV 文件失败: ${file.file_id}`, error.message);
            }
        }
    }
    await data.deleteFilesByIds(files.map(f => f.message_id), userId);
    return { success: true };
}

async function stream(file_id, userId) {
    const client = getClient(userId);
    return client.createReadStream(file_id);
}

async function getUrl(file_id, userId) {
    const client = getClient(userId);
    try {
        return await client.getFileDownloadLink(file_id);
    } catch (error) {
        console.warn(`获取 WebDAV 下载链接失败 for ${file_id}:`, error.message);
        return null; // 链接获取失败时返回 null
    }
}

module.exports = { upload, remove, getUrl, stream, type: 'webdav' };
