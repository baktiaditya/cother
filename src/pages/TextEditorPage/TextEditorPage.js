/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import scss from './TextEditorPage.mod.scss';

// Components
import Base from '../../components/Base/Base';
import Header from '../../components/Header/Header';
import { Row, Cell, Splitter } from '../../components/ResizeableGrid/ResizeableGrid';

class TextEditorPage extends React.Component {
  static propTypes = {
    // from react-router
    params: PropTypes.object
  }

  _id = this.props.params.id;
  _editor = {
    html: null,
    css: null
  };
  _firepad = {
    html: null,
    css: null
  };
  _firepadRef = {
    html: firebaseDb.ref(`${this._id}_html`),
    css: firebaseDb.ref(`${this._id}_css`)
  }
  _html = require('./defaultHtml.txt');
  _css = '';
  _style;

  state = {
    showEditor: ['html', 'css'],
    showIframeMask: false
  }

  componentWillMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this._id}`;

    // Create custom <style /> in <head />
    let css = `body { padding-top: ${scss['headerHeight']}; }`;
    css += 'body, html, #__container, #base, [data-reactroot] { height: 100%; }';
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');

    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = css;
    } else {
      this._style.appendChild(document.createTextNode(css));
    }

    head.appendChild(this._style);
  }

  componentDidMount() {
    this._editor.html = this.createTextEditor({
      targetDomId: 'html',
      mode: 'html',
      onChange: (editor, callback) => {
        this._html = editor.getValue();
        callback();
      }
    });

    this._firepad.html = window.Firepad.fromACE(this._firepadRef.html, this._editor.html, {
      defaultText: this._html
    });

    this._editor.css = this.createTextEditor({
      targetDomId: 'css',
      mode: 'css',
      onChange: (editor, callback) => {
        this._css = editor.getValue();
        callback();
      }
    });

    this._firepad.css = window.Firepad.fromACE(this._firepadRef.css, this._editor.css, {
      defaultText: '/* CSS */'
    });
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
    editor.setOptions({
      showGutter: false,
      vScrollBarAlwaysVisible: false,
      theme: 'ace/theme/tomorrow_night'
    });
    editor.on('change', () => {
      onChange && onChange(editor, () => {
        const bodyRegex = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i; // find closing body tag
        let html = this._html;
        const css = this._css;
        if (bodyRegex.test(html)) {
          html = html.replace(bodyRegex, `<style>${css}</style>\n<body/>`);
        } else {
          html = `${html}<style>${css}</style>`;
        }

        const iframeDoc = document.getElementById(scss['iframe']).contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      });
    });

    return editor;
  }

  render() {
    return (
      <Base>
        <Header />

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

          <Cell>
            {/* Use mask to prevent Splitter drag error */}
            {this.state.showIframeMask && <div className={scss['iframe-mask']} />}
            <iframe
              id={scss['iframe']}
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
