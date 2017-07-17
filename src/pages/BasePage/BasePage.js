import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { slugify } from '../../shared/utils';
import scss from './BasePage.string.scss';

class BasePage extends Component {
  static displayName = 'BasePage';

  static propTypes = {
    children: PropTypes.node
  }

  _style;

  componentWillMount() {
    console.log(this.props);

    // Create custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(BasePage.displayName);
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
    return (
      <div>{this.props.children}</div>
    );
  }
}

export default BasePage;
