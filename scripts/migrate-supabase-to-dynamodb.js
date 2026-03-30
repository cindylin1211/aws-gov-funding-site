import { createClient } from '@supabase/supabase-js';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const supabaseUrl = 'https://yttfrncgkgiodnartgbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGZybmNna2dpb2RuYXJ0Z2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI1MTIsImV4cCI6MjA4Mzk0ODUxMn0.jpIl9r6ZAqWSvPpuIxb6_IJTFiRWVdIedHc1pTg_Tew';

const supabase = createClient(supabaseUrl, supabaseKey);

const client = new DynamoDBClient({ region: 'us-west-2' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'government-grants';

async function migrateData() {
  try {
    console.log('從 Supabase 載入資料...\n');
    
    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('❌ Supabase 沒有資料');
      return;
    }
    
    // 取得所有補助資料
    const grants = data[0].data;
    console.log(`✅ 從 Supabase 載入了 ${grants.length} 個補助計畫\n`);
    
    // 上傳到 DynamoDB
    console.log('開始遷移到 DynamoDB...\n');
    
    for (const grant of grants) {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: grant
      });
      
      await docClient.send(command);
      console.log(`✓ 已遷移: ${grant.計畫名稱}`);
    }
    
    console.log(`\n✅ 遷移完成！共遷移 ${grants.length} 個補助計畫到 DynamoDB`);
    
  } catch (error) {
    console.error('❌ 遷移失敗:', error);
    process.exit(1);
  }
}

migrateData();
