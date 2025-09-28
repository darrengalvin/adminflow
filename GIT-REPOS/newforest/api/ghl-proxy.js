export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, endpoint, headers, body, params } = req.body;
    
    if (!method || !endpoint) {
      return res.status(400).json({ error: 'Method and endpoint are required' });
    }

    console.log('🔄 Proxying request to GoHighLevel:', {
      method,
      endpoint,
      headers: Object.keys(headers || {}),
      hasBody: !!body
    });

    // Build query string from params
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    // Prepare fetch options
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    console.log('📤 Making request to:', url);
    console.log('📤 Request options:', {
      method: fetchOptions.method,
      headers: fetchOptions.headers,
      bodyLength: fetchOptions.body ? fetchOptions.body.length : 0
    });

    // Make the actual request to GoHighLevel
    const response = await fetch(url, fetchOptions);
    
    console.log('📥 GoHighLevel response status:', response.status);

    // Get response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Get response data
    let responseData;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { error: 'Invalid JSON response', rawResponse: await response.text() };
      }
    } else {
      responseData = { textResponse: await response.text() };
    }

    console.log('📥 Response data:', responseData);

    // Return the proxied response
    res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      success: response.ok
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    res.status(500).json({
      status: 500,
      statusText: 'Proxy Error',
      headers: {},
      data: {
        error: error.message,
        type: error.name,
        details: 'Failed to proxy request to GoHighLevel API'
      },
      success: false
    });
  }
} 