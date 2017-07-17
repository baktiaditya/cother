/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import { slugify } from '../../shared/utils';
import scss from './TextEditorPage.mod.scss';
import scssString from './TextEditorPage.string.scss';

// Components
import Base from '../../components/Base/Base';
import Header from '../../components/Header/Header';
import { Row, Cell, Splitter } from '../../components/ResizeableGrid/ResizeableGrid';
import Iframe from '../../components/Iframe/Iframe';

class TextEditorPage extends Component {
  static displayName = 'TextEditorPage';

  static propTypes = {
    // from react-router
    params: PropTypes.object
  }

  _id = this.props.params.id;
  _userId = Math.floor(Math.random() * 9999999999).toString();
  _editor = {
    html: null,
    css: null
  };
  _firepad = {};
  _firepadRef = {}
  _htmlDefaultText = require('./templates/defaultHtml.html');
  _cssDefaultText = require('./templates/defaultCss.string.css');
  _style;

  state = {
    editorReady: [],
    showEditor: ['html', 'css'],
    showIframeMask: false,
    html: '',
    css: ''
  }

  componentWillMount() {
    Object.keys(this._editor).forEach(editor => {
      this._firepad[editor] = null;
    });
    // Database
    Object.keys(this._editor).forEach(editor => {
      this._firepadRef[editor] = firebaseDb.ref(`documents-no-owner/${this._id}/${editor}`);
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
      targetDomId: 'html',
      mode: 'html',
      onChange: (editor) => {
        this.setState({
          html: editor.getValue()
        });
      }
    });

    this._firepad.html = window.Firepad.fromACE(this._firepadRef.html, this._editor.html, {
      userId: this._userId,
      defaultText: this._htmlDefaultText
    });
    this._firepad.html.on('ready', () => this.setState({ editorReady: [...this.state.editorReady, 'html'] }));

    this._editor.css = this.createTextEditor({
      targetDomId: 'css',
      mode: 'css',
      onChange: (editor) => {
        this.setState({
          css: editor.getValue()
        });
      }
    });

    this._firepad.css = window.Firepad.fromACE(this._firepadRef.css, this._editor.css, {
      userId: this._userId,
      defaultText: this._cssDefaultText
    });
    this._firepad.css.on('ready', () => this.setState({ editorReady: [...this.state.editorReady, 'css'] }));
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

    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  createTextEditor({ targetDomId, mode, onChange }) {
    const editor = window.ace.edit(targetDomId);
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
      enableSnippets: true,
      enableLiveAutocompletion: false,
      showGutter: false,
      vScrollBarAlwaysVisible: false,
      theme: 'ace/theme/tomorrow_night'
    });
    editor.on('change', () => {
      onChange && onChange(editor);
    });

    return editor;
  }

  render() {
    return (
      <Base>
        <Header
          firepadRef={this._firepadRef.html}
          userId={this._userId}
          isLoading={!this.state.editorReady.includes('html') && !this.state.editorReady.includes('css')}
        />

        <Row>
          {/* HTML */}
          <Cell
            hide={!this.state.showEditor.includes('html')}
            onDimensionChange={() => this._editor.html && this._editor.html.resize()}
          >
            <div id='html' className={scss['editor-container']} />
          </Cell>
          <Splitter
            className={scss['splitter']}
            hide={!this.state.showEditor.includes('html')}
            onDragStart={() => this.setState({ showIframeMask: true })}
            onDragStop={() => this.setState({ showIframeMask: false })}
          />

          {/* CSS */}
          <Cell
            hide={!this.state.showEditor.includes('css')}
            onDimensionChange={() => this._editor.css && this._editor.css.resize()}
          >
            <div id='css' className={scss['editor-container']} />
          </Cell>
          <Splitter
            className={scss['splitter']}
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
      </Base>
    );
  }
}

export default TextEditorPage;
