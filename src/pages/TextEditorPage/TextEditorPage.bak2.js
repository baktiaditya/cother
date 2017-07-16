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

  _isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  _id = this.props.params.id;
  _userId = Math.floor(Math.random() * 9999999999).toString();
  _editor = {
    html: null,
    css: null
  };
  _firepad = {
    html: null,
    css: null
  };
  _firepadRef = {
    html: firebaseDb.ref(`${this._id}/html`),
    css: firebaseDb.ref(`${this._id}/css`)
  }
  _html = require('./templates/defaultHtml.html');
  _css = require('./templates/defaultCss.string.css');
  _style;

  state = {
    ready: false,
    editorReady: [],
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
      userId: this._userId,
      defaultText: this._html
    });
    this._firepad.html.on('ready', () => this.setState({ editorReady: [...this.state.editorReady, 'html'] }));

    this._editor.css = this.createTextEditor({
      targetDomId: 'css',
      mode: 'css',
      onChange: (editor, callback) => {
        this._css = editor.getValue();
        callback();
      }
    });

    this._firepad.css = window.Firepad.fromACE(this._firepadRef.css, this._editor.css, {
      userId: this._userId,
      defaultText: this._css
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
          html = html.replace(bodyRegex, `<style>${css}</style>\n</body>`);
        }
        else {
          html = `${html}<style>${css}</style>`;
        }

        const iframe = document.getElementById(scss['iframe']);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const iframeHead = iframeDoc.head;
        const iframeBody = iframeDoc.body;

        if (!this._isFirefox) {
          // Do Firefox-related activities
          const { scriptsArr, scriptsSrcArr } = this.extractScript(html);
          // console.log('scriptsArr', scriptsArr);
          // console.log('scriptsSrcArr', scriptsSrcArr);

          const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
          while (SCRIPT_REGEX.test(html)) {
            html = html.replace(SCRIPT_REGEX, '');
          }
          // console.log('html', html);

          const head = html.match(/<head[^>]*>[\s\S]*<\/head>/gi);
          const body = html.match(/<body[^>]*>[\s\S]*<\/body>/gi);
          // console.log('head', head);
          // console.log('body', body);

          iframeHead.innerHTML = head;
          iframeBody.innerHTML = body;

          if (scriptsSrcArr.length > 0) {
            scriptsSrcArr.forEach((src) => {
              this.loadIframeScriptSrc(iframeDoc, src);
            });
          }

          if (scriptsArr.length > 0) {
            scriptsArr.forEach((script) => {
              this.loadIframeScriptInline(iframeDoc, script);
            });
          }
        } else {
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
        }
      });
    });

    return editor;
  }

  extractScript(code) {
    const div = document.createElement('div');
    div.setAttribute('id', 'fake');
    div.innerHTML = code;
    const scripts = div.getElementsByTagName('script');
    const scriptsArr = [];
    const scriptsSrcArr = [];
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src) {
        scriptsSrcArr.push(scripts[i].src);
      }
      if (scripts[i].innerHTML) {
        scriptsArr.push(scripts[i].innerHTML);
      }
    }

    return {
      scriptsArr,
      scriptsSrcArr
    };
  }

  loadIframeScriptSrc(iframeDoc, src, callback) {
    let r = false;
    const s = iframeDoc.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = () => {
      // console.log(this.readyState); // uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        callback && callback();
      }
    };
    iframeDoc.getElementsByTagName('body')[0].appendChild(s);
  }

  loadIframeScriptInline(iframeDoc, script) {
    const s = iframeDoc.createElement('script');
    s.type = 'text/javascript';
    try {
      s.appendChild(iframeDoc.createTextNode(script));
      iframeDoc.body.appendChild(s);
    } catch (e) {
      s.text = script;
      iframeDoc.body.appendChild(s);
    }
  }

  render() {
    return (
      <Base>
        <Header
          firepadRef={this._firepadRef.html}
          userId={this._userId}
          isLoading={!this.state.editorReady.includes('html') && !this.state.editorReady.includes('css')}
        />

        <Row className={scss['row']}>
          {/* HTML */}
          <Cell
            className={scss['cell']}
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
            className={scss['cell']}
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

          <Cell className={scss['cell']}>
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
