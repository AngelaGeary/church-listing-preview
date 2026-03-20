// Serverless function to fetch church location from Store Locator Widgets API
exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const STORE_LOCATOR_API_KEY = process.env.STORE_LOCATOR_API_KEY;

  if (!STORE_LOCATOR_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Store Locator API key not configured' })
    };
  }

  try {
    // Get search parameters
    const searchTerm = event.queryStringParameters?.church; // Could be city, address, or name
    const churchName = event.queryStringParameters?.name; // The actual church name for filtering
    
    if (!searchTerm) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing church parameter' })
      };
    }

    // Search using Store Locator API
    const searchUrl = `https://api.storelocatorwidgets.com:443/searchByAddress/${encodeURIComponent(searchTerm)}?api_key=${STORE_LOCATOR_API_KEY}&max_results=20`;
    
    console.log('Searching Store Locator for:', searchTerm);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error('Store Locator API error:', response.status, await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch church location from Store Locator API' })
      };
    }

    const data = await response.json();
    
    // Check if we got results
    if (!data.locations || data.locations.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Church not found in Store Locator', 
          searchTerm,
          suggestion: 'This church may not be in the Store Locator database yet'
        })
      };
    }

    // If we have a church name, filter results to find exact match
    let location = data.locations[0]; // Default to first result
    
    if (churchName) {
      const exactMatch = data.locations.find(loc => 
        loc.name && loc.name.toLowerCase().includes(churchName.toLowerCase())
      );
      
      if (exactMatch) {
        location = exactMatch;
        console.log('Found exact match:', location.name);
      } else {
        console.log('No exact match, using first result:', location.name);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify({
        success: true,
        location: {
          name: location.name,
          address: location.address,
          lat: parseFloat(location.map_lat),
          lng: parseFloat(location.map_lng),
          image: location.image,
          website: location.website,
          phone: location.phone,
          email: location.email,
          description: location.description
        }
      })
    };

  } catch (error) {
    console.error('Error fetching church location:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
