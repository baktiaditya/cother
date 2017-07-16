import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { slugify } from '../../shared/utils';
import scss from './Base.string.scss';

class Base extends Component {
  static displayName = 'Base';

  static propTypes = {
    children: PropTypes.node
  }

  _style;

  componentWillMount() {
    // Create custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(Base.displayName);
    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = scss;
    } else {
      this._style.appendChild(document.createTextNode(scss));
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
