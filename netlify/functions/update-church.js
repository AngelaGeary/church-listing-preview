// Serverless function to update church data in Airtable
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appSE6JqFAzvuFCoP';
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Churches';

  if (!AIRTABLE_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    const { recordId, fields } = JSON.parse(event.body);
    
    if (!recordId || !fields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing recordId or fields' })
      };
    }

    // Update the record in Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );

    if (!response.ok) {
      console.error('Airtable API error:', response.status, await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to update church data in Airtable' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        record: data
      })
    };

  } catch (error) {
    console.error('Error updating church data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
