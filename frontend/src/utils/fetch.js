import { getAntiCSRFToken, handleCSRFToken } from './antiCSRFToken.js';

/**
 * Wrapper around the fetch function.
 * Accepts either json data or FormData.
 * @param {{Object}} config
 * @param {string} config.url
 * @param {string} [config.method = 'GET']
 * @param {Object} [config.data]
 * @param {Object} [config.headers]
 * @param {boolean} [config.antiCSRFToken = true]
 * @returns {Response|null} Returns the response data or null if no data is returned
 * @throws {Response} Throws if the request returns an error
 */
export async function simpleFetch({
    url,
    method = 'GET',
    data,
    headers,
    antiCSRFToken = true,
}) {
    const contentType =
        data && !(data instanceof FormData) ? 'application/json' : undefined;
    const body =
        !data || data instanceof FormData ? data : JSON.stringify(data);

    const options = {
        method,
        headers: {
            ...(contentType && { 'Content-Type': contentType }),
            ...(antiCSRFToken && { 'X-CRSF-Token': getAntiCSRFToken() }),
            ...headers,
        },
        ...(body && { body }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw response;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
