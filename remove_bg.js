import fs from 'fs';
import path from 'path';
import { removeBackground } from '@imgly/background-removal-node';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage(imageName) {
  const imagePath = 'file:///' + path.join(__dirname, 'public', `${imageName}.jpg`).replace(/\\/g, '/');
  const outputPath = path.join(__dirname, 'public', `${imageName}.png`);
  
  console.log(`Processing ${imageName}...`);
  try {
    const blob = await removeBackground(imagePath);
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${imageName}:`, error);
  }
}

async function main() {
  await processImage('bouquet_1');
  await processImage('bouquet_2');
  await processImage('bouquet_3');
  await processImage('bouquet_4');
}

main();
