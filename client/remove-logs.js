import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        content = content.split(/\r?\n/).filter(line => !line.includes('console.log(')).join('\n');

        if (content !== originalContent) {
           fs.writeFileSync(fullPath, content, 'utf8');
           console.log(`Cleaned ${file}`);
        }
      }
    }
  }
}

traverse(path.join(__dirname, 'src'));
