import { async } from 'regenerator-runtime';
import { API_URL } from './config';
//import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
import { RESULTS_PER_PAGE, KEY } from './config';

export const state = {
  recipe: {},
  search: { query: '', results: [], page: 1, resultsPerPage: RESULTS_PER_PAGE },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //add the key if it exists
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const res = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log('=res', res);
    state.recipe = createRecipeObject(res);

    //if the id just loaded exists in the bookmark array set bookmarked to true
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    //  console.log('state.recipe=', state.recipe);
  } catch (err) {
    console.error(`err😅`);
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    state.search.page = 1;
    const res = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = res.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        //add the key if it exists
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9  slice does not include the last value
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  //new quantity = old quantity * new servings/old servings
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);
  //mark current recipe as bookmarked
  if ((recipe.id = state.recipe.id)) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = id => {
  //find index of id in array
  const index = state.bookmarks.findIndex(el => el.id === id);
  //delete element from array at index
  state.bookmarks.splice(index, 1);
  //mark current recipe as bookmarked
  state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//for debugging
const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].split(',').map(el => el.trim());
        //    const ingArray = ing[1].replaceAll(' ', '').split(',');
        if (ingArray.length < 3)
          throw new Error(
            'Wrong ingredient format. Please us the correct format'
          );
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log('recipe=', recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    //     const data = await sendJSON(`${API_URL}?key=${KEY}`,recipe);
    console.log('data=', data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
