# 🚀 立即部署指南（簡化版）

## ⚠️ 重要：先部署，後初始化

由於本地 HTML 檔案有 CORS 限制，我們改用以下流程：
1. **先部署到 Amplify**
2. **再用部署後的網站初始化資料庫**

---

## 步驟 1：部署到 AWS Amplify（5 分鐘）

### 1.1 開啟 AWS Amplify Console
```
https://console.aws.amazon.com/amplify/
```

### 1.2 建立新應用程式
1. 點擊「**New app**」
2. 選擇「**Host web app**」
3. 選擇「**GitHub**」

### 1.3 連接 Repository
1. 授權 GitHub（如果還沒授權）
2. 選擇 Repository：`cindylin1211/aws-gov-funding-site`
3. 選擇 Branch：`main`
4. 點擊「**Next**」

### 1.4 設定 Build Settings
Amplify 會自動偵測，確認以下設定：

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

點擊「**Next**」

### 1.5 設定環境變數（重要！）

在「**Environment variables**」區域，點擊「**Add environment variable**」，新增以下兩個變數：

**變數 1：**
```
Key: VITE_SUPABASE_URL
Value: https://yttfrncgkgiodnartgbf.supabase.co
```

**變數 2：**
```
Key: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGZybmNna2dpb2RuYXJ0Z2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI1MTIsImV4cCI6MjA4Mzk0ODUxMn0.jpIl9r6ZAqWSvPpuIxb6_IJTFiRWVdIedHc1pTg_Tew
```

### 1.6 開始部署
1. 點擊「**Save and deploy**」
2. 等待 3-5 分鐘
3. 部署完成後，會看到一個網址，例如：
   ```
   https://main.d1234567890.amplifyapp.com
   ```

---

## 步驟 2：初始化 Supabase 資料庫（2 分鐘）

### 2.1 開啟部署後的網站
複製 Amplify 給你的網址，在瀏覽器開啟

### 2.2 開啟開發者工具
按 **F12** 或右鍵選擇「檢查」

### 2.3 執行初始化腳本
在 **Console** 分頁中，貼上以下程式碼並按 Enter：

```javascript
async function initDB() {
  console.log('🔄 開始初始化...');
  
  // 載入資料
  const response = await fetch('/grants-database.json');
  const data = await response.json();
  console.log(`📊 找到 ${data.grants.length} 個補助計畫`);
  
  // 載入 Supabase
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    'https://yttfrncgkgiodnartgbf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGZybmNna2dpb2RuYXJ0Z2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI1MTIsImV4cCI6MjA4Mzk0ODUxMn0.jpIl9r6ZAqWSvPpuIxb6_IJTFiRWVdIedHc1pTg_Tew'
  );
  
  console.log('📤 上傳到 Supabase...');
  
  // 上傳資料
  const result = await supabase.from('grants').upsert({
    id: 'grants-data',
    data: data.grants,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  
  if (result.error) {
    console.error('❌ 失敗:', result.error);
  } else {
    console.log('✅ 成功！已上傳 31 個補助計畫');
    console.log('🎉 現在可以使用 Admin 頁面了！');
  }
}

initDB();
```

### 2.4 確認成功
你應該會在 Console 看到：
```
🔄 開始初始化...
📊 找到 31 個補助計畫
📤 上傳到 Supabase...
✅ 成功！已上傳 31 個補助計畫
🎉 現在可以使用 Admin 頁面了！
```

---

## 步驟 3：測試功能（3 分鐘）

### 3.1 測試主網站
重新整理頁面，確認：
- [ ] 看到 31 個補助計畫
- [ ] 搜尋功能正常
- [ ] 篩選功能正常

### 3.2 測試 Admin 頁面
訪問：`https://[你的網址]/admin`

確認：
- [ ] 看到所有 31 個計畫
- [ ] 可以編輯計畫
- [ ] 可以新增計畫
- [ ] 儲存後重新整理，資料保持

### 3.3 測試即時更新
1. 在 Admin 編輯一個計畫
2. 回到主網站
3. 等待 5 秒或重新整理
4. [ ] 確認看到更新

---

## 🎉 完成！

現在你的網站已經完全運作了！

**網站網址**：`https://[你的 Amplify 網址]`  
**Admin 後台**：`https://[你的 Amplify 網址]/admin`

---

## 📞 如果遇到問題

### 問題 1：部署失敗
- 檢查環境變數是否正確設定
- 檢查 GitHub repository 是否可存取

### 問題 2：初始化腳本執行失敗
**可能原因：Supabase 資料表尚未建立**

**解決方法：**
1. 登入 Supabase Dashboard：https://supabase.com/dashboard
2. 選擇專案：uijhsmfimsscmfycsrhr
3. 點擊左側「SQL Editor」
4. 貼上 `supabase-setup.sql` 的內容並執行
5. 再次執行初始化腳本

### 問題 3：Admin 儲存後資料消失
- 確認初始化腳本已成功執行
- 檢查瀏覽器 Console 是否有錯誤

---

## 📋 快速檢查清單

- [ ] 步驟 1：部署到 Amplify（設定環境變數）
- [ ] 步驟 2：開啟部署後的網站
- [ ] 步驟 3：按 F12 執行初始化腳本
- [ ] 步驟 4：確認看到成功訊息
- [ ] 步驟 5：測試主網站功能
- [ ] 步驟 6：測試 Admin 功能
- [ ] 步驟 7：測試即時更新

**預計總時間：10 分鐘**

---

## 🎯 下一步

部署完成後：
1. 分享網址給團隊
2. 讓 Maggie 開始使用 Admin 管理補助計畫
3. 參考 `MAINTENANCE_GUIDE.md` 了解日常維護

**補助相關問題找 Maggie**  
**網站技術相關找 Cindy**
