import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveProductMeta, updateAggregateRatingMarkup } from './review-schema-utils.mjs';

test('explicit Product price wins over cheaper secondary services on the page', () => {
  const html = `
    <title>Küchenmontage Hamburg | Test</title>
    <meta property="og:title" content="Küchenmontage Hamburg | Festpreis">
    <meta property="og:url" content="https://example.test/">
    <meta property="product:price:amount" content="170">
    <p>Waschmaschine anschließen ab 60€</p>
  `;

  assert.equal(deriveProductMeta(html).price, '170');
});

test('lowest valid page price remains the fallback when no explicit price exists', () => {
  const html = '<title>Service</title><p>Variante A ab 149€; Variante B ab 89€.</p>';

  assert.equal(deriveProductMeta(html).price, '89');
});

test('aggregate update does not overwrite individual review ratings', () => {
  const html = JSON.stringify({
    aggregateRating: { ratingValue: '5.0', ratingCount: '19', reviewCount: '19' },
    review: [{ reviewRating: { ratingValue: '5', bestRating: '5' } }],
  });

  const updated = updateAggregateRatingMarkup(html, 24, 4.8);

  assert.match(updated, /"aggregateRating":\{"ratingValue":"4\.8","ratingCount":"24","reviewCount":"24"\}/);
  assert.match(updated, /"reviewRating":\{"ratingValue":"5"/);
});
