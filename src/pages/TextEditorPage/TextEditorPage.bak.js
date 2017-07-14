/* eslint no-console:0, no-eval:0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import ReactFrame from 'react-frame-component';
import { firebaseDb } from '../../firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../constants';
import Iframe from '../../components/Iframe/Iframe';
import FrameContent from './FrameContent';
import scss from './TextEditorPage.mod.scss';

class TextEditorPage extends React.Component {
  static propTypes = {
    params: PropTypes.object
  }

  _firepad;
  _firepadDom;
  // _firepadHeadless;
  _firepadRef = firebaseDb.ref(this.props.params.action);

  state = {
    html: '',
    extractedScript: []
  }

  componentWillMount() {
    this._firepadRef.on('child_changed', (snapshot) => {
      this.firepadUpdate();
    });
  }

  componentDidMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this.props.params.action}`;

    const firePadDom = ReactDOM.findDOMNode(this._firepadDom);
    const codeMirror = window.CodeMirror(firePadDom, {
      // lineWrapping: true,
      extraKeys: { Tab: this.betterTab },
      lineNumbers: true,
      autoCloseTags: true,
      mode: 'htmlmixed'
    });

    this._firepad = window.Firepad.fromCodeMirror(this._firepadRef, codeMirror, {
      richTextShortcuts: true,
      // richTextToolbar: true,
      defaultText: '// CSS Editing'
    });

    this._firepad.on('ready', () => {
      this.firepadUpdate();

      // this._firepadRef.on('child_changed', (snapshot) => {
      //   // console.log('ewe');
      //   this.firepadUpdate();
      // });

      // this._firepadHeadless = new window.Firepad.Headless(this._firepadRef);
      // this._firepadHeadless.firebaseAdapter_.on('operation', () => {
      //   this.firepadUpdate();
      // });

      // this._firepad.firebaseAdapter_.on('operation', () => {
      //   this.firepadUpdate();
      // });
    });

    // this._firepad.on('synced', () => {
    //   this.firepadUpdate();
    // });
  }

  componentWillUnmount() {
    this._firepad.off('ready');
    this._firepad.off('synced');
    this._firepadRef.off('child_changed');
    this._firepad = undefined;
    // this._firepadHeadless.firebaseAdapter_.off('operation');
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

  betterTab(cm) {
    if (cm.somethingSelected()) {
      cm.indentSelection('add');
    } else {
      cm.replaceSelection(cm.getOption('indentWithTabs') ? '\t' :
        new Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input');
    }
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
        <div>
          <h3>TextEditorPage</h3>
          <Link to='/' className={scss['back-btn']}>back</Link>
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
