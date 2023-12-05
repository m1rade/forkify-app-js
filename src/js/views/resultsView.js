import icons from '../../img/icons.svg';
import View from './view.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again ;)';
    _message = '';

    _generateMarkup() {
        return this._data.reduce(this._generateMarkupPreview, '');
    }

    _generateMarkupPreview(str, currResult) {
        return (
            str +
            `
        <li class="preview">
          <a class="preview__link" href="#${currResult.id}">
            <figure class="preview__fig">
              <img src="${currResult.image_url}" alt="${currResult.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${currResult.title}</h4>
              <p class="preview__publisher">${currResult.publisher}</p>
            </div>
          </a>
        </li>`
        );
    }
}

export default new ResultsView();
