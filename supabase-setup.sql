-- 建立補助計畫資料表
CREATE TABLE IF NOT EXISTS grants (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;

-- 允許所有人讀取
CREATE POLICY "Allow public read access" ON grants
FOR SELECT USING (true);

-- 允許認證用戶寫入（你可以之後調整權限）
CREATE POLICY "Allow authenticated insert" ON grants
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON grants
FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON grants
FOR DELETE USING (true);
