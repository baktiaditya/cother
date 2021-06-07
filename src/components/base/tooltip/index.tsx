/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, ThemeContext, SerializedStyles } from '@emotion/react';
import isBoolean from 'lodash/isBoolean';
import omit from 'lodash/omit';
import { ThemeLib } from 'src/styles/theme';
import PopperContent, { PopperContentProps } from '../popper-content';
import { getTarget, TargetPropType } from 'src/utils';
import createStyles from './styles';

type TooltipProps = Pick<PopperContentProps, 'className' | 'open' | 'placement' | 'transition'> & {
  arrowClassName?: string;
  children: React.ReactNode;
  elevation: 'none' | keyof ThemeLib['elevation'];
  styles?: {
    base?: SerializedStyles;
    inner?: SerializedStyles;
  };
  target: TargetPropType;
  /** @default "hover" */
  trigger: 'click' | 'hover' | 'focus' | 'manual';
};

type State = {
  open: boolean;
};

class Tooltip extends React.Component<TooltipProps, State> {
  static defaultProps: Pick<TooltipProps, 'arrowClassName' | 'elevation' | 'trigger'> = {
    arrowClassName: 'tooltip-arrow',
    elevation: 'raised',
    trigger: 'hover',
  };

  static contextType = ThemeContext;
  context!: ThemeLib;

  delay: number;
  mounted: boolean;
  initialOpen?: boolean;
  showTimeout?: NodeJS.Timeout;
  hideTimeout?: NodeJS.Timeout;
  popperContentRef: React.RefObject<HTMLElement>;
  targetElement?: HTMLElement | SVGElement;

  constructor(props: TooltipProps) {
    super(props);

    this.delay = 0;
    this.mounted = false;
    this.initialOpen = props.open;
    this.popperContentRef = React.createRef();
    this.state = {
      open: props.trigger === 'manual' && isBoolean(props.open) ? props.open : false,
    };
  }

  componentDidMount() {
    this.mounted = true;

    const target = getTarget(this.props.target);
    if (target) {
      this.targetElement = target;
      this.addTargetEvents();
    }

    // listen to custom event triggered outside tooltip component
  }

  componentDidUpdate(prevProps: TooltipProps) {
    // props.trigger === 'manual'
    if (
      this.props.trigger === 'manual' &&
      isBoolean(this.props.open) &&
      prevProps.open !== this.props.open
    ) {
      this.setState({
        open: this.props.open,
      });
    }

    // If props.trigger change
    if (prevProps.trigger !== this.props.trigger) {
      this.removeTargetEvents();
      this.addTargetEvents();

      if (this.props.trigger === 'manual') {
        this.setState({
          open: isBoolean(this.props.open) ? this.props.open : this.state.open,
        });
      } else if (this.props.trigger === 'focus') {
        if (
          this.targetElement &&
          this.targetElement === document.activeElement &&
          !this.state.open
        ) {
          this.setState({
            open: true,
          });
        } else {
          if (this.state.open) {
            this.setState({
              open: false,
            });
          }
        }
      } else {
        if (this.state.open) {
          this.setState({
            open: false,
          });
        }
      }
    }

    // If placement change
    // Fix Popper wrong position
    if (prevProps.placement !== this.props.placement && this.state.open) {
      this.setState(
        {
          open: false,
        },
        () => {
          window.requestAnimationFrame(() => {
            this.setState({
              open: true,
            });
          });
        },
      );
    }
  }

  componentWillUnmount() {
    this.removeTargetEvents();
    this.mounted = false;
  }

  handleDocumentClick = (event: MouseEvent | TouchEvent) => {
    const { trigger } = this.props;
    const target = event.target as HTMLElement | null;
    const { current: popperContent } = this.popperContentRef;

    if (this.targetElement) {
      if (this.targetElement.contains(target)) {
        if (trigger === 'click') {
          this.toggle();
        }
      } else {
        if (
          (trigger === 'click' && popperContent && !popperContent.contains(target)) ||
          trigger === 'hover'
        ) {
          this.hide();
        }
      }
    }
  };

  addTargetEvents = () => {
    if (!this.targetElement) return;

    if (this.props.trigger === 'hover') {
      this.targetElement.addEventListener('mouseover', this.show, true);
      this.targetElement.addEventListener('mouseout', this.hide, true);
    } else if (this.props.trigger === 'focus') {
      this.targetElement.addEventListener('focus', this.show, true);
      this.targetElement.addEventListener('blur', this.hide, true);
    }

    ['click', 'touchstart'].forEach(e =>
      document.addEventListener(e as 'click' | 'touchstart', this.handleDocumentClick, true),
    );
  };

  removeTargetEvents = () => {
    ['mouseover', 'focus'].forEach(
      e => this.targetElement && this.targetElement.removeEventListener(e, this.show, true),
    );
    ['mouseout', 'blur'].forEach(
      e => this.targetElement && this.targetElement.removeEventListener(e, this.hide, true),
    );
    ['click', 'touchstart'].forEach(e =>
      document.removeEventListener(e as 'click' | 'touchstart', this.handleDocumentClick, true),
    );
  };

  show = () => {
    this.hideTimeout && clearTimeout(this.hideTimeout);
    this.showTimeout = setTimeout(this.onShow, this.delay);
  };

  onShow = () => {
    this.showTimeout && clearTimeout(this.showTimeout);
    this.setState({
      open: true,
    });
  };

  hide = () => {
    this.showTimeout && clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(this.onHide, this.delay);
  };

  onHide = () => {
    this.hideTimeout && clearTimeout(this.hideTimeout);
    // Prevent warning: Can't perform a React state update on an unmounted component.
    if (this.mounted) {
      this.setState({
        open: false,
      });
    }
  };

  toggle = () => {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  };

  handleMouseOverContent = () => {
    // Prevent hide when user hover on tooltip, only when this.props.trigger === 'hover'
    if (this.props.trigger !== 'hover') return;
    this.hideTimeout && clearTimeout(this.hideTimeout);
  };

  handleMouseLeaveContent = () => {
    if (this.props.trigger !== 'hover') return;
    this.showTimeout && clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(this.hide, this.delay);
  };

  render() {
    const omittedProps: Array<keyof Pick<TooltipProps, 'open' | 'target' | 'trigger'>> = [
      'open',
      'target',
      'trigger',
    ];
    const {
      arrowClassName,
      children,
      elevation,
      styles: _styles,
      ...rest
    } = omit(this.props, omittedProps);
    const nativeStyles = createStyles(this.context, elevation);
    const styles = {
      base: [nativeStyles.base, _styles && 'base' in _styles && _styles.base],
      inner: [nativeStyles.inner, _styles && 'inner' in _styles && _styles.inner],
    };

    if (this.targetElement) {
      return (
        <PopperContent
          {...rest}
          ref={this.popperContentRef}
          css={styles.base}
          target={this.targetElement}
          open={this.state.open}
          arrowClassName={arrowClassName}
          onMouseOver={this.handleMouseOverContent}
          onMouseOut={this.handleMouseLeaveContent}
        >
          <div css={styles.inner}>{children}</div>
        </PopperContent>
      );
    }

    return null;
  }
}

export default Tooltip;
