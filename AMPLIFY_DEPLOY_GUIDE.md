# AWS Amplify 部署指南

## 🎯 快速部署步驟

### 1. 初始化 Supabase 資料庫（必須先做）

**方式 A：使用瀏覽器（最簡單）**
1. 用瀏覽器開啟專案中的 `init-database.html`
2. 點擊「開始初始化資料庫」按鈕
3. 等待成功訊息

**方式 B：部署後再初始化**
1. 先完成 Amplify 部署
2. 開啟部署後的網站
3. 按 F12 開啟開發者工具
4. 在 Console 貼上以下程式碼：

```javascript
async function initDB() {
  const response = await fetch('/grants-database.json');
  const data = await response.json();
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    'https://uijhsmfimsscmfycsrhr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs'
  );
  const result = await supabase.from('grants').upsert({
    id: 'grants-data',
    data: data.grants,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  console.log(result.error ? '❌ 失敗' : '✅ 成功！');
}
initDB();
```

---

### 2. 部署到 AWS Amplify

#### 選項 A：從 GitHub 部署（推薦）

1. **登入 AWS Console**
   - 前往 AWS Amplify: https://console.aws.amazon.com/amplify/

2. **建立新應用程式**
   - 點擊「New app」 > 「Host web app」
   - 選擇「GitHub」

3. **連接 Repository**
   - 授權 GitHub 存取
   - 選擇 repository: `cindylin1211/aws-gov-funding-site`
   - 選擇 branch: `main`

4. **設定 Build Settings**
   
   Amplify 會自動偵測到這是 Vite 專案，build settings 應該是：
   
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **設定環境變數**
   
   在「Environment variables」區域新增：
   
   ```
   VITE_SUPABASE_URL = https://uijhsmfimsscmfycsrhr.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs
   ```

6. **儲存並部署**
   - 點擊「Save and deploy」
   - 等待部署完成（約 3-5 分鐘）

#### 選項 B：手動部署（使用 dist 資料夾）

1. **登入 AWS Console**
   - 前往 AWS Amplify

2. **建立新應用程式**
   - 點擊「New app」 > 「Host web app」
   - 選擇「Deploy without Git provider」

3. **上傳 dist 資料夾**
   - 將 `dist` 資料夾壓縮成 zip
   - 上傳 zip 檔案
   - 設定 App name

4. **完成部署**
   - 點擊「Save and deploy」

---

### 3. 驗證部署

部署完成後，測試以下功能：

#### ✅ 主網站功能
- [ ] 開啟網站，看到 31 個補助計畫
- [ ] 搜尋功能正常
- [ ] 篩選功能正常
- [ ] 補助卡片顯示正確

#### ✅ Admin 功能
- [ ] 訪問 `/admin` 頁面
- [ ] 看到所有 31 個計畫
- [ ] 可以編輯現有計畫
- [ ] 可以新增計畫
- [ ] 可以刪除計畫
- [ ] 儲存後資料保持（重新整理後不會消失）

#### ✅ 即時更新
- [ ] 在 Admin 編輯資料
- [ ] 回到主網站
- [ ] 5 秒內看到更新（或手動重新整理）

---

### 4. 設定自訂網域（選用）

1. 在 Amplify Console 點擊「Domain management」
2. 點擊「Add domain」
3. 輸入您的網域名稱
4. 按照指示設定 DNS 記錄

---

## 🔧 常見問題

### Q1: 部署後網站顯示空白
**A:** 檢查：
- Build 是否成功
- 環境變數是否設定正確
- 瀏覽器 Console 是否有錯誤

### Q2: Admin 儲存後資料消失
**A:** 檢查：
- Supabase 是否已初始化
- 環境變數是否正確
- 網路連線是否正常

### Q3: 主網站沒有顯示資料
**A:** 檢查：
- Supabase 資料庫是否有資料
- 執行初始化腳本
- 重新整理頁面

### Q4: 編輯後主網站沒有更新
**A:** 
- 等待 5 秒（輪詢間隔）
- 手動重新整理頁面
- 檢查 Supabase 資料是否更新

---

## 📞 支援

- **補助相關問題**：Maggie
- **網站技術相關**：Cindy

---

## 📚 相關文件

- `DEPLOYMENT_INSTRUCTIONS.md` - 詳細部署說明
- `MAINTENANCE_GUIDE.md` - Maggie 維護指南
- `README.md` - 專案說明
- `supabase-setup.sql` - 資料庫設定

---

## 🎉 完成！

部署完成後，您的補助計畫網站就上線了！

**網站功能：**
- ✅ 31 個補助計畫展示
- ✅ 智慧搜尋與篩選
- ✅ Admin 後台管理
- ✅ 即時資料同步
- ✅ 響應式設計
- ✅ 雲端資料庫

**下一步：**
1. 測試所有功能
2. 分享網址給團隊
3. 開始使用 Admin 管理補助計畫
