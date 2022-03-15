/******************************************
 * Search View: Literally just the search
 * bar and attached button
 *****************************************/
class SearchView {
  _parentElement = document.querySelector('.search');

  /**
   * Gets user search query and returns it to controller to be handled
   * @returns {String} query to be used for loading results from API
   */
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  /**
   * Clears the search query from the window
   */
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  /**
   * Takes in controller function to handle search submit event
   * @param {function} handler
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
