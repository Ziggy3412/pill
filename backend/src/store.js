import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const PILLS_FILE = join(DATA_DIR, 'pills.json');

export function loadPills() {
  if (!existsSync(PILLS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(PILLS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function savePills(pills) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(PILLS_FILE, JSON.stringify(pills, null, 2));
}
