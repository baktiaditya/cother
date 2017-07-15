import React from 'react';
import PropTypes from 'prop-types';
import scss from './Button.mod.scss';

class Button extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {};

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

export default Button;
