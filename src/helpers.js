import { BASE_URL } from './conf.js';

export function getApiUrl(uri, baseUrl=BASE_URL) {
    return new URL(`${uri}`, baseUrl).toString();
}