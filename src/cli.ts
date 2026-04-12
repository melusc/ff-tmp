import {cp, mkdtemp, realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {env, exit} from 'node:process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

import {execaNode} from 'execa';
import {z} from 'zod';

import Logger from './log.js';
import {run} from './run.js';
import {setupUblock} from './setup/ublock.js';

const {
	values: {'no-adblock': noAdblock, detached, help: showHelp},
} = parseArgs({
	options: {
		'no-adblock': {
			type: 'boolean',
			default: false,
		},
		detached: {
			type: 'boolean',
			default: false,
			short: 'd',
		},
		help: {
			type: 'boolean',
			default: false,
			short: 'h',
		},
	},
});

if (showHelp) {
	console.log(`ff-tmp: Create a temporary Firefox profile.

Usage: ff-tmp [OPTIONS]

Options:
  -h, --help
          Print help

      --no-adblock
          Don't install uBlock Origin.

  -d, --detached
          Detach Firefox process, run in background. This way,
          closing the terminal will not terminate Firefox.`);
	exit(0);
}

const {FIREFOX_PATH: firefoxPath} = z
	.object({
		FIREFOX_PATH: z.string().min(1),
	})
	.parse(env);

const osTemporaryDirectory = await realpath(tmpdir());
const temporaryProfileDirectory = await mkdtemp(
	path.join(osTemporaryDirectory, 'ff-tmp-'),
);

// Disable telemetry and similar
await cp(
	new URL('../src/user.js', import.meta.url),
	path.join(temporaryProfileDirectory, 'user.js'),
);

if (!noAdblock) {
	await setupUblock(temporaryProfileDirectory);
}

if (detached) {
	const detachedPath = new URL('detached.js', import.meta.url);

	const arguments_ = [
		'--tmp-dir',
		temporaryProfileDirectory,
		'--firefox-path',
		firefoxPath,
	];

	execaNode(fileURLToPath(detachedPath), arguments_, {
		detached: true,
	}).unref();

	exit(0);
} else {
	const logger = new Logger(false);
	logger.log('firefoxPath="%s"', firefoxPath);
	logger.log('tmpProfileDir="%s"', temporaryProfileDirectory);
	await run(firefoxPath, temporaryProfileDirectory, logger);
}
