import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Code, 
  Zap, 
  Plus,
  Trash2,
  Copy,
  Download,
  Clock,
  Activity
} from 'lucide-react';

interface APIHeader {
  key: string;
  value: string;
  enabled: boolean;
}

interface APIParam {
  key: string;
  value: string;
  enabled: boolean;
}

interface APIRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: APIHeader[];
  params: APIParam[];
  body: string;
  bodyType: 'json' | 'form' | 'text' | 'none';
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: string;
}

interface PostmanAPITesterProps {
  initialRequests?: APIRequest[];
  className?: string;
}

function createNewRequest(): APIRequest {
  return {
    id: Date.now().toString(),
    name: 'New Request',
    method: 'GET',
    url: 'https://api.example.com/endpoint',
    headers: [
      { key: 'Authorization', value: 'Bearer YOUR_API_KEY', enabled: true },
      { key: 'Content-Type', value: 'application/json', enabled: true }
    ],
    params: [
      { key: 'limit', value: '10', enabled: true }
    ],
    body: JSON.stringify({
      "name": "Test Request",
      "data": {
        "key": "value"
      }
    }, null, 2),
    bodyType: 'json'
  };
}

export const PostmanAPITester: React.FC<PostmanAPITesterProps> = ({ 
  initialRequests = [], 
  className = '' 
}) => {
  console.log('🔧 PostmanAPITester initialRequests:', initialRequests);
  
  const [requests, setRequests] = useState<APIRequest[]>(() => {
    const reqs = initialRequests.length > 0 ? initialRequests : [createNewRequest()];
    console.log('🔧 PostmanAPITester requests:', reqs);
    return reqs;
  });
  const [activeRequestId, setActiveRequestId] = useState<string>(() => {
    const reqs = initialRequests.length > 0 ? initialRequests : [createNewRequest()];
    const id = reqs[0]?.id || '';
    console.log('🔧 PostmanAPITester activeRequestId:', id);
    return id;
  });
  const [responses, setResponses] = useState<Record<string, APIResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const activeRequest = requests.find(r => r.id === activeRequestId);

  const sendRequest = async () => {
    if (!activeRequest) return;

    setLoading(prev => ({ ...prev, [activeRequest.id]: true }));

    try {
      const startTime = Date.now();
      
      // Build query parameters
      const enabledParams = activeRequest.params.filter(p => p.enabled && p.key && p.value);
      const params: Record<string, string> = {};
      enabledParams.forEach(p => {
        params[p.key] = p.value;
      });
      
      // Build headers
      const enabledHeaders = activeRequest.headers.filter(h => h.enabled && h.key);
      const headers: Record<string, string> = {};
      enabledHeaders.forEach(h => {
        headers[h.key] = h.value;
      });

      console.log('🚀 Making proxied API call to:', activeRequest.url);
      console.log('📤 Headers:', headers);
      console.log('📤 Body:', activeRequest.body);
      console.log('📤 Params:', params);

      // Check if this is a GoHighLevel API call - use proxy to bypass CORS
      const isGoHighLevelAPI = activeRequest.url.includes('leadconnectorhq.com') || 
                               activeRequest.url.includes('gohighlevel.com');
      
      let response: Response;
      let responseData: any;
      let responseHeaders: Record<string, string> = {};
      let responseTime: number;

      if (isGoHighLevelAPI) {
        // Use our proxy endpoint for GoHighLevel API calls
        const proxyPayload = {
          method: activeRequest.method,
          endpoint: activeRequest.url,
          headers,
          body: activeRequest.body ? JSON.parse(activeRequest.body) : undefined,
          params
        };

        response = await fetch('/api/ghl-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(proxyPayload)
        });

        responseTime = Date.now() - startTime;
        const proxyResponse = await response.json();

        responseData = proxyResponse.data;
        responseHeaders = proxyResponse.headers || {};
        
        // Create a mock response object for consistency
        response = {
          status: proxyResponse.status,
          statusText: proxyResponse.statusText,
          ok: proxyResponse.success
        } as Response;

        console.log('📥 Proxied API Response:', proxyResponse);
      } else {
        // Direct API call for non-GoHighLevel APIs
        const queryString = Object.keys(params).length > 0 
          ? '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
          : '';

        const fetchOptions: RequestInit = {
          method: activeRequest.method,
          headers,
        };

        // Add body for methods that support it
        if (['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && activeRequest.body) {
          fetchOptions.body = activeRequest.body;
        }

        response = await fetch(activeRequest.url + queryString, fetchOptions);
        responseTime = Date.now() - startTime;
        
        // Get response headers
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Get response data
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

        console.log('📥 Direct API Response:', { status: response.status, data: responseData });
      }

      // Calculate response size
      const responseSize = new Blob([JSON.stringify(responseData)]).size;
      const sizeFormatted = responseSize > 1024 
        ? `${(responseSize / 1024).toFixed(1)} KB`
        : `${responseSize} B`;

      const apiResponse: APIResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        responseTime,
        size: sizeFormatted
      };

      setResponses(prev => ({
        ...prev,
        [activeRequest.id]: apiResponse
      }));

    } catch (error: any) {
      console.error('❌ API Request failed:', error);
      
      const errorResponse: APIResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: {
          error: error.message,
          type: error.name,
          details: 'This could be due to CORS restrictions, network issues, or invalid API credentials'
        },
        responseTime: Date.now() - Date.now(),
        size: '0 B'
      };

      setResponses(prev => ({
        ...prev,
        [activeRequest.id]: errorResponse
      }));
    }

    setLoading(prev => ({ ...prev, [activeRequest.id]: false }));
  };

  if (!activeRequest) {
    console.log('❌ PostmanAPITester: No active request found');
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">❌ No active request found. Requests: {requests.length}, ActiveID: {activeRequestId}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <span>🚀 API Testing Lab</span>
        </h3>
      </div>

      <div className="p-4">
        {/* Request Line */}
        <div className="flex items-center space-x-2 mb-4">
          <select
            value={activeRequest.method}
            onChange={(e) => {
              const newMethod = e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
              setRequests(prev => prev.map(req => 
                req.id === activeRequestId 
                  ? { ...req, method: newMethod }
                  : req
              ));
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input
            type="text"
            value={activeRequest.url}
            onChange={(e) => {
              setRequests(prev => prev.map(req => 
                req.id === activeRequestId 
                  ? { ...req, url: e.target.value }
                  : req
              ));
            }}
            placeholder="Enter request URL"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <button
            onClick={sendRequest}
            disabled={loading[activeRequest.id]}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {loading[activeRequest.id] ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{loading[activeRequest.id] ? 'Sending...' : 'Send'}</span>
          </button>
        </div>

        {/* Headers Section */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Headers</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {activeRequest.headers.map((header, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => {
                    setRequests(prev => prev.map(req => 
                      req.id === activeRequestId 
                        ? { 
                            ...req, 
                            headers: req.headers.map((h, i) => 
                              i === index ? { ...h, enabled: e.target.checked } : h
                            )
                          }
                        : req
                    ));
                  }}
                  className="rounded"
                />
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => {
                    setRequests(prev => prev.map(req => 
                      req.id === activeRequestId 
                        ? { 
                            ...req, 
                            headers: req.headers.map((h, i) => 
                              i === index ? { ...h, key: e.target.value } : h
                            )
                          }
                        : req
                    ));
                  }}
                  placeholder="Header name"
                  className="px-2 py-1 border border-slate-300 rounded text-xs flex-1"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => {
                    setRequests(prev => prev.map(req => 
                      req.id === activeRequestId 
                        ? { 
                            ...req, 
                            headers: req.headers.map((h, i) => 
                              i === index ? { ...h, value: e.target.value } : h
                            )
                          }
                        : req
                    ));
                  }}
                  placeholder="Header value"
                  className="px-2 py-1 border border-slate-300 rounded text-xs flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Request Body for POST/PUT/PATCH */}
        {['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Request Body</h4>
            <textarea
              value={activeRequest.body}
              onChange={(e) => {
                setRequests(prev => prev.map(req => 
                  req.id === activeRequestId 
                    ? { ...req, body: e.target.value }
                    : req
                ));
              }}
              placeholder="Request body (JSON)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              rows={8}
            />
          </div>
        )}

        {/* Response */}
        {responses[activeRequestId] && (
          <div className="border-t border-slate-200 pt-4 bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Response</span>
              </h4>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  responses[activeRequestId].status < 300 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {responses[activeRequestId].status} {responses[activeRequestId].statusText}
                </span>
                <span className="text-xs text-slate-500 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{responses[activeRequestId].responseTime}ms</span>
                </span>
                <span className="text-xs text-slate-500">{responses[activeRequestId].size}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(responses[activeRequestId].data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 