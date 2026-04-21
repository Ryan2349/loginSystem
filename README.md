# 用戶註冊登入系統 (Login System)

這是一個使用 Node.js、Express、MongoDB 和 HTML 構建的簡單用戶註冊與登入應用。

## 功能特點

- 用戶註冊 (密碼會進行 bcrypt 哈希處理)
- 用戶登入 (驗證密碼)
- 使用 MongoDB Atlas 作為資料庫
- 現代化 HTML/CSS 前端介面
- 分離的頁面設計 (註冊頁、登入頁、主頁)

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
│   ├── index.html          # 首頁 (導航頁面)
│   ├── register.html       # 用戶註冊頁面
│   ├── login.html          # 用戶登入頁面
│   └── dashboard.html      # 登入後的主頁
├── server.js               # 後端伺服器 (Express + MongoDB)
├── package.json            # 專案配置與依賴
├── .gitignore              # Git 忽略文件
└── README.md               # 本文件
```

## 頁面說明

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 首頁 | `/` | 提供註冊和登入的導航按鈕 |
| 註冊頁 | `/register.html` | 新用戶註冊表單 |
| 登入頁 | `/login.html` | 現有用戶登入表單 |
| 主頁 | `/dashboard.html` | 登入成功後的用戶主頁 |

## API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/register` | 用戶註冊 |
| `POST` | `/login` | 用戶登入 |
| `GET` | `/logout` | 用戶登出 |

### 註冊端點 (`POST /register`)
- 請求參數：`username`, `password`
- 成功：重定向到登入頁面
- 失敗：返回錯誤訊息

### 登入端點 (`POST /login`)
- 請求參數：`username`, `password`
- 成功：重定向到主頁 (附帶用戶名參數)
- 失敗：返回錯誤訊息

## 安全說明

- 密碼使用 bcrypt 進行哈希處理，不會以明文存儲
- 建議在生產環境中使用 HTTPS
- 建議使用環境變量管理敏感信息 (如 MongoDB 連接字串)
- 目前的會話管理為簡化版本，生產環境建議使用 session 或 JWT

## 授權

ISC License
