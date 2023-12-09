export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const API_KEY = '88012fd7-3a2e-453e-8824-1083c2611e30';
export const TIMEOUT_SEC = 10;
export const RESULTS_PER_PAGE = 10;
export const getPostRequestOptions = body => ({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});
export const MODAL_CLOSE_SEC = 2.5;
export const RENDER_ADD_RECIPE_FORM_SEC = 0.6;
