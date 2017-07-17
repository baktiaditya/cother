import React, { Component } from 'react';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import scss from './NotFoundPage.mod.scss';

class ErrorPage extends Component {
  _style;
  _pageTitle = 'Page Not Found';

  componentWillMount() {
    // Page title
    const titleTag = document.getElementsByTagName('title')[0];
    titleTag.innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this._pageTitle}`;

    // Create custom <style /> in <head />
    let css = 'html { display: table; height: 100%; text-align: center; width: 100%; }';
    css += 'body { display: table-cell; vertical-align: middle; margin: 2em auto; }';
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');

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
          exist.</p>
      </div>
    );
  }
}

export default ErrorPage;
