import { describe, MockTracker } from '../vendor/kixx-test/mod.js';
import { assert, assertEqual } from '../vendor/kixx-assert/mod.js';
import { UnauthorizedError } from '../mod.js';

describe('UnauthorizedError', ({ it, describe }) => { // eslint-disable-line no-shadow

    it('creates instances inherited from the native Error', () => {
        const cause = new Error('test cause');
        const err = new UnauthorizedError('test message', { cause });
        assert(err instanceof Error);
        assert(err instanceof UnauthorizedError);
        assertEqual('test message', err.message);
        assertEqual(cause, err.cause);
    });

    // eslint-disable-next-line no-shadow
    describe('with defaults', ({ it }) => {
        it('has the default .name property', () => {
            const err = new UnauthorizedError('test message');
            assertEqual('UnauthorizedError', err.name);
            assertEqual(UnauthorizedError.name, err.name);
        });

        it('has the default .code property', () => {
            const err = new UnauthorizedError('test message');
            assertEqual('UNAUTHORIZED_ERROR', err.code);
            assertEqual(UnauthorizedError.CODE, err.code);
        });

        it('has the default .httpStatusCode property', () => {
            const err = new UnauthorizedError('test message');
            assertEqual(401, err.httpStatusCode);
            assertEqual(UnauthorizedError.HTTP_STATUS_CODE, err.httpStatusCode);
        });

        it('has the default .expected property', () => {
            const err = new UnauthorizedError('test message');
            assertEqual(true, err.expected);
        });

        it('has the default .httpError property', () => {
            const err = new UnauthorizedError('test message');
            assertEqual(true, err.httpError);
        });
    });

    // eslint-disable-next-line no-shadow
    describe('with custom options', ({ it }) => {
        it('accepts a custom name', () => {
            const err = new UnauthorizedError('test message', { name: 'CustomError' });
            assertEqual('CustomError', err.name);
        });

        it('accepts a custom code', () => {
            const err = new UnauthorizedError('test message', { code: 'CUSTOM_ERROR_CODE' });
            assertEqual('CUSTOM_ERROR_CODE', err.code);
        });

        it('accepts a custom httpStatusCode', () => {
            const err = new UnauthorizedError('test message', { httpStatusCode: 418 });
            assertEqual(418, err.httpStatusCode);
            assertEqual(true, err.httpError);
        });

        it('accepts a custom expected flag', () => {
            const err = new UnauthorizedError('test message', { expected: false });
            assertEqual(false, err.expected);
        });

        it('accepts multiple custom options simultaneously', () => {
            const err = new UnauthorizedError('test message', {
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
            const err = new UnauthorizedError('test message', null, sourceFunction);
            assertEqual(1, Error.captureStackTrace.mock.callCount());
            assertEqual(err, Error.captureStackTrace.mock.getCall(0).arguments[0]);
            assertEqual(sourceFunction, Error.captureStackTrace.mock.getCall(0).arguments[1]);
        });
    });
});
