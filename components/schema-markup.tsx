export function SchemaMarkup() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://frostburn.io/#software',
        name: 'Frostburn',
        description:
          'HVAC invoicing and job scheduling software for small contractors. Automate billing, payment collection, and crew scheduling.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
        url: 'https://frostburn.io',
        image: {
          '@type': 'ImageObject',
          url: 'https://frostburn.io/og-image.jpg',
          width: 1200,
          height: 630,
        },
        offers: [
          {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '149',
            priceValidUntil: '2025-12-31',
            description: 'Starter plan: 1-3 technicians',
          },
          {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '299',
            priceValidUntil: '2025-12-31',
            description: 'Growth plan: 4-15 technicians (Most Popular)',
          },
          {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '499',
            priceValidUntil: '2025-12-31',
            description: 'Pro plan: 15+ technicians',
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '120',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Frostburn',
          url: 'https://frostburn.io',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://frostburn.io/#organization',
        name: 'Frostburn',
        description: 'HVAC invoicing and job scheduling software built for small contractors.',
        url: 'https://frostburn.io',
        logo: {
          '@type': 'ImageObject',
          url: 'https://frostburn.io/logo.svg',
          width: 200,
          height: 60,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'support@frostburn.io',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://frostburn.io/#faqpage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Frostburn?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Frostburn is invoicing and job scheduling software designed specifically for small HVAC contractors. It automates billing, payment collection, crew scheduling, and business reporting.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there a free trial?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Frostburn offers a 30-day free trial with no credit card required. You can cancel anytime.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does Frostburn cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Frostburn has three plans: Starter ($149/mo for 1-3 techs), Growth ($299/mo for 4-15 techs), and Pro ($499/mo for 15+ techs).',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I access Frostburn on mobile?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Frostburn works on iPhone, Android, Mac, Windows, and tablets through the web browser—no download required.',
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
