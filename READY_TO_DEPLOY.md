# ✅ 準備部署 - 完整檢查清單

## 📊 當前狀態

### ✅ 已完成
- [x] 31 個補助計畫資料準備完成
- [x] 所有程式碼開發完成
- [x] 專案已 build（dist 資料夾已準備好）
- [x] 所有變更已推送到 GitHub
- [x] Admin 後台功能完整
- [x] 主網站 5 秒輪詢機制已實作
- [x] Supabase 連接設定完成

### ⚠️ 待完成
- [ ] **初始化 Supabase 資料庫**（必須先做）
- [ ] 部署到 AWS Amplify

---

## 🚀 立即開始部署

### 步驟 1：初始化 Supabase（2 分鐘）

**剛剛已經開啟了 `init-database.html`，請：**

1. 在開啟的瀏覽器視窗中
2. 點擊「開始初始化資料庫」按鈕
3. 等待看到綠色的「✅ 初始化成功」訊息
4. 確認顯示「已成功上傳 31 個補助計畫到 Supabase」

**如果初始化失敗：**
- 檢查網路連線
- 確認 Supabase 專案已建立
- 確認已執行 `supabase-setup.sql` 建立資料表
- 參考 `DEPLOYMENT_INSTRUCTIONS.md` 的替代方案

---

### 步驟 2：部署到 AWS Amplify（5 分鐘）

#### 方式 A：從 GitHub 自動部署（推薦）

1. **開啟 AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **建立新應用程式**
   - 點擊「New app」→「Host web app」
   - 選擇「GitHub」
   - 授權並選擇 repository: `cindylin1211/aws-gov-funding-site`
   - 選擇 branch: `main`

3. **設定環境變數**（重要！）
   ```
   VITE_SUPABASE_URL = https://uijhsmfimsscmfycsrhr.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs
   ```

4. **確認 Build Settings**
   - Amplify 會自動偵測 Vite 專案
   - 確認 `baseDirectory` 是 `dist`
   - 確認 build command 是 `npm run build`

5. **部署**
   - 點擊「Save and deploy」
   - 等待 3-5 分鐘

#### 方式 B：手動上傳 dist 資料夾

1. 將 `dist` 資料夾壓縮成 zip
2. 在 Amplify Console 選擇「Deploy without Git」
3. 上傳 zip 檔案
4. 完成部署

---

### 步驟 3：驗證部署（3 分鐘）

部署完成後，測試以下功能：

#### 主網站測試
```
https://[your-amplify-url].amplifyapp.com
```

- [ ] 看到 31 個補助計畫
- [ ] 搜尋功能正常
- [ ] 篩選功能正常（企業規模、補助金額、主辦機關）
- [ ] 補助卡片顯示完整資訊
- [ ] 參考資料連結可點擊

#### Admin 後台測試
```
https://[your-amplify-url].amplifyapp.com/admin
```

- [ ] 看到所有 31 個計畫列表
- [ ] 可以編輯現有計畫
- [ ] 可以新增計畫
- [ ] 可以刪除計畫
- [ ] 參考資料可以新增/刪除
- [ ] 儲存後重新整理，資料保持不變

#### 即時同步測試
1. 在 Admin 編輯一個計畫（例如改標題）
2. 點擊儲存
3. 開新分頁到主網站
4. 等待 5 秒或手動重新整理
5. [ ] 確認看到更新的資料

---

## 📁 專案檔案說明

### 部署相關
- `dist/` - 已 build 的生產版本，可直接部署
- `AMPLIFY_DEPLOY_GUIDE.md` - AWS Amplify 詳細部署指南
- `DEPLOYMENT_INSTRUCTIONS.md` - 完整部署說明文件

### 資料庫初始化
- `init-database.html` - 瀏覽器版初始化工具（推薦）
- `init-db.mjs` - Node.js 版初始化腳本
- `supabase-setup.sql` - 資料庫結構設定

### 資料檔案
- `public/grants-database.json` - 31 個補助計畫資料
- `src/hooks/useSupabaseGrants.ts` - Admin 資料管理
- `src/hooks/useGrantsData.ts` - 主網站資料載入（5 秒輪詢）

### 維護文件
- `MAINTENANCE_GUIDE.md` - Maggie 維護指南
- `README.md` - 專案說明

---

## 🎯 系統架構

```
使用者瀏覽主網站
    ↓
useGrantsData.ts (每 5 秒輪詢)
    ↓
Supabase 雲端資料庫 ← Admin 後台編輯 (useSupabaseGrants.ts)
    ↓
即時更新顯示
```

### 資料流程
1. **初始化**：`init-database.html` → Supabase（一次性）
2. **瀏覽**：主網站 → 每 5 秒查詢 Supabase → 顯示最新資料
3. **編輯**：Admin → 儲存到 Supabase → 主網站自動更新

---

## 🔧 技術規格

### 前端
- **框架**：React 18 + TypeScript
- **建置工具**：Vite
- **UI 框架**：Tailwind CSS + shadcn/ui
- **狀態管理**：React Hooks

### 後端
- **資料庫**：Supabase (PostgreSQL)
- **即時更新**：5 秒輪詢機制
- **資料格式**：JSONB

### 部署
- **平台**：AWS Amplify
- **CI/CD**：GitHub 自動部署
- **環境變數**：Vite 環境變數

---

## 📞 聯絡資訊

### 補助相關問題
- **負責人**：Maggie
- **Email**：[Maggie's email]
- **Slack**：[Maggie's Slack]

### 網站技術相關
- **負責人**：Cindy
- **Email**：[Cindy's email]
- **Slack**：[Cindy's Slack]

---

## 🎉 部署後

### 立即可用功能
✅ 31 個補助計畫展示  
✅ 智慧搜尋與多重篩選  
✅ Admin 後台完整 CRUD  
✅ 即時資料同步（5 秒）  
✅ 響應式設計（手機/平板/桌面）  
✅ 雲端資料庫持久化  

### Maggie 可以做的事
- 新增補助計畫
- 編輯現有計畫
- 刪除過期計畫
- 更新參考資料連結
- 所有變更即時生效

### 未來擴充
- 自訂網域設定
- Google Analytics 追蹤
- SEO 優化
- 更多篩選條件
- 匯出功能

---

## 📚 相關文件連結

- [AWS Amplify 部署指南](./AMPLIFY_DEPLOY_GUIDE.md)
- [詳細部署說明](./DEPLOYMENT_INSTRUCTIONS.md)
- [維護指南（給 Maggie）](./MAINTENANCE_GUIDE.md)
- [專案說明](./README.md)

---

## ✨ 準備好了！

所有程式碼已完成，所有文件已準備好。

**現在只需要：**
1. ✅ 初始化 Supabase（已開啟 init-database.html）
2. 🚀 部署到 AWS Amplify

**預計時間：10 分鐘內完成！**
