import assert from 'node:assert';
import {parseArgs} from 'node:util';

import Logger from './log.js';
import {run} from './run.js';

const logger = new Logger(true);

const {
	values: {'tmp-dir': temporaryDirectory, 'firefox-path': firefoxPath},
} = parseArgs({
	options: {
		'tmp-dir': {
			type: 'string',
		},
		'firefox-path': {
			type: 'string',
		},
	},
});

logger.log('--tmp-dir="%s"', temporaryDirectory);
logger.log('--firefox-path="%s"', firefoxPath);

assert.ok(temporaryDirectory);
assert.ok(firefoxPath);

await run(firefoxPath, temporaryDirectory, logger);
