/**
 * Cloudinary Image URL Optimizer
 *
 * Transforms raw Cloudinary upload URLs into optimized variants by injecting
 * transformation parameters (format, quality, width).
 *
 * Non-Cloudinary URLs are returned unchanged.
 *
 * @example
 *   getOptimizedImageUrl("https://res.cloudinary.com/.../upload/v123/img.png", 400)
 *   // → "https://res.cloudinary.com/.../upload/f_auto,q_auto,w_400/v123/img.png"
 */

/**
 * @param {string} url - The original image URL
 * @param {number} [width] - Target display width in pixels
 * @returns {string} The optimized Cloudinary URL, or the original URL if not Cloudinary
 */
export function getOptimizedImageUrl(url, width) {
  if (!url || typeof url !== "string") return url;

  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  // Build transformation string
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  const transformStr = transforms.join(",");

  // Insert transforms after /upload/
  // Pattern: .../upload/v1234/... → .../upload/f_auto,q_auto,w_400/v1234/...
  // Also handle case where transforms already exist (avoid double-transform)
  const uploadSegment = "/upload/";
  const uploadIndex = url.indexOf(uploadSegment);

  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + uploadSegment.length);
  const afterUpload = url.substring(uploadIndex + uploadSegment.length);

  // If transforms are already present (starts with a known param like f_, q_, w_, c_, etc.)
  // skip to avoid double-applying
  if (/^[a-z]_/.test(afterUpload)) return url;

  return `${beforeUpload}${transformStr}/${afterUpload}`;
}
