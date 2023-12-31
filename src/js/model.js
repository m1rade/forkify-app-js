import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { ajax } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: [],
};

export const loadRecipe = async function (id) {
    try {
        const data = await ajax(`${API_URL}${id}?key=${API_KEY}`);

        state.recipe = data.data.recipe;

        if (state.bookmarks.some(b => b.id === state.recipe.id)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await ajax(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search.results = data.data.recipes;
        state.search.page = 1;
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

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    // Mark current recipe as a bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(b => b.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT a bookmark
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

(function init() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
})();

export const uploadRecipe = async function (newRecipe) {
    try {
        // 1. Format ingredients objects like data from API: {quantity, unit, description}
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');

                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });

        // 2. Prepare new recipe object
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        // 3. Send recipe to server
        const data = await ajax(`${API_URL}?key=${API_KEY}`, recipe);

        // 4. Save recipe
        state.recipe = data.data.recipe;

        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
};
