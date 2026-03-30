const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wljaklyrlhubgcdnacia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsamFrbHlybGh1YmdjZG5hY2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjY3NjIsImV4cCI6MjA3NDcwMjc2Mn0.bN37ROUWndxWVLOPY_jnC-uR8sUqaUzAt9AUepAz21I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  try {
    console.log('Checking Supabase tables...\n');
    
    // Try to query grants table
    const { data: grants, error: grantsError, count } = await supabase
      .from('grants')
      .select('*', { count: 'exact' });
    
    if (grantsError) {
      console.log('❌ Grants table error:', grantsError.message);
    } else {
      console.log(`✅ Found grants table with ${count} records`);
      if (grants && grants.length > 0) {
        console.log('\nFirst grant:');
        console.log(JSON.stringify(grants[0], null, 2));
      }
    }
    
    // List all tables by trying common names
    const tableNames = ['grants', 'government_grants', 'subsidy', 'plans', 'applications'];
    
    console.log('\n\nChecking other possible tables:');
    for (const tableName of tableNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ Table '${tableName}' exists`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSupabase();
