/* eslint no-console:0 */
import React from 'react';
import { Link } from 'react-router';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { generateRandomString } from '../../shared/utils';

// Components
import Base from '../../components/Base/Base';

class HomePage extends React.Component {
  componentWillMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} Collaborative Text Editor`;
  }

  render() {
    return (
      <Base>
        <Link to={`/${generateRandomString(20)}`}>Create New</Link>
      </Base>
    );
  }
}

export default HomePage;
