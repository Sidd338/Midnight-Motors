import { BlogArticle } from '../types/blog';

export interface PageSEOConfig {
  title: string;
  description: string;
  mainKeyword: string;
  relatedKeywords: string[];
  canonicalUrl: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEOConfig> = {
  home: {
    title: 'Hypercars Showroom | Exotic Supercars | Midnight Motors',
    description:
      'Visit our private hypercars showroom featuring an exotic supercars collection and rare hyper machinery. Discover elite performance. Explore the collection.',
    mainKeyword: 'hypercars showroom',
    relatedKeywords: ['exotic supercars collection', 'luxury car showroom'],
    canonicalUrl: '/'
  },
  'what-is-a-hypercar': {
    title: 'What is a Hypercar? Hypercar vs Supercar | Midnight Motors',
    description:
      'Wondering what is a hypercar? Compare hypercar vs supercar engineering, top speed records, aerodynamics, and bespoke power. Read the comprehensive guide.',
    mainKeyword: 'what is a hypercar',
    relatedKeywords: ['hypercar vs supercar', 'fastest hypercars in the world'],
    canonicalUrl: '/what-is-a-hypercar'
  },
  'best-classic-cars-to-invest-in': {
    title: 'Best Classic Cars to Invest In: Vintage | Midnight Motors',
    description:
      'Discover the best classic cars to invest in, from rare Ferrari icons to an exotic classic cars portfolio with proven returns. Explore our collector guide.',
    mainKeyword: 'best classic cars to invest in',
    relatedKeywords: ['exotic classic cars', 'vintage car collection'],
    canonicalUrl: '/best-classic-cars-to-invest-in'
  },
  'luxury-motorcycles': {
    title: 'Luxury Motorcycles: Superbikes Collection | Midnight Motors',
    description:
      'Explore the world of luxury motorcycles and view our rare superbikes collection featuring the pinnacle of two-wheel speed. Discover the full track showcase.',
    mainKeyword: 'luxury motorcycles',
    relatedKeywords: ['superbikes collection', 'best luxury bikes in the world'],
    canonicalUrl: '/luxury-motorcycles'
  }
};

export function updateSEO(article?: BlogArticle) {
  // Ensure Google Search Console verification meta tag is always preserved in head
  let verificationMeta = document.querySelector('meta[name="google-site-verification"]');
  if (!verificationMeta) {
    verificationMeta = document.createElement('meta');
    verificationMeta.setAttribute('name', 'google-site-verification');
    verificationMeta.setAttribute('content', 'EZG_-PUQRTMA7qk4757g1WrZeDqRlbA_5Fs4xZ0wvXw');
    document.head.prepend(verificationMeta);
  }

  if (article) {
    // Check if we have an explicit page config for this article
    const config = SEO_PAGE_CONFIGS[article.slug];
    const finalTitle = config ? config.title : `${article.seoTitle} | Midnight Motors`;
    const finalDesc = config ? config.description : article.seoDescription;
    const finalKeywords = config
      ? [config.mainKeyword, ...config.relatedKeywords]
      : [article.mainKeyword, ...article.relatedKeywords, ...article.seoKeywords];

    document.title = finalTitle;
    updateMetaTag('name', 'description', finalDesc);
    updateMetaTag('name', 'keywords', finalKeywords.join(', '));

    // OpenGraph & Twitter Cards
    updateMetaTag('property', 'og:title', finalTitle);
    updateMetaTag('property', 'og:description', finalDesc);
    updateMetaTag('property', 'og:image', article.heroImage);
    updateMetaTag('property', 'og:type', 'article');
    const cleanCanonicalPath = config ? config.canonicalUrl : `/${article.slug}`;
    const fullCleanUrl = `${window.location.origin}${cleanCanonicalPath}`;
    updateMetaTag('property', 'og:url', fullCleanUrl);
    updateMetaTag('name', 'twitter:title', finalTitle);
    updateMetaTag('name', 'twitter:description', finalDesc);
    updateMetaTag('name', 'twitter:image', article.heroImage);
    updateMetaTag('name', 'twitter:url', fullCleanUrl);

    // Canonical link with clean defined URL
    updateCanonical(cleanCanonicalPath);

    // Inject JSON-LD Schema with Clean Defined URL
    injectSchema({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsArticle',
          headline: article.title,
          url: fullCleanUrl,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullCleanUrl
          },
          image: [article.heroImage],
          datePublished: '2026-10-01T08:00:00+00:00',
          dateModified: '2026-10-14T08:00:00+00:00',
          author: [
            {
              '@type': 'Person',
              name: article.author.name,
              jobTitle: article.author.role
            }
          ],
          publisher: {
            '@type': 'Organization',
            name: 'Midnight Motors',
            logo: {
              '@type': 'ImageObject',
              url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80'
            }
          },
          description: finalDesc
        },
        {
          '@type': 'FAQPage',
          mainEntity: article.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }
      ]
    });
  } else {
    // Default Homepage SEO configuration
    const homeConfig = SEO_PAGE_CONFIGS.home;
    const homeUrl = `${window.location.origin}/`;
    document.title = homeConfig.title;
    updateMetaTag('name', 'description', homeConfig.description);
    updateMetaTag(
      'name',
      'keywords',
      [homeConfig.mainKeyword, ...homeConfig.relatedKeywords].join(', ')
    );
    updateMetaTag('property', 'og:title', homeConfig.title);
    updateMetaTag('property', 'og:description', homeConfig.description);
    updateMetaTag(
      'property',
      'og:image',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    );
    updateMetaTag('property', 'og:url', homeUrl);
    updateMetaTag('name', 'twitter:url', homeUrl);
    updateCanonical('/');
  }
}

function updateMetaTag(keyType: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${keyType}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(keyType, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonical(path: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', `${window.location.origin}${path}`);
}

function injectSchema(schemaObj: object) {
  let script = document.getElementById('article-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'article-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj);
}
