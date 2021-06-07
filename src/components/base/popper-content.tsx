/* eslint-disable no-console */
// https://dev.to/tannerhallman/using-usepopper-to-create-a-practical-dropdown-5bf8
import React from 'react';
import ReactDOM from 'react-dom';
import { Placement } from '@popperjs/core';
import { Popper as ReactPopper } from 'react-popper';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { CSSTransition } from 'react-transition-group';
import merge from 'lodash/merge';
import { useTheme } from '@emotion/react';
import { isBrowser, useDidMount, useDidUpdate, usePrevious } from 'src/utils';

export type PopperContentProps = React.HTMLAttributes<HTMLDivElement> & {
  arrow?: boolean;
  arrowClassName?: string;
  className?: string;
  fallbackPlacements?: Array<Placement>;
  inline?: boolean;
  log?: boolean;
  open?: boolean;
  placement?: Placement;
  target: HTMLElement | SVGElement;
  transition?: CSSTransitionProps;
};

type State = {
  open: boolean;
};

const PopperContent = React.forwardRef<HTMLElement, PopperContentProps>((props, ref) => {
  const {
    arrow = true,
    arrowClassName,
    children,
    className,
    fallbackPlacements = [
      'top',
      'top-start',
      'top-end',
      'right',
      'right-start',
      'right-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
    ],
    inline = false,
    log = false,
    open = false,
    placement = 'auto',
    target,
    transition: _transition,
    ...rest
  } = props;
  const [state, setState] = React.useState<State>({ open: false });
  const theme = useTheme();
  const prevProps = usePrevious<PopperContentProps>(props);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const transitionDefault: CSSTransitionProps = {
    appear: true,
    enter: true,
    exit: true,
    timeout: theme.animation.timing.normal,
    classNames: {
      appear: 'appear',
      appearActive: 'appear-active',
      appearDone: 'appear-done',
      enter: 'enter',
      enterActive: 'enter-active',
      enterDone: 'enter-done',
      exit: 'exit',
      exitActive: 'exit-active',
      exitDone: 'exit-done',
    },
  };
  const transition = merge(transitionDefault, _transition);

  useDidMount(() => {
    if (open) {
      setState({ open: true });
    }
    const element = elementRef.current;
    if (element && element.childNodes && element.childNodes[0]) {
      const childNodes = element.childNodes[0] as HTMLElement | null;
      if (childNodes && 'focus' in childNodes) {
        childNodes.focus();
      }
    }
  });

  useDidUpdate(() => {
    if (prevProps && !prevProps.open && open) {
      setState({ open: true });
    }
  }, [open]);

  const handleTransitionExited = (node: HTMLElement) => {
    setState({ open: false });
    transition.onExited && transition.onExited(node);
  };

  const renderChildren = () => {
    return (
      <CSSTransition {...transition} onExited={handleTransitionExited} in={open}>
        <ReactPopper
          innerRef={ref}
          referenceElement={target}
          placement={placement}
          modifiers={[
            {
              name: 'offset',
              phase: 'main',
              options: {
                offset: [0, 0],
              },
            },
            {
              name: 'flip',
              phase: 'main',
              options: {
                fallbackPlacements,
              },
            },
            {
              name: 'computeStyles',
              phase: 'beforeWrite',
              options: {
                gpuAcceleration: false,
                adaptive: false,
              },
            },
            {
              name: 'topLogger',
              enabled: log,
              phase: 'main',
              fn({ state: _state }) {
                console.log('popper state:', _state);
              },
            },
            {
              name: 'applyArrowEdge',
              enabled: true,
              phase: 'write',
              fn({ state: _state }) {
                const { arrow: _arrow } = _state.elements;

                if (_arrow) {
                  if (_state.modifiersData.arrow && _state.modifiersData.arrow.centerOffset !== 0) {
                    _arrow.setAttribute('data-edge', '');
                  } else {
                    _arrow.removeAttribute('data-edge');
                  }
                }
              },
            },
          ]}
        >
          {({ ref: popperRef, style, placement: _placement, arrowProps }) => {
            return (
              <div
                {...rest}
                ref={popperRef}
                className={className}
                style={style}
                data-placement={_placement}
              >
                {children}
                {arrow && (
                  <div ref={arrowProps.ref} className={arrowClassName} style={arrowProps.style} />
                )}
              </div>
            );
          }}
        </ReactPopper>
      </CSSTransition>
    );
  };

  if (isBrowser && state.open) {
    if (inline) {
      return renderChildren();
    } else {
      return ReactDOM.createPortal(<div ref={elementRef}>{renderChildren()}</div>, document.body);
    }
  }

  return null;
});

export default PopperContent;
