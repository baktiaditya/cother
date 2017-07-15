import React from 'react';
import PropTypes from 'prop-types';

class Base extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  _style;

  componentWillMount() {
    // Create custom <style /> in <head />
    const css = require('./Base.css.txt');
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');

    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = css;
    } else {
      this._style.appendChild(document.createTextNode(css));
    }

    head.appendChild(this._style);
  }

  componentWillUnmount() {
    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  render() {
    const {
      children,
      ...props
    } = this.props;

    return (
      <div id='base' {...props}>{children}</div>
    );
  }
}

export default Base;
