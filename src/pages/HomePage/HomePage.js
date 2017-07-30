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
    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <div className={scss['container']}>
        <div className={scss['container-inner']}>
          <div className={scss['logo']}>
            <img src={logoImg} alt='Logo' />
            <h1>Cother</h1>
          </div>
          <p className={scss['caption']}>A real-time collaborative code editor and previewer</p>
          <Link className={scss['link']} to={`/anonymous/${generateRandomString(20)}`}>
            Create New
          </Link>
        </div>

        <Footer type='fixed' />
      </div>
    );
  }
}

export default HomePage;
