# 📌 LocalStorage Key 讀取器 (LocalStorage Reader TS)

[![GitHub License](https://img.shields.io/github/license/Yuno-Liu/Localstorage-reader-TS)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![esbuild](https://img.shields.io/badge/Bundled%20with-esbuild-FFCF00?logo=esbuild&logoColor=black)](https://esbuild.github.io/)

一款專為前端工程師、網站測試員與數據分析師設計的輕量級 Chrome 擴充套件，能迅速讀取當前分頁中任意指定的 `localStorage` Key 之對應 Value，並提供即時一鍵複製功能。

---

## ✨ 核心特色與功能

- 🔍 **任意 Key 即時查詢**：輸入想要查詢的 Key 名稱（例如：`token`、`authToken`、`userId`、`theme` 等），一鍵查詢當前頁面的 Storage 數據。
- 💾 **歷史輸入記憶**：自動記錄使用者上次查詢的 Key 名稱，下次開啟彈跳視窗無需重新手動輸入。
- 📋 **一鍵快速複製**：成功讀取內容後自動呈現複製按鈕，點擊立即寫入系統剪貼簿並帶有綠色視覺確認反饋。
- 📦 **安全解耦通訊**：Popup 透過 `chrome.tabs.sendMessage` 向 Content Script 發送查詢請求，安全獲取當前網頁 DOM Context 下的 `window.localStorage` 數據。
- ⚡ **純淨原生、無依賴負擔**：採用 TypeScript + esbuild 打包，極度輕量、啟動零延遲。

---

## 🚀 安裝說明

### 載入未封裝項目（開發者模式）

1. 複製專案並安裝相依套件：
   ```bash
   git clone https://github.com/Yuno-Liu/Localstorage-reader-TS.git
   cd Localstorage-reader-TS
   npm install
   npm run build
   ```
2. 編譯完成後，擴充套件檔案輸出至 `dist/` 目錄。
3. 開啟 Chrome 瀏覽器，進入擴充功能頁面：`chrome://extensions/`。
4. 開啟右上角「**開發人員模式**」。
5. 點擊「**載入未封裝項目**」，選取本專案的 `dist/` 目錄即可完成安裝。
6. 點擊 Chrome 工具列右上方的拼圖圖示，將「📌 LocalStorage Key 讀取器」釘選至工具列。

---

## 📖 使用方式

1. 瀏覽至任何需要檢視 LocalStorage 的目標網站。
2. 點擊工具列上的「📌 LocalStorage 讀取器」圖示展開彈跳視窗。
3. 在輸入框中輸入欲查詢的 Storage Key 名稱（例如：`access_token` 或 `user_profile`）。
4. 點擊 **「🚀 取得 Value」** 按鈕。
5. 查詢結果將於下方文字方塊中完整呈現；點擊 **「📋 複製內容」** 即可快速將資料複製至剪貼簿。

---

## 🛠️ 開發與建置

```bash
# 安裝依賴
npm install

# 編譯生產版本（產出 dist/）
npm run build

# 開發監聽模式（檔案變更時自動即時重新構建）
npm run watch

# 執行 TypeScript 靜態型別檢查
npm run typecheck

# 清除構建產物
npm run clean
```

---

## 📂 專案結構

```
Localstorage-reader-TS/
├── dist/                   # 編譯輸出目錄（載入此資料夾至 Chrome）
│   ├── content.js
│   ├── popup.js
│   ├── popup.html
│   └── manifest.json
├── src/                    # TypeScript 原始碼
│   ├── content.ts          # 注入頁面的腳本（負責讀取 window.localStorage）
│   └── popup.ts            # 彈出視窗 UI 控制邏輯、剪貼簿與 Storage 記憶
├── manifest.json           # Manifest V3 擴充功能設定檔
├── popup.html              # 彈出視窗 HTML 介面
├── package.json            # 專案相依性配置與腳本
├── tsconfig.json           # TypeScript 編譯器設定
├── LICENSE                 # MIT 授權
└── README.md               # 專案說明文件
```

---

## 📜 授權協議 (License)

本專案採用 [MIT License](LICENSE) 授權。
