import {Buffer} from 'node:buffer';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

import z from 'zod';

export async function setupUblock(
	temporaryProfileDirectory: string,
): Promise<void> {
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

	const extensionsDirectory = path.join(
		temporaryProfileDirectory,
		'extensions',
	);
	const extensionTarget = path.join(
		extensionsDirectory,
		'uBlock0@raymondhill.net.xpi',
	);

	await mkdir(extensionsDirectory);

	await writeFile(extensionTarget, Buffer.from(xpi));
}
