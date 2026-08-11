import fs from 'fs';
import path from 'path';

const publicDir = 'd:/credible-create/public';

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(publicDir);

let totalReplacements = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Replace WhatsApp links
  content = content.replace(/wa\.me\/919999999999/g, 'wa.me/919219488809');
  content = content.replace(/wa\.me\/91[0-9]{10}/g, 'wa.me/919219488809');

  // Replace Tel links
  content = content.replace(/tel:\+919999999999/g, 'tel:+919219488809');
  content = content.replace(/tel:\+91[0-9]{10}/g, 'tel:+919219488809');

  // Replace Emails
  content = content.replace(/info@crediblecreate\.com/g, 'crediblecreate0@gmail.com');
  content = content.replace(/legal@crediblecreate\.com/g, 'crediblecreate0@gmail.com');
  content = content.replace(/privacy@crediblecreate\.com/g, 'crediblecreate0@gmail.com');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated contacts in ${path.relative('d:/credible-create', filePath)}`);
    totalReplacements++;
  }
});

console.log(`\nUpdated ${totalReplacements} HTML files successfully!`);
