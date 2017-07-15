import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import scss from './Header.mod.scss';

class Header extends React.Component {
  static propTypes = {
    brand: PropTypes.string
  }

  static defaultProps = {
    brand: 'Cother'
  }

  render() {
    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <div className={scss['header']}>
        <Link to='/' className={scss['brand']}>
          <img src={logoImg} alt='Cother' />
          <h1>{this.props.brand}</h1>
        </Link>
      </div>
    );
  }
}

export default Header;
