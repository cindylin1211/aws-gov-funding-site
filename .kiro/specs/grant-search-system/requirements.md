# Requirements Document

## Introduction

政府補助計畫搜尋器是一個現代化的網頁應用程式，旨在協助企業快速找到適合的政府補助方案。系統提供智能搜尋、多維度篩選、分類瀏覽等功能，讓使用者能夠有效率地探索和比較各種補助計畫。

## Glossary

- **System**: 政府補助計畫搜尋器網頁應用程式
- **User**: 使用系統搜尋補助計畫的企業代表或個人
- **Administrator**: 負責管理和更新補助計畫資料的系統管理員
- **Grant**: 政府提供的補助計畫，包含名稱、類別、金額、對象等資訊
- **Filter**: 用於縮小搜尋結果範圍的條件設定
- **Category**: 補助計畫的分類，包含主分類和子分類
- **Database**: 儲存所有補助計畫資料的 JSON 檔案
- **Data Management Tool**: 用於新增、編輯、刪除和匯入補助計畫資料的管理介面
- **Validation**: 檢查資料格式、完整性和正確性的過程

## Requirements

### Requirement 1

**User Story:** 作為企業代表，我想要搜尋補助計畫，以便快速找到相關的補助方案

#### Acceptance Criteria

1. WHEN User 輸入搜尋關鍵字，THE System SHALL 即時過濾並顯示包含該關鍵字的補助計畫
2. THE System SHALL 在計畫名稱、補助重點、主辦單位欄位中搜尋關鍵字
3. THE System SHALL 顯示符合搜尋條件的補助計畫總數
4. WHEN User 清除搜尋關鍵字，THE System SHALL 顯示所有補助計畫

### Requirement 2

**User Story:** 作為企業代表，我想要依據多個條件篩選補助計畫，以便找到最適合我公司的方案

#### Acceptance Criteria

1. THE System SHALL 提供補助類別、企業規模、金額範圍、主辦機關的篩選選項
2. WHEN User 選擇篩選條件，THE System SHALL 即時更新顯示符合所有條件的補助計畫
3. THE System SHALL 允許 User 同時套用多個篩選條件
4. THE System SHALL 提供清除所有篩選條件的功能
5. WHEN User 選擇主分類，THE System SHALL 更新子分類選項以對應該主分類
6. WHEN User 點擊企業規模篩選按鈕，THE System SHALL 切換該選項的選取狀態
7. WHEN User 再次點擊已選取的企業規模按鈕，THE System SHALL 取消該選項的選取
8. THE System SHALL 允許 User 同時選取多個企業規模選項
9. THE System SHALL 顯示符合任一選取的企業規模條件的補助計畫
10. THE System SHALL 在企業規模按鈕上以視覺方式區分選取和未選取狀態

### Requirement 3

**User Story:** 作為企業代表，我想要查看補助計畫的詳細資訊，以便評估是否適合申請

#### Acceptance Criteria

1. WHEN User 點擊補助計畫卡片，THE System SHALL 開啟詳細資訊彈窗
2. THE System SHALL 在詳細資訊中顯示計畫名稱、補助類別、補助重點、補助對象、補助金額、補助比例、計畫時程、主辦單位、參考資料
3. THE System SHALL 在詳細資訊中提供可點擊的參考資料連結
4. WHEN User 點擊關閉按鈕或彈窗外部區域，THE System SHALL 關閉詳細資訊彈窗

### Requirement 4

**User Story:** 作為企業代表，我想要依據不同條件排序補助計畫，以便優先查看最相關的方案

#### Acceptance Criteria

1. THE System SHALL 提供預設順序、補助金額高到低、補助金額低到高、申請截止日期的排序選項
2. WHEN User 選擇排序方式，THE System SHALL 立即重新排列顯示的補助計畫
3. THE System SHALL 在套用篩選條件後保持選定的排序方式

### Requirement 5

**User Story:** 作為企業代表，我想要在不同裝置上使用系統，以便隨時隨地查詢補助資訊

#### Acceptance Criteria

1. THE System SHALL 在桌面、平板、手機裝置上正確顯示所有功能
2. THE System SHALL 在小螢幕裝置上調整版面配置以提供良好的使用體驗
3. THE System SHALL 在所有裝置上保持一致的功能性

### Requirement 6

**User Story:** 作為企業代表，我想要看到補助計畫的視覺化分類，以便快速瀏覽不同類型的補助

#### Acceptance Criteria

1. THE System SHALL 在篩選區域顯示主分類及其補助計畫數量
2. THE System SHALL 在篩選區域顯示子分類選項
3. WHEN User 選擇分類，THE System SHALL 顯示該分類下的所有補助計畫
4. THE System SHALL 以視覺化方式區分不同的補助類別

### Requirement 7

**User Story:** 作為系統管理員，我想要能夠更新補助資料，以便保持資訊的時效性

#### Acceptance Criteria

1. THE System SHALL 從 JSON 檔案載入補助計畫資料
2. WHEN JSON 檔案更新，THE System SHALL 在重新載入後顯示最新資料
3. THE System SHALL 在資料載入失敗時顯示錯誤訊息
4. THE System SHALL 在資料載入期間顯示載入狀態

### Requirement 8

**User Story:** 作為企業代表，我想要看到補助計畫的關鍵資訊摘要，以便快速比較多個方案

#### Acceptance Criteria

1. THE System SHALL 在卡片上顯示計畫名稱、補助類別、補助金額、主辦單位
2. THE System SHALL 在卡片上顯示適用的企業規模標籤
3. THE System SHALL 使用視覺化設計區分不同類別的補助計畫
4. THE System SHALL 在卡片上提供查看詳細資訊的明確指示

### Requirement 9

**User Story:** 作為企業代表，我想要諮詢線上政府補助小助手，以便獲得即時的補助申請協助

#### Acceptance Criteria

1. THE System SHALL 在頁面右下角顯示固定位置的小助手按鈕
2. THE System SHALL 在小助手按鈕上顯示清晰的圖示和文字標示
3. WHEN User 點擊小助手按鈕，THE System SHALL 開啟聊天介面或對話視窗
4. THE System SHALL 在小助手按鈕上提供視覺回饋（hover 效果、動畫）
5. THE System SHALL 確保小助手按鈕在所有裝置上都可見且易於點擊
6. WHILE User 滾動頁面，THE System SHALL 保持小助手按鈕在固定位置

### Requirement 10

**User Story:** 作為系統管理員，我想要使用資料更新工具來管理補助計畫資料，以便輕鬆地新增、編輯和刪除補助計畫

#### Acceptance Criteria

1. THE System SHALL 提供獨立的資料管理介面供管理員使用
2. THE System SHALL 顯示所有現有補助計畫的列表
3. WHEN Administrator 點擊新增按鈕，THE System SHALL 開啟新增補助計畫表單
4. THE System SHALL 在表單中提供所有必填欄位的輸入控制項
5. WHEN Administrator 提交新增表單，THE System SHALL 驗證資料格式正確性
6. WHEN Administrator 選擇編輯補助計畫，THE System SHALL 開啟預填現有資料的編輯表單
7. WHEN Administrator 儲存變更，THE System SHALL 更新 JSON 資料檔案
8. WHEN Administrator 刪除補助計畫，THE System SHALL 要求確認後移除該計畫
9. THE System SHALL 在資料變更後自動重新計算分類統計數量
10. THE System SHALL 提供匯出功能將資料下載為 JSON 格式

### Requirement 11

**User Story:** 作為系統管理員，我想要批次匯入補助計畫資料，以便快速更新大量資料

#### Acceptance Criteria

1. THE System SHALL 提供 CSV 或 Excel 檔案匯入功能
2. THE System SHALL 提供資料範本下載功能
3. WHEN Administrator 上傳檔案，THE System SHALL 驗證檔案格式
4. THE System SHALL 顯示匯入預覽讓管理員確認資料
5. WHEN Administrator 確認匯入，THE System SHALL 處理並儲存所有有效資料
6. THE System SHALL 顯示匯入結果報告包含成功和失敗的記錄數
7. IF 資料驗證失敗，THE System SHALL 顯示詳細錯誤訊息和錯誤位置

### Requirement 12

**User Story:** 作為系統管理員，我想要驗證補助計畫資料的完整性和正確性，以便確保資料品質

#### Acceptance Criteria

1. THE System SHALL 驗證所有必填欄位已填寫
2. THE System SHALL 驗證補助金額格式符合規範
3. THE System SHALL 驗證日期格式正確
4. THE System SHALL 驗證 URL 連結格式正確
5. THE System SHALL 檢查補助類別和子分類的對應關係
6. THE System SHALL 檢查企業規模和金額分類的有效值
7. WHEN 資料驗證失敗，THE System SHALL 顯示具體的錯誤訊息和修正建議
8. THE System SHALL 在儲存前執行完整的資料驗證
