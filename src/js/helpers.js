import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (url) {
    try {
        const resp = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await resp.json();

        if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

        return data;
    } catch (err) {
        throw err;
    }
};
