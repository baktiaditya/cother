/* eslint no-console:0 */
import React from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX } from '../../constants';
import { generateRandomString } from '../../utils';
import scss from './HomePage.mod.scss';

class HomePage extends React.Component {
  componentDidMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = PAGE_TITLE_PREFIX;
  }

  render() {
    return (
      <div className={scss['header']}>
        <Link to={`/${generateRandomString(20)}`}>Create New</Link>
      </div>
    );
  }
}

export default HomePage;
