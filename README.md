# 用戶註冊登入系統 (Login System)

這是一個使用 Node.js、Express、MongoDB 和 HTML 構建的簡單用戶註冊與登入應用，旨在演示基礎的認證流程與 Session 會話管理。

## 項目特色 (Features)

- **安全認證**: 使用 `bcryptjs` 進行密碼哈希加密儲存。
- **會話管理**: 透過 `express-session` 實現伺服器端狀態追蹤，防止未授權訪問 Dashboard。
- **資料庫整合**: 使用 MongoDB Atlas 儲存用戶資料，並建立唯一索引確保用戶名不重複。
- **前端介面**: 提供完整的註冊、登入及個人主頁 (Dashboard) 靜態頁面。
- **安全性強化**: 設置 `HttpOnly` Cookie 防止 XSS 攻擊，並實作 30 分鐘會話過期機制。

## 檔案結構 (Folder Structure)

```text
loginSystem/
├── public/
│   ├── index.html          # 首頁 (導航)
│   ├── register.html       # 註冊頁面
│   ├── login.html          # 登入頁面
│   └── dashboard.html      # 登入後主頁 (受保護)
├── server.js               # 後端主程式 (Express 路由與資料庫邏輯)
├── package.json            # 專案依賴配置
└── README.md               # 專案說明文件
```

## 快速開始 (Getting Started)

### 1. 環境準備
- 安裝 [Node.js](https://nodejs.org/) (建議 v14+)
- 準備一個 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 帳號或本地 MongoDB 實例。

### 2. 安裝與配置
```bash
# 安裝依賴套件
npm install
```

**配置資料庫：**
編輯 `server.js`，將 `MONGODB_URI` 替換為您的 MongoDB 連接字串：
```javascript
const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/...';
```

### 3. 啟動專案
```bash
# 啟動伺服器
npm start
```
啟動後，請訪問：`http://localhost:3000`

## API 概覽

| 路徑 | 方法 | 說明 | 權限 |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | 註冊新用戶 | 公開 |
| `/login` | `POST` | 登入並創建 Session | 公開 |
| `/logout` | `GET` | 銷毀 Session 並登出 | 需登入 |
| `/api/user` | `GET` | 獲取當前用戶資訊 | 需登入 |
| `/dashboard` | `GET` | 訪問受保護的主頁 | 需登入 |
