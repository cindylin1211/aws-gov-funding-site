import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yttfrncgkgiodnartgbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGZybmNna2dpb2RuYXJ0Z2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI1MTIsImV4cCI6MjA4Mzk0ODUxMn0.jpIl9r6ZAqWSvPpuIxb6_IJTFiRWVdIedHc1pTg_Tew';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking Supabase grants table...\n');
  
  // Check grants table
  const { data, error, count } = await supabase
    .from('grants')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('Details:', error);
  } else {
    console.log(`✅ Grants table exists with ${count} records`);
    if (data && data.length > 0) {
      console.log('\nFirst record:');
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
}

checkTables();
