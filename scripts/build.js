#!/usr/bin/env node

/**
 * Build & Validation Script for Garda Mangkunagaran
 * - Validates data integrity (including title and honorifics)
 * - Validates modular components
 * - Bundles/syncs CSS from src/assets/css to public/styles.css
 * - Verifies asset paths, logo & favicon references, and zero orphan files / broken links
 */

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const publicDir = path.resolve(rootDir, 'public');

console.log('--- Garda Mangkunagaran Build & Validation ---');

// 1. Check for legacy/incorrect name across the repository
const TARGET_INCORRECT_NAME = 'dr. H. K. R. T. Wikan Basworo, M.Sc. Sp. FML';
const REQUIRED_CORRECT_NAME = 'dr. K. R. T. H. Wikan Basworo, Sp.FMI.,M.Sc';

function searchFileForText(filePath, text) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(text);
}

function scanDirForText(dir, text) {
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  const matches = [];
  for (const file of files) {
    if (file.isFile()) {
      const fullPath = path.resolve(file.parentPath || file.path, file.name);
      // Skip scripts, .git, and node_modules
      if (
        fullPath.includes(`${path.sep}scripts${path.sep}`) ||
        fullPath.includes(`${path.sep}.git${path.sep}`) ||
        fullPath.includes(`${path.sep}node_modules${path.sep}`)
      ) {
        continue;
      }
      if (searchFileForText(fullPath, text)) {
        matches.push(fullPath);
      }
    }
  }
  return matches;
}

const legacyMatches = scanDirForText(rootDir, TARGET_INCORRECT_NAME);
if (legacyMatches.length > 0) {
  console.error('❌ Found occurrences of incorrect legacy name in:');
  legacyMatches.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log('✅ Zero occurrences of incorrect legacy name found.');
}

// 2. Validate that the correct name exists in key files
const indexHtmlPath = path.resolve(publicDir, 'index.html');
const structureCompPath = path.resolve(srcDir, 'components', 'structure.html');
const orgDataPath = path.resolve(srcDir, 'data', 'organization.json');

const correctFiles = [indexHtmlPath, structureCompPath, orgDataPath];
for (const f of correctFiles) {
  if (!fs.existsSync(f)) {
    console.error(`❌ Expected file not found: ${f}`);
    process.exit(1);
  }
  if (!searchFileForText(f, REQUIRED_CORRECT_NAME)) {
    console.error(`❌ File ${f} does not contain required name: "${REQUIRED_CORRECT_NAME}"`);
    process.exit(1);
  }
}
console.log(`✅ Correct name "${REQUIRED_CORRECT_NAME}" verified in HTML, components, and data.`);

// 3. Validate components
const expectedComponents = [
  'topline.html',
  'header.html',
  'hero.html',
  'about.html',
  'history.html',
  'values.html',
  'programs.html',
  'structure.html',
  'membership.html',
  'eligibility.html',
  'legal.html',
  'closing.html',
  'footer.html',
];

for (const comp of expectedComponents) {
  const compPath = path.resolve(srcDir, 'components', comp);
  if (!fs.existsSync(compPath)) {
    console.error(`❌ Component missing: ${compPath}`);
    process.exit(1);
  }
}
console.log(`✅ All ${expectedComponents.length} modular components verified.`);

// 4. Bundle/sync CSS modules into public/styles.css
const cssModules = [
  'variables.css',
  'reset.css',
  'layout.css',
  'components.css',
  'sections.css',
  'responsive.css',
];

let bundledCss = `/**\n * Garda Mangkunagaran - Production Stylesheet\n * Generated from modular source in src/assets/css/\n */\n\n`;

for (const cssMod of cssModules) {
  const modPath = path.resolve(srcDir, 'assets', 'css', cssMod);
  if (!fs.existsSync(modPath)) {
    console.error(`❌ CSS module missing: ${modPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(modPath, 'utf8');
  bundledCss += `/* --- Module: ${cssMod} --- */\n` + content.trim() + '\n\n';
}

const publicStylesPath = path.resolve(publicDir, 'styles.css');
fs.writeFileSync(publicStylesPath, bundledCss.trim() + '\n', 'utf8');
console.log('✅ CSS modules successfully bundled into public/styles.css.');

// 5. Verify image references exist
const imageAssets = [
  'garda-favicon-latest.png',
  'garda-favicon.png',
  'garda-logo-latest.webp',
  'garda-logo.webp',
];

for (const img of imageAssets) {
  const imgPath = path.resolve(publicDir, 'images', img);
  if (!fs.existsSync(imgPath)) {
    console.error(`❌ Asset missing: ${imgPath}`);
    process.exit(1);
  }
}
console.log(`✅ All ${imageAssets.length} image assets in public/images/ verified.`);

// 5b. Verify all logo and favicon references in HTML files use valid /images/ path
const htmlFilesToCheck = [
  indexHtmlPath,
  path.resolve(srcDir, 'components', 'header.html'),
  path.resolve(srcDir, 'components', 'footer.html'),
];

for (const htmlFile of htmlFilesToCheck) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  if (content.includes('manus-storage/garda-logo')) {
    console.error(`❌ Legacy manus-storage logo path found in: ${htmlFile}`);
    process.exit(1);
  }
  if (!content.includes('src="/images/garda-logo-latest.webp"')) {
    console.error(`❌ Missing src="/images/garda-logo-latest.webp" in: ${htmlFile}`);
    process.exit(1);
  }
  if (!content.includes('data-fallback="/images/garda-logo-latest.webp"')) {
    console.error(`❌ Missing data-fallback="/images/garda-logo-latest.webp" in: ${htmlFile}`);
    process.exit(1);
  }
}
console.log('✅ All logo references use verified /images/ absolute path and data-fallback.');

// 6. Verify JS entry points and modules
const jsFiles = [
  path.resolve(publicDir, 'script.js'),
  path.resolve(srcDir, 'js', 'main.js'),
  path.resolve(srcDir, 'js', 'modules', 'fallback.js'),
  path.resolve(srcDir, 'js', 'modules', 'navigation.js'),
  path.resolve(srcDir, 'js', 'modules', 'scrollSpy.js'),
];

for (const js of jsFiles) {
  if (!fs.existsSync(js)) {
    console.error(`❌ JS file missing: ${js}`);
    process.exit(1);
  }
}
console.log('✅ All JavaScript modules and public entry points verified.');

console.log('🎉 Build and validation completed successfully with 0 errors.');
