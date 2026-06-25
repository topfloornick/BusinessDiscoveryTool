const callScripts = [
  {
    id: 'cold-call',
    name: 'Cold Call Introduction',
    duration: '2-3 minutes',
    bestFor: 'First time calling a lead',
    steps: [
      {
        label: 'Opening',
        script: 'Hi, is this [Contact Name]? Great! My name is [Your Name], I\'m a web designer in [your area]. I found [Business Name] while doing some research and I was really impressed by [specific compliment]. Do you have just 2 minutes?'
      },
      {
        label: 'If they say yes',
        script: 'Awesome, I\'ll be quick. I noticed [specific issue - no website / outdated site / not mobile friendly]. I help businesses like yours get more customers through modern websites. Most of my clients see a significant increase in inquiries within the first month.'
      },
      {
        label: 'The Ask',
        script: 'I\'d love to show you what\'s possible - could we schedule a quick 15-minute call where I walk you through some ideas? Completely free, no strings attached.'
      },
      {
        label: 'If they say no / busy',
        script: 'Totally understand! Would it be okay if I sent you a quick email with some info? You can check it out when it\'s convenient. What\'s the best email for you?'
      },
      {
        label: 'Closing',
        script: 'Perfect, I\'ll send that over today. And [Contact Name], keep up the great work with [Business Name] - your [reviews/products/reputation] really stand out. Talk soon!'
      }
    ]
  },
  {
    id: 'follow-up-call',
    name: 'Follow-Up Call',
    duration: '2-4 minutes',
    bestFor: 'After sending an email, no response',
    steps: [
      {
        label: 'Opening',
        script: 'Hi [Contact Name], this is [Your Name] - I sent you an email a few days ago about [Business Name]\'s website. Just wanted to make sure it didn\'t end up in spam! Did you get a chance to look at it?'
      },
      {
        label: 'If they saw it',
        script: 'Great! Any thoughts? I know you\'re busy running the business, so I wanted to make it as easy as possible. I could put together a quick free mockup of what your site could look like - would that be helpful?'
      },
      {
        label: 'If they didn\'t see it',
        script: 'No worries at all! The short version is: I help businesses like yours get more customers through modern websites. I noticed [specific issue] and I think there\'s a real opportunity for [Business Name]. Can I resend it?'
      },
      {
        label: 'Handling objections',
        script: '"Too expensive" → I work with all budgets. What if I showed you options starting at [your lowest price]?\n"Not right now" → Totally get it. When would be a better time to revisit this? I\'ll set a reminder.\n"We\'re fine without one" → I hear you! Just curious - how are customers finding you right now? [Listen, then explain what they\'re missing]'
      },
      {
        label: 'Closing',
        script: 'Thanks for your time, [Contact Name]. I\'ll [next action]. Have a great rest of your day!'
      }
    ]
  },
  {
    id: 'discovery-call',
    name: 'Discovery Call (Scheduled)',
    duration: '15-20 minutes',
    bestFor: 'Scheduled consultation with interested lead',
    steps: [
      {
        label: 'Rapport Building (2 min)',
        script: 'Thanks for taking the time, [Contact Name]! Before we dive in, tell me a bit about [Business Name] - how long have you been running it? What\'s your favorite part about what you do?'
      },
      {
        label: 'Understanding Needs (5 min)',
        script: 'So tell me - how are customers finding you right now? What\'s working well? And what would you change if you could? Is there anything you see competitors doing online that you wish you had?'
      },
      {
        label: 'Pain Points (3 min)',
        script: 'Got it. And what about [their current site issue] - how is that affecting your business? Are you losing customers because of it? What would it mean for [Business Name] if you could [solve their problem]?'
      },
      {
        label: 'Solution Presentation (5 min)',
        script: 'Based on what you\'re telling me, here\'s what I\'d recommend for [Business Name]: [Present 2-3 specific solutions]. This would help you [benefit 1], [benefit 2], and [benefit 3]. I\'ve done similar work for [comparable business] and they saw [specific result].'
      },
      {
        label: 'Pricing Discussion (3 min)',
        script: 'For a project like this, my investment range is [price range]. That includes [list what\'s included]. I also offer [payment plan option] if that helps with cash flow. How does that sound?'
      },
      {
        label: 'Next Steps (2 min)',
        script: 'Great! Here\'s what happens next: I\'ll put together a detailed proposal with everything we discussed, mockup included. I\'ll have that to you by [date]. Once you review it, we can make any adjustments and get started. Sound good?'
      }
    ]
  }
];

export default callScripts;
