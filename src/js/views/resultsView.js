import view from '../views/view.js';
import icons from 'url:../../img/icons.svg'; //parcel 2
import previewView from './previewView.js';

class resultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results found for your query. Please try again';
  _message = '';

  _generateMarkup() {
    console.log('this._data;=', this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultsView();
