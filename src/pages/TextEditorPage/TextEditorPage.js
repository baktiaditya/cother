/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { slugify } from '../../shared/utils';

// Components
import HeaderEditor from '../../components/HeaderEditor/HeaderEditor';
import { Row, Cell, Splitter } from '../../components/ResizeableGrid/ResizeableGrid';
import Iframe from '../../components/Iframe/Iframe';

// Styles
import scss from './TextEditorPage.mod.scss';
import scssString from './TextEditorPage.string.scss';

class TextEditorPage extends Component {
  static displayName = 'TextEditorPage';

  static propTypes = {
    // from react-router
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._id = props.params.id;
    this._dbPrefix = `documents-no-owner/${this._id}`;
    this._userId = Math.floor(Math.random() * 9999999999).toString();
    this._userDbRef = firebaseDb.ref(`${this._dbPrefix}/presence/${this._userId}`);
    this._userDisplayName = `Guest ${Math.floor(Math.random() * 1000)}`;

    // Register editor here
    // then everything will follow
    this._ace = {
      html: {
        show: true,
        defaultContent: require('./templates/defaultHtml.html'),
      },
      css: {
        show: true,
        defaultContent: require('./templates/defaultCss.string.css'),
      },
      javascript: {
        show: false,
        defaultContent: '// JS\n\nconsole.log(jQuery.fn.jquery);',
      },
    };

    this._firepad = {};
    this._firepadDbRef = {};
    this._cellRef = {};
    this._splitterData = null;
    this._style = null;

    this.state = {
      editor: {},
      editorReady: [],
      user: {},
      userList: [],
      showIframeMask: false,
    };

    // Set editor state
    Object.keys(this._ace).forEach(mode => {
      this.state.editor[mode] = {
        show: this._ace[mode].show,
        content: '',
      };
    });
    this.state.editor.output = { show: true };

    // Firepad
    Object.keys(this._ace).forEach(editor => {
      this._firepad[editor] = null;
    });
  }

  componentWillMount() {
    // Database
    Object.keys(this._ace).forEach(editor => {
      this._firepadDbRef[editor] = firebaseDb.ref(`${this._dbPrefix}/${editor}`);
    });
    this._userDbRef.onDisconnect().remove();
    this._userDbRef.getParent().on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          userList: snapshot.val(),
        });
      }
    });

    // Page title
    const titleTag = document.getElementsByTagName('title')[0];
    titleTag.innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this._id}`;

    // Create custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');
    this._style.id = slugify(TextEditorPage.displayName);
    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = scssString;
    } else {
      this._style.appendChild(document.createTextNode(scssString));
    }

    head.appendChild(this._style);
  }

  componentDidMount() {
    Object.keys(this._ace).forEach((mode) => {
      const editor = window.ace.edit(ReactDOM.findDOMNode(this._ace[mode].ref));
      editor.session.setMode(`ace/mode/${mode}`);
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
        if (this.state.editor[mode].content !== editor.getValue()) {
          this.setState({
            editor: {
              ...this.state.editor,
              [mode]: {
                ...this.state.editor[mode],
                content: editor.getValue(),
              },
            },
          });
        }
      });

      this._ace[mode].instance = editor;
      this._firepad[mode] = window.Firepad.fromACE(this._firepadDbRef[mode], editor, {
        userId: this._userId,
        defaultText: this._ace[mode].defaultContent,
      });
      this._firepad[mode].on('ready', () => this.setState({
        // set user
        user: {
          id: this._userId,
          color: this._firepad[mode].firebaseAdapter_.color_,
          displayName: this._userDisplayName,
        },
        editorReady: [...this.state.editorReady, mode],
      }));
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state.user) !== JSON.stringify(nextState.user)) {
      this._userDbRef.set({
        displayName: nextState.user.displayName,
        color: nextState.user.color,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset cell width
    const prevEditor = Object.keys(prevState.editor)
      .map(e => ({ ...prevState.editor[e], mode: e }))
      .filter((e) => e.show === true)
      .map(e => e.mode);

    const currEditor = Object.keys(this.state.editor)
      .map(e => ({ ...this.state.editor[e], mode: e }))
      .filter((e) => e.show === true)
      .map(e => e.mode);

    if (JSON.stringify(prevEditor) !== JSON.stringify(currEditor)) {
      if (!this._splitterData) {
        return false;
      }
      Object.keys(this._splitterData).forEach((el) => {
        const dom = this._splitterData[el];
        if (dom.style.removeProperty) {
          dom.style.removeProperty('flex');
          dom.style.removeProperty('max-width');
        } else {
          dom.style.removeAttribute('flex');
          dom.style.removeAttribute('max-width');
        }
      });
      this._splitterData = null;

      this.resizeAllEditor();
    }
  }

  componentWillUnmount() {
    // Destroy Ace editor
    Object.keys(this._ace).forEach(key => {
      if (this._ace[key].instance && isFunction(this._ace[key].instance.destroy)) {
        this._ace[key].instance.destroy();
      }
    });

    // Destroy firepad
    Object.keys(this._firepad).forEach(key => {
      if (this._firepad[key] && isFunction(this._firepad[key].dispose)) {
        this._firepad[key].dispose();
      }
    });

    // Remove and unlisten user db
    this._userDbRef.getParent().off('value');
    this._userDbRef.remove();

    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  onBtnEditorClick = (mode) => {
    this.setState({
      editor: {
        ...this.state.editor,
        [mode]: {
          ...this.state.editor[mode],
          show: !this.state.editor[mode].show,
        },
      },
    }, () => {
      this.resizeAllEditor();
    });
  };

  resizeAllEditor() {
    console.log('resizeAllEditor');
    Object.keys(this._ace).forEach(a => {
      this._ace[a].instance && this._ace[a].instance.resize();
    });
  }

  renderEditor(mode) {
    const ace = this._ace[mode];
    const isHide = !this.state.editor[mode].show;
    const style = { display: isHide ? 'none' : undefined };
    const currEditor = Object.keys(this.state.editor)
      .map(e => ({ ...this.state.editor[e], mode: e }))
      .filter((e) => e.show === true)
      .map(e => e.mode);

    const cell = (
      <Cell
        key={`${mode}-cell`}
        ref={c => (this._cellRef[mode] = c)}
        onDimensionChange={() => ace.instance && ace.instance.resize()}
        style={style}
      >
        <div id={mode} ref={c => (ace.ref = c)} className={scss['editor-container']} />
      </Cell>
    );

    if (currEditor.length === 1) {
      return ([cell]);
    }

    return ([
      cell,
      <Splitter
        key={`${mode}-splitter`}
        onDragStart={(data) => {
          this._splitterData = data;
          this.setState({ showIframeMask: true });
        }}
        onDragMove={() => this.resizeAllEditor()}
        onDragStop={() => this.setState({ showIframeMask: false })}
        style={style}
      />,
    ]);
  }

  render() {
    const {
      editor,
      editorReady,
      userList,
    } = this.state;

    const headerProps = {
      editor,
      onBtnEditorClick: this.onBtnEditorClick,
      totalUsers: !isEmpty(userList) ? Object.keys(userList).length : 0,
    };
    const headerPropsEditorArr = Object.keys(headerProps.editor).filter((e) => e !== 'output');
    headerProps.isLoading = JSON.stringify(editorReady) !== JSON.stringify(headerPropsEditorArr);

    // all text editor hidden + iframe
    let allEditorHidden = false;
    if (!editor.css.show && !editor.html.show && !editor.javascript.show && !editor.output.show) {
      allEditorHidden = true;
    }

    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <div className={scss['container']}>
        <HeaderEditor {...headerProps} />

        <div
          className={scss['artwork']}
          style={{ display: !allEditorHidden ? 'none' : undefined }}
        >
          <img src={logoImg} alt='logo' />
          <span>No active tab</span>
        </div>
        <Row style={{ display: allEditorHidden ? 'none' : undefined }}>
          {/* Editor */}
          {Object.keys(this._ace).map((mode) => this.renderEditor(mode))}

          {/* iFrame */}
          <Cell
            ref={c => (this._cellRef.output = c)}
            style={{ display: !editor.output.show ? 'none' : undefined }}
          >
            {/* Use mask to prevent Splitter drag error */}
            {this.state.showIframeMask && <div className={scss['iframe-mask']} />}
            <Iframe
              html={editor.html.content}
              css={editor.css.content}
              javascript={editor.javascript.content}
              frameBorder={0}
              scrolling='yes'
              allowFullScreen
            />
          </Cell>
        </Row>
      </div>
    );
  }
}

export default TextEditorPage;
