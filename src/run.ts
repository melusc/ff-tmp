import {rm} from 'node:fs/promises';

import {execa} from 'execa';

import type Logger from './log.js';

export async function run(
	firefoxPath: string,
	temporaryDirectory: string,
	xpi: string | undefined,
	logger: Logger,
) {
	logger.log('Starting Firefox');

	await execa(
		firefoxPath,
		[
			'-profile',
			temporaryDirectory,
			'-no-remote',
			'-new-instance',
			...(xpi ? [xpi] : []),
		],
		{
			detached: true,
		},
	);

	logger.log('Firefox has closed');

	logger.log('Deleting firefox profile');
	await rm(temporaryDirectory, {recursive: true});

	logger.done();
}
