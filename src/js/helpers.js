import { TIMEOUT_SEC, getPostRequestOptions } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const ajax = async function (url, payload = undefined) {
    try {
        const fetchPromise = payload ? fetch(url, getPostRequestOptions(payload)) : fetch(url);

        const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await resp.json();

        if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

        return data;
    } catch (err) {
        throw err;
    }
};
