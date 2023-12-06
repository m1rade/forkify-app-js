import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
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

export const getSearchResultPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // Formula to calc new quantity
        // newQt = oldQt * newServings / oldServings
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};
