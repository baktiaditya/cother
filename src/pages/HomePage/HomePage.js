/* eslint no-console:0 */
import React from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../constants';
import { generateRandomString } from '../../utils';
import scss from './HomePage.mod.scss';

// Components
import Base from '../../components/Base/Base';

class HomePage extends React.Component {
  componentDidMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} Collaborative Text Editor`;
  }

  render() {
    return (
      <Base>
        <div className={scss['header']}>
          <Link to={`/${generateRandomString(20)}`}>Create New</Link>
        </div>
      </Base>
    );
  }
}

export default HomePage;
