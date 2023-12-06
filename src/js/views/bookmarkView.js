import previewView from './previewView.js';
import View from './view.js';

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
    _message = '';

    _generateMarkup() {
        return this._data.reduce((str, bookmark) => str + previewView.render(bookmark, false), '');
    }
}

export default new BookmarkView();
