import {Buffer} from 'node:buffer';
import {cp, mkdtemp, realpath, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {env, exit} from 'node:process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

import {execaNode} from 'execa';
import {z} from 'zod';

import Logger from './log.js';
import {run} from './run.js';

const {
	values: {'no-adblock': noAdblock, detached},
} = parseArgs({
	options: {
		'no-adblock': {
			type: 'boolean',
			default: false,
		},
		detached: {
			type: 'boolean',
			default: false,
		},
	},
});

const {FIREFOX_PATH: firefoxPath} = z
	.object({
		FIREFOX_PATH: z.string().min(1),
	})
	.parse(env);

// eslint-disable-next-line security/detect-non-literal-fs-filename
const osTemporaryDirectory = await realpath(tmpdir());
const temporaryProfileDirectory = await mkdtemp(
	path.join(osTemporaryDirectory, 'ff-tmp-'),
);

// Disable telemetry and similar
await cp(
	new URL('../src/user.js', import.meta.url),
	path.join(temporaryProfileDirectory, 'user.js'),
);

let xpiOutDirectory: string | undefined;

if (!noAdblock) {
	const versionRequest = await fetch(
		'https://addons.mozilla.org/api/v5/addons/addon/ublock-origin/versions/',
	);
	const untrustedJson: unknown = await versionRequest.json();
	const versions = z
		.object({
			results: z.array(
				z.object({
					file: z.object({
						url: z.string(),
					}),
				}),
			),
		})
		.parse(untrustedJson);

	const [latest] = versions.results;

	if (!latest) {
		throw new Error('Could not find latest version');
	}

	const xpiRequest = await fetch(latest.file.url);
	const xpi = await xpiRequest.arrayBuffer();

	xpiOutDirectory = path.join(temporaryProfileDirectory, 'ublock.temp.xpi');
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await writeFile(xpiOutDirectory, Buffer.from(xpi));
}

if (detached) {
	const detachedPath = new URL('detached.js', import.meta.url);

	const arguments_ = [
		'--tmp-dir',
		temporaryProfileDirectory,
		'--firefox-path',
		firefoxPath,
	];

	if (xpiOutDirectory) {
		arguments_.push('--xpi', xpiOutDirectory);
	}

	execaNode(fileURLToPath(detachedPath), arguments_, {
		detached: true,
	}).unref();

	exit(0);
} else {
	const logger = new Logger(false);
	logger.log('firefoxPath="%s"', firefoxPath);
	logger.log('tmpProfileDir="%s"', temporaryProfileDirectory);
	logger.log('xpiOutDir="%s"', xpiOutDirectory);
	await run(firefoxPath, temporaryProfileDirectory, xpiOutDirectory, logger);
}
