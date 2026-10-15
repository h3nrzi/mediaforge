import { refuse } from './contract.js';

/**
 * Refuse execution unless the approved Node.js patch is running.
 * @returns {void} Returns only for the approved runtime patch.
 */
export function checkRuntime() {
  if (process.versions.node !== '24.22.0')
    refuse(
      400,
      'unsupported_runtime',
      'Mediaforge requires Node.js 24.22.0; install the pinned runtime before starting.',
    );
}
