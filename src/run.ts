import {rm} from 'node:fs/promises';

import spawn from 'nano-spawn';

import type Logger from './log.js';

export async function run(
	firefoxPath: string,
	temporaryDirectory: string,
	logger: Logger,
) {
	logger.log('Starting Firefox');

	await spawn(
		firefoxPath,
		['-profile', temporaryDirectory, '-no-remote', '-new-instance'],
		{
			detached: true,
		},
	);

	logger.log('Firefox has closed');

	logger.log('Deleting firefox profile');
	await rm(temporaryDirectory, {recursive: true});

	logger.done();
}
