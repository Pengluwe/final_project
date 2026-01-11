# SkyMemories API 規格說明書

本文件詳細說明 SkyMemories 後端 API 的使用方式、端點路徑、請求參數與回傳格式。

## 基本資訊
*   **Base URL**: `http://localhost:5001/api`
*   **Content-Type**: `application/json` (圖片上傳除外)

## 驗證機制 (Authentication)
所有受保護的 API (Protected Routes) 皆需在 Header 帶入 JWT Token。

*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <your_token_here>`

---

## 1. 使用者認證 (Authentication)

### 註冊 (Register)
*   **Method**: `POST`
*   **URL**: `/auth/register`
*   **Body**:
    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123"
    }
    ```
*   **Response (201)**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "username": "testuser",
        "email": "test@example.com",
        "role": "user"
      }
    }
    ```

### 登入 (Login)
*   **Method**: `POST`
*   **URL**: `/auth/login`
*   **Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
*   **Response (200)**: (同註冊回傳結構)

### 取得目前使用者資訊 (Get Current User)
*   **Method**: `GET`
*   **URL**: `/auth/me`
*   **Headers**: 需帶 Token
*   **Response (200)**:
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
    ```

---

## 2. 飛行紀錄 (Flights)
所有端點皆需驗證 Token。

### 取得所有航班 (Get All Flights)
*   **Method**: `GET`
*   **URL**: `/flights`
*   **Response (200)**:
    ```json
    [
      {
        "_id": "60d21b2f9b1d8e0015f65b8e",
        "airline": "EVA Air",
        "flightNumber": "BR87",
        "departure": "TPE",
        "destination": "CDG",
        "date": "2023-12-25T00:00:00.000Z",
        "seatClass": "Economy",
        "aircraftReg": "B-16701",
        "photos": ["/uploads/flight-123.jpg"],
        "userId": "..."
      }
    ]
    ```

### 取得單一航班 (Get Flight By ID)
*   **Method**: `GET`
*   **URL**: `/flights/:id`

### 新增航班 (Create Flight)
*   **Method**: `POST`
*   **URL**: `/flights`
*   **Body**:
    ```json
    {
      "airline": "China Airlines",
      "flightNumber": "CI100",
      "departure": "TPE",
      "destination": "NRT",
      "date": "2024-01-10",
      "seatClass": "Business",
      "aircraftReg": "B-18918",
      "notes": "Good service",
      "photos": ["/uploads/img1.jpg"]
    }
    ```

### 更新航班 (Update Flight)
*   **Method**: `PUT`
*   **URL**: `/flights/:id`
*   **Body**: (同新增航班，可僅傳送欲修改欄位)

### 刪除航班 (Delete Flight)
*   **Method**: `DELETE`
*   **URL**: `/flights/:id`

---

## 3. 機場資訊 (Airports)
用於提供自動完成與地圖座標資訊。

### 取得所有機場 (Get All Airports)
*   **Method**: `GET`
*   **URL**: `/airports`
*   **Response**: 機場物件陣列 (包含 code, name, city, country, coordinates)。

### 搜尋機場 (Search Airports)
*   **Method**: `GET`
*   **URL**: `/airports/search?query=TPE`

### 批次取得機場座標 (Batch Get Airports)
*   **Method**: `POST`
*   **URL**: `/airports/batch`
*   **Body**: `{"codes": ["TPE", "NRT", "LAX"]}`

---

## 4. 檔案上傳 (Upload)

### 上傳照片 (Upload Photo)
*   **Method**: `POST`
*   **URL**: `/upload`
*   **Headers**: `Content-Type: multipart/form-data`
*   **Body**:
    *   **key**: `file` (Value: 圖片檔案)
*   **Response (200)**:
    ```json
    {
      "url": "/uploads/flight-170123456789.jpg"
    }
    ```

---

## 5. 管理員功能 (Admin)
需具備 `admin` 權限 Token。

### 取得所有使用者 (Get All Users)
*   **Method**: `GET`
*   **URL**: `/admin/users`

### 刪除使用者 (Delete User)
*   **Method**: `DELETE`
*   **URL**: `/admin/users/:id`
*   **Note**: 此操作會同時刪除該用戶的所有飛行紀錄。

### 取得系統統計 (Get Stats)
*   **Method**: `GET`
*   **URL**: `/admin/stats`
*   **Response**:
    ```json
    {
      "totalUsers": 10,
      "totalFlights": 150
    }
    ```
