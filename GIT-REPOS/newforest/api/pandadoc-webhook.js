import crypto from 'crypto';

// PandaDoc webhook handler for document completion events
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 PandaDoc webhook received:', {
      headers: req.headers,
      body: req.body
    });

    // Verify webhook signature (optional but recommended for production)
    const signature = req.headers['x-pandadoc-signature'];
    const timestamp = req.headers['x-pandadoc-timestamp'];
    
    // For development, we'll skip signature verification
    // In production, you should verify with your webhook secret
    if (process.env.PANDADOC_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(req.body, signature, timestamp, process.env.PANDADOC_WEBHOOK_SECRET);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { event_type, data } = req.body;

    // Only process document completion events
    if (event_type === 'document_completed' || event_type === 'recipient_completed') {
      console.log(`📄 Processing ${event_type} for document:`, data?.id);

      // Extract document data for our automation
      const documentData = extractDocumentData(data);
      
      // Log the extracted data
      console.log('📊 Extracted document data:', documentData);

      // TODO: Trigger your automation workflow here
      // This is where you'd call your FareHarbor, Xero, and other integrations
      const automationResult = await triggerWorkflowAutomation(documentData);

      return res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        documentId: data?.id,
        automationResult
      });
    }

    // Log but ignore other event types
    console.log(`ℹ️ Ignoring event type: ${event_type}`);
    return res.status(200).json({
      success: true,
      message: 'Event received but not processed',
      eventType: event_type
    });

  } catch (error) {
    console.error('❌ Error processing PandaDoc webhook:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Verify webhook signature (for production security)
function verifyWebhookSignature(payload, signature, timestamp, secret) {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${JSON.stringify(payload)}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Extract the data we need from PandaDoc webhook payload
function extractDocumentData(data) {
  // Map PandaDoc data to our expected format
  const documentData = {
    // Document Info
    documentId: data?.id || data?.document?.id,
    documentName: data?.name || data?.document?.name,
    signedAt: data?.date_completed || new Date().toISOString(),
    
    // Extract from document fields/tokens (you'll need to map these based on your template)
    companyName: extractFieldValue(data, 'company_name') || 'Unknown Company',
    organizerName: extractFieldValue(data, 'organizer_name') || extractFieldValue(data, 'contact_name'),
    customerEmail: extractFieldValue(data, 'email') || extractRecipientEmail(data),
    customerPhone: extractFieldValue(data, 'phone'),
    numberOfPeople: parseInt(extractFieldValue(data, 'number_of_people') || extractFieldValue(data, 'participants')) || 0,
    eventDate: extractFieldValue(data, 'event_date'),
    eventType: extractFieldValue(data, 'event_type') || 'Team Building',
    totalValue: parseFloat(extractFieldValue(data, 'total_value') || extractFieldValue(data, 'price')) || 0,
    
    // Additional details
    eventDetails: {
      activities: extractFieldValue(data, 'activities')?.split(',') || [],
      duration: extractFieldValue(data, 'duration') || 'Full Day',
      location: extractFieldValue(data, 'location') || 'New Forest Adventure Centre'
    },
    
    // Raw webhook data for debugging
    rawWebhookData: data
  };

  return documentData;
}

// Helper to extract field values from PandaDoc data
function extractFieldValue(data, fieldName) {
  try {
    // Try different possible locations for field data
    const tokens = data?.tokens || [];
    const fields = data?.fields || [];
    
    // Look in tokens array
    const token = tokens.find(t => 
      t.name?.toLowerCase() === fieldName.toLowerCase() ||
      t.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (token?.value) return token.value;
    
    // Look in fields array
    const field = fields.find(f => 
      f.name?.toLowerCase() === fieldName.toLowerCase() ||
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field?.value) return field.value;
    
    // Look in metadata
    if (data?.metadata && data.metadata[fieldName]) {
      return data.metadata[fieldName];
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting field ${fieldName}:`, error);
    return null;
  }
}

// Extract email from recipients
function extractRecipientEmail(data) {
  try {
    const recipients = data?.recipients || [];
    const firstRecipient = recipients[0];
    return firstRecipient?.email;
  } catch (error) {
    console.error('Error extracting recipient email:', error);
    return null;
  }
}

// Trigger the automation workflow
async function triggerWorkflowAutomation(documentData) {
  console.log('🚀 Triggering automation workflow for:', documentData.companyName);
  
  try {
    const results = {
      fareHarbor: null,
      xero: null,
      catering: null,
      manifest: null
    };

    // 1. Create FareHarbor booking
    console.log('🛳️ Creating FareHarbor booking...');
    results.fareHarbor = await createFareHarborBooking(documentData);
    
    // 2. Generate Xero invoices
    console.log('💰 Generating Xero invoices...');
    results.xero = await generateXeroInvoices(documentData);
    
    // 3. Send catering booking
    console.log('🍽️ Booking catering...');
    results.catering = await bookCatering(documentData);
    
    // 4. Create manifest
    console.log('📋 Creating manifest...');
    results.manifest = await createManifest(documentData);
    
    console.log('✅ All automation steps completed successfully');
    return results;

  } catch (error) {
    console.error('❌ Automation workflow failed:', error);
    throw error;
  }
}

// Placeholder functions for integrations
async function createFareHarborBooking(documentData) {
  // TODO: Implement FareHarbor API integration
  console.log('Creating FareHarbor booking for:', documentData.companyName);
  return { status: 'pending', message: 'FareHarbor integration not yet implemented' };
}

async function generateXeroInvoices(documentData) {
  // TODO: Implement Xero API integration
  console.log('Generating Xero invoices for:', documentData.companyName);
  return { status: 'pending', message: 'Xero integration not yet implemented' };
}

async function bookCatering(documentData) {
  // TODO: Implement Gmail/catering booking
  console.log('Booking catering for:', documentData.companyName);
  return { status: 'pending', message: 'Catering integration not yet implemented' };
}

async function createManifest(documentData) {
  // TODO: Implement manifest creation
  console.log('Creating manifest for:', documentData.companyName);
  return { status: 'pending', message: 'Manifest creation not yet implemented' };
} 