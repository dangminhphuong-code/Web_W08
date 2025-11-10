import db from './db.js';

async function testConnection() {
    try {
        const result = await db.raw('SELECT NOW()');
        console.log('Kết nối thành công!');
        console.log('Thời gian server: ', result.rows[0].now);

        await db.destroy();
    } catch (error) {
        console.error('Lỗi kết nối: ',error.message);
        process.exit();
    }

}
testConnection();