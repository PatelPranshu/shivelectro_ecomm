import { Helmet } from "react-helmet-async";

const SITE_NAME = "Shiv Electro";
const DEFAULT_OG_IMAGE = "https://www.shivelectro.com/logo.png";
const BASE_URL = "https://www.shivelectro.com";

/**
 * Reusable SEO component for per-page meta tag management.
 *
 * @param {Object} props
 * @param {string} props.title - Page title (will be appended with " | Shiv Electro")
 * @param {string} props.description - Meta description (max ~160 chars recommended)
 * @param {string} [props.canonicalUrl] - Canonical URL for the page
 * @param {string} [props.ogImage] - Open Graph image URL (defaults to logo)
 * @param {string} [props.ogType] - OG type, defaults to "website"
 * @param {Object|null} [props.jsonLd] - Optional JSON-LD schema object
 */
function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullCanonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${BASE_URL}${canonicalUrl}`
    : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export default SEO;
