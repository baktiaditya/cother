/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, withTheme } from '@emotion/react';
import Head from 'next/head';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import ErrorPage from './_error';
import { PROJECT_NAME } from 'src/contants';
import { isNumeric, keys } from 'src/utils';
import { ThemeLib } from 'src/styles/theme';
import createStyles from 'src/styles/pages/code-editor';

// Components
import Header from 'src/components/contextual/header';
import Resizeable from 'src/components/base/resizeable-grid/resizeable';
import Cell from 'src/components/base/resizeable-grid/cell';
import Splitter, { SplitterDragStartData } from 'src/components/base/resizeable-grid/splitter';
import Iframe from 'src/components/base/iframe';

// Templates
import defaultHtml from 'src/templates/html.txt';
import defaultCss from 'src/templates/css.txt';

// Firebase
import { firebaseDb } from 'src/firebase';

// Redux
import { ReduxState, Pane } from 'cother';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { setLoading, setTotalUser, reset } from 'src/actions/action_app';

type CodeEditorProps = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<ReduxState, void, Action>;
  theme: ThemeLib;
};

type PaneEditor = Exclude<Pane, 'result'>;

type State = {
  err: boolean;
  editor: {
    [key in PaneEditor]: {
      label: string;
      ready: boolean;
      content: string;
    };
  };
  id?: string;
  showIframeMask: boolean;
  currentUser: {
    id?: string;
    color?: string;
    displayName?: string;
  };
  userList?: any;
};

const mapStateToProps = (state: ReduxState) => ({
  activePane: state.app.activePane,
});

class CodeEditor extends React.Component<CodeEditorProps, State> {
  dbPrefix?: string;
  userId?: string;
  userDbRef?: any;
  userDisplayName?: string;
  paneEditor: Array<Exclude<Pane, 'editor'>>;
  ace: {
    [key in PaneEditor]: {
      instance: any;
      ref: HTMLDivElement | null;
      defaultContent?: string;
    };
  };
  firepad: {
    [key in PaneEditor]: {
      instance: any;
      dbRef: any;
    };
  };
  splitterData: SplitterDragStartData | null;
  styles: ReturnType<typeof createStyles>;

  constructor(props: CodeEditorProps) {
    super(props);

    this.styles = createStyles(props.theme);
    this.paneEditor = ['html', 'css', 'javascript'];
    this.splitterData = null;
    this.firepad = {
      html: {
        instance: null,
        dbRef: null,
      },
      css: {
        instance: null,
        dbRef: null,
      },
      javascript: {
        instance: null,
        dbRef: null,
      },
    };
    this.ace = {
      html: {
        instance: null,
        ref: null,
        defaultContent: defaultHtml,
      },
      css: {
        instance: null,
        ref: null,
        defaultContent: defaultCss,
      },
      javascript: {
        instance: null,
        ref: null,
        defaultContent: [
          '$(function() {',
          '  // Code here',
          '  console.log($.fn.jquery);',
          '});',
        ].join('\n'),
      },
    };

    this.state = {
      currentUser: {},
      editor: {
        html: {
          label: 'HTML',
          ready: false,
          content: '',
        },
        css: {
          label: 'CSS',
          ready: false,
          content: '',
        },
        javascript: {
          label: 'JS',
          ready: false,
          content: '',
        },
      },
      err: false,
      id: undefined,
      showIframeMask: false,
      userList: undefined,
    };
  }

  componentDidMount() {
    const id = this.getQueryStringValue('session');
    if (isNumeric(id) && id.length === 13) {
      this.dbPrefix = `documents-no-owner/${id}`;
      this.userId = Math.floor(Math.random() * 9999999999).toString();
      this.userDbRef = firebaseDb.ref(`${this.dbPrefix}/presence/${this.userId}`);
      this.userDisplayName = `Guest ${Math.floor(Math.random() * 1000)}`;

      // Database
      keys(this.state.editor).forEach(editor => {
        this.firepad[editor].dbRef = firebaseDb.ref(`${this.dbPrefix}/${editor}`);
      });
      this.userDbRef.onDisconnect().remove();
      this.userDbRef.getParent().on('value', (snapshot: any) => {
        if (snapshot.val()) {
          const userList = snapshot.val();
          this.props.dispatch(setTotalUser(Object.keys(userList).length));
          this.setState({
            userList,
          });
        }
      });

      // Editor
      keys(this.ace).forEach(pane => {
        const editor = (window as any).ace.edit(this.ace[pane].ref);
        editor.session.setMode(`ace/mode/${pane}`);
        editor.session.setTabSize(2);
        editor.session.setUseWrapMode(true);
        editor.renderer.setScrollMargin(10, 10);
        editor.renderer.setPadding(10);
        editor.$blockScrolling = Infinity;
        // https://github.com/ajaxorg/ace/blob/v1.2.3/lib/ace/virtual_renderer.js#L1611-L1750
        // https://github.com/ajaxorg/ace/blob/master/demo/autocompletion.html
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableEmmet: true,
          enableSnippets: true,
          enableLiveAutocompletion: false,
          showGutter: false,
          showPrintMargin: false,
          vScrollBarAlwaysVisible: false,
          theme: 'ace/theme/tomorrow_night',
        });
        editor.on('change', () => {
          if (this.state.editor[pane].content !== editor.getValue()) {
            this.setState({
              editor: {
                ...this.state.editor,
                [pane]: {
                  ...this.state.editor[pane],
                  content: editor.getValue(),
                },
              },
            });
          }
        });

        this.ace[pane].instance = editor;
        this.firepad[pane].instance = (window as any).Firepad.fromACE(
          this.firepad[pane].dbRef,
          editor,
          {
            userId: this.userId,
            defaultText: this.ace[pane].defaultContent,
          },
        );
        this.firepad[pane].instance.on('ready', () => {
          this.setState({
            currentUser: {
              id: this.userId,
              color: this.firepad[pane].instance.firebaseAdapter_.color_,
              displayName: this.userDisplayName,
            },
            editor: {
              ...this.state.editor,
              [pane]: {
                ...this.state.editor[pane],
                ready: true,
              },
            },
          });
        });
      });

      this.setState({
        id,
      });
    } else {
      this.setState({
        err: true,
      });
    }
  }

  componentDidUpdate(prevProps: CodeEditorProps, prevState: State) {
    // Update loading state
    if (!isEqual(prevState.editor, this.state.editor)) {
      const prevReady: Array<boolean> = keys(prevState.editor).map(pane => {
        return prevState.editor[pane].ready;
      });
      const ready: Array<boolean> = keys(this.state.editor).map(pane => {
        return this.state.editor[pane].ready;
      });
      if (!isEqual(prevReady, ready) && !ready.includes(false)) {
        this.props.dispatch(setLoading(false));
      }
    }

    // Update user db
    if (!isEqual(prevState.currentUser, this.state.currentUser)) {
      this.userDbRef.set({
        displayName: this.state.currentUser.displayName,
        color: this.state.currentUser.color,
      });
    }

    // Reset cell width
    if (!isEqual(prevProps.activePane, this.props.activePane)) {
      if (!this.splitterData) {
        return false;
      }
      keys(this.splitterData).forEach(el => {
        if (this.splitterData) {
          const dom = this.splitterData[el];
          if (dom) {
            dom.style.removeProperty('flex');
            dom.style.removeProperty('max-width');
          }
        }
      });
      this.splitterData = null;
      this.resizeAllEditor();
    }
  }

  componentWillUnmount() {
    // Reset redux state
    this.props.dispatch(reset());

    // Destroy Ace editor
    keys(this.ace).forEach(key => {
      const ace = this.ace[key];
      if (ace.instance && isFunction(ace.instance.destroy)) {
        ace.instance.destroy();
      }
    });

    // Destroy firepad
    keys(this.firepad).forEach(key => {
      if (this.firepad[key].instance && isFunction(this.firepad[key].instance.dispose)) {
        this.firepad[key].instance.dispose();
      }
    });

    // Remove and unlisten user db
    this.userDbRef.getParent().off('value');
    this.userDbRef.remove();
  }

  /**
   * @see https://stackoverflow.com/a/9870540
   */
  getQueryStringValue(key: string) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          '^(?:.*[&\\?]' +
            encodeURIComponent(key).replace(/[.+*]/g, '\\$&') +
            '(?:\\=([^&]*))?)?.*$',
          'i',
        ),
        '$1',
      ),
    );
  }

  resizeAllEditor = () => {
    keys(this.ace).forEach(pane => {
      const { instance } = this.ace[pane];
      instance && instance.resize();
    });
  };

  handleSplitterDragStart = (data: SplitterDragStartData) => {
    this.splitterData = data;
    this.setState({ showIframeMask: true });
  };

  handleSplitterDragStop = () => {
    this.setState({ showIframeMask: false });
  };

  renderEditor(pane: PaneEditor) {
    const ace = this.ace[pane];
    const isHide = !this.props.activePane.includes(pane);
    const style = { display: isHide ? 'none' : undefined };

    const visiblePane: Array<Pane> = [];
    // create sequence based on this.state.editor
    keys(this.state.editor).forEach(key => {
      if (this.props.activePane.includes(key)) {
        visiblePane.push(key);
      }
    });
    const lastActivePane = visiblePane.slice(-1)[0];
    const showSplitter = !(lastActivePane === pane && !this.props.activePane.includes('result'));

    return (
      <Fragment key={pane}>
        <Cell
          onDimensionChange={() => {
            ace.instance && ace.instance.resize();
          }}
          style={style}
        >
          <div css={this.styles.editorLabel}>{this.state.editor[pane].label}</div>
          <div id={pane} ref={c => (ace.ref = c)} css={this.styles.editorContainer} />
        </Cell>
        {showSplitter && (
          <Splitter
            className={!isHide ? 'show' : undefined}
            onDragStart={this.handleSplitterDragStart}
            onDragMove={this.resizeAllEditor}
            onDragStop={this.handleSplitterDragStop}
            style={style}
          />
        )}
      </Fragment>
    );
  }

  render() {
    const { activePane } = this.props;
    const { err, editor } = this.state;

    if (err) {
      return <ErrorPage statusCode={404} />;
    }

    return (
      <div css={this.styles.wrapper}>
        <Head>
          <title>{PROJECT_NAME} &bull; Code Editor</title>
        </Head>

        <Header />

        <div css={this.styles.content}>
          <Resizeable>
            {/* Editor */}
            {keys(editor).map(pane => this.renderEditor(pane))}

            {/* Output */}
            <Cell style={{ display: !activePane.includes('result') ? 'none' : undefined }}>
              {/* Use mask to prevent Splitter drag error */}
              {this.state.showIframeMask && <div css={this.styles.iframeMask} />}
              <Iframe
                value={{
                  css: editor.css.content,
                  html: editor.html.content,
                  javascript: editor.javascript.content,
                }}
                id="result"
                frameBorder={0}
                scrolling="yes"
                allowFullScreen
              />
            </Cell>
          </Resizeable>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withTheme(CodeEditor));
