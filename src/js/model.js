import { async } from 'regenerator-runtime';

export const state = {
    recipe: {},
};

export const loadRecipe = async function (id) {
    try {
        const resp = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        const data = await resp.json();

        if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

        state.recipe = data.data.recipe;
    } catch (err) {
        alert(err);
    }
};
