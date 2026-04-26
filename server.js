const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// 解析請求體
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 設置 Session 中間件
app.use(session({
    secret: 'your-secret-key-change-in-production', // 生產環境請使用環境變數
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // 生產環境設為 true (使用 HTTPS 時)
        httpOnly: true, // 防止 XSS 攻擊
        maxAge: 30 * 60 * 1000 // 30 分鐘過期
    }
}));

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

        // 登入成功：設置 Session
        req.session.isLoggedIn = true;
        req.session.username = username;
        
        // 登入成功後重定向到主頁
        res.redirect('/dashboard.html');
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).send('登入失敗，請稍後再試');
    }
});

// 保護的 Dashboard 路由 - 需要登入才能訪問
app.get('/dashboard', (req, res) => {
    // 檢查用戶是否已登入
    if (!req.session.isLoggedIn || !req.session.username) {
        return res.redirect('/login.html?error=unauthorized');
    }
    
    // 如果已登入，提供 dashboard 頁面
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 處理直接訪問 dashboard.html 的請求
app.get('/dashboard.html', (req, res) => {
    // 檢查用戶是否已登入
    if (!req.session.isLoggedIn || !req.session.username) {
        return res.redirect('/login.html?error=unauthorized');
    }
    
    // 如果已登入，提供 dashboard 頁面
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API 端點：獲取當前登入用戶資訊
app.get('/api/user', (req, res) => {
    if (!req.session.isLoggedIn || !req.session.username) {
        return res.status(401).json({ error: '未登入' });
    }
    res.json({ username: req.session.username, isLoggedIn: true });
});

// 登出路由
app.get('/logout', (req, res) => {
    // 銷毀 Session
    req.session.destroy((err) => {
        if (err) {
            console.error('登出錯誤:', err);
        }
        res.redirect('/');
    });
});

// 啟動伺服器
app.listen(PORT, async () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
    await connectToDatabase();
});
