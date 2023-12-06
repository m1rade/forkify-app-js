import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again ;)';
    _message = '';

    _generateMarkup() {
        return this._data.reduce((str, result) => str + previewView.render(result, false), '');
    }
}

export default new ResultsView();
