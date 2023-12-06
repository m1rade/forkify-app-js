import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView';
import searchView from './views/searchView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
    module.hot.accept();
}

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();

        // 0. Update results view to mark selected search result
        resultsView.update(model.getSearchResultPage());

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

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
