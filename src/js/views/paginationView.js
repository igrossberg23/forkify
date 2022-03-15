/******************************************
 * Pagination View: The pagination below
 * the search results if there exists
 * more than 1 page of results
 *****************************************/
import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Takes in controller function to handle user input
   * on (next-page) or (prev-page) pagination buttons
   * @param {function} handler
   * @returns if the event target is not a pagination button
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  /**
   * Determines new page results to be displayed based on
   * application state and pagination button clicked
   * @returns HTML Markup
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupButtons(null, curPage + 1);

    // Last page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupButtons(curPage - 1, null);

    // Other page
    if (curPage < numPages)
      return this._generateMarkupButtons(curPage - 1, curPage + 1);

    // Page 1 and there are NO other pages
    return '';
  }

  /**
   * Creates new pagination button markup based on input arguments
   * @param {integer} prevPage optional page # argument
   * @param {integer} nextPage optional page # argument
   * @returns HTML markup
   */
  _generateMarkupButtons(prevPage, nextPage) {
    let markup = '';
    if (prevPage)
      markup += `
      <button data-goto="${prevPage}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
      <span>Page ${prevPage}</span>
      </button>`;

    if (nextPage)
      markup += `
    <button data-goto="${nextPage}" class="btn--inline pagination__btn--next">
      <span>Page ${nextPage}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;

    return markup;
  }
}

export default new PaginationView();
