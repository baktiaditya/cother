/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import { PROJECT_NAME, GITHUB_BTN_URL } from 'src/contants';
import Button from 'src/components/base/button';
import ButtonGroup from 'src/components/base/button-group';
import Icon from 'src/components/base/icon';
import Spinner from 'src/components/base/spinner';
import Tooltip from 'src/components/base/tooltip';
import { keys, isBrowser } from 'src/utils';
import createStyles from './styles';
import logo from 'src/img/logo.svg';

// Redux
import { ReduxState, Pane } from 'cother';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { addActivePane, removeActivePane } from 'src/actions/action_app';

type HeaderProps = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<ReduxState, void, Action>;
};

const mapStateToProps = (state: ReduxState) => ({
  activePane: state.app.activePane,
  loading: state.app.loading,
  totalUser: state.app.totalUser,
});

const Header: React.VFC<HeaderProps> = props => {
  const { activePane, dispatch, loading, totalUser } = props;
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const buttons: { [key in Pane]: string } = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JS',
    result: 'Result',
  };
  const tooltipRef = React.useRef<Tooltip>(null);
  let currentUrl = '';
  if (isBrowser) {
    currentUrl = window.location.href;
  }

  React.useEffect(() => {
    // detect click on Result iframe, then close Tooltip
    const resultIframe = document.getElementById('result');
    if (resultIframe && resultIframe instanceof HTMLIFrameElement) {
      resultIframe.contentDocument &&
        resultIframe.contentDocument.body.addEventListener(
          'mouseup',
          handleResultIframeClick,
          true,
        );
    }

    return () => {
      if (resultIframe && resultIframe instanceof HTMLIFrameElement) {
        resultIframe.contentDocument &&
          resultIframe.contentDocument.body.removeEventListener(
            'mouseup',
            handleResultIframeClick,
            true,
          );
      }
    };
  }, []);

  const handleResultIframeClick = () => {
    if (tooltipRef.current) {
      tooltipRef.current.hide();
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/');
  };

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }
    e.preventDefault();
    if (e.target.dataset.value) {
      const value = e.target.dataset.value as Pane;
      // check if already exist in redux state
      if (activePane.includes(value)) {
        dispatch(removeActivePane(value));
      } else {
        dispatch(addActivePane(value));
      }
    }
  };

  const handleCopyLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    copy(currentUrl);
    if (tooltipRef.current) {
      tooltipRef.current.hide();
    }
  };

  return (
    <div css={styles.wrapper}>
      <div css={styles.col1}>
        <a href="/" onClick={handleBrandClick} css={styles.brand}>
          <img src={logo} alt={PROJECT_NAME} />
          <h1>{PROJECT_NAME}</h1>
        </a>
      </div>

      <div css={styles.col2}>
        <ButtonGroup>
          {keys(buttons).map(pane => {
            const isActive = activePane.includes(pane);
            return (
              <Button key={pane} onClick={handleBtnClick} data-value={pane} active={isActive}>
                {buttons[pane]}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>

      <div css={styles.col3}>
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <div id="share" css={styles.share}>
              Share
              <Icon name="share" />
            </div>
            <Tooltip
              ref={tooltipRef}
              target="#share"
              trigger="click"
              placement="bottom"
              styles={{ base: styles.tooltip, inner: styles.tooltipInner }}
            >
              <div css={styles.tooltipContent}>
                <div css={styles.tooltipUrl}>{currentUrl}</div>
                <a href="#" css={styles.tooltipBtn} onClick={handleCopyLink}>
                  Copy link
                </a>
              </div>
            </Tooltip>

            <div css={styles.userListIndicator}>
              {totalUser}
              <Icon name="eye" />
            </div>

            <iframe src={GITHUB_BTN_URL} frameBorder={0} scrolling="no" width={54} height={20} />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(Header);
