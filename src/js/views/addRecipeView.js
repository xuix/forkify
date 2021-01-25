import view from './view.js';
import icons from 'url:../../img/icons.svg'; //parcel 2

class AddRecipeView extends view {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded 😆';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow = () => {
    this._btnOpen.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  };
  _addHandlerHideWindow = () => {
    this._btnClose.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  };

  addHandlerUpload = handler => {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      // scrape all the data off the form
      const dataArray = [...new FormData(this._parentElement)];
      //convert array to object
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  };
  generateMarkup = () => {};
}
export default new AddRecipeView();
