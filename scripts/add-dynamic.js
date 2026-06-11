const fs = require('fs');
const path = require('path');

function getRouteFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getRouteFiles(filePath, files);
    } else if (file === 'route.ts' || file === 'route.js') {
      files.push(filePath);
    }
  }
  return files;
}

const apiDir = path.join(__dirname, '..', 'app', 'api');
const routeFiles = getRouteFiles(apiDir);

console.log(`Found ${routeFiles.length} API route files.`);

for (const file of routeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Skip if dynamic is already configured
  if (content.includes('dynamic =') || content.includes('dynamic=')) {
    console.log(`Skipping: ${path.relative(apiDir, file)} (already configured)`);
    continue;
  }
  
  // Inject at the top
  const injected = `export const dynamic = "force-dynamic";\n\n${content}`;
  fs.writeFileSync(file, injected, 'utf8');
  console.log(`Updated: ${path.relative(apiDir, file)}`);
}

console.log('All API routes verified!');
