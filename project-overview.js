import { previewProjectFile } from "./project-files.js";

// Fixed root-level probes only. Every name must be eligible for previewProjectFile.
const ROOT_FILES = ["README.md", "README.rst", "README", "README.txt", "package.json", "pyproject.toml", "Cargo.toml"];
const MAX_OVERVIEW_FILES = 3;
const MAX_OVERVIEW_CHARS = 6000;
const MAX_EXCERPT_CHARS = MAX_OVERVIEW_CHARS / MAX_OVERVIEW_FILES;

export async function readProjectOverview(root) {
  const files = [];
  for (const relativePath of ROOT_FILES) {
    let preview;
    try {
      preview = await previewProjectFile({ workspacePath: root, relativePath });
    } catch {
      // An absent, blocked, or unverifiable probe contributes neither content nor diagnostics.
      continue;
    }

    let text = preview.text.slice(0, MAX_EXCERPT_CHARS);
    if (/[\ud800-\udbff]$/u.test(text)) text = text.slice(0, -1);
    if (!text.trim()) continue;
    files.push({ path: relativePath, text, truncated: preview.truncated || text.length < preview.text.length });
    if (files.length === MAX_OVERVIEW_FILES) break;
  }
  return { files };
}
