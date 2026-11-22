// Builds one standalone, read-only birthday page from index.html, styles.css and script.js.
// Usage: node build.js [our-blooms-data.json]
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
const escapeScript = (s) => s.replace(/<\/script/gi, '<\\/script');

let html = read('index.html');
const css = read('styles.css');
const js = read('script.js');

const dataFile = process.argv[2] || path.join(dir, 'our-blooms-data.json');
let data = { names: undefined, photos: {} };
if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  console.log('Using data from', path.basename(dataFile));
} else {
  console.log('No data file found; building with the default names and no photos.');
}

const cfgRe = /(<script id="cfg" type="application\/json">)[\s\S]*?(<\/script>)/;
const cfgJson = JSON.stringify({
  locked: true,
  names: data.names || JSON.parse(html.match(cfgRe)[0].replace(/^[^>]*>|<\/script>$/g, '')).names,
  photos: data.photos || {},
}).replace(/</g, '\\u003c');

html = html
  .replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + css + '</style>')
  .replace(cfgRe, (m, open, close) => open + cfgJson + close)
  .replace('<script src="script.js"></script>', () => '<script>\n' + escapeScript(js) + '</script>');

const out = path.join(dir, 'our-blooms-locked.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', out);
