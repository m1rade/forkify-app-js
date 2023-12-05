import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
    },
};

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`);

        state.recipe = data.data.recipe;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.results = data.data.recipes;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
