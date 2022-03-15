/******************************************
 * Bookmarks View: Holds all bookmarked
 * recipes as previews
 *****************************************/
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMesssage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = 'Default message';

  /**
   * Takes in controller function to handle rendering bookmarks on app load
   * @param {function} handler
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /** Generates previews of each recipe in markups and returns the markup */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
