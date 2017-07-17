/* eslint no-console:0 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { generateRandomString } from '../../shared/utils';
import scss from './HomePage.mod.scss';

class HomePage extends Component {
  componentWillMount() {
    // Page title
    const titleTag = document.getElementsByTagName('title')[0];
    titleTag.innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} Collaborative Text Editor`;
  }

  render() {
    return (
      <div>
        <Link className={scss['link']} to={`/${generateRandomString(20)}`}>Create New</Link>
        <br />
        <Link className={scss['link']} to={`/${generateRandomString(20)}`}>
          <img className={scss['img']} src={require('./cookie.jpg')} alt='hehe' width={310} />
        </Link>
      </div>
    );
  }
}

export default HomePage;
