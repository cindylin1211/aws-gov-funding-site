import { createClient } from '@supabase/supabase-js';
import grantsDatabase from '../public/grants-database.json';

const SUPABASE_URL = "https://uijhsmfimsscmfycsrhr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamhzbWZpbXNzY21meWNzcmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU3OTAsImV4cCI6MjA3NDEyMTc5MH0.RRkluAiZtnJU_AquD6rQnQeslaNC2MlzXPYdWcJwSRs";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function initializeSupabase() {
  try {
    console.log('開始初始化 Supabase...');
    console.log('準備寫入', grantsDatabase.grants.length, '個補助計畫');

    // 先刪除所有現有資料
    console.log('清除現有資料...');
    const { error: deleteError } = await supabase
      .from('grants')
      .delete()
      .neq('id', 'impossible-id-to-match-nothing'); // 刪除所有資料

    if (deleteError) {
      console.error('刪除資料時發生錯誤:', deleteError);
    }

    // 插入新資料
    console.log('插入新資料...');
    const { data, error } = await supabase
      .from('grants')
      .insert({
        id: 'grants-data',
        data: grantsDatabase.grants
      })
      .select();

    if (error) {
      console.error('插入資料時發生錯誤:', error);
      throw error;
    }

    console.log('✅ 成功初始化 Supabase！');
    console.log('已寫入', grantsDatabase.grants.length, '個補助計畫');
    console.log('資料:', data);

    // 驗證資料
    console.log('\n驗證資料...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('grants')
      .select('*');

    if (verifyError) {
      console.error('驗證資料時發生錯誤:', verifyError);
    } else {
      console.log('✅ 驗證成功！');
      console.log('資料庫中共有', verifyData?.length, '筆記錄');
      if (verifyData && verifyData.length > 0) {
        const grants = verifyData.flatMap((row: any) => row.data);
        console.log('共有', grants.length, '個補助計畫');
      }
    }

  } catch (error) {
    console.error('❌ 初始化失敗:', error);
    process.exit(1);
  }
}

initializeSupabase();
