import { describe, MockTracker } from '../vendor/kixx-test/mod.js';
import { assert, assertEqual } from '../vendor/kixx-assert/mod.js';
import { ServiceUnavailableError } from '../mod.js';

describe('ServiceUnavailableError', ({ it, describe }) => { // eslint-disable-line no-shadow

    it('creates instances inherited from the native Error', () => {
        const cause = new Error('test cause');
        const err = new ServiceUnavailableError('test message', { cause });
        assert(err instanceof Error);
        assert(err instanceof ServiceUnavailableError);
        assertEqual('test message', err.message);
        assertEqual(cause, err.cause);
    });

    // eslint-disable-next-line no-shadow
    describe('with defaults', ({ it }) => {
        it('has the default .name property', () => {
            const err = new ServiceUnavailableError('test message');
            assertEqual('ServiceUnavailableError', err.name);
            assertEqual(ServiceUnavailableError.name, err.name);
        });

        it('has the default .code property', () => {
            const err = new ServiceUnavailableError('test message');
            assertEqual('SERVICE_UNAVAILABLE_ERROR', err.code);
            assertEqual(ServiceUnavailableError.CODE, err.code);
        });

        it('has the default .httpStatusCode property', () => {
            const err = new ServiceUnavailableError('test message');
            assertEqual(503, err.httpStatusCode);
            assertEqual(ServiceUnavailableError.HTTP_STATUS_CODE, err.httpStatusCode);
        });

        it('has the default .expected property', () => {
            const err = new ServiceUnavailableError('test message');
            assertEqual(true, err.expected);
        });

        it('has the default .httpError property', () => {
            const err = new ServiceUnavailableError('test message');
            assertEqual(true, err.httpError);
        });
    });

    // eslint-disable-next-line no-shadow
    describe('with custom options', ({ it }) => {
        it('accepts a custom name', () => {
            const err = new ServiceUnavailableError('test message', { name: 'CustomError' });
            assertEqual('CustomError', err.name);
        });

        it('accepts a custom code', () => {
            const err = new ServiceUnavailableError('test message', { code: 'CUSTOM_ERROR_CODE' });
            assertEqual('CUSTOM_ERROR_CODE', err.code);
        });

        it('accepts a custom httpStatusCode', () => {
            const err = new ServiceUnavailableError('test message', { httpStatusCode: 418 });
            assertEqual(418, err.httpStatusCode);
            assertEqual(true, err.httpError);
        });

        it('accepts a custom expected flag', () => {
            const err = new ServiceUnavailableError('test message', { expected: false });
            assertEqual(false, err.expected);
        });

        it('accepts multiple custom options simultaneously', () => {
            const err = new ServiceUnavailableError('test message', {
                name: 'CustomError',
                code: 'CUSTOM_ERROR_CODE',
                httpStatusCode: 418,
                expected: false,
            });
            assertEqual('CustomError', err.name);
            assertEqual('CUSTOM_ERROR_CODE', err.code);
            assertEqual(418, err.httpStatusCode);
            assertEqual(false, err.expected);
            assertEqual(true, err.httpError);
        });
    });

    // eslint-disable-next-line no-shadow
    describe('with a retryAfterSeconds option', ({ it }) => {
        it('keeps a valid retry hint with the 503 defaults', () => {
            const err = new ServiceUnavailableError('busy', { retryAfterSeconds: 5 });
            assertEqual('ServiceUnavailableError', err.name);
            assertEqual('SERVICE_UNAVAILABLE_ERROR', err.code);
            assertEqual(503, err.httpStatusCode);
            assertEqual(true, err.httpError);
            assertEqual(true, err.expected);
            assertEqual(5, err.retryAfterSeconds);
            assertEqual('busy', err.message);
        });

        it('keeps a custom code and cause', () => {
            const cause = new Error('overloaded');
            const err = new ServiceUnavailableError('busy', { cause, code: 'StoreOverloaded' });
            assertEqual('StoreOverloaded', err.code);
            assertEqual(cause, err.cause);
        });

        it('honors expected: false', () => {
            const err = new ServiceUnavailableError('busy', { expected: false });
            assertEqual(false, err.expected);
        });

        it('keeps a zero retry hint', () => {
            const err = new ServiceUnavailableError('busy', { retryAfterSeconds: 0 });
            assertEqual(0, err.retryAfterSeconds);
        });

        it('sets retryAfterSeconds to null when omitted', () => {
            const err = new ServiceUnavailableError('busy');
            assertEqual(null, err.retryAfterSeconds);
        });

        it('sets retryAfterSeconds to null when invalid', () => {
            for (const value of [ -1, 1.5, '5', NaN ]) {
                const err = new ServiceUnavailableError('busy', { retryAfterSeconds: value });
                assertEqual(null, err.retryAfterSeconds, `retryAfterSeconds ${ String(value) }`);
            }
        });

        it('does not allow retryAfterSeconds to be reassigned', () => {
            const err = new ServiceUnavailableError('busy', { retryAfterSeconds: 5 });

            try {
                err.retryAfterSeconds = 10;
            } catch {
                // Strict mode throws on a non-writable property.
            }

            assertEqual(5, err.retryAfterSeconds);
        });
    });

    // eslint-disable-next-line no-shadow
    describe('when a sourceFunction is provided', ({ before, after, it }) => {
        let sandbox;

        before(() => {
            sandbox = new MockTracker();
            sandbox.method(Error, 'captureStackTrace');
        });

        after(() => {
            sandbox.restoreAll();
        });

        it('captures the stack trace', () => {
            const sourceFunction = () => { };
            const err = new ServiceUnavailableError('test message', null, sourceFunction);
            assertEqual(1, Error.captureStackTrace.mock.callCount());
            assertEqual(err, Error.captureStackTrace.mock.getCall(0).arguments[0]);
            assertEqual(sourceFunction, Error.captureStackTrace.mock.getCall(0).arguments[1]);
        });
    });
});
