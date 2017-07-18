/* eslint no-console:0 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { generateRandomString, slugify } from '../../shared/utils';
import scss from './HomePage.mod.scss';
import scssString from './HomePage.string.scss';

import Footer from '../../components/Footer/Footer';

class HomePage extends Component {
  static displayName = 'HomePage';

  _style;

  componentWillMount() {
    // Page title
    const titleTag = document.getElementsByTagName('title')[0];
    titleTag.innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} Collaborative Text Editor`;

    // Create custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(HomePage.displayName);
    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = scssString;
    } else {
      this._style.appendChild(document.createTextNode(scssString));
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
      <div className={scss['container']}>
        <Link className={scss['link']} to={`/${generateRandomString(20)}`}>Create New</Link>
        <br />
        <Link className={scss['link']} to={`/${generateRandomString(20)}`}>
          <img className={scss['img']} src={require('./cookie.jpg')} alt='hehe' width={310} />
        </Link>

        <Footer type='fixed' />
      </div>
    );
  }
}

export default HomePage;
