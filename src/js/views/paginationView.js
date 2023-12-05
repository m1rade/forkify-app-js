import icons from '../../img/icons.svg';
import View from './view.js';

class Pagination extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');

            if (!btn) return;

            handler(+btn.dataset.goto);
        });
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupBtn('next', curPage + 1);
        }

        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkupBtn('prev', curPage - 1);
        }
        // Other pages
        if (curPage < numPages) {
            return this._generateMarkupBtn('prev', curPage - 1) + this._generateMarkupBtn('next', curPage + 1);
        }

        // Page 1, and there are NO other pages
        return '';
    }

    _generateMarkupBtn(type, page) {
        return `
            <button class="btn--inline pagination__btn--${type}" data-goto="${page}">
              ${type === 'prev' ? this._generateMarkupBtnIcon(type) : ''}
              <span>Page ${page}</span>
              ${type === 'next' ? this._generateMarkupBtnIcon(type) : ''}
            </button>
            `;
    }

    _generateMarkupBtnIcon(type) {
        return `
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        `;
    }
}

export default new Pagination();
