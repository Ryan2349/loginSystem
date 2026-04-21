# 用戶註冊登入系統 (Login System)

這是一個使用 Node.js、Express、MongoDB 和 HTML 構建的簡單用戶註冊與登入應用。

## 功能特點

- 用戶註冊 (密碼會進行 bcrypt 哈希處理)
- 用戶登入 (驗證密碼)
- 使用 MongoDB Atlas 作為資料庫
- 純 HTML 前端 (無 CSS)

## 環境要求

- Node.js (建議版本 14+)
- npm
- MongoDB Atlas 帳號 (或本地 MongoDB 實例)

## 安裝步驟

1. **安裝依賴套件**
   ```bash
   npm install
   ```

2. **配置 MongoDB Atlas 連接字串**
   
   打開 `server.js` 文件，找到以下行：
   ```javascript
   const MONGODB_URI = 'your_mongodb_atlas_connection_string';
   ```
   
   將 `'your_mongodb_atlas_connection_string'` 替換為您的 MongoDB Atlas 連接字串。
   
   範例格式：
   ```javascript
   const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority';
   ```

3. **啟動伺服器**
   ```bash
   node server.js
   ```

4. **訪問應用**
   
   在瀏覽器中打開：`http://localhost:3000`

## 專案結構

```
loginSystem/
├── public/
│   └── index.html      # 前端頁面 (註冊與登入表單)
├── server.js           # 後端伺服器 (Express + MongoDB)
├── package.json        # 專案配置與依賴
├── .gitignore          # Git 忽略文件
└── README.md           # 本文件
```

## API 端點

- `POST /register` - 用戶註冊
  - 請求參數：`username`, `password`
  
- `POST /login` - 用戶登入
  - 請求參數：`username`, `password`

## 安全說明

- 密碼使用 bcrypt 進行哈希處理，不會以明文存儲
- 建議在生產環境中使用 HTTPS
- 建議使用環境變量管理敏感信息 (如 MongoDB 連接字串)

## 授權

ISC License
