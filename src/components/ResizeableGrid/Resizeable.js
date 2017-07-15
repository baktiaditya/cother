import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import scss from './ResizeableGrid.mod.scss';

class Resizeable extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fullScreen: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.object,
    type: PropTypes.oneOf(['row', 'column'])
  }

  static defaultProps = {
    type: 'row'
  }

  constructor(props) {
    super(props);

    if (props.type === 'column' && props.fullScreen === true) {
      window.addEventListener('resize', () => { this.updateComponentMaxHeight(); });
    }
  }

  updateComponentMaxHeight() {
    const h = window.innerHeight;
    const w = window.innerWidth;
    const top = ReactDOM.findDOMNode(this._ref).getBoundingClientRect().top;
    const left = ReactDOM.findDOMNode(this._ref).getBoundingClientRect().left;
    ReactDOM.findDOMNode(this._ref).style.maxWidth = w - left;
    ReactDOM.findDOMNode(this._ref).style.minWidth = w - left;
    ReactDOM.findDOMNode(this._ref).style.maxHeight = h - top;
    ReactDOM.findDOMNode(this._ref).style.minHeight = h - top;
  }

  renderChildren(children, type) {
    return React.Children.map(children, (child) => React.cloneElement(child, {
      type
    }));
  }

  render() {
    const {
      children,
      className,
      style,
      type,
      ...props
    } = this.props;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'resizeable',
      `resizeable-type-${type}`
    );

    const combinedStyle = {
      minHeight: this.props.height || '100%',
      maxHeight: this.props.height || '100%',
      ...style
    };

    return (
      <div
        {...props}
        ref={c => (this._ref = c)}
        className={classes}
        style={combinedStyle}
        data-style='display: flex;'
      >
        {this.renderChildren(children, type)}
      </div>
    );
  }
}

export default Resizeable;
