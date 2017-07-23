import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import scss from './ResizeableGrid.mod.scss';
import { Cell } from './Cell';

class Splitter extends Component {
  static propTypes = {
    className: PropTypes.string,
    onDragStart: PropTypes.func,
    onDragMove: PropTypes.func,
    onDragStop: PropTypes.func,
    type: PropTypes.oneOf(['row', 'column'])
  }

  _elemRef;

  state = {
    dragging: false,
    resizeableElement: null,
    otherElement: null
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (e) => {
    const node = ReactDOM.findDOMNode(this._elemRef);
    const parent = ReactDOM.findDOMNode(e.currentTarget).parentNode.childNodes;
    const filteredParent = [];
    for (let i = 0; i < parent.length; i++) {
      const style = getComputedStyle(parent[i]);
      // exclude hidden elem
      if (style && style.display !== 'none') {
        filteredParent.push(parent[i]);
      }
    }
    let resizeableElement;
    let otherElement;
    for (let i = 0; i < filteredParent.length; i++) {
      if (filteredParent[i] === node) {
        resizeableElement = filteredParent[i - 1];
        otherElement = filteredParent[i + 1];
        break;
      }
    }

    if (this.props.type === 'row') {
      resizeableElement.dataset.cellMaxWidth = `${resizeableElement.clientWidth + otherElement.clientWidth}px`;
    } else {
      resizeableElement.dataset.cellMaxHeight = `${resizeableElement.clientHeight + otherElement.clientHeight}px`;
    }

    this.props.onDragStart && this.props.onDragStart({ resizeableElement, otherElement }, e);

    this.setState({
      dragging: true,
      resizeableElement,
      otherElement
    });
  }

  onMouseUp = (e) => {
    this.setState({
      dragging: false
    }, () => {
      this.props.onDragStop && this.props.onDragStop(e);

      if (this.props.type === 'row') {
        // this.state.resizeableElement.dataset.cellMaxWidth = '';
        this.state.resizeableElement.removeAttribute('data-cell-max-width');
      } else {
        // this.state.resizeableElement.dataset.cellMaxHeight = '';
        this.state.resizeableElement.removeAttribute('data-cell-max-height');
      }
    });
  }

  onMouseMove = (e) => {
    this.props.onDragMove && this.props.onDragMove(e);

    const { resizeableElement, otherElement } = this.state;
    const offset = resizeableElement.getBoundingClientRect();

    if (this.props.type === 'row') {
      const { dataset: { cellMaxWidth } } = resizeableElement;
      const splitterWidth = ReactDOM.findDOMNode(this._elemRef).clientWidth;
      const newResizeableElemWidth = e.clientX - offset.left - (parseInt(splitterWidth, 10) / 2);
      const newOtherElemWidth = parseInt(cellMaxWidth, 10) - newResizeableElemWidth;

      if (newResizeableElemWidth >= 0 && newOtherElemWidth >= 0) {
        resizeableElement.style.flex = `0 0 ${newResizeableElemWidth}px`;
        resizeableElement.style.maxWidth = `${newResizeableElemWidth}px`;
        otherElement.style.flex = `0 0 ${newOtherElemWidth}px`;
        otherElement.style.maxWidth = `${newOtherElemWidth}px`;
      }
    } else {
      const { dataset: { cellMaxHeight } } = resizeableElement;
      const splitterHeight = ReactDOM.findDOMNode(this._elemRef).clientHeight;
      const newResizeableElemHeight = e.clientY - offset.top - (parseInt(splitterHeight, 10) / 2);
      const newOtherElemHeight = parseInt(cellMaxHeight, 10) - newResizeableElemHeight;

      if (newResizeableElemHeight >= 0 && newOtherElemHeight >= 0) {
        resizeableElement.style.flex = `0 0 ${newResizeableElemHeight}px`;
        resizeableElement.style.maxHeight = `${newResizeableElemHeight}px`;
        otherElement.style.flex = `0 0 ${newOtherElemHeight}px`;
        otherElement.style.maxHeight = `${newOtherElemHeight}px`;
      }
    }
  }

  render() {
    const {
      className,
      type,
      ...props
    } = this.props;
    delete props.onDragStart;
    delete props.onDragMove;
    delete props.onDragStop;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'splitter',
      `${type === 'row' ? 'splitter-vertical' : 'splitter-horizontal'}`,
      {
        'splitter-dragging': this.state.dragging
      }
    );

    const elemProps = {
      ...props,
      ref: c => (this._elemRef = c),
      className: classes,
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
      type
    };

    if (type === 'row') {
      elemProps.width = 10;
    } else {
      elemProps.height = 10;
    }

    return (
      <Cell {...elemProps} />
    );
  }
}

export { Splitter };
