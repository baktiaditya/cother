// https://github.com/firebase/firepad/blob/master/examples/userlist.html
// https://github.com/firebase/firepad/blob/master/examples/firepad-userlist.js
// https://firebase.googleblog.com/2013/06/how-to-build-presence-system.html
// https://firebase.google.com/docs/database/admin/retrieve-data
import React from 'react';
import PropTypes from 'prop-types';

class UserList extends React.Component {
  static propTypes = {
    firepadRef: PropTypes.object,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    displayName: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      userList: {}
    };

    this.displayName = props.displayName || `Guest ${Math.floor(Math.random() * 1000)}`;
    this.userRef = props.firepadRef.getParent().child(`presence/${props.userId}`);
    this.colorRef = props.firepadRef.child(`users/${props.userId}/color`);
  }

  componentWillMount() {
    this.colorRef.on('value', (snapshot) => {
      if (snapshot.val() && this.displayName) {
        const nameRef = this.userRef.child('name');
        const colorRef = this.userRef.child('color');

        nameRef.set(this.displayName);
        colorRef.set(snapshot.val());
        this.userRef.onDisconnect().remove();
      }
    });

    this.userRef.getParent().on('value', (snapshot) => {
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
    this.userRef.getParent().off('value');
    this.userRef.remove();
    this.colorRef.off('value');
  }

  render() {
    const {
      ...props
    } = this.props;
    delete props.firepadRef;
    delete props.userId;
    delete props.displayName;

    const totalUsers = Object.keys(this.state.userList).length;
    let caption = 'user';
    if (Number(totalUsers) > 1) {
      caption = 'users';
    }

    return (
      <div {...props}>{`${totalUsers} ${caption} online`}</div>
    );
  }
}

export default UserList;
