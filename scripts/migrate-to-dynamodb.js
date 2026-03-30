const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');

const client = new DynamoDBClient({ region: 'us-west-2' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'government-grants';

async function migrateData() {
  try {
    // Read JSON file
    const jsonPath = path.join(__dirname, '../public/grants-database.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`Found ${data.grants.length} grants to migrate`);
    
    // Upload each grant to DynamoDB
    for (const grant of data.grants) {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: grant
      });
      
      await docClient.send(command);
      console.log(`✓ Migrated: ${grant.計畫名稱}`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`Total grants migrated: ${data.grants.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
