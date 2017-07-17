import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loader from '../Loader/Loader';
import Icon from '../Icon/Icon';
import scss from './Header.mod.scss';

class Header extends Component {
  static propTypes = {
    brand: PropTypes.string,
    isLoading: PropTypes.bool,
    totalUsers: PropTypes.number
  }

  static defaultProps = {
    brand: 'Cother',
    totalUsers: 0
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

        {isLoading
          ? <Loader />
          : (
            <div className={scss['user-list-indicator']}>
              {this.props.totalUsers}&nbsp;&nbsp;<Icon size={20} icon='remove-red-eye' />
            </div>
          )
        }
      </div>
    );
  }
}

export default Header;
