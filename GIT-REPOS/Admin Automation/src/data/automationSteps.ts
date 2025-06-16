import { WorkflowStep } from '../types';

export const automationSteps: WorkflowStep[] = [
  // === TRIGGER: EMAIL DETECTION ===
  {
    id: 'email-trigger',
    title: '🔔 EMAIL TRIGGER ACTIVATED',
    description: 'New email detected matching corporate event criteria',
    status: 'pending',
    duration: 500,
    phase: 'Trigger Detection',
    tips: [
      'Triggers on emails containing: "corporate event", "team building", "company outing"',
      'Monitors multiple inboxes: info@, events@, bookings@',
      'Filters out: spam, newsletters, existing customer replies'
    ],
    data: {
      triggerConditions: [
        'Subject contains: "Corporate Event Enquiry"',
        'Body contains: "team building" OR "company event"',
        'From domain: @company.com (not personal emails)',
        'Not auto-reply or out-of-office'
      ],
      detectedEmail: {
        from: 'sarah.johnson@techcorp.com',
        subject: 'Corporate Team Building Event - 50 People',
        timestamp: '2024-01-15 09:23:45',
        confidence: '94%'
      }
    }
  },

  // === IMMEDIATE RESPONSE (5 minutes) ===
  {
    id: 'ai-extraction',
    title: 'AI Information Extraction',
    description: 'Extract client details, requirements, dates, and budget using GPT-4',
    status: 'pending',
    duration: 2000,
    phase: 'Immediate Response',
    tips: [
      'Uses GPT-4 to understand natural language requests',
      'Extracts: company, contact, dates, group size, budget, activities',
      'Validates extracted data against business rules'
    ],
    data: {
      extractedData: {
        company: 'TechCorp Solutions Ltd',
        contact: 'Sarah Johnson (HR Director)',
        email: 'sarah.johnson@techcorp.com',
        phone: '+44 20 7123 4567',
        groupSize: '45-50 people',
        preferredDates: ['2024-03-15', '2024-03-22', '2024-03-29'],
        budget: '£150-200 per person',
        activities: ['team building', 'outdoor activities', 'problem solving'],
        dietary: 'vegetarian options required',
        location: 'Within 2 hours of London'
      },
      confidence: '96%',
      missingInfo: ['exact headcount', 'specific activity preferences']
    }
  },
  {
    id: 'crm-contact-create',
    title: 'CRM Contact Creation',
    description: 'Create new contact in HubSpot CRM with extracted information',
    status: 'pending',
    duration: 1500,
    phase: 'Immediate Response',
    tips: [
      'Checks for existing contacts to avoid duplicates',
      'Tags with source: "Website Enquiry - Corporate Events"',
      'Sets lead score based on company size and budget'
    ],
    data: {
      crmResponse: {
        contactId: 'CRM-2024-0156',
        status: 'Created successfully',
        leadScore: 85,
        tags: ['Corporate Events', 'High Value', 'Q1 2024'],
        duplicateCheck: 'No existing contact found',
        assignedTo: 'James Mitchell (Senior Sales)'
      }
    }
  },
  {
    id: 'auto-acknowledgment',
    title: 'Send Professional Acknowledgment',
    description: 'Send branded email confirming receipt within 5 minutes',
    status: 'pending',
    duration: 1000,
    phase: 'Immediate Response',
    tips: [
      'Personalised with client name and extracted requirements',
      'Sets expectation: "Detailed proposal within 4 hours"',
      'Includes direct contact details and calendar booking link'
    ],
    data: {
      emailSent: {
        to: 'sarah.johnson@techcorp.com',
        subject: 'Re: Corporate Team Building Event - Proposal Coming Soon',
        sentAt: '2024-01-15 09:28:12',
        template: 'corporate-acknowledgment-v2',
        personalisation: {
          clientName: 'Sarah',
          companyName: 'TechCorp Solutions',
          groupSize: '45-50 people',
          estimatedValue: '£7,500-10,000'
        }
      }
    }
  },

  // === PROPOSAL PHASE (2-4 hours) ===
  {
    id: 'crm-deal-creation',
    title: 'CRM Deal Pipeline Setup',
    description: 'Create deal record with £8,750 estimated value',
    status: 'pending',
    duration: 1500,
    phase: 'Proposal Phase',
    tips: [
      'Calculates deal value: 47.5 people × £175 average = £8,312',
      'Sets pipeline stage: "Proposal Preparation"',
      'Assigns probability: 35% (new corporate enquiry)'
    ],
    data: {
      dealCreated: {
        dealId: 'DEAL-2024-0089',
        value: '£8,312',
        probability: '35%',
        closeDate: '2024-03-15',
        stage: 'Proposal Preparation',
        products: ['Team Building Day', 'Catering', 'Transport'],
        nextAction: 'Send proposal by 2024-01-15 13:30'
      }
    }
  },
  {
    id: 'ai-programme-design',
    title: 'AI Programme Planning',
    description: 'Generate tailored event programme using historical data and preferences',
    status: 'pending',
    duration: 3500,
    phase: 'Proposal Phase',
    tips: [
      'Analyses 200+ previous corporate events for similar groups',
      'Considers: group size, budget, season, location preferences',
      'Generates 3 programme options with different activity mixes'
    ],
    data: {
      programmeOptions: [
        {
          name: 'Adventure Challenge Day',
          activities: ['High Ropes Course', 'Problem Solving Challenges', 'Team Orienteering'],
          duration: '9:00 AM - 5:00 PM',
          price: '£165 per person',
          suitability: '95% match for tech companies'
        },
        {
          name: 'Creative Collaboration Experience',
          activities: ['Escape Room Challenge', 'Creative Workshop', 'Team Cooking'],
          duration: '10:00 AM - 4:00 PM',
          price: '£185 per person',
          suitability: '88% match for HR-led events'
        }
      ],
      recommendedOption: 'Adventure Challenge Day',
      reasoning: 'Best value, highest satisfaction scores for similar groups'
    }
  },
  {
    id: 'pandadoc-generation',
    title: 'PandaDoc Proposal Generation',
    description: 'Generate professional branded proposal with e-signature capability',
    status: 'pending',
    duration: 2500,
    phase: 'Proposal Phase',
    tips: [
      'Uses "Corporate Events Premium" template',
      'Includes: programme details, pricing, terms, testimonials',
      'Auto-populates client data and customises for their industry'
    ],
    data: {
      proposalGenerated: {
        documentId: 'PD-2024-CE-0156',
        title: 'Corporate Team Building Proposal - TechCorp Solutions',
        pages: 12,
        sections: ['Executive Summary', 'Programme Details', 'Pricing', 'Testimonials', 'Terms'],
        totalValue: '£7,837.50 (47 people × £165 + VAT)',
        validUntil: '2024-02-15',
        eSignatureEnabled: true
      }
    }
  },
  {
    id: 'proposal-delivery',
    title: 'Send Proposal with Tracking',
    description: 'Email proposal with open/view tracking and automated follow-up sequence',
    status: 'pending',
    duration: 1000,
    phase: 'Proposal Phase',
    tips: [
      'Tracks: email opens, time spent viewing, pages viewed',
      'Sets up 3-day follow-up sequence if no response',
      'Notifies sales team when proposal is opened'
    ],
    data: {
      proposalSent: {
        sentTo: 'sarah.johnson@techcorp.com',
        sentAt: '2024-01-15 13:15:22',
        trackingEnabled: true,
        followUpScheduled: '2024-01-18 10:00:00',
        salesNotification: 'James Mitchell notified',
        proposalLink: 'https://app.pandadoc.com/s/abc123...'
      }
    }
  },

  // === BOOKING CONFIRMATION (1-2 days) ===
  {
    id: 'proposal-monitoring',
    title: 'Proposal Engagement Tracking',
    description: 'Monitor client engagement and send intelligent follow-ups',
    status: 'pending',
    duration: 2000,
    phase: 'Booking Confirmation',
    tips: [
      'Tracks: opens (3x), time spent (12 minutes), pages viewed (all)',
      'Engagement score: 85% (high interest)',
      'Triggers personalised follow-up based on viewing behaviour'
    ],
    data: {
      engagementData: {
        opens: 3,
        totalTimeSpent: '12 minutes 34 seconds',
        pagesViewed: ['All pages', 'Pricing viewed 3x', 'Testimonials viewed 2x'],
        engagementScore: '85%',
        lastViewed: '2024-01-16 14:22:15',
        followUpTrigger: 'High engagement - send booking incentive'
      }
    }
  },
  {
    id: 'contract-processing',
    title: 'E-Signature Processing',
    description: 'Process signed contract and trigger booking confirmation workflow',
    status: 'pending',
    duration: 2000,
    phase: 'Booking Confirmation',
    tips: [
      'Automatically detects completed e-signature',
      'Updates CRM deal stage to "Won"',
      'Triggers booking confirmation and logistics workflows'
    ],
    data: {
      contractSigned: {
        signedAt: '2024-01-17 11:45:33',
        signedBy: 'Sarah Johnson (HR Director)',
        ipAddress: '203.0.113.42',
        finalValue: '£7,837.50',
        eventDate: '2024-03-15',
        participantCount: 47,
        crmUpdated: 'Deal stage: Won, Probability: 100%'
      }
    }
  },
  {
    id: 'fareharbor-booking',
    title: 'FareHarbor Activity Booking',
    description: 'Create bookings for all activities with equipment and guide allocation',
    status: 'pending',
    duration: 3000,
    phase: 'Booking Confirmation',
    tips: [
      'Books: High Ropes (47 people), Problem Solving (47 people)',
      'Reserves: 6 instructors, safety equipment for 47',
      'Handles group size optimization and resource allocation'
    ],
    data: {
      fareharborBookings: [
        {
          activityId: 'FH-HR-001',
          name: 'High Ropes Course',
          date: '2024-03-15',
          time: '09:30-12:00',
          participants: 47,
          instructors: 4,
          bookingRef: 'FH-240315-HR-001'
        },
        {
          activityId: 'FH-PS-002',
          name: 'Problem Solving Challenges',
          date: '2024-03-15',
          time: '13:30-16:00',
          participants: 47,
          instructors: 2,
          bookingRef: 'FH-240315-PS-002'
        }
      ],
      totalCost: '£6,345.00',
      equipmentReserved: 'Safety harnesses (47), Helmets (47), Problem solving kits (8)'
    }
  },
  {
    id: 'booking-confirmation-email',
    title: 'Send Booking Confirmation',
    description: 'Email comprehensive booking details and preparation instructions',
    status: 'pending',
    duration: 1500,
    phase: 'Booking Confirmation',
    tips: [
      'Includes: booking references, arrival instructions, what to bring',
      'Attaches: participant information form, dietary requirements form',
      'Sets calendar reminder for 1 week before event'
    ],
    data: {
      confirmationSent: {
        emailTo: 'sarah.johnson@techcorp.com',
        subject: 'CONFIRMED: TechCorp Team Building - March 15th',
        attachments: ['Participant_Info_Form.pdf', 'What_to_Bring_Checklist.pdf'],
        bookingRefs: ['FH-240315-HR-001', 'FH-240315-PS-002'],
        arrivalTime: '09:00 AM',
        venue: 'Adventure Centre, Surrey Hills',
        calendarInvite: 'Sent to all participants'
      }
    }
  },

  // === LOGISTICS SETUP (1-2 weeks) ===
  {
    id: 'xero-invoicing',
    title: 'Xero Invoice Generation',
    description: 'Generate invoice with 30-day payment terms and send to accounts',
    status: 'pending',
    duration: 2000,
    phase: 'Logistics Setup',
    tips: [
      'Invoice total: £7,837.50 (includes 20% VAT)',
      'Payment terms: 30 days from invoice date',
      'Sends to: accounts@techcorp.com and sarah.johnson@techcorp.com'
    ],
    data: {
      invoiceGenerated: {
        invoiceNumber: 'INV-2024-0234',
        amount: '£7,837.50',
        vatAmount: '£1,306.25',
        netAmount: '£6,531.25',
        dueDate: '2024-02-16',
        sentTo: ['accounts@techcorp.com', 'sarah.johnson@techcorp.com'],
        paymentLink: 'https://pay.xero.com/invoice/abc123'
      }
    }
  },
  {
    id: 'catering-coordination',
    title: 'Catering & Dietary Requirements',
    description: 'Process dietary requirements and coordinate with catering partners',
    status: 'pending',
    duration: 2500,
    phase: 'Logistics Setup',
    tips: [
      'Collects dietary info via automated form',
      'Coordinates with 3 approved catering partners',
      'Ensures allergen compliance and variety'
    ],
    data: {
      cateringArranged: {
        provider: 'Surrey Hills Catering Co.',
        menu: 'Corporate Lunch Package B',
        dietaryAccommodated: {
          vegetarian: 8,
          vegan: 3,
          glutenFree: 2,
          allergies: ['nuts (2)', 'dairy (1)']
        },
        servingTime: '12:30 PM',
        cost: '£987.50',
        confirmed: true
      }
    }
  },
  {
    id: 'participant-manifest',
    title: 'Participant Manifest & Safety Docs',
    description: 'Generate participant lists, safety briefings, and emergency contacts',
    status: 'pending',
    duration: 2000,
    phase: 'Logistics Setup',
    tips: [
      'Compiles: names, emergency contacts, medical conditions',
      'Generates: safety briefing materials, risk assessments',
      'Creates: instructor briefing packs, emergency procedures'
    ],
    data: {
      manifestCreated: {
        totalParticipants: 47,
        emergencyContacts: 47,
        medicalConditions: 3,
        safetyBriefingGenerated: true,
        instructorPacksCreated: 6,
        riskAssessmentCompleted: 'RA-2024-0156',
        emergencyProcedures: 'EP-Surrey-Hills-v3.2'
      }
    }
  },
  {
    id: 'logistics-coordination',
    title: 'Transport & Equipment Logistics',
    description: 'Coordinate transport, equipment delivery, and venue setup',
    status: 'pending',
    duration: 3000,
    phase: 'Logistics Setup',
    tips: [
      'Arranges: coach transport from London (2 coaches)',
      'Coordinates: equipment delivery day before event',
      'Schedules: venue setup team arrival at 8:00 AM'
    ],
    data: {
      logisticsArranged: {
        transport: {
          provider: 'Executive Coach Hire',
          vehicles: 2,
          capacity: '49 passengers each',
          pickupTime: '08:00 AM',
          pickupLocation: 'TechCorp Offices, Canary Wharf',
          cost: '£650.00'
        },
        equipment: {
          deliveryDate: '2024-03-14',
          items: ['Safety equipment', 'Problem solving materials', 'First aid kits'],
          setupTime: '08:00 AM on event day'
        }
      }
    }
  },

  // === PRE-EVENT MANAGEMENT (1 week) ===
  {
    id: 'payment-tracking',
    title: 'Payment Status Monitoring',
    description: 'Track invoice payment and send automated reminders',
    status: 'pending',
    duration: 1500,
    phase: 'Pre-Event Management',
    tips: [
      'Monitors Xero for payment receipt',
      'Sends reminder at 7 days overdue',
      'Escalates to finance team at 14 days overdue'
    ],
    data: {
      paymentStatus: {
        invoiceNumber: 'INV-2024-0234',
        status: 'PAID',
        paidDate: '2024-02-10',
        paidAmount: '£7,837.50',
        paymentMethod: 'Bank Transfer',
        reference: 'TECHCORP-TEAM-BUILDING-MAR24'
      }
    }
  },
  {
    id: 'pre-event-communications',
    title: 'Final Event Communications',
    description: 'Send weather updates, final instructions, and arrival details',
    status: 'pending',
    duration: 2000,
    phase: 'Pre-Event Management',
    tips: [
      'Weather forecast: Sunny, 15°C - perfect for outdoor activities',
      'Sends clothing recommendations and what to bring',
      'Includes venue contact details and emergency numbers'
    ],
    data: {
      finalComms: {
        weatherForecast: 'Sunny, 15°C, light breeze',
        clothingAdvice: 'Comfortable outdoor clothing, trainers, light jacket',
        whatToBring: 'Water bottle, sunglasses, any personal medication',
        venueContact: '+44 1483 555 0123',
        emergencyContact: '+44 7700 900 123',
        sentTo: 47,
        sentAt: '2024-03-08 10:00:00'
      }
    }
  },
  {
    id: 'staff-briefing',
    title: 'Staff & Instructor Briefing',
    description: 'Brief all team members on client requirements and event objectives',
    status: 'pending',
    duration: 2500,
    phase: 'Pre-Event Management',
    tips: [
      'Client background: Tech company, focus on collaboration',
      'Key objectives: Team bonding, communication, problem-solving',
      'Special requirements: Mix of confidence levels, some nervous about heights'
    ],
    data: {
      staffBriefing: {
        attendees: ['Lead Instructor', '5 Activity Instructors', 'Event Coordinator'],
        clientObjectives: ['Improve team communication', 'Build trust', 'Have fun'],
        specialNotes: ['3 participants nervous about heights', 'CEO participating', 'Photos required'],
        emergencyProcedures: 'Reviewed and confirmed',
        equipmentChecklist: 'Completed',
        briefingCompleted: '2024-03-14 16:00:00'
      }
    }
  },

  // === EVENT DELIVERY (Event day) ===
  {
    id: 'event-setup',
    title: 'Event Day Setup & Final Checks',
    description: 'Complete venue setup, equipment checks, and team preparation',
    status: 'pending',
    duration: 2000,
    phase: 'Event Delivery',
    tips: [
      'Team arrives at 7:30 AM for setup',
      'Equipment safety checks completed by 8:30 AM',
      'Welcome area prepared with registration desk'
    ],
    data: {
      setupComplete: {
        teamArrival: '07:30 AM',
        equipmentChecks: 'All passed - signed off by Lead Instructor',
        venueSetup: 'Registration desk, welcome banners, activity stations',
        weatherCheck: 'Perfect conditions - 16°C, sunny',
        readyForParticipants: '08:45 AM'
      }
    }
  },
  {
    id: 'live-event-monitoring',
    title: 'Real-Time Event Monitoring',
    description: 'Monitor event progress, participant satisfaction, and handle any issues',
    status: 'pending',
    duration: 4000,
    phase: 'Event Delivery',
    tips: [
      'Live updates every 30 minutes to client and head office',
      'Photo/video capture for marketing (with permission)',
      'Real-time issue resolution and backup plan activation if needed'
    ],
    data: {
      liveUpdates: [
        { time: '09:00', status: 'Group arrived on time, excellent energy' },
        { time: '10:30', status: 'High ropes going brilliantly, great team support' },
        { time: '12:30', status: 'Lunch served, very positive feedback' },
        { time: '15:00', status: 'Problem solving challenges completed, huge success' },
        { time: '16:30', status: 'Event concluded, client extremely happy' }
      ],
      participantFeedback: 'Outstanding - 9.2/10 average satisfaction',
      photosCapture: '47 group photos, 15 action shots',
      issuesResolved: 'Minor: 1 participant felt dizzy (resolved with rest and water)'
    }
  },

  // === POST-EVENT FOLLOW-UP (1-2 weeks) ===
  {
    id: 'feedback-collection',
    title: 'Client Feedback & Testimonials',
    description: 'Send feedback surveys and collect testimonials for marketing',
    status: 'pending',
    duration: 1500,
    phase: 'Post-Event Follow-up',
    tips: [
      'Automated survey sent 24 hours after event',
      'Requests testimonial and permission to use photos',
      'Identifies areas for improvement and future opportunities'
    ],
    data: {
      feedbackReceived: {
        surveyResponses: 43,
        averageRating: '9.4/10',
        testimonial: '"Absolutely fantastic day! The team loved every minute and we\'re already planning our next event with you." - Sarah Johnson, HR Director',
        photoPermission: 'Granted for marketing use',
        improvementSuggestions: ['Longer lunch break', 'More vegetarian options'],
        recommendationScore: '10/10 - would definitely recommend'
      }
    }
  },
  {
    id: 'future-opportunities',
    title: 'Future Business Development',
    description: 'Schedule follow-up meetings and identify referral opportunities',
    status: 'pending',
    duration: 2000,
    phase: 'Post-Event Follow-up',
    tips: [
      'Books follow-up call for 2 weeks after event',
      'Identifies potential referrals within client network',
      'Adds to quarterly event planning discussion list'
    ],
    data: {
      opportunitiesIdentified: {
        followUpMeeting: 'Scheduled for 2024-03-29 at 2:00 PM',
        potentialReferrals: ['TechCorp sister companies', 'Sarah\'s professional network'],
        futureEvents: ['Summer team day', 'Christmas party', 'New starter inductions'],
        estimatedValue: '£25,000+ annual potential',
        crmUpdated: 'Opportunity pipeline created for Q2-Q4 2024'
      }
    }
  }
];

export const getStepsByPhase = () => {
  const phases = [...new Set(automationSteps.map(step => step.phase!))];
  return phases.map(phase => ({
    phase,
    steps: automationSteps.filter(step => step.phase === phase)
  }));
}; 