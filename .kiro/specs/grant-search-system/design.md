# Design Document

## Overview

政府補助計畫搜尋器採用現代化的前端架構，使用 React 18 + TypeScript 建構，搭配 Tailwind CSS 和 Shadcn/ui 組件庫。系統採用客戶端渲染架構，資料儲存在靜態 JSON 檔案中，透過自定義 Hook 管理狀態和篩選邏輯。

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (Client)                             │
├─────────────────────────────────────────────────────────────────┤
│  React Application                                               │
│  ┌─────────────────────┐  ┌──────────────────────┐             │
│  │  Public Pages       │  │  Admin Pages         │             │
│  │  - Index            │  │  - Admin             │             │
│  │  - NotFound         │  │                      │             │
│  └──────────┬──────────┘  └──────────┬───────────┘             │
│             │                        │                          │
│  ┌──────────▼──────────┐  ┌──────────▼───────────┐            │
│  │  Public Components  │  │  Admin Components    │            │
│  │  - SearchBar        │  │  - GrantForm         │            │
│  │  - FilterSection    │  │  - GrantList         │            │
│  │  - GrantCard        │  │  - ImportDialog      │            │
│  │  - GrantModal       │  │  - DataValidator     │            │
│  │  - ChatAssistant    │  │                      │            │
│  └──────────┬──────────┘  └──────────┬───────────┘            │
│             │                        │                          │
│             └────────┬───────────────┘                          │
│                      │                                          │
│             ┌────────▼────────┐                                │
│             │  Custom Hooks   │                                │
│             │  - useGrantsData│                                │
│             │  - useDataMgmt  │                                │
│             └────────┬────────┘                                │
│                      │                                          │
│             ┌────────▼────────┐                                │
│             │  Utilities      │                                │
│             │  - Validator    │                                │
│             │  - FileParser   │                                │
│             │  - DataExporter │                                │
│             └────────┬────────┘                                │
│                      │                                          │
│             ┌────────▼────────┐                                │
│             │  Types/Models   │                                │
│             │  - Grant        │                                │
│             └─────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │ READ / WRITE
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Static JSON Database                                │
│              (grants-database.json)                              │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Routing**: React Router DOM
- **Data Storage**: Static JSON file

## Components and Interfaces

### Core Components

#### 1. Index Page (`src/pages/Index.tsx`)
主要頁面組件，整合所有功能模組。

**Responsibilities:**
- 渲染整體頁面結構（Hero、Filters、Results）
- 管理選中的補助計畫和彈窗狀態
- 處理排序邏輯
- 協調各子組件的互動

**Props:** None (root component)

**State:**
- `selectedGrant`: 當前選中的補助計畫
- `isModalOpen`: 彈窗開啟狀態
- `sortBy`: 排序方式

#### 2. SearchBar Component (`src/components/SearchBar.tsx`)
搜尋輸入組件。

**Props:**
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}
```

**Responsibilities:**
- 接收使用者輸入
- 即時更新搜尋關鍵字
- 提供清除功能

#### 3. FilterSection Component (`src/components/FilterSection.tsx`)
篩選條件區域組件。

**Props:**
```typescript
interface FilterSectionProps {
  filters: Filters;
  onFilterChange: (filterType: string, value: string) => void;
  categoriesData: any;
  filtersData: any;
  totalGrantsCount: number;
  allGrants: Grant[];
}
```

**Responsibilities:**
- 顯示所有篩選選項
- 處理篩選條件變更
- 顯示各篩選選項的補助計畫數量
- 提供清除篩選功能

#### 4. GrantCard Component (`src/components/GrantCard.tsx`)
補助計畫卡片組件。

**Props:**
```typescript
interface GrantCardProps {
  grant: Grant;
  onClick: () => void;
}
```

**Responsibilities:**
- 顯示補助計畫摘要資訊
- 處理點擊事件
- 視覺化呈現補助類別和企業規模

#### 5. GrantModal Component (`src/components/GrantModal.tsx`)
補助計畫詳細資訊彈窗組件。

**Props:**
```typescript
interface GrantModalProps {
  grant: Grant | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Responsibilities:**
- 顯示完整的補助計畫資訊
- 處理彈窗開關
- 提供參考資料連結

#### 6. ChatAssistant Component (`src/components/ChatAssistant.tsx`)
線上政府補助小助手組件。

**Props:**
```typescript
interface ChatAssistantProps {
  // 可選：自訂位置、樣式等
}
```

**Responsibilities:**
- 顯示固定在右下角的浮動按鈕
- 處理按鈕點擊事件
- 開啟/關閉聊天介面
- 提供視覺回饋和動畫效果
- 響應式設計適配不同裝置

**State:**
- `isOpen`: 聊天視窗開啟狀態
- `hasNewMessage`: 是否有新訊息提示

### Data Management Components

#### 7. AdminPage Component (`src/pages/Admin.tsx`)
資料管理主頁面組件。

**Props:** None (root component)

**Responsibilities:**
- 渲染資料管理介面
- 顯示補助計畫列表
- 提供新增、編輯、刪除功能入口
- 處理批次匯入功能
- 管理資料驗證和儲存

**State:**
- `grants`: 所有補助計畫資料
- `selectedGrant`: 當前選中的補助計畫
- `isFormOpen`: 表單開啟狀態
- `formMode`: 'add' | 'edit'
- `isImportOpen`: 匯入對話框開啟狀態

#### 8. GrantForm Component (`src/components/admin/GrantForm.tsx`)
補助計畫表單組件。

**Props:**
```typescript
interface GrantFormProps {
  grant?: Grant | null;
  mode: 'add' | 'edit';
  onSave: (grant: Grant) => void;
  onCancel: () => void;
}
```

**Responsibilities:**
- 顯示補助計畫輸入表單
- 處理表單驗證
- 提供所有欄位的輸入控制項
- 處理表單提交和取消

**Validation:**
- 必填欄位檢查
- 格式驗證（URL、日期、金額）
- 分類對應關係檢查

#### 9. GrantList Component (`src/components/admin/GrantList.tsx`)
補助計畫列表組件。

**Props:**
```typescript
interface GrantListProps {
  grants: Grant[];
  onEdit: (grant: Grant) => void;
  onDelete: (grantId: string) => void;
  onExport: () => void;
}
```

**Responsibilities:**
- 顯示所有補助計畫的表格
- 提供搜尋和篩選功能
- 處理編輯和刪除操作
- 提供匯出功能

#### 10. ImportDialog Component (`src/components/admin/ImportDialog.tsx`)
資料匯入對話框組件。

**Props:**
```typescript
interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Grant[]) => void;
}
```

**Responsibilities:**
- 處理檔案上傳（CSV/Excel）
- 解析檔案內容
- 顯示匯入預覽
- 驗證資料格式
- 顯示匯入結果報告

### Custom Hooks

#### useGrantsData Hook (`src/hooks/useGrantsData.ts`)

**Purpose:** 管理補助資料的載入、篩選、排序邏輯

**Return Value:**
```typescript
{
  grantsData: GrantsDatabase | null;
  filteredGrants: Grant[];
  filters: Filters;
  loading: boolean;
  error: string | null;
  updateFilter: (filterType: string, value: string) => void;
  clearAllFilters: () => void;
  sortGrants: (grants: Grant[], sortBy: string) => Grant[];
}
```

**Responsibilities:**
- 從 JSON 檔案載入資料
- 管理篩選狀態
- 執行多維度篩選邏輯
- 提供排序功能
- 處理載入和錯誤狀態

**Filtering Logic:**
- Search: 在計畫名稱、補助重點、主辦單位中搜尋
- Main Category: 精確匹配補助類別
- Sub Category: 精確匹配子分類
- Company Size: 檢查企業規模陣列是否包含選定值
- Grant Amount: 精確匹配金額分類
- Agency: 精確匹配主辦機關分類

#### useDataManagement Hook (`src/hooks/useDataManagement.ts`)

**Purpose:** 管理補助資料的新增、編輯、刪除和匯入功能

**Return Value:**
```typescript
{
  grants: Grant[];
  loading: boolean;
  error: string | null;
  addGrant: (grant: Grant) => Promise<void>;
  updateGrant: (id: string, grant: Grant) => Promise<void>;
  deleteGrant: (id: string) => Promise<void>;
  importGrants: (grants: Grant[]) => Promise<ImportResult>;
  exportGrants: () => void;
  validateGrant: (grant: Partial<Grant>) => ValidationResult;
  recalculateStats: () => void;
}
```

**Responsibilities:**
- 管理補助計畫的 CRUD 操作
- 處理資料驗證
- 執行批次匯入
- 提供資料匯出功能
- 自動重新計算分類統計

### Utility Functions

#### DataValidator (`src/utils/dataValidator.ts`)

**Purpose:** 驗證補助計畫資料的完整性和正確性

**Functions:**
```typescript
validateGrant(grant: Partial<Grant>): ValidationResult
validateRequiredFields(grant: Partial<Grant>): string[]
validateURLFormat(url: string): boolean
validateDateFormat(date: string): boolean
validateAmountFormat(amount: string): boolean
validateCategoryMapping(mainCategory: string, subCategory: string): boolean
```

#### FileParser (`src/utils/fileParser.ts`)

**Purpose:** 解析 CSV 和 Excel 檔案

**Functions:**
```typescript
parseCSV(file: File): Promise<Grant[]>
parseExcel(file: File): Promise<Grant[]>
generateTemplate(): Blob
```

#### DataExporter (`src/utils/dataExporter.ts`)

**Purpose:** 匯出資料為不同格式

**Functions:**
```typescript
exportToJSON(grants: Grant[]): void
exportToCSV(grants: Grant[]): void
exportToExcel(grants: Grant[]): void
```

## Data Models

### Grant Interface

```typescript
interface Grant {
  id: string;                    // 唯一識別碼
  計畫名稱: string;              // 補助計畫名稱
  補助類別: string;              // 主分類（數位轉型、創新研發、人才培訓）
  子分類: string;                // 細分類別
  補助重點: string;              // 補助計畫重點說明
  補助對象: string[];            // 適用對象列表
  補助金額: string;              // 補助金額說明
  補助比例上限: string;          // 補助比例
  計畫時程: string;              // 申請時間與計畫期程
  主辦單位: string;              // 主辦機關名稱
  參考資料: {                    // 參考連結
    text: string;
    url: string;
  }[];
  企業規模: string[];            // 適用企業規模
  金額分類: string;              // 金額分類標籤
  主辦機關分類: string;          // 主辦機關分類
}
```

### Filters Interface

```typescript
interface Filters {
  search: string;           // 搜尋關鍵字
  mainCategory: string;     // 主分類
  subCategory: string;      // 子分類
  companySize: string;      // 企業規模
  grantAmount: string;      // 金額範圍
  agency: string;           // 主辦機關
}
```

### GrantsDatabase Interface

```typescript
interface GrantsDatabase {
  grants: Grant[];          // 所有補助計畫
  categories: {             // 分類資訊
    main: {
      id: string;
      name: string;
      count: number;
      subcategories: string[];
    }[];
  };
  filters: {                // 篩選選項
    companySize: string[];
    grantAmount: string[];
    agency: string[];
  };
}
```

## Error Handling

### Data Loading Errors

**Scenario:** JSON 檔案載入失敗

**Handling:**
1. Catch fetch errors in useGrantsData hook
2. Set error state with descriptive message
3. Display error alert in UI with AlertCircle icon
4. Prevent rendering of main content

**User Experience:**
- Show centered error message
- Provide clear error description
- Suggest possible solutions (check network, refresh page)

### Empty Results

**Scenario:** 篩選後無符合結果

**Handling:**
1. Check if filteredGrants.length === 0
2. Display empty state message
3. Show search icon and helpful text
4. Suggest adjusting filters

**User Experience:**
- Clear visual indication of empty state
- Actionable suggestions
- Maintain filter state for easy adjustment

### Invalid Data Format

**Scenario:** JSON 資料格式不符預期

**Handling:**
1. TypeScript type checking at compile time
2. Runtime validation in useGrantsData
3. Graceful degradation for missing fields
4. Console logging for debugging

## Testing Strategy

### Unit Testing

**Components to Test:**
- SearchBar: input handling, clear functionality
- FilterSection: filter updates, clear all filters
- GrantCard: display logic, click handling
- GrantModal: open/close behavior, data display

**Hooks to Test:**
- useGrantsData: filtering logic, sorting logic, data loading

**Test Framework:** Vitest + React Testing Library

**Key Test Cases:**
1. Search filtering with various keywords
2. Multiple filter combinations
3. Sorting by different criteria
4. Empty state handling
5. Error state handling
6. Modal open/close interactions

### Integration Testing

**Scenarios:**
1. Complete user flow: search → filter → view details
2. Filter combination effects on results
3. Sort + filter interactions
4. Data loading and error recovery

### Manual Testing Checklist

**Functionality:**
- [ ] Search works across all searchable fields
- [ ] All filters apply correctly
- [ ] Filter combinations work as expected
- [ ] Sorting maintains filter state
- [ ] Modal displays complete information
- [ ] Links in modal are clickable and valid

**Responsive Design:**
- [ ] Desktop layout (1920px, 1440px, 1024px)
- [ ] Tablet layout (768px)
- [ ] Mobile layout (375px, 414px)
- [ ] Filter section adapts on mobile
- [ ] Modal is usable on all screen sizes

**Performance:**
- [ ] Initial load time < 2 seconds
- [ ] Filter/search response feels instant
- [ ] No lag when scrolling results
- [ ] Smooth animations and transitions

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Sufficient color contrast
- [ ] Focus indicators visible

## Design Decisions and Rationales

### 1. Client-Side Filtering vs Server-Side

**Decision:** Client-side filtering using useMemo

**Rationale:**
- Dataset size is manageable (< 1000 grants expected)
- Instant response time for better UX
- Simpler architecture without backend
- Easier deployment as static site
- Lower hosting costs

**Trade-offs:**
- Initial load includes all data
- Not suitable for very large datasets
- No server-side search optimization

### 2. JSON File vs Database

**Decision:** Static JSON file for data storage

**Rationale:**
- Simple deployment and maintenance
- No database infrastructure needed
- Easy to update by non-technical users
- Version control friendly
- Fast read performance

**Trade-offs:**
- Manual data updates required
- No real-time updates
- Limited to read-only operations
- Not suitable for user-generated content

### 3. Custom Hook for Data Management

**Decision:** useGrantsData custom hook

**Rationale:**
- Separation of concerns
- Reusable logic
- Easier testing
- Clean component code
- Centralized state management

### 4. Component-Based Architecture

**Decision:** Small, focused components

**Rationale:**
- Better maintainability
- Easier testing
- Reusability
- Clear responsibilities
- Follows React best practices

### 5. Tailwind CSS + Shadcn/ui

**Decision:** Utility-first CSS with pre-built components

**Rationale:**
- Rapid development
- Consistent design system
- Accessible components out of the box
- Customizable and themeable
- Good developer experience

## Future Enhancements

### Potential Improvements

1. **Backend Integration**
   - Move to database for larger datasets
   - Add admin panel for data management
   - Implement user accounts and saved searches

2. **Advanced Features**
   - Save favorite grants
   - Email notifications for new grants
   - Comparison tool for multiple grants
   - Export results to PDF/Excel

3. **Search Enhancements**
   - Fuzzy search
   - Search suggestions
   - Search history
   - Advanced search operators

4. **Analytics**
   - Track popular searches
   - Monitor filter usage
   - User behavior insights
   - Grant popularity metrics

5. **Internationalization**
   - Multi-language support
   - Localized content
   - Regional grant filtering
