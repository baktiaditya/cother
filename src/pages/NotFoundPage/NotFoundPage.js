import React, { Component } from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { slugify } from '../../shared/utils';
import scss from './NotFoundPage.mod.scss';
import scssString from './NotFoundPage.string.scss';

class ErrorPage extends Component {
  static displayName = 'ErrorPage';

  _style;
  _pageTitle = 'Page Not Found';

  componentWillMount() {
    // Page title
    const titleTag = document.getElementsByTagName('title')[0];
    titleTag.innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this._pageTitle}`;

    // Create custom <style /> in <head />
    const css = scssString;
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(ErrorPage.displayName);

    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = css;
    } else {
      this._style.appendChild(document.createTextNode(css));
    }

    head.appendChild(this._style);
  }

  componentWillUnmount() {
    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  render() {
    return (
      <div>
        <h1 className={scss['headline']}>{this._pageTitle}</h1>
        <p className={scss['caption']}>Sorry, but the page you were trying to view does not
          exist. Head over to the <Link to='/'>home page</Link> to choose a new direction.</p>
      </div>
    );
  }
}

export default ErrorPage;
