import WrappedError from './wrapped-error.js';


/**
 * Error used when a request conflicts with the current resource state.
 * @extends WrappedError
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
export default class ConflictError extends WrappedError {
    /**
     * The error code string for this error type.
     * @type {string}
     * @static
     * @readonly
     */
    static CODE = 'CONFLICT_ERROR';

    /**
     * The HTTP status code for this error type (409).
     * @type {number}
     * @static
     * @readonly
     */
    static HTTP_STATUS_CODE = 409;

    /**
     * @param {string} message - Error message describing the resource conflict.
     * @param {Object} [options] - Additional error options.
     * @param {string} [options.code] - Custom error code override.
     * @param {string} [options.name] - Custom error name override.
     * @param {Error} [options.cause] - Underlying cause.
     * @param {Function} [sourceFunction] - Function excluded from captured stack frames.
     */
    constructor(message, options, sourceFunction) {
        const opts = Object.assign({ expected: true }, options);
        super(message, opts, sourceFunction);
    }
}
