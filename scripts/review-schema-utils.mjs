const FALLBACK_IMAGE = 'https://kuechen-montage-hamburg.de/img/profile/profile.webp';

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function metaContent(html, key) {
  const escaped = escapeRegExp(key);
  const attr = '(?:property|name)';
  const first = new RegExp(`<meta[^>]+${attr}=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i');
  const reversed = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${escaped}["']`, 'i');
  return (html.match(first) || html.match(reversed) || [])[1] || '';
}

function validPrice(value) {
  const amount = Number(String(value).replace(',', '.'));
  return Number.isFinite(amount) && amount >= 20 && amount <= 5000 ? amount : null;
}

/** Build Product metadata without letting a cheap secondary service redefine the main offer. */
export function deriveProductMeta(html, fallbackImage = FALLBACK_IMAGE) {
  const title = metaContent(html, 'og:title') || (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || '';
  const name = (title.split(/[|–—·]/)[0] || '').trim() || 'Küchenmontage Hamburg';
  const image = metaContent(html, 'og:image') || fallbackImage;
  const description = (metaContent(html, 'og:description') || metaContent(html, 'description') || name).trim();
  const explicitPrice = validPrice(metaContent(html, 'product:price:amount'));
  const pagePrices = [...html.matchAll(/\bab\s*(\d{2,4})\s*€/gi)]
    .map((match) => validPrice(match[1]))
    .filter((price) => price != null);
  const amount = explicitPrice ?? (pagePrices.length ? Math.min(...pagePrices) : null);
  const url = metaContent(html, 'og:url')
    || (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1]
    || '';

  return { name, image, description, price: amount == null ? '' : String(amount), url };
}

/** Update only AggregateRating nodes; individual Review.reviewRating values must stay intact. */
export function updateAggregateRatingMarkup(html, count, rating) {
  const normalizedCount = String(count);
  const normalizedRating = Number(rating).toFixed(1);

  return html.replace(/("aggregateRating"\s*:\s*\{)([^{}]*)(\})/g, (_all, start, body, end) => {
    const updated = body
      .replace(/("reviewCount"\s*:\s*")\d+(")/g, `$1${normalizedCount}$2`)
      .replace(/("ratingCount"\s*:\s*")\d+(")/g, `$1${normalizedCount}$2`)
      .replace(/("ratingValue"\s*:\s*")[\d.]+(")/g, `$1${normalizedRating}$2`);
    return `${start}${updated}${end}`;
  });
}
