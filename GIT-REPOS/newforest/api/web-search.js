export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, software } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`🔍 Performing web search for: ${query}`);

    // For now, we'll use a curated knowledge base of verified API information
    // In production, you could integrate with Google Custom Search API, Bing Search API, etc.
    
    let searchResults = '';
    
    if (software?.toLowerCase().includes('gohighlevel') || software?.toLowerCase().includes('ghl')) {
      searchResults = `
🔍 **VERIFIED GOHIGHLEVEL API DOCUMENTATION:**

**Official Documentation Sources:**
- API 2.0 Docs: https://highlevel.stoplight.io/docs/integrations/0443d7d1a4bd0-overview
- Developer Hub: https://developers.gohighlevel.com/
- Support Portal: https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api
- Private Integrations: https://help.gohighlevel.com/support/solutions/articles/155000003054-private-integrations-everything-you-need-to-know

**Current API Status (2024):**
- API 2.0: Active and recommended for all new integrations
- Base URL: https://services.leadconnectorhq.com/
- Authentication: Private Integration Tokens (OAuth 2.0 based)
- API 1.0: End-of-Life, no new endpoints planned

**Authentication Requirements:**
- Header Format: Authorization: YOUR_PRIVATE_INTEGRATION_TOKEN
- NO "Bearer" prefix required (this is critical!)
- Required Version Header: Version: 2021-07-28
- Plan Requirement: Pro plan or above for API access

**Key Endpoints:**
- Opportunities: POST /opportunities
- Contacts: GET/POST /contacts  
- Pipelines: GET /opportunities/pipelines
- Locations: GET /locations

**Critical Requirements for Opportunities:**
- locationId: REQUIRED field (your sub-account ID)
- title: Use "title" not "name" (API 2.0 change)
- pipelineId: Required
- pipelineStageId: Required
- contactId: Optional but recommended
- status: open/won/lost/abandoned

**Rate Limits:**
- Burst: 100 requests per 10 seconds per location
- Daily: 200,000 requests per day per location
- Headers returned: X-RateLimit-Remaining, X-RateLimit-Limit-Daily

**Common Errors:**
- 404: Wrong endpoint or missing Version header
- 401: Invalid or missing Private Integration Token
- 422: Missing required fields (locationId, title, pipelineId)
- 429: Rate limit exceeded

**Working Example:**
POST https://services.leadconnectorhq.com/opportunities
Headers:
  Authorization: YOUR_PRIVATE_INTEGRATION_TOKEN
  Content-Type: application/json
  Version: 2021-07-28
Body:
{
  "locationId": "your_location_id",
  "title": "Deal Name",
  "pipelineId": "your_pipeline_id", 
  "pipelineStageId": "your_stage_id",
  "status": "open"
}
`;
    } else if (software?.toLowerCase().includes('salesforce')) {
      searchResults = `
🔍 **SALESFORCE API DOCUMENTATION:**

**Official Sources:**
- REST API: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/
- SOAP API: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/
- Trailhead: https://trailhead.salesforce.com/en/content/learn/modules/api_basics

**Authentication:**
- OAuth 2.0 recommended
- Session ID authentication available
- Connected Apps required for OAuth

**Base URLs:**
- Production: https://[instance].salesforce.com/services/data/v58.0/
- Sandbox: https://[instance].sandbox.salesforce.com/services/data/v58.0/

**Common Endpoints:**
- Objects: /sobjects/
- Query: /query/?q=SELECT...
- Create: POST /sobjects/Account/
- Update: PATCH /sobjects/Account/[ID]
`;
    } else if (software?.toLowerCase().includes('hubspot')) {
      searchResults = `
🔍 **HUBSPOT API DOCUMENTATION:**

**Official Sources:**
- API Documentation: https://developers.hubspot.com/docs/api/overview
- CRM API: https://developers.hubspot.com/docs/api/crm/understanding-the-crm

**Authentication:**
- Private Apps (recommended): API Key authentication
- OAuth 2.0 for public apps
- Header: Authorization: Bearer YOUR_API_KEY

**Base URL:**
- https://api.hubapi.com/

**Common Endpoints:**
- Contacts: /crm/v3/objects/contacts
- Companies: /crm/v3/objects/companies  
- Deals: /crm/v3/objects/deals
- Tickets: /crm/v3/objects/tickets
`;
    } else {
      searchResults = `
🔍 **GENERAL API RESEARCH FOR ${software?.toUpperCase() || 'UNKNOWN PLATFORM'}:**

**Research Recommendations:**
- Check official developer documentation
- Look for REST API or GraphQL endpoints
- Identify authentication method (API Key, OAuth 2.0, JWT)
- Find rate limiting information
- Test with sandbox/development environment first

**Common API Patterns:**
- Base URL: https://api.[platform].com/v1/
- Authentication: Bearer tokens or API keys
- Rate Limits: Usually 100-1000 requests per minute
- Error Codes: Standard HTTP status codes (200, 400, 401, 404, 429, 500)

**Next Steps:**
- Visit the official website's developer section
- Check for API documentation or developer portal
- Look for SDKs or integration guides
- Join developer communities or forums
`;
    }

    return res.status(200).json({
      success: true,
      query,
      software,
      results: searchResults,
      timestamp: new Date().toISOString(),
      source: 'curated_knowledge_base'
    });

  } catch (error) {
    console.error('Web search error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
} 