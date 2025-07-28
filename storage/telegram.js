const axios = require('axios');
const FormData = require('form-data');
const data = require('../data.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// --- 核心重构：修改 upload 函数以接收 readStream ---
async function upload(readStream, fileName, mimetype, userId, folderId, size, caption = '') {
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', caption);
    
    // 直接将文件流附加到表单中
    form.append('document', readStream, {
        filename: fileName,
        contentType: mimetype,
        knownLength: size
    });

    try {
        const response = await axios.post(`${API_URL}/sendDocument`, form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data.ok) {
            const file = response.data.result.document;
            const thumb = response.data.result.document.thumbnail;
            
            const dbResult = await data.addFile({
                message_id: response.data.result.message_id,
                fileName: file.file_name,
                mimetype: file.mime_type,
                file_id: file.file_id,
                thumb_file_id: thumb ? thumb.file_id : null,
                date: response.data.result.date * 1000,
                size: file.file_size
            }, folderId, userId, 'telegram');

            return { success: true, message: '文件已上传至 Telegram。', fileId: dbResult.fileId };
        } else {
            throw new Error(`Telegram API 错误: ${response.data.description}`);
        }
    } catch (error) {
        console.error('Telegram 上传失败:', error.message);
        throw error;
    }
}

async function remove(files, userId) {
    let successCount = 0;
    for (const file of files) {
        try {
            const response = await axios.get(`${API_URL}/deleteMessage`, {
                params: {
                    chat_id: CHAT_ID,
                    message_id: file.message_id
                }
            });
            if (response.data.ok) {
                successCount++;
            }
        } catch (error) {
            // 如果消息已被删除，Telegram 会返回 400 错误，这里可以忽略
            if (error.response && error.response.status !== 400) {
                console.error(`删除 Telegram 消息失败 (ID: ${file.message_id}):`, error.message);
            }
        }
    }
    
    await data.deleteFilesByIds(files.map(f => f.message_id), userId);
    
    return { success: true, message: `${successCount} 个文件已从 Telegram 删除。` };
}

async function getUrl(file_id) {
    try {
        const response = await axios.get(`${API_URL}/getFile`, { params: { file_id } });
        if (response.data.ok) {
            return `https://api.telegram.org/file/bot${BOT_TOKEN}/${response.data.result.file_path}`;
        }
        return null;
    } catch (error) {
        console.error("获取 Telegram 文件链接失败:", error.message);
        return null;
    }
}

// Telegram 存储模式不支持直接的流式读取，它依赖 getUrl 获取链接
async function stream(file_id, userId) {
    const url = await getUrl(file_id);
    if (!url) {
        throw new Error("无法获取 Telegram 文件流，因为获取 URL 失败。");
    }
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    return response.data;
}

module.exports = { upload, remove, getUrl, stream, type: 'telegram' };
