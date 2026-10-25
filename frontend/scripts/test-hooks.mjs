/**
 * Node ESM resolve hook for Verba unit tests (test runs only).
 * Resolves extensionless relative imports to their `.ts` source files so
 * tests can run on plain Node (type stripping) without a bundler or extra deps.
 */
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

/**
 * @typedef {object} ResolveContext
 * @property {string} [parentURL]
 * @property {string[]} [conditions]
 */

function candidateFiles(base) {
  return [base + '.ts', path.join(base, 'index.ts')];
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const isRelative = specifier.startsWith('./') || specifier.startsWith('../');
    if (!isRelative || !context.parentURL) {
      throw error;
    }
    const parentPath = fileURLToPath(context.parentURL);
    const base = path.resolve(path.dirname(parentPath), specifier);
    for (const candidate of candidateFiles(base)) {
      try {
        if (existsSync(candidate) && statSync(candidate).isFile()) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      } catch {
        // Ignore filesystem errors and keep searching.
      }
    }
    throw error;
  }
}
