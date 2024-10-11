import path from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { parse, resolve } from 'path';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

try {
  const { base } = parse(__dirname);
  const { version } = JSON.parse(
    readFileSync(resolve(__dirname, 'build', 'manifest.json'), 'utf8')
  );

  const outDir = 'release';
  const filename = `${base}-v${version}.zip`;
  const zip = new AdmZip();
  zip.addLocalFolder('build');
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }
  zip.writeZip(`${outDir}/${filename}`);

  console.log(
    `Success! Created a ${filename} file under ${outDir} directory. You can upload this file to web store.`
  );
} catch (e) {
  console.log(e);
  console.error('Error! Failed to generate a zip file.');
}
