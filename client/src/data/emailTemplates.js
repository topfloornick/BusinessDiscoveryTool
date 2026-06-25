const emailTemplates = [
  {
    id: 'cold-intro',
    name: 'Cold Introduction',
    subject: 'Quick question about [Business Name]\'s website',
    body: `Hi [Contact Name],

I came across [Business Name] while researching businesses in [City] and I was really impressed by [specific compliment - reviews, products, reputation].

I noticed your website [could use a refresh / hasn't been updated in a while / doesn't exist yet], and I wanted to reach out because I help businesses like yours get more customers through modern, mobile-friendly websites.

Here's what I typically help with:
- Mobile-responsive design (70%+ of customers browse on phones)
- Fast loading speeds
- Clear calls-to-action that convert visitors to customers
- SEO basics so people can find you on Google

Would you be open to a quick 10-minute call this week? I'd love to show you what's possible.

Best,
[Your Name]
[Your Phone]`,
    tags: ['cold-outreach', 'introduction'],
    bestFor: 'First contact with new leads'
  },
  {
    id: 'no-website',
    name: 'No Website Pitch',
    subject: 'Helping [Business Name] get found online',
    body: `Hi [Contact Name],

I found [Business Name] on [Google Maps / Yelp / Instagram] and your [reviews / work / products] look amazing!

I noticed you don't have a website yet, and I wanted to share something interesting - studies show that 97% of consumers search online for local businesses. Without a website, you're likely missing out on customers who are actively looking for what you offer.

I build clean, modern websites specifically for businesses like yours. Here's what you'd get:

- A professional site that works perfectly on phones and computers
- A way for customers to contact you / book appointments easily
- Better visibility on Google (right now competitors with websites rank above you)
- A site you own and control (not dependent on social media algorithms)

I keep my pricing simple and affordable for small businesses. Would you have 10 minutes for a quick chat?

Best,
[Your Name]
[Your Phone]`,
    tags: ['no-website', 'value-proposition'],
    bestFor: 'Businesses with no web presence'
  },
  {
    id: 'outdated-site',
    name: 'Outdated Website Refresh',
    subject: 'A fresh look for [Business Name]?',
    body: `Hi [Contact Name],

I was checking out [Business Name]'s website and I can tell it was built a while back. No judgment - web technology moves fast!

Here's what I noticed that might be costing you customers:
- [Not mobile-friendly / Slow loading / Broken links / Outdated design]
- [No SSL certificate (the "Not Secure" warning scares people)]
- [Missing features like online booking / menu / portfolio]

The good news? A modern redesign can make a huge difference. My clients typically see:
- 40-60% more inquiries after launching their new site
- Better Google rankings within weeks
- Customers staying on the site longer

I'd love to show you a quick mockup of what [Business Name] could look like with a fresh design. Completely free, no obligation.

Interested?

Best,
[Your Name]
[Your Phone]`,
    tags: ['outdated', 'redesign', 'mockup-offer'],
    bestFor: 'Businesses with old/broken websites'
  },
  {
    id: 'follow-up-1',
    name: 'Follow Up #1 (3 days)',
    subject: 'Re: Quick question about [Business Name]\'s website',
    body: `Hi [Contact Name],

Just following up on my message from a few days ago. I know you're busy running [Business Name]!

I put together a quick list of 3 things that could immediately help your online presence:

1. [Specific observation about their business]
2. [Specific improvement suggestion]
3. [Quick win they could implement]

Happy to jump on a 5-minute call to walk through these. Would [Day] or [Day] work for you?

Best,
[Your Name]`,
    tags: ['follow-up', 'value-add'],
    bestFor: '3 days after initial contact, no response'
  },
  {
    id: 'follow-up-2',
    name: 'Follow Up #2 (1 week)',
    subject: 'Last one from me - free website audit for [Business Name]',
    body: `Hi [Contact Name],

Last time I'll bug you - I promise!

I went ahead and did a quick free audit of [Business Name]'s online presence. Here's what I found:

[Insert 2-3 specific findings]

If you ever want to chat about improving your web presence, my door is always open. No pressure at all.

Wishing you and [Business Name] continued success!

Best,
[Your Name]
[Your Phone]`,
    tags: ['follow-up', 'final', 'audit'],
    bestFor: 'Final follow-up after no response'
  },
  {
    id: 'referral',
    name: 'Referral Introduction',
    subject: '[Referrer Name] suggested I reach out',
    body: `Hi [Contact Name],

[Referrer Name] from [Referrer Business] suggested I get in touch with you. I recently helped them [rebuild their website / get more online visibility / launch their new site] and they thought you might benefit from similar work.

I specialize in building modern websites for [industry] businesses. Here's a quick look at what I did for [Referrer Business]: [link to portfolio/example]

Would you be open to a quick call to see if I can help [Business Name] too?

Best,
[Your Name]
[Your Phone]`,
    tags: ['referral', 'warm-intro'],
    bestFor: 'When you have a referral connection'
  }
];

export default emailTemplates;
