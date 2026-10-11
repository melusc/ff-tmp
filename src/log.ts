import {createWriteStream, type WriteStream} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {formatWithOptions} from 'node:util';

const logsDirectory = new URL('../logs/', import.meta.url);
await mkdir(logsDirectory, {recursive: true});

/*
 * It seems that when the current node process is detached it can handle
 * only a few console.debug calls before it errors with EPIPE
 * The fix for that is to just not call `console.debug` at all if the instance is detached.
 */

export default class Logger {
	readonly #logFile: WriteStream;
	readonly #detached: boolean;

	constructor(detached: boolean) {
		const logFilePath = new URL(
			`ff-tmp-${new Date().toISOString().replaceAll(':', '_')}.log`,
			logsDirectory,
		);
		this.#logFile = createWriteStream(logFilePath);
		this.#detached = detached;

		this.log('detached=%s', detached);
	}

	log(message: string, ...parameters: unknown[]) {
		const formatted = formatWithOptions(
			{
				colors: false,
				sorted: true,
			},
			`[%s] ${message}`,
			new Date(),
			...parameters,
		);

		if (!this.#detached) {
			console.debug(formatted);
		}

		this.#logFile.write(`${formatted}\n`);
	}

	done() {
		this.#logFile.close();
	}
}
