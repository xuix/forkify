//libraries for polyfill
import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';

import paginationView from './views/paginationView.js';

import bookmarksView from './views/bookmarksView.js';

import { MODAL_CLOSE_SEC } from './config';

//parcel keep state on reloading
// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async () => {
  try {
    const id = window.location.hash.slice(1);
    //  console.log('id=', id);

    //display the spinner
    recipeView.renderSpinner();
    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //Loading recipe

    await model.loadRecipe(id);

    if (!id) return;

    console.log('recipe=', model.state.recipe);
    //2 rendering recipe
    recipeView.render(model.state.recipe);

    // controlservings();
  } catch (err) {
    console.log('ggggggggggg', err);
    // alert(`An error occured ${err}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    //get Search query
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    //load search results
    await model.loadSearchResults(query);
    //render search results
    console.log('#data1=', model.state.search);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log('hhhhh', err);
    resultsView.renderError();
  }
};
const controlPagination = gotoPage => {
  console.log('gotoPage=', gotoPage);
  //render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));
  //render new pagination button
  paginationView.render(model.state.search);
};
//controlSearchResults();

const controlServings = newServings => {
  //update the recipe servings
  model.updateServings(newServings);
  //update the recipe  view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = bookmark => {
  //add or remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();
    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    //console.log('   model.state.recipe=', model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Display success Message
    addRecipeView.renderMessage();
    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change id in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close the form window after 2 seconds
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('👿err=', err);
    addRecipeView.renderError(err.message);
  }
};
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
