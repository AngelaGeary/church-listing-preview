// Serverless function to fetch church data from Airtable
// This keeps your API key secure and handles CORS

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get the record ID from query parameters
  const recordId = event.queryStringParameters?.id;
  
  if (!recordId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing record ID' })
    };
  }

  // Airtable configuration from environment variables
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
    // Fetch the church record from Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Airtable API error:', response.status, await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch church data from Airtable' })
      };
    }

    const data = await response.json();
    
    // Extract the fields we need
    const fields = data.fields || {};
    
    // Return clean data structure
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      },
      body: JSON.stringify({
        id: data.id,
        church: fields['Church'] || '',
        address: fields['Address'] || '',
        countyOrCity: fields['County or city'] || '',
        email: fields['Email'] || '',
        website: fields['Website'] || '',
        contact: fields['Contact'] || '',
        phone: fields['Phone'] || '',
        bibles: fields['Bibles'] || '',
        hymnBooks: fields['Hymn books'] || '',
        meetings: fields['Meetings'] || '',
        notes: fields['Notes'] || '',
        churchImage: fields['Church image'] ? fields['Church image'][0]?.url : null,
        billingName: fields['Billing name (from Holiday church purchases 2026)'] ? fields['Billing name (from Holiday church purchases 2026)'][0] : null,
        listingType: fields['Listing type (from Holiday church purchases 2026)'] ? fields['Listing type (from Holiday church purchases 2026)'][0] : null,
        included2026: fields['Included 2026'] || ''
      })
    };

  } catch (error) {
    console.error('Error fetching church data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
