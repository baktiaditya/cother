import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loader from '../Loader/Loader';
import UserList from '../UserList/UserList';
import scss from './Header.mod.scss';

class Header extends Component {
  static propTypes = {
    brand: PropTypes.string,
    isLoading: PropTypes.bool,

    //------
    firepadRef: PropTypes.object.isRequired,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    displayName: PropTypes.string
  }

  static defaultProps = {
    brand: 'Cother'
  }

  render() {
    const {
      brand,
      displayName,
      firepadRef,
      userId,
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
            <UserList
              firepadRef={firepadRef}
              userId={userId}
              displayName={displayName}
              className={scss['user-list']}
            />
          )
        }
      </div>
    );
  }
}

export default Header;
