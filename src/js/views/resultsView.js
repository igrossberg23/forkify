/******************************************
 * Results View: List of recipes rendered
 * on screen as search results
 *****************************************/
import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMesssage = 'No recipes found for your query! Please try again :)';
  _message = 'Default message';

  /** Simple function to take in search results and render them on the page */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
