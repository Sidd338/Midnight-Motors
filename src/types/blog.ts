export type ArticleCategory =
  | 'Hypercars'
  | 'Supercars'
  | 'Classics & Heritage'
  | 'Engineering & Tech'
  | 'Track & Performance'
  | 'German Performance'
  | 'JDM Legends'
  | 'Collections & Lifestyle'
  | 'Superbikes';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  credentials: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  subheading?: string;
  body: string[];
  callout?: {
    quote: string;
    speaker: string;
    context: string;
  };
  specTable?: SpecItem[];
  image?: {
    url: string;
    alt: string;
    caption: string;
  };
}

export interface ProductRecommendation {
  name: string;
  badge: string;
  category: string;
  specs: string;
  description: string;
  priceEstimate: string;
  rating: number;
  highlight: string;
  image: string;
}

export interface ProsAndCons {
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TableOfContentItem {
  id: string;
  title: string;
}

export interface ExternalCitation {
  title: string;
  url: string;
  publisher: string;
  description: string;
  type: 'regulatory' | 'manufacturer' | 'auction' | 'motorsport' | 'telemetry';
}

export interface InternalDeepLink {
  title: string;
  path: string;
  anchorText: string;
  context: string;
  badge: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  mainKeyword: string;
  relatedKeywords: string[];
  category: ArticleCategory;
  vehicleType: 'cars' | 'bikes' | 'both';
  heroImage: string;
  heroImageAlt: string;
  heroImageCaption: string;
  publishedDate: string;
  updatedDate: string;
  readTime: string;
  author: Author;
  excerpt: string;
  tableOfContents: TableOfContentItem[];
  contentSections: ContentSection[];
  productRecommendations: ProductRecommendation[];
  prosAndCons: ProsAndCons;
  faqs: FAQItem[];
  relatedSlugs: string[];
  inwardLinks?: InternalDeepLink[];
  outboundLinks?: ExternalCitation[];
  featured?: boolean;
  trendingScore: number;
}
