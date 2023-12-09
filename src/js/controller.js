import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config';
import { wait } from './helpers.js';
import * as model from './model.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView';
import searchView from './views/searchView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();

        // 0. Update results view to mark selected search result
        resultsView.update(model.getSearchResultPage());
        // Also update bookmarks
        bookmarkView.update(model.state.bookmarks);

        // 1. Loading recipe
        await model.loadRecipe(id);

        // 2. Rendering recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
    try {
        // 1. Get search query
        const query = searchView.getQuery();
        if (!query) return;

        resultsView.renderSpinner();

        // 2. Load search results
        await model.loadSearchResults(query);

        // 3. Render results
        resultsView.render(model.getSearchResultPage());

        // 4. Render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.error(err);
    }
};

const controlPagination = function (goToPage) {
    // 1. Render new results
    resultsView.render(model.getSearchResultPage(goToPage));

    // 2. Render new pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    // 1. Add/remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // 2. Update bookmark icon
    recipeView.update(model.state.recipe);
    // and render all bookmarks
    bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        addRecipeView.renderSpinner();

        // Upload the new recipe data
        await model.uploadRecipe(newRecipe);

        // Render new recipe on UI
        recipeView.render(model.state.recipe);

        // Display success message
        addRecipeView.renderMessage();

        // Render bookmark view
        bookmarkView.render(model.state.bookmarks);

        // Change id in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        await wait(MODAL_CLOSE_SEC);
        // Close window
        addRecipeView.toggleWindow();
        await wait(0.6);
        // Render window again
        addRecipeView.render('render');
    } catch (err) {
        addRecipeView.renderError(err.message);
    }
};

(function init() {
    bookmarkView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
})();
