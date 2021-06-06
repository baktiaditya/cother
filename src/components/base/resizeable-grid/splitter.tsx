/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, withTheme } from '@emotion/react';
import omit from 'lodash/omit';
import Cell, { CellProps, CellRef } from './cell';
import { ThemeLib } from 'src/styles/theme';
import createStyles from './styles';

export type SplitterDragStartData = { resizeableElement?: HTMLElement; otherElement?: HTMLElement };

type SplitterProps = Omit<CellProps, 'height' | 'onDimensionChange' | 'onDragStart' | 'width'> & {
  onDragStart: (data: SplitterDragStartData, e: React.MouseEvent<HTMLDivElement>) => void;
  onDragMove: (e: MouseEvent) => void;
  onDragStop: (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => void;
  theme: ThemeLib;
};

type State = {
  dragging: boolean;
  resizeableElement?: HTMLElement;
  otherElement?: HTMLElement;
};

class Splitter extends React.Component<SplitterProps> {
  static defaultProps: Pick<SplitterProps, 'type'> = {
    type: 'row',
  };

  state: State = {
    dragging: false,
    resizeableElement: undefined,
    otherElement: undefined,
  };

  ref = React.createRef<CellRef>();

  componentDidUpdate(prevProps: SplitterProps, prevState: State) {
    if (this.state.dragging && !prevState.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = this.ref.current;
    if (!node) {
      return;
    }
    const parent = node.parentNode!.childNodes;
    const filteredParent = [];
    for (let i = 0; i < parent.length; i++) {
      const target = parent[i] as Element;
      const style = getComputedStyle(target);
      // exclude hidden elem
      if (style && style.display !== 'none') {
        filteredParent.push(parent[i]);
      }
    }

    let resizeableElement: HTMLElement | undefined = undefined;
    let otherElement: HTMLElement | undefined = undefined;
    for (let i = 0; i < filteredParent.length; i++) {
      if (filteredParent[i] === node) {
        resizeableElement = filteredParent[i - 1] as HTMLElement;
        otherElement = filteredParent[i + 1] as HTMLElement;
        break;
      }
    }

    if (this.props.type === 'row') {
      if (resizeableElement && otherElement) {
        resizeableElement.dataset.cellMaxWidth = `${
          resizeableElement.clientWidth + otherElement.clientWidth
        }px`;
      }
    } else {
      if (resizeableElement && otherElement) {
        resizeableElement.dataset.cellMaxHeight = `${
          resizeableElement.clientHeight + otherElement.clientHeight
        }px`;
      }
    }

    this.props.onDragStart && this.props.onDragStart({ resizeableElement, otherElement }, e);

    this.setState({
      dragging: true,
      resizeableElement,
      otherElement,
    });
  };

  onMouseUp = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    this.setState(
      {
        dragging: false,
      },
      () => {
        this.props.onDragStop && this.props.onDragStop(e);
        const { type } = this.props;
        const { resizeableElement } = this.state;

        if (type === 'row') {
          // this.state.resizeableElement.dataset.cellMaxWidth = '';
          resizeableElement && resizeableElement.removeAttribute('data-cell-max-width');
        } else {
          // this.state.resizeableElement.dataset.cellMaxHeight = '';
          resizeableElement && resizeableElement.removeAttribute('data-cell-max-height');
        }
      },
    );
  };

  onMouseMove = (e: MouseEvent) => {
    this.props.onDragMove && this.props.onDragMove(e);

    const { resizeableElement, otherElement } = this.state;
    if (!resizeableElement || !otherElement) {
      return;
    }

    const offset = resizeableElement.getBoundingClientRect();
    const {
      dataset: { cellMaxWidth, cellMaxHeight },
    } = resizeableElement;
    const splitter = this.ref.current;

    if (!splitter) {
      return;
    }

    if (this.props.type === 'row') {
      const splitterWidth = splitter.clientWidth;
      const newResizeableElemWidth =
        e.clientX - offset.left - parseInt(String(splitterWidth), 10) / 2;

      if (!cellMaxWidth) {
        return;
      }

      const newOtherElemWidth = parseInt(cellMaxWidth, 10) - newResizeableElemWidth;
      if (newResizeableElemWidth >= 0 && newOtherElemWidth >= 0) {
        resizeableElement.style.flex = `0 0 ${newResizeableElemWidth}px`;
        resizeableElement.style.maxWidth = `${newResizeableElemWidth}px`;
        otherElement.style.flex = `0 0 ${newOtherElemWidth}px`;
        otherElement.style.maxWidth = `${newOtherElemWidth}px`;
      }
    } else {
      const splitterHeight = splitter.clientHeight;
      const newResizeableElemHeight =
        e.clientY - offset.top - parseInt(String(splitterHeight), 10) / 2;

      if (!cellMaxHeight) {
        return;
      }

      const newOtherElemHeight = parseInt(cellMaxHeight, 10) - newResizeableElemHeight;
      if (newResizeableElemHeight >= 0 && newOtherElemHeight >= 0) {
        resizeableElement.style.flex = `0 0 ${newResizeableElemHeight}px`;
        resizeableElement.style.maxHeight = `${newResizeableElemHeight}px`;
        otherElement.style.flex = `0 0 ${newOtherElemHeight}px`;
        otherElement.style.maxHeight = `${newOtherElemHeight}px`;
      }
    }
  };

  render() {
    const omittedProps: Array<
      keyof Pick<SplitterProps, 'onDragStart' | 'onDragMove' | 'onDragStop'>
    > = ['onDragStart', 'onDragMove', 'onDragStop'];
    const { theme, type, ...rest } = omit(this.props, omittedProps);
    const { dragging } = this.state;
    const styles = createStyles(theme);

    return (
      <Cell
        {...rest}
        ref={this.ref}
        css={[
          styles.splitter,
          type === 'row' ? styles.splitterVertical : styles.splitterHorizontal,
          dragging && styles.splitterDragging,
        ]}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        type={type}
        width={type === 'row' ? 10 : undefined}
        height={type === 'column' ? 10 : undefined}
      />
    );
  }
}

export default withTheme(Splitter);
