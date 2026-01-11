# SkyMemories - 個人雲端飛行日記

SkyMemories 是一個專為航空愛好者與旅客設計的全端 Web 應用程式，旨在數位化管理個人的飛行紀錄。使用者可以記錄每一趟旅程的詳細資訊（如航空公司、航班號碼、機身編號、座艙心得等），並透過互動式世界地圖視覺化飛行足跡。

本專案現已包含完整的 **管理員後台 (Admin Panel)**，可用於用戶管理與系統數據查看。

## 核心功能 (Key Features)

*   **飛行管理**: 新增、編輯、刪除詳細的飛行紀錄 (日期、艙等、機型、註冊號等)。
*   **互動地圖**: 使用 Leaflet.js 在動態世界地圖上視覺化您的飛行路徑。
*   **照片圖庫**: 為每一趟飛行上傳並管理照片回憶。
*   **機場整合**: 內建全球機場資料庫與座標資訊，確保地圖繪製精準。
*   **會員系統**: 安全的註冊與登入機制 (JWT 驗證)。
*   **權限控管**: 區分一般用戶與管理員的權限。
*   **管理員後台**: 
    *   查看系統統計數據 (總用戶數、總飛行數)。
    *   管理註冊用戶 (查看列表、刪除違規用戶)。
*   **響應式設計**: 使用 Bootstrap 5 建構，支援各種裝置瀏覽。

## 技術堆疊 (Technology Stack)

*   **前端 (Frontend)**: React.js, Vite, Axios, React Leaflet, Bootstrap 5
*   **後端 (Backend)**: Node.js, Express.js
*   **資料庫 (Database)**: MongoDB (配合 Mongoose)
*   **驗證機制 (Authentication)**: JWT (JSON Web Tokens)
*   **容器化 (Containerization)**: Docker & Docker Compose (用於資料庫)

## 先決條件 (Prerequisites)

在執行此專案前，請確保您的環境已安裝：

*   **Node.js** (建議 v18 或以上版本)
*   **Docker Desktop** (用於快速啟動 MongoDB) - 推薦使用，或確保本地已安裝 MongoDB 服務。

## 安裝與設定 (Installation & Setup)

### 1. 複製專案 (Clone Repository)
```bash
git clone <repository-url>
cd skymemories
```

### 2. 安裝依賴套件 (Install Dependencies)
您可以直接在根目錄執行以下指令，一次安裝前後端所有套件：
```bash
npm run install:all
```
*或者手動分別安裝：*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. 環境變數設定 (Environment Configuration)
請在 `backend` 目錄下建立 `.env` 檔案，填入以下內容：
```bash
# backend/.env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/skymemories
JWT_SECRET=your_super_secret_key_here
```

### 4. 啟動資料庫 (Start Database)
使用 Docker Compose 啟動 MongoDB：
```bash
npm run docker:up
# 或
cd docker && docker-compose up -d
```

### 5. 初始化資料 (Seed Database)
初始化機場資料庫，以便地圖功能正常運作：
```bash
cd backend
node seedAirports.js
```

## 使用指引 (Usage Guidelines)

### 啟動應用程式
最簡單的方式是在 Windows 環境下使用提供的腳本：
```bash
.\scripts\start_app.bat
```
或是在根目錄使用 npm 指令：
```bash
npm start
```

*   **前端頁面**: http://localhost:5173
*   **後端 API**: http://localhost:5001

### 帳號測試

#### 一般用戶 (Standard User)
1.  前往註冊頁面 (Register)。
2.  建立一個新帳號。
3.  開始記錄您的飛行旅程！

#### 管理員 (Administrator)
您可以建立一個預設的超級管理員帳號來測試後台功能：

1.  執行建立腳本 (確保資料庫已啟動)：
    ```bash
    cd backend
    node createSuperAdmin.js
    ```
2.  使用以下資訊登入：
    *   **Email**: `superadmin@example.com`
    *   **Password**: `password1234`
3.  登入後點擊導覽列紅色的 **"Admin Panel"** 按鈕即可進入管理後台。

## 專案結構 (Project Structure)
```
root/
├── backend/            # Express API 伺服器
│   ├── controllers/    # 商業邏輯
│   ├── models/         # Mongoose 資料模型 (User, Flight, Airport)
│   ├── routes/         # API路由路徑
│   ├── middleware/     # 中介軟體 (Auth, Admin)
│   └── uploads/        # 圖片儲存區
├── frontend/           # React 應用程式
│   ├── src/
│   │   ├── components/ # UI 元件 (Map, Forms, Dashboard)
│   │   ├── context/    # Auth Context (Observer Pattern)
│   │   └── services/   # API Client (Axios)
├── docker/             # Docker 設定檔
└── scripts/            # 輔助腳本 (Start/Stop)
```

## 設計模式應用 (Design Patterns Used)

本專案在開發過程中應用了多種經典設計模式，以確保程式碼的可維護性、擴充性與結構清晰度。

### 1. 後端 (Backend)

#### MVC 模式 (Model-View-Controller)
*   **模式說明**: 將應用程式邏輯區分為資料模型 (Model)、視圖 (View, 本專案為 JSON Response) 與控制器 (Controller)。
*   **應用場景**: 構建 RESTful API 時，分離資料存取與業務邏輯。
*   **專案實作**:
    *   **Model**: `models/User.js`, `models/Flight.js` 定義資料結構與資料庫操作。
    *   **Controller**: `controllers/flightController.js` 處理請求邏輯與流程控制。
    *   **View**: 回傳的 JSON 格式資料。

#### Singleton 模式 (單例模式)
*   **模式說明**: 確保一個類別只有一個實例，並提供一個全域存取點。
*   **應用場景**: 管理共享資源，如資料庫連線或應用程式設定。
*   **專案實作**:
    *   `mongoose.connect` 在整個應用程式生命週期中維護單一資料庫連線池。
    *   `src/services/api.js` 中的 Axios 實例也是單例，統一管理請求設定。

### 2. 前端 (Frontend)

#### Observer 模式 (觀察者模式)
*   **模式說明**: 定義物件間的一對多依賴，當物件狀態改變時，所有依賴者都會收到通知並自動更新。
*   **應用場景**: 管理全域狀態 (如使用者登入狀態)，當狀態改變時，所有相關 UI 元件需同步更新。
*   **專案實作**:
    *   **Subject**: `AuthContext.jsx` 中的 `AuthProvider` 維護 `user` 狀態。
    *   **Observer**: 使用 `useAuth()` Hook 的所有元件 (如 `Dashboard`, `Login`)。當 `user` 登入或登出時，這些元件會自動重新渲染 (Re-render)。

#### Factory 模式 (工廠模式)
*   **模式說明**: 定義一個介面用於建立物件，但讓子類別決定實例化哪一個類別。
*   **應用場景**: 封裝物件建立的複雜過程。
*   **專案實作**:
    *   `src/services/api.js` 使用 `axios.create()` 工廠方法來建立具有預設配置 (Base URL, Timeout) 的 HTTP Client 實例。

