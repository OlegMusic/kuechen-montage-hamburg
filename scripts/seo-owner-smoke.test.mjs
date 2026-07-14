import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

function htmlFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) htmlFiles(absolute, files);
    else if (entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim());
}

test('homepage is the focused owner and exposes the correct primary offer', () => {
  const html = read('index.html');
  const product = jsonLdBlocks(html)
    .map((block) => JSON.parse(block))
    .find((node) => node['@type'] === 'Product');

  assert.match(html, /<title>Küchenmontage Hamburg ab 170 €/);
  assert.match(html, /<meta property="product:price:amount" content="170">/);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.equal(product?.offers?.price, '170');
});

test('legacy kitchen-montage page is a compact alias to the homepage', () => {
  const html = read('pages/services/kuechenmontage-hamburg.html');

  assert.ok(html.length < 1_000);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.match(html, /rel="canonical" href="https:\/\/kuechen-montage-hamburg\.de\/"/);
  assert.match(html, /http-equiv="refresh" content="0; url=https:\/\/kuechen-montage-hamburg\.de\/"/);
  assert.doesNotMatch(html, /<h1\b/i);
});

test('commercial kitchen-front page links to its informational guide', () => {
  assert.match(
    read('kuechenfronten-austauschen-hamburg/index.html'),
    /href="\.\.\/pages\/blog\/kuechenfronten-austauschen-lohnt-sich\.html"/,
  );
});

test('every JSON-LD block on the site parses as JSON', () => {
  const failures = [];
  for (const file of htmlFiles(repo)) {
    for (const [index, block] of jsonLdBlocks(fs.readFileSync(file, 'utf8')).entries()) {
      try {
        JSON.parse(block);
      } catch (error) {
        failures.push(`${path.relative(repo, file)}#${index + 1}: ${error.message}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
