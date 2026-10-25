/**
 * Registration entry for Verba unit-test resolve hooks.
 * Usage (from frontend/): node --test --import ./scripts/test-register.mjs <test files>
 */
import { register } from 'node:module';

register('./test-hooks.mjs', import.meta.url);
