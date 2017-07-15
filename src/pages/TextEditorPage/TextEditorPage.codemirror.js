/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import Iframe from '../../components/Iframe/Iframe';
import FrameContent from '../../components/Iframe/IframeContent';
import scss from './TextEditorPage.mod.scss';

class TextEditorPage extends React.Component {
  static propTypes = {
    params: PropTypes.object
  }

  _firepad;
  _firepadDom;
  _firepadHeadless;
  _firepadRef = firebaseDb.ref(this.props.params.action);

  state = {
    html: '',
    extractedScript: []
  }

  componentDidMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this.props.params.action}`;

    const firePadDom = ReactDOM.findDOMNode(this._firepadDom);
    const codeMirror = window.CodeMirror(firePadDom, {
      extraKeys: {
        // https://github.com/codemirror/CodeMirror/issues/988
        Tab: (cm) => {
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            cm.replaceSelection(cm.getOption('indentWithTabs') ? '\t' :
              new Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input');
          }
        }
      },
      lineNumbers: true,
      lineWrapping: true,
      autoCloseTags: true,
      mode: 'htmlmixed',
      theme: 'tomorrow-night'
    });

    const charWidth = codeMirror.defaultCharWidth();
    const basePadding = 4;
    codeMirror.on('renderLine', (cm, line, elt) => {
      const off = window.CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
      elt.style.textIndent = `-${off}px`;
      elt.style.paddingLeft = `${basePadding + off}px`;
    });
    codeMirror.refresh();

    this._firepad = window.Firepad.fromCodeMirror(this._firepadRef, codeMirror, {
      // richTextShortcuts: true,
      // richTextToolbar: true,
      defaultText: '// Code'
    });

    this._firepad.on('ready', () => {
      // this.firepadUpdate();

      this._firepadHeadless = new window.Firepad.Headless(this._firepadRef);
      this._firepadHeadless.firebaseAdapter_.on('operation', () => {
        this.firepadUpdate();
      });
    });
  }

  componentWillUnmount() {
    this._firepad.off('ready');
    this._firepad.off('synced');
    // this._firepadRef.off('child_changed');
    this._firepadHeadless.firebaseAdapter_.off('operation');
    this._firepad = undefined;
  }

  extractScript(s) {
    const div = document.createElement('div');
    div.innerHTML = s;
    const scripts = div.getElementsByTagName('script');
    const scriptsArr = [];
    for (let i = 0; i < scripts.length; i++) {
      scriptsArr.push(scripts[i].innerHTML);
    }

    return scriptsArr;
  }

  firepadUpdate() {
    if (!this._firepad) { return false; }

    const txt = this._firepad.getText();
    const extractedScript = this.extractScript(txt);

    this.setState({
      html: txt,
      extractedScript
    });
  }

  render() {
    return (
      <div>
        <div className={scss['header']}>
          <h3>Text Editor Page</h3>
          <Link to='/' className={scss['link']}>Home</Link>
        </div>

        <div>
          <div className={scss['column']}>
            <div ref={c => (this._firepadDom = c)} />
          </div>
          <div className={scss['column']}>
            <Iframe
              frameBorder={0}
              className={scss['iframe']}
            >
              <FrameContent
                loadExternalScripts={[
                  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js'
                ]}
                extractedScript={this.state.extractedScript}
                dangerouslySetInnerHTML={{ __html: this.state.html }}
              />
            </Iframe>
          </div>
        </div>
      </div>
    );
  }
}

export default TextEditorPage;
