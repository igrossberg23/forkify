/******************************************
 * Model: holds the program state and
 * handles business processes behind
 * the scenes
 *****************************************/
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// Program State
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Format Recipe Object for use in the application
 * @param {Object} data recipe object in the format returned by forkify API
 * @returns {Object} recipe object in a standardized format
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads a specific recipe based on its unique id to the state
 * @param {String} id alphanumeric id asociated with a recipe
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`⚠${err}`);
    throw err;
  }
};

/**
 * Loads all search results from forkify API based on search query
 * @param {String} query Search query for results page
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1;
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(`⚠${err}`);
    throw err;
  }
};

/**
 * Retrieves array of recipes to be displayed on the results view
 * @param {Integer} page Page #
 * @returns {Recipe[]} Array of recipes to be displayed
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Updates state based on servings change initiated by user
 * @param {Integer} newServings Positive integer for current servings
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

/**
 * Commits bookmarks to local storage in the browser
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds input recipe to bookmarks array in state
 * @param {Object} recipe recipe to be added to bookmarks
 */
export const addBookmark = function (recipe) {
  // Add bookmark to state
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Removes a recipe from the bookmarks array in state
 * @param {String} id alphanumeric id of recipe to be deleted
 */
export const deleteBookmark = function (id) {
  // Delete bookmark in state
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

/**
 * Initialization function. Currently only retrieves bookmarks
 * from local storage
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Dev function used to programmatically clear bookmarks
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

/**
 * Uploads a user-generated recipe to the forkify API
 * @param {Object} newRecipe recipe object to be uploaded
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
