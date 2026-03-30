# 🚀 部署指南

## 當前狀態
✅ 程式碼已完成並 build 完成  
✅ dist 資料夾已準備好部署  
⚠️ Supabase 資料庫需要初始化（31 個補助計畫）

---

## 方案 1：先部署，後初始化（推薦）

### 步驟 1：部署到 AWS Amplify
1. 將整個專案推送到 GitHub（已完成）
2. 在 AWS Amplify 連接 GitHub repository
3. 設定環境變數：
   ```
   VITE_SUPABASE_URL=https://uijhsmfimsscmfycsrhr.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs
   ```
4. 部署

### 步驟 2：初始化 Supabase 資料庫
部署完成後，有 3 種方式初始化：

#### 方式 A：使用部署後的網站（最簡單）
1. 開啟部署後的網站
2. 在瀏覽器按 F12 開啟開發者工具
3. 在 Console 貼上以下程式碼：

```javascript
// 初始化 Supabase 資料庫
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
  
  if (result.error) {
    console.error('❌ 錯誤:', result.error);
  } else {
    console.log('✅ 成功！已上傳 31 個補助計畫');
  }
}

initDB();
```

#### 方式 B：使用 Supabase Dashboard SQL Editor
1. 登入 Supabase Dashboard: https://supabase.com/dashboard
2. 選擇專案: uijhsmfimsscmfycsrhr
3. 點選左側 "SQL Editor"
4. 執行以下 SQL（資料在下方）

#### 方式 C：使用 Supabase Dashboard Table Editor
1. 登入 Supabase Dashboard
2. 選擇專案: uijhsmfimsscmfycsrhr
3. 點選左側 "Table Editor" > "grants"
4. 點選 "Insert" > "Insert row"
5. 填入：
   - id: `grants-data`
   - data: 複製 `public/grants-database.json` 中的 grants 陣列
   - created_at: 自動
   - updated_at: 自動

---

## 方案 2：先初始化，後部署

### 步驟 1：手動初始化 Supabase
使用上述方式 B 或 C 初始化資料庫

### 步驟 2：部署到 Amplify
按照方案 1 的步驟 1 部署

---

## 驗證部署成功

1. **主網站**：開啟網站，應該看到 31 個補助計畫
2. **Admin 頁面**：訪問 `/admin`，應該能看到並編輯所有計畫
3. **即時更新**：在 Admin 編輯後，主網站應在 5 秒內更新

---

## 如果遇到問題

### 問題 1：Admin 儲存後資料沒有保存
- 檢查 Supabase 是否已初始化
- 檢查瀏覽器 Console 是否有錯誤訊息
- 確認環境變數設定正確

### 問題 2：主網站沒有顯示資料
- 檢查 Supabase 資料庫是否有資料
- 檢查網路連線
- 重新整理頁面

### 問題 3：編輯後主網站沒有更新
- 等待 5 秒（輪詢間隔）
- 手動重新整理頁面
- 檢查 Supabase 資料是否真的更新了

---

## 聯絡資訊

- **補助相關問題**：Maggie | maggie@example.com | Slack
- **網站技術相關**：Cindy | cindy@example.com | Slack

---

## 附錄：SQL 初始化腳本

如果使用方式 B（SQL Editor），請執行：

```sql
-- 先刪除舊資料（如果有）
DELETE FROM grants WHERE id = 'grants-data';

-- 插入新資料
-- 注意：需要將 public/grants-database.json 中的 grants 陣列複製到下方的 data 欄位
INSERT INTO grants (id, data, updated_at)
VALUES (
  'grants-data',
  '[]'::jsonb,  -- 這裡需要替換成實際的 grants 陣列
  NOW()
);
```

由於 SQL 腳本太長，建議使用方式 A（瀏覽器 Console）或方式 C（Table Editor）。
