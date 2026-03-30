const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'government-grants';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle OPTIONS request for CORS
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const httpMethod = event.requestContext?.http?.method || event.httpMethod;
    let rawPath = event.rawPath || event.path || '';
    const pathParameters = event.pathParameters || {};
    
    // Remove /prod prefix if present
    if (rawPath.startsWith('/prod')) {
      rawPath = rawPath.substring(5);
    }
    
    // GET /grants - List all grants
    if (httpMethod === 'GET' && rawPath === '/grants') {
      const command = new ScanCommand({
        TableName: TABLE_NAME
      });
      
      const response = await docClient.send(command);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          grants: response.Items || [],
          count: response.Count || 0
        })
      };
    }
    
    // GET /grants/{id} - Get single grant
    if (httpMethod === 'GET' && pathParameters?.id) {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: pathParameters.id }
      });
      
      const response = await docClient.send(command);
      
      if (!response.Item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Grant not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.Item)
      };
    }
    
    // POST /grants - Create new grant
    // PUT /grants - Update grant
    if ((httpMethod === 'POST' || httpMethod === 'PUT') && rawPath === '/grants') {
      const body = JSON.parse(event.body);
      
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: body
      });
      
      await docClient.send(command);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Grant saved successfully',
          grant: body
        })
      };
    }
    
    // DELETE /grants/{id} - Delete grant
    if (httpMethod === 'DELETE' && pathParameters?.id) {
      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: pathParameters.id }
      });
      
      await docClient.send(command);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Grant deleted successfully' })
      };
    }
    
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Invalid request',
        method: httpMethod,
        path: rawPath
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
