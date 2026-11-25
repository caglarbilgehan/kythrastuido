#!/usr/bin/env node
/**
 * KythraStudio AI Context Exporter
 * Generates clean, binary-free Markdown codebase bundles for NotebookLM & Gemini.
 * Usage: npm run export:context
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'ai-context', 'gemini');

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '__pycache__',
  '.pytest_cache',
  '.venv',
  'venv',
  'storage',
  'font',
  'soundfont',
  '.aistudio',
]);

const ALLOWED_EXTS = new Set([
  '.py',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.yaml',
  '.yml',
  '.toml',
  '.sh',
  '.conf',
  '.md',
  '.html',
]);

const IGNORED_FILES = new Set([
  'package-lock.json',
  'bun.lock',
  'yarn.lock',
  'pnpm-lock.yaml',
  'material-web.d.ts',
]);

const MAX_FILE_BYTES = 120 * 1024; // Skip huge generated files if any

function langForExt(ext) {
  const map = {
    '.py': 'python',
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.js': 'js',
    '.mjs': 'js',
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.toml': 'toml',
    '.sh': 'bash',
    '.conf': 'nginx',
    '.md': 'markdown',
    '.html': 'html',
  };
  return map[ext] || '';
}

function collectFiles(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      collectFiles(path.join(dirPath, entry.name), results);
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) continue;
      const fullPath = path.join(dirPath, entry.name);
      const stat = fs.statSync(fullPath);
      if (stat.size > MAX_FILE_BYTES) continue;
      results.push(fullPath);
    }
  }
  return results;
}

function buildBundle({ title, description, roots, extraFiles = [], outFile }) {
  const fileSet = new Set();
  for (const rel of extraFiles) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      fileSet.add(abs);
    }
  }
  for (const rel of roots) {
    for (const f of collectFiles(path.join(ROOT, rel))) {
      fileSet.add(f);
    }
  }

  const files = Array.from(fileSet).sort((a, b) => a.localeCompare(b));
  const lines = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${description}`);
  lines.push(`> Toplam Dosya: ${files.length} | Üretim Tarihi: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('## Dosya Dizini');
  for (const f of files) {
    lines.push(`- \`${path.relative(ROOT, f)}\``);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const f of files) {
    const rel = path.relative(ROOT, f);
    const ext = path.extname(f).toLowerCase();
    const content = fs.readFileSync(f, 'utf8').trimEnd();
    lines.push(`## \`${rel}\``);
    lines.push('');
    lines.push('```' + langForExt(ext));
    lines.push(content);
    lines.push('```');
    lines.push('');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const target = path.join(OUT_DIR, outFile);
  fs.writeFileSync(target, lines.join('\n'), 'utf8');
  const kb = (fs.statSync(target).size / 1024).toFixed(1);
  console.log(`Generated ${path.relative(ROOT, target)} (${files.length} files, ${kb} KB)`);
}

buildBundle({
  title: 'KythraStudio — Backend, Tests & Infra Codebase Snapshot',
  description:
    'Python FastAPI backend, 4-stage DAG engines, SQLite DB, observability middleware, tests, and deployment config.',
  roots: ['production/backend', 'production/tests', 'production/docker'],
  extraFiles: [
    'production/pyproject.toml',
    'production/run.py',
    'production/start.sh',
    'production/docker-compose.yml',
  ],
  outFile: 'codebase-backend.md',
});

buildBundle({
  title: 'KythraStudio — Web Studio, Developer Workbench & Mobile Codebase Snapshot',
  description:
    'React/TypeScript sources for Web Studio, Developer Observability Workbench, and Mobile prototype (excluding large CSS stylesheets, fonts, and binaries).',
  roots: ['production/web/src', 'production/developer/src', 'production/mobile/src'],
  extraFiles: [
    'package.json',
    'production/web/package.json',
    'production/web/vite.config.ts',
    'production/developer/package.json',
    'production/developer/vite.config.ts',
    'production/mobile/package.json',
    'production/mobile/App.tsx',
  ],
  outFile: 'codebase-frontend.md',
});
