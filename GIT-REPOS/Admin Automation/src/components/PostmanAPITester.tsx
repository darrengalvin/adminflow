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

export const PostmanAPITester: React.FC<PostmanAPITesterProps> = ({ 
  initialRequests = [], 
  className = '' 
}) => {
  const [requests, setRequests] = useState<APIRequest[]>(
    initialRequests.length > 0 ? initialRequests : [createNewRequest()]
  );
  const [activeRequestId, setActiveRequestId] = useState<string>(requests[0]?.id || '');
  const [responses, setResponses] = useState<Record<string, APIResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

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

  const activeRequest = requests.find(r => r.id === activeRequestId);

  const sendRequest = async () => {
    if (!activeRequest) return;

    setLoading(prev => ({ ...prev, [activeRequest.id]: true }));

    try {
      const startTime = Date.now();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const responseTime = Date.now() - startTime;
      
      // Mock successful response
      const mockResponse: APIResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-ratelimit-remaining': '999',
          'x-response-time': `${responseTime}ms`
        },
        data: {
          success: true,
          message: "API request successful",
          data: {
            id: Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            method: activeRequest.method,
            endpoint: activeRequest.url,
            authentication: "✅ Valid"
          }
        },
        responseTime,
        size: '1.2 KB'
      };

      setResponses(prev => ({
        ...prev,
        [activeRequest.id]: mockResponse
      }));

    } catch (error) {
      const mockErrorResponse: APIResponse = {
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          error: "Invalid API key",
          message: "Please provide a valid authorization token"
        },
        responseTime: 500,
        size: '0.3 KB'
      };

      setResponses(prev => ({
        ...prev,
        [activeRequest.id]: mockErrorResponse
      }));
    }

    setLoading(prev => ({ ...prev, [activeRequest.id]: false }));
  };

  if (!activeRequest) return null;

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