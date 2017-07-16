// https://github.com/firebase/firepad/blob/master/examples/userlist.html
// https://github.com/firebase/firepad/blob/master/examples/firepad-userlist.js
// https://firebase.googleblog.com/2013/06/how-to-build-presence-system.html
// https://firebase.google.com/docs/database/admin/retrieve-data
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Icon from '../Icon/Icon';
import scss from './UserList.mod.scss';

class UserList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    firepadRef: PropTypes.object,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    displayName: PropTypes.string
  };

  _displayName = this.props.displayName || `Guest ${Math.floor(Math.random() * 1000)}`;
  _userRef = this.props.firepadRef.getParent().child(`presence/${this.props.userId}`);
  _colorRef = this.props.firepadRef.child(`users/${this.props.userId}/color`);

  state = {
    userList: {}
  };

  componentWillMount() {
    this._colorRef.on('value', (snapshot) => {
      if (snapshot.val() && this._displayName) {
        const nameRef = this._userRef.child('name');
        const colorRef = this._userRef.child('color');

        nameRef.set(this._displayName);
        colorRef.set(snapshot.val());
        this._userRef.onDisconnect().remove();
      }
    });

    this._userRef.getParent().on('value', (snapshot) => {
      this.setState({
        userList: snapshot.val()
      }, () => {
        console.log('users', snapshot.val());
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return JSON.stringify(this.state.userList) !== JSON.stringify(nextState.userList);
  }

  componentWillUnmount() {
    this._userRef.getParent().off('value');
    this._userRef.remove();
    this._colorRef.off('value');
  }

  render() {
    const {
      className,
      ...props
    } = this.props;
    delete props.firepadRef;
    delete props.userId;
    delete props.displayName;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'user-list'
    );
    const totalUsers = Object.keys(this.state.userList).length;

    return (
      <div {...props} className={classes}>
        {totalUsers}&nbsp;&nbsp;<Icon size={20} icon='remove-red-eye' />
      </div>
    );
  }
}

export default UserList;
