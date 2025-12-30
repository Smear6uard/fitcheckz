export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Styleum",
    url: "https://styleum.app",
    logo: "https://styleum.app/images/logo.png",
    sameAs: [
      "https://twitter.com/styleum",
      "https://instagram.com/styleum",
      "https://tiktok.com/@styleum",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@styleum.app",
      contactType: "customer support",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Styleum",
    url: "https://styleum.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://styleum.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Styleum",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, iOS, Android",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
        description: "Up to 50 items, 5 outfit recommendations per week",
      },
      {
        "@type": "Offer",
        price: "6.99",
        priceCurrency: "USD",
        name: "Pro",
        description: "Unlimited items and outfit recommendations",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2847",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Daily outfit recommendations",
      "Weather-smart picks",
      "Wardrobe management",
      "Style analytics",
      "Shopping recommendations",
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does Styleum work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Add your clothes by taking photos. Every morning, get 6 personalized outfit suggestions based on your wardrobe, the weather, and your calendar.",
        },
      },
      {
        "@type": "Question",
        name: "Is my wardrobe data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your wardrobe photos are stored securely and only used to generate outfit recommendations. We never share or sell your data.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Styleum cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Styleum is free to start with up to 50 items and 5 outfit recommendations per week. Pro is $6.99/month for unlimited items and recommendations.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can cancel your Pro subscription at any time from your account settings. No questions asked.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add clothes to my wardrobe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Take photos of your clothes or forward your purchase receipts. We automatically detect and categorize each item for you.",
        },
      },
      {
        "@type": "Question",
        name: "Does Styleum work with my calendar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Connect your calendar and get outfit suggestions based on your upcoming events and meetings.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to my data if I delete my account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All your photos and data are permanently deleted when you delete your account.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a mobile app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Styleum works on any device through your browser. Native iOS and Android apps are coming soon.",
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://styleum.app",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
