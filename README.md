# SkyMemories - 個人雲端飛行日記 (Personal Flight Diary)

SkyMemories 是一個專為旅客設計的 Web 應用程式，旨在數位化管理個人的飛行紀錄。使用者可以透過此平台記錄每一趟旅程的詳細資訊（如航空公司、航線、座艙心得、照片紀錄、機身編號），並透過世界地圖視覺化飛行足跡。

## 1. 技術選型

- **前端 (Frontend)**: React.js, Bootstrap 5, Axios, React-Leaflet
- **後端 (Backend)**: Node.js, Express.js, Multer
- **資料庫 (Database)**: MongoDB (Docker 容器化)
- **容器化技術**: Docker, Docker Compose

## 2. 專案目錄結構

```text
sky-memories/
├── frontend/           # 前端應用程式 (React)
│   ├── src/            # 主要原始碼 (App.jsx, Components)
│   ├── public/         # 靜態資源 (index.html, 圖示)
│   └── package.json    # 前端套件管理
├── backend/            # 後端 API 伺服器 (Node.js)
│   ├── controllers/    # 請求處理與商業邏輯
│   ├── models/         # 資料模型定義 (Mongoose Schema)
│   ├── routes/         # API 路由設定
│   ├── uploads/        # 實體圖片儲存路徑 (Git 忽略)
│   ├── server.js       # 入口檔案
│   └── package.json    # 後端套件管理
├── docker/             # Docker 相關設定
│   └── docker-compose.yml
├── docs/               # 系統設計文件目錄
│   ├── api-spec.md     # API 規格文件
│   ├── architecture.md # 系統架構說明
│   └── flowchart.md    # 系統流程圖說明
└── README.md           # 專案整體說明與執行指引
```

## 3. 安裝與執行指引

### 先決條件
- Docker Desktop
- Node.js (建議 v18+)

### 第一步：啟動 MongoDB (Docker)
確保已安裝 Docker Desktop，並在終端機執行：
```bash
cd docker
docker-compose up -d
```

### 第二步：後端伺服器 (Backend)
```bash
cd backend
npm install
npm start
```
伺服器將啟動於 `http://localhost:5001`。

### 第三步：前端介面 (Frontend)
```bash
cd frontend
npm install
npm start
```
瀏覽器將自動開啟 `http://localhost:3000`。

## 4. API 規格與技術文件
詳細文件請參閱 `docs/` 目錄：
- [API 規格說明文件](docs/api-spec.md)
- [系統架構說明](docs/architecture.md)
- [系統流程圖說明](docs/flowchart.md)
