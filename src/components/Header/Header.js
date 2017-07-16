import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loader from '../Loader/Loader';
import scss from './Header.mod.scss';

class Header extends React.Component {
  static propTypes = {
    brand: PropTypes.string,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    brand: 'Cother'
  }

  render() {
    const {
      brand,
      isLoading
    } = this.props;

    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <div className={scss['header']}>
        <Link to='/' className={scss['brand']}>
          <img src={logoImg} alt='Cother' />
          <h1>{brand}</h1>
        </Link>

        {isLoading && <Loader />}
      </div>
    );
  }
}

export default Header;
