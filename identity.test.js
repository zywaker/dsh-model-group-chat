import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// A renamed package must not keep the old identity in the files the Loader and
// the browser module table resolve by name.
test('bundle patch and client id match the package name', async () => {
  const manifest = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
  const patch = await readFile(new URL('./cordis.patch.yml', import.meta.url), 'utf8');
  const client = await readFile(new URL('./client.js', import.meta.url), 'utf8');
  const patchName = /^\s*name:\s*['"]?([^'"\r\n]+)['"]?\s*$/mu.exec(patch)?.[1];
  const clientId = /window\.__ModuleLoader__\.load\(\{\s*id:\s*['"]([^'"]+)['"]/u.exec(client)?.[1];
  assert.equal(patchName, manifest.name, 'cordis.patch.yml row name must equal package.json name');
  assert.equal(clientId, manifest.name, 'client.js module id must equal package.json name');
  const rowId = /^\s*-\s*id:\s*(\S+)\s*$/mu.exec(patch)?.[1];
  assert.ok(rowId && /^[a-z0-9][a-z0-9-]*$/u.test(rowId), 'row id must be a stable lowercase identifier');
});
