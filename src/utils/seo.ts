import { BlogArticle } from '../types/blog';

export function updateSEO(article?: BlogArticle) {
  // Ensure Google Search Console verification meta tag is always present
  let verificationMeta = document.querySelector('meta[name="google-site-verification"]');
  if (!verificationMeta) {
    verificationMeta = document.createElement('meta');
    verificationMeta.setAttribute('name', 'google-site-verification');
    verificationMeta.setAttribute('content', 'EZG_-PUQRTMA7qk4757g1WrZeDqRlbA_5Fs4xZ0wvXw');
    document.head.prepend(verificationMeta);
  }

  if (article) {
    document.title = `${article.seoTitle} | MIDNIGHT MOTORS`;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', article.seoDescription);

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', article.seoKeywords.join(', '));

    // OpenGraph
    updateMetaTag('property', 'og:title', article.seoTitle);
    updateMetaTag('property', 'og:description', article.seoDescription);
    updateMetaTag('property', 'og:image', article.heroImage);
    updateMetaTag('property', 'og:type', 'article');
    updateMetaTag('name', 'twitter:title', article.seoTitle);
    updateMetaTag('name', 'twitter:description', article.seoDescription);
    updateMetaTag('name', 'twitter:image', article.heroImage);

    // Inject JSON-LD Schema for Article & FAQPage
    injectSchema({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsArticle',
          headline: article.title,
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
            name: 'MIDNIGHT MOTORS',
            logo: {
              '@type': 'ImageObject',
              url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80'
            }
          },
          description: article.seoDescription
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
    // Default Homepage SEO
    document.title = 'MIDNIGHT MOTORS — Curated Hypercars, Supercars, Bikes & Automotive Icons';
    updateMetaTag(
      'name',
      'description',
      'Explore deep-dive technical engineering editorials on hypercars, classic supercars, JDM legends, superbikes, and the ultimate dream garage at MIDNIGHT MOTORS.'
    );
    updateMetaTag(
      'name',
      'keywords',
      'hypercars, supercars, classic cars, JDM legends, superbikes, Ferrari, Koenigsegg, Bugatti, McLaren F1, Porsche GT3 RS'
    );
    updateMetaTag('property', 'og:title', 'MIDNIGHT MOTORS — Curated Hypercars, Supercars & Automotive Icons');
    updateMetaTag('property', 'og:description', 'Deep-dive technical engineering editorials on the world’s most extraordinary automobiles.');
    updateMetaTag('property', 'og:image', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85');
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
