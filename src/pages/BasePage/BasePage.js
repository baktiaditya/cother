import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { slugify } from '../../shared/utils';
import scssString from './BasePage.string.scss';

class BasePage extends PureComponent {
  static displayName = 'BasePage';

  static propTypes = {
    children: PropTypes.node,
  };

  _style;

  componentDidMount() {
    // Create custom <style /> in <head />
    const id = slugify(BasePage.displayName);
    const elem = document.getElementById(id);
    if (elem) {
      elem.parentNode.removeChild(elem);
    }

    const css = scssString;
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(BasePage.displayName);

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
    return (
      <Fragment>{this.props.children}</Fragment>
    );
  }
}

export default BasePage;
