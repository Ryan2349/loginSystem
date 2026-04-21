const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// 解析請求體
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 提供靜態文件 (HTML)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB 連接配置
// TODO: 請將下方的 'your_mongodb_atlas_connection_string' 替換為您的 MongoDB Atlas 連接字串
// 範例: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
const MONGODB_URI = 'your_mongodb_atlas_connection_string';
const DB_NAME = 'loginSystemDB';
const COLLECTION_NAME = 'users';

let db;
let usersCollection;

// 連接 MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('成功連接到 MongoDB Atlas');
        db = client.db(DB_NAME);
        usersCollection = db.collection(COLLECTION_NAME);
        
        // 建立索引以確保用戶名唯一
        await usersCollection.createIndex({ username: 1 }, { unique: true });
    } catch (error) {
        console.error('MongoDB 連接失敗:', error);
        process.exit(1);
    }
}

// 註冊路由
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('用戶名和密碼不能為空');
    }

    try {
        // 檢查用戶是否已存在
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('用戶名已存在');
        }

        // 哈希密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用戶
        await usersCollection.insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date()
        });

        // 註冊成功後重定向到登入頁面
        res.redirect('/login.html?registered=true');
    } catch (error) {
        console.error('註冊錯誤:', error);
        res.status(500).send('註冊失敗，請稍後再試');
    }
});

// 登入路由
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('用戶名和密碼不能為空');
    }

    try {
        // 查找用戶
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).send('用戶名或密碼錯誤');
        }

        // 驗證密碼
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('用戶名或密碼錯誤');
        }

        // 登入成功後重定向到主頁，並傳遞用戶名
        res.redirect(`/dashboard.html?username=${encodeURIComponent(username)}`);
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).send('登入失敗，請稍後再試');
    }
});

// 登出路由
app.get('/logout', (req, res) => {
    res.redirect('/');
});

// 啟動伺服器
app.listen(PORT, async () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
    await connectToDatabase();
});
