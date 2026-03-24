// Serverless function to check if a URL is reachable
exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const url = event.queryStringParameters?.url;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing URL parameter' })
    };
  }

  // Validate URL format first
  let validUrl;
  try {
    validUrl = new URL(url);
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        valid: false,
        error: 'Invalid URL format',
        checked: url
      })
    };
  }

  // Only allow http/https protocols
  if (!['http:', 'https:'].includes(validUrl.protocol)) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        valid: false,
        error: 'Only HTTP/HTTPS URLs are supported',
        checked: url
      })
    };
  }

  try {
    // Try to fetch the URL with a HEAD request (faster than GET)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow', // Follow redirects
      headers: {
        'User-Agent': 'ET-Church-Finder-Link-Checker/1.0'
      }
    });
    
    clearTimeout(timeoutId);

    // Consider 2xx and 3xx status codes as valid
    const isValid = response.status >= 200 && response.status < 400;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify({
        valid: isValid,
        statusCode: response.status,
        checked: url,
        finalUrl: response.url // In case of redirects
      })
    };

  } catch (error) {
    // If HEAD fails, try GET (some servers don't support HEAD)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'ET-Church-Finder-Link-Checker/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      const isValid = response.status >= 200 && response.status < 400;
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        },
        body: JSON.stringify({
          valid: isValid,
          statusCode: response.status,
          checked: url,
          finalUrl: response.url
        })
      };
      
    } catch (secondError) {
      // Both HEAD and GET failed
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          valid: false,
          error: error.name === 'AbortError' ? 'Request timeout' : 'Could not reach URL',
          errorDetails: secondError.message,
          checked: url
        })
      };
    }
  }
};
