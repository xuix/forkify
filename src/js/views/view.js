import icons from 'url:../../img/icons.svg'; //parcel 2

export default class view {
  _parentElement = document.querySelector('.recipe');
  _data;
  _errorMessage =
    "Sorry I couldn't find that recipe. Please try another one 😃 ";
  _message = '';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // data = recipe
    this._data = data;
    const markup = this._generateMarkup();
    //  console.log('render markup  data=', markup);

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    //completely rendering page is too much if only 1 element has changed
    //only render what has changed on the page
    //  if (!data || (Array.isArray(data) && data.length === 0))
    //    return this.renderError();
    // data = recipe
    this._data = data;
    const newMarkup = this._generateMarkup();
    //create a DOM element from the markup string
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    console.log('newDOM=', newDOM);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        // update elements that contain text directly
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;
      //update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = () => {
    const markup = `<div class="spinner">
                            <svg>
                              <use href="${icons}#icon-loader"></use>
                            </svg>
                          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError = (message = this._errorMessage) => {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderMessage = (message = this._message) => {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
}
