/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { slugify } from '../../shared/utils';
import scss from './TextEditorPage.mod.scss';
import scssString from './TextEditorPage.string.scss';

// Components
import HeaderEditor from '../../components/HeaderEditor/HeaderEditor';
import { Row, Cell, Splitter } from '../../components/ResizeableGrid/ResizeableGrid';
import Iframe from '../../components/Iframe/Iframe';

class TextEditorPage extends Component {
  static displayName = 'TextEditorPage';

  static propTypes = {
    // from react-router
    params: PropTypes.object
  }

  _id = this.props.params.id;
  _dbPrefix = `documents-no-owner/${this._id}`;
  _userId = Math.floor(Math.random() * 9999999999).toString();
  _userDbRef = firebaseDb.ref(`${this._dbPrefix}/presence/${this._userId}`);
  _displayName = `Guest ${Math.floor(Math.random() * 1000)}`;
  _editor = {
    html: null,
    css: null
  };
  _firepad = {};
  _firepadDbRef = {}
  _htmlDefaultText = require('./templates/defaultHtml.html');
  _cssDefaultText = require('./templates/defaultCss.string.css');
  _htmlRef;
  _cssRef;
  _style;

  state = {
    user: {},
    userList: {},
    editorReady: [],
    showEditor: ['html', 'css'],
    showIframeMask: false,
    html: '',
    css: ''
  }

  componentWillMount() {
    // Database
    Object.keys(this._editor).forEach(editor => {
      this._firepadDbRef[editor] = firebaseDb.ref(`${this._dbPrefix}/${editor}`);
    });
    this._userDbRef.onDisconnect().remove();
    this._userDbRef.getParent().on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          userList: snapshot.val()
        }, () => {
          // console.log('users', snapshot.val());
        });
      }
    });

    // Editor
    Object.keys(this._editor).forEach(editor => {
      this._firepad[editor] = null;
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
    this._editor.html = this.createTextEditor({
      targetDom: ReactDOM.findDOMNode(this._htmlRef),
      mode: 'html',
      onChange: (editor) => {
        /* const annotationChanged = new Promise((resolve) => {
          editor.getSession().once('changeAnnotation', () => {
            const annotations = editor.getSession().getAnnotations();

            let hasError = false;
            Object.keys(annotations).some((key) => {
              hasError = true;
              return annotations[key].type === 'error';
            });

            resolve(hasError);
          });
        });

        (async () => {
          const hasError = await annotationChanged;
          if (this.state.html !== editor.getValue() && !hasError) {
            this.setState({
              html: editor.getValue()
            });
          }
        })(); */

        if (this.state.html !== editor.getValue()) {
          this.setState({
            html: editor.getValue()
          });
        }
      }
    });

    this._firepad.html = window.Firepad.fromACE(this._firepadDbRef.html, this._editor.html, {
      userId: this._userId,
      defaultText: this._htmlDefaultText
    });
    this._firepad.html.on('ready', () => this.setState({
      // set user
      user: {
        id: this._userId,
        color: this._firepad.html.firebaseAdapter_.color_,
        displayName: this._displayName
      },
      editorReady: [...this.state.editorReady, 'html']
    }));

    this._editor.css = this.createTextEditor({
      targetDom: ReactDOM.findDOMNode(this._cssRef),
      mode: 'css',
      onChange: (editor) => {
        if (this.state.css !== editor.getValue()) {
          this.setState({
            css: editor.getValue()
          });
        }
      }
    });

    this._firepad.css = window.Firepad.fromACE(this._firepadDbRef.css, this._editor.css, {
      userId: this._userId,
      defaultText: this._cssDefaultText
    });
    this._firepad.css.on('ready', () => this.setState({ editorReady: [...this.state.editorReady, 'css'] }));
  }

  componentWillUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state.user) !== JSON.stringify(nextState.user)) {
      this._userDbRef.set({
        displayName: nextState.user.displayName,
        color: nextState.user.color
      });
    }
  }

  componentWillUnmount() {
    // Destroy Ace editor
    Object.keys(this._editor).forEach(key => {
      this._editor[key].destroy();
    });

    // Destroy firepad
    Object.keys(this._firepad).forEach(key => {
      this._firepad[key].dispose();
    });

    // Destroy and unlisten user db
    this._userDbRef.getParent().off('value');
    this._userDbRef.remove();

    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  createTextEditor({ targetDom, mode, onChange }) {
    const editor = window.ace.edit(targetDom);
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
      theme: 'ace/theme/tomorrow_night'
    });
    editor.on('change', () => {
      onChange && onChange(editor);
    });

    // console.log(Object.keys(editor.$options));

    return editor;
  }

  render() {
    const {
      editorReady,
      userList
    } = this.state;

    const headerProps = {
      isLoading: !editorReady.includes('html') && !editorReady.includes('css'),
      totalUsers: !_.isEmpty(userList) ? Object.keys(userList).length : 0
    };

    return (
      <div className={scss['container']}>
        <HeaderEditor {...headerProps} />

        <Row>
          {/* HTML */}
          <Cell
            hide={!this.state.showEditor.includes('html')}
            onDimensionChange={() => this._editor.html && this._editor.html.resize()}
          >
            <div ref={c => (this._htmlRef = c)} className={scss['editor-container']} />
          </Cell>
          <Splitter
            hide={!this.state.showEditor.includes('html')}
            onDragStart={() => this.setState({ showIframeMask: true })}
            onDragStop={() => this.setState({ showIframeMask: false })}
          />

          {/* CSS */}
          <Cell
            hide={!this.state.showEditor.includes('css')}
            onDimensionChange={() => this._editor.css && this._editor.css.resize()}
          >
            <div ref={c => (this._cssRef = c)} className={scss['editor-container']} />
          </Cell>
          <Splitter
            hide={!this.state.showEditor.includes('css')}
            onDragStart={() => this.setState({ showIframeMask: true })}
            onDragStop={() => this.setState({ showIframeMask: false })}
          />

          {/* iFrame */}
          <Cell>
            {/* Use mask to prevent Splitter drag error */}
            {this.state.showIframeMask && <div className={scss['iframe-mask']} />}
            <Iframe
              html={this.state.html}
              css={this.state.css}
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
