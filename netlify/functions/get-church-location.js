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
    // Get church name from query params
    const churchName = event.queryStringParameters?.church;
    const address = event.queryStringParameters?.address;
    
    if (!churchName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing church parameter' })
      };
    }

    // Try searching by church name first
    let searchUrl = `https://api.storelocatorwidgets.com:443/searchByAddress/${encodeURIComponent(churchName)}?api_key=${STORE_LOCATOR_API_KEY}`;
    
    console.log('Searching Store Locator for:', churchName);
    
    let response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error('Store Locator API error:', response.status, await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch church location from Store Locator API' })
      };
    }

    let data = await response.json();
    
    // If not found by name and we have an address, try searching by address
    if ((!data.locations || data.locations.length === 0) && address) {
      console.log('Not found by name, trying address:', address);
      searchUrl = `https://api.storelocatorwidgets.com:443/searchByAddress/${encodeURIComponent(address)}?api_key=${STORE_LOCATOR_API_KEY}`;
      response = await fetch(searchUrl);
      
      if (response.ok) {
        data = await response.json();
      }
    }
    
    // Check if we got results
    if (!data.locations || data.locations.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Church not found in Store Locator', 
          churchName,
          suggestion: 'This church may not be in the Store Locator database yet'
        })
      };
    }

    // Return the first matching location
    const location = data.locations[0];

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
        body: JSON.stringify({ error: 'Church not found in Store Locator', churchName })
      };
    }

    // Return the first matching location
    const location = data.locations[0];

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
