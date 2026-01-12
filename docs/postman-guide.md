# 使用 Postman 測試 SkyMemories API

為方便測試，製作了一份完整的 **Postman Collection** 設定檔。

## 1. 取得設定檔
設定檔位置：`docs/skymemories.postman_collection.json`

## 2. 匯入 (Import) 到 Postman
1.  開啟 Postman。
2.  點擊左上角的 **"Import"** 按鈕。
3.  將 `skymemories.postman_collection.json` 檔案拖入，或選擇檔案上傳。
4.  點擊 **"Import"** 確認。
5.  您應該會在左側的 Collections 列表中看到 **"SkyMemories API"**。

## 3. 環境變數自動化 (Automation)
我們已在 Collection 中設定了自動化腳本，讓測試更方便：

*   **Base URL**: 預設為 `http://localhost:5001/api`。
*   **Token 自動帶入**:
    1.  當您執行 **"Auth" -> "Login"** 請求並成功登入後。
    2.  系統會自動擷取回傳的 `token`，並存入 Postman 的 Environment Variable (`token`)。
    3.  此後執行所有需要權限的請求 (如 Get All Flights)，都會**自動帶入**剛剛取得的 Token，無需手動複製貼上。

## 4. 測試流程建議

### 步驟 A: 一般功能測試
1.  執行 **Auth / Register** (或改用現有帳號)。
2.  執行 **Auth / Login** -> **重要！這一步會取得 Token**。
3.  執行 **Auth / Get Current User (Me)** -> 確認 Token 有效。
4.  執行 **Flights / Create Flight** -> 新增一筆資料。
5.  執行 **Flights / Get All Flights** -> 確認剛剛新增的資料有出現。

### 步驟 B: 管理員功能測試
1.  執行 **Auth / Login**，Body 改用管理員帳號 (`superadmin@example.com`)。
2.  執行 **Admin / Get Stats** -> 應回傳系統統計數據。
3.  執行 **Admin / Get All Users** -> 應回傳用戶列表。

## 5. 常見問題
*   **"token variable not found"**: 請確認您是否已經先執行過 **Login** 請求。
*   **"ECONNREFUSED"**: 請確認後端伺服器 (`npm start`) 是否已啟動。
