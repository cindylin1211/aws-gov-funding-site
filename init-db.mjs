// Initialize Supabase database with grant data
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://uijhsmfimsscmfycsrhr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs";

async function initializeDatabase() {
  try {
    console.log('🔄 讀取補助資料...');
    const grantsData = JSON.parse(fs.readFileSync('./public/grants-database.json', 'utf8'));
    const grants = grantsData.grants;
    
    console.log(`📊 找到 ${grants.length} 個補助計畫`);
    
    console.log('🔌 連接 Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    console.log('📤 上傳資料到 Supabase...');
    const { data, error } = await supabase
      .from('grants')
      .upsert({
        id: 'grants-data',
        data: grants,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (error) {
      console.error('❌ 上傳失敗:', error.message);
      console.error('詳細錯誤:', error);
      process.exit(1);
    }
    
    console.log('✅ 成功！已將 31 個補助計畫上傳到 Supabase');
    console.log('');
    console.log('📋 下一步：');
    console.log('1. 將 dist 資料夾部署到 AWS Amplify');
    console.log('2. 部署後，Admin 頁面可以編輯資料');
    console.log('3. 主網站會在 5 秒內自動更新');
    
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
