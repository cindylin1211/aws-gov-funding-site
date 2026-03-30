// Simple Node.js script to initialize Supabase with grant data
// Run with: node initialize-supabase.js

import fs from 'fs';
import https from 'https';

const SUPABASE_URL = "https://yttfrncgkgiodnartgbf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGZybmNna2dpb2RuYXJ0Z2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI1MTIsImV4cCI6MjA4Mzk0ODUxMn0.jpIl9r6ZAqWSvPpuIxb6_IJTFiRWVdIedHc1pTg_Tew";

async function initializeSupabase() {
  try {
    console.log('讀取補助資料...');
    const grantsData = JSON.parse(fs.readFileSync('./public/grants-database.json', 'utf8'));
    const grants = grantsData.grants;
    
    console.log(`找到 ${grants.length} 個補助計畫`);
    
    // Prepare the data
    const payload = {
      id: 'grants-data',
      data: grants,
      updated_at: new Date().toISOString()
    };
    
    const postData = JSON.stringify(payload);
    
    console.log('正在上傳到 Supabase...');
    
    const options = {
      hostname: 'uijhsmfimsscmfycsrhr.supabase.co',
      port: 443,
      path: '/rest/v1/grants',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log('✅ 成功！已將 31 個補助計畫上傳到 Supabase');
          console.log('現在可以部署到 Amplify 了');
        } else {
          console.error('❌ 上傳失敗');
          console.error('狀態碼:', res.statusCode);
          console.error('回應:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ 錯誤:', error.message);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
  }
}

initializeSupabase();
