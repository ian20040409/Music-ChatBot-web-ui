# 🎵 Music-ChatBot-web-ui

一個問答聊天機器人 Web 介面，提供直觀易用的對話體驗和豐富的互動功能。

![GitHub stars](https://img.shields.io/github/stars/ian20040409/Music-ChatBot-web-ui)
![GitHub forks](https://img.shields.io/github/forks/ian20040409/Music-ChatBot-web-ui)
![GitHub issues](https://img.shields.io/github/issues/ian20040409/Music-ChatBot-web-ui)
![License](https://img.shields.io/github/license/ian20040409/Music-ChatBot-web-ui)

## ✨ UI 特色

- 🎨 **現代化介面設計**：使用 Bootstrap 5 和自訂 CSS，提供美觀的視覺體驗
- 📱 **完全響應式**：完美適配桌面、平板和手機螢幕
- 🚀 **PWA 支援**：支援安裝到桌面，提供原生應用程式般的體驗
- 🔊 **音效回饋系統**：點擊、發送、思考等互動音效增強使用體驗
- ⚙️ **可自訂參數**：直觀的滑桿控制回答風格和詳細度
- 🌙 **優雅的對話界面**：清晰的聊天氣泡和流暢的動畫效果
- ✨ **智慧建議**：動態顯示相關問題建議


## 🎨 介面預覽

### 主要功能區域
- **對話模式選擇**：RAG 音樂知識庫 / 本地模型切換
- **回答風格調整**：溫度和詳細度參數控制
- **聊天對話區**：清晰的問答顯示界面
- **智慧輸入框**：支援即時驗證和建議

### 視覺設計
- 使用 Noto Sans TC 和 Poppins 字體組合
- 漸層背景和卡片式設計
- Font Awesome 圖標系統
- 柔和的色彩搭配和圓角設計

## 🚀 快速啟動

### 1. 開啟網頁
直接在瀏覽器中開啟 `templates/index.html` 或透過 Web 伺服器訪問。

### 2. 選擇問答模式
- **RAG 音樂知識庫**：基於預建知識庫的精準回答
- **本地模型**：使用 AI 模型的創意回答

### 3. 調整回答風格（可選）
點擊「回答風格」按鈕可調整：
- **溫度**：控制回答的創意程度（0.1-1.0）
- **詳細度**：控制回答的長度（100-500 tokens）

### 4. 開始對話
輸入音樂相關問題，享受智慧問答體驗！

## 📦 前端技術棧

### 核心框架
- **HTML5**：語義化標籤和現代化結構
- **CSS3**：Flexbox 布局和動畫效果
- **JavaScript (ES6+)**：模組化和非同步處理
- **Bootstrap 5**：響應式組件和工具類

### 外部資源
- **Google Fonts**：Noto Sans TC + Poppins 字體
- **Font Awesome 6**：圖標系統
- **Bootstrap Icons**：補充圖標
- **reCAPTCHA**：人機驗證（可選）

### PWA 功能
- **Service Worker**：快取和離線支援
- **Web App Manifest**：應用程式資訊和圖標
- **響應式圖標**：支援各種裝置和平台

## 💡 使用指南

### 基本操作
1. **提問**：在輸入框中輸入音樂相關問題
2. **發送**：點擊發送按鈕或按 Enter 鍵
3. **等待回覆**：系統會播放思考音效並顯示載入動畫
4. **檢視答案**：答案會以對話氣泡形式顯示

### 進階功能
- **建議問題**：點擊動態顯示的建議問題快速提問
- **音效控制**：各種互動都有對應的音效回饋
- **參數調整**：使用預設風格快速套用或手動微調
- **PWA 安裝**：在支援的瀏覽器中可安裝為桌面應用

### 預設風格說明
- **學者風格**：嚴謹正經，適合學術討論
- **聊天風格**：自然適中，日常對話最佳選擇
- **創意風格**：活潑詳細，激發創意思考

## 📂 檔案結構

```
static/
├── app.js                 # 主要 JavaScript 邏輯
├── style.css              # 自訂樣式表
├── sw.js                  # Service Worker
├── manifest.webmanifest   # PWA 設定檔
├── *.mp3                  # 音效檔案
│   ├── begin.mp3          # 開始音效
│   ├── click.mp3          # 點擊音效
│   ├── continue.mp3       # 繼續音效
│   ├── reply-ok.mp3       # 回覆成功音效
│   └── thinking.mp3       # 思考中音效
└── icon/                  # 應用程式圖標
    ├── favicon-*.png      # 各尺寸圖標
    └── manifest.json      # 圖標設定

templates/
└── index.html             # 主頁面模板
```

## 🎨 樣式特色

### 色彩主題
- **主色調**：漸層藍紫色 (#667eea → #764ba2)
- **強調色**：各種 Bootstrap 語義顏色
- **背景**：柔和的漸層背景
- **文字**：高對比度確保可讀性

### 視覺效果
- **卡片陰影**：3D 層次感設計
- **圓角邊框**：現代化視覺風格
- **動畫過渡**：流暢的互動回饋
- **響應式布局**：適應各種螢幕尺寸

### 互動體驗
- **音效系統**：5種不同情境音效
- **載入動畫**：視覺化處理狀態
- **即時驗證**：輸入提示和錯誤處理
- **鍵盤支援**：Enter 鍵快速發送

## 🔧 自訂說明

### 修改樣式
編輯 `static/style.css` 檔案可自訂：
- 色彩主題和漸層效果
- 字體大小和間距
- 動畫效果和過渡時間
- 響應式斷點設定

### 更換音效
替換 `static/` 目錄下的音效檔案：
- `thinking.mp3` - 處理中音效
- `reply-ok.mp3` - 回覆完成音效
- `continue.mp3` - 點擊音效

### 自訂圖標
更新 `static/icon/` 目錄中的圖標檔案，並修改：
- `manifest.webmanifest` - PWA 設定
- `index.html` - Apple Touch 圖標連結

## 🌐 瀏覽器支援

### 完整支援
- **Chrome 88+**：所有功能完整支援
- **Firefox 84+**：所有功能完整支援
- **Safari 14+**：所有功能完整支援
- **Edge 88+**：所有功能完整支援

### PWA 支援
- **Android Chrome**：支援安裝和離線功能
- **iOS Safari**：支援新增到主畫面
- **Windows/macOS**：支援桌面安裝

## 📱 行動裝置最佳化

### 觸控優化
- 按鈕大小符合觸控標準（44px+）
- 適當的間距避免誤觸
- 支援滑動和觸控手勢

### 效能優化
- 圖片和資源壓縮
- 快取策略減少載入時間
- 非同步載入提升響應速度

## 🤝 參與貢獻

歡迎提交 Issue 和 Pull Request！

### UI/UX 改進
- 視覺設計優化建議
- 使用者體驗改善
- 無障礙功能增強
- 新的互動效果

### 前端功能
- JavaScript 功能擴充
- CSS 動畫效果
- 響應式設計改進
- PWA 功能增強

## 📝 授權條款

此專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- [Bootstrap 5](https://getbootstrap.com/) - 響應式前端框架
- [Font Awesome](https://fontawesome.com/) - 圖標字體庫
- [Google Fonts](https://fonts.google.com/) - 網路字體服務
- [MDN Web Docs](https://developer.mozilla.org/) - Web 技術文檔





---

⭐ 如果這個 UI 對您有幫助，請給我們一個星星！

🎵 優雅的介面，讓音樂學習更加愉快！
